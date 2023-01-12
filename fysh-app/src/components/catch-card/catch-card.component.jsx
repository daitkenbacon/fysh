import './catch-card.styles.scss';
import { getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect } from 'react';
import { useState } from 'react';

const defaultSubmission = {
    author: '',
    time_submitted: '',
    description: '',
    size: 0,
    img: '',
}

const CatchCard = ({submission}) => {
    const [catchItem, setCatchItem] = useState(defaultSubmission);
    const [catchDate, setCatchDate] = useState('');
    const [catchTime, setCatchTime] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        async function getCatchData() {
            try {
                const item = await getDocInCollection('catches', submission)
                setCatchItem(item.data());
                setCatchDate(new Date(item.data().time_submitted.seconds * 1000).toLocaleDateString('en-US'));
                setCatchTime(new Date(item.data().time_submitted.seconds * 1000).toLocaleTimeString('en-US'));
            } catch (err) {
                console.log(err);
            }
        }
        getCatchData();
    }, [])

    useEffect(() => {
        async function getUserData() {
            if(!catchItem.author) {
                return;
            }
            try {
                await getDocInCollection('users', catchItem.author).then((user) => setUserName(user.data().displayName));
            } catch(err) {
                console.log(err);
            }
        }

        getUserData();
    }, [catchItem])

    return (
        <div className="catch-card-container">
            <div className='card-header'>
                <h4>{userName}'s Catch</h4>
                <p>Caught on {catchDate} at {catchTime}</p>
            </div>
            <div>
                <p>{catchItem.description}</p>
                <p>Size: {catchItem.size} inches</p>
            </div>
            <img className='card-img' src={catchItem.img}/>
        </div>
    )
}

export default CatchCard;