import './catch-card.styles.scss';
import { getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/user.context';

const defaultCatch = {
    author: '',
    time_submitted: '',
    description: '',
    size: 0,
    img: '',
    isHost: false,
}

const CatchCard = (props) => {
    const [catchItem, setCatchItem] = useState(defaultCatch);
    const [isCatchOwner, setIsCatchOwner] = useState(false);
    const { currentUserUID } = useContext(UserContext);
    const {isHost, declareWinner, isOpen, removeSubmission, submission} = props;
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
                if(item.data().author===currentUserUID){
                    setIsCatchOwner(true)
                }
                else {
                    setIsCatchOwner(false);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getCatchData();
    }, [submission])

    useEffect(() => {
        async function getUserData() {
            if(!catchItem.author) {
                return;
            }
            try {
                await getDocInCollection('users', catchItem.author)
                .then((user) => setUserName(user.data().displayName));
            } catch(err) {
                console.error(err);
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
                    <button onClick={() => declareWinner(submission)} className='declare-winner-button'>Declare winner</button>
                }
            </div>
            <div className='img-container'>
                <img className='card-img' src={catchItem.img}></img>
                {isCatchOwner && isOpen &&
                    <button onClick={() => removeSubmission(submission)} className='delete-catch-button'>
                        X
                    </button>
                }
            </div>
        </div>
    )
}

export default CatchCard;