import './catch-card.styles.scss';
import { getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect } from 'react';
import { useState } from 'react';

const defaultCatch = {
    author: '',
    time_submitted: '',
    description: '',
    size: 0,
    img: '',
    isHost: false,
}

const CatchCard = ({submission}, ...otherProps) => {
    const [catchItem, setCatchItem] = useState(defaultCatch);
    const {isHost, declareWinner, isOpen} = otherProps;
    const [catchDate, setCatchDate] = useState('');
    const [catchTime, setCatchTime] = useState('');
    const [userName, setUserName] = useState('');
    console.log(submission);

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
                {isHost && isOpen &&
                    <button onClick={() => declareWinner(submission)}>Declare winner</button>
                }
            </div>
            <img className='card-img' src={catchItem.img}/>
        </div>
    )
}

export default CatchCard;