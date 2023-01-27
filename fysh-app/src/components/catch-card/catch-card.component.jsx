import './catch-card.styles.scss';
import { getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { TournamentsContext } from '../../contexts/tournaments.context';

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
    const { getCatch, catches } = useContext(TournamentsContext);
    const {isHost, declareWinner, isOpen, removeSubmission, submission} = props;
    const [catchDate, setCatchDate] = useState('');
    const [catchTime, setCatchTime] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if(catches.length > 0){
            const c = getCatch(submission);
            setCatchItem(c);
            setCatchDate(new Date(c.time_submitted.seconds * 1000).toLocaleDateString('en-US'));
            setCatchTime(new Date(c.time_submitted.seconds * 1000).toLocaleTimeString('en-US'));
            if(c.author===currentUserUID){
                setIsCatchOwner(true)
            }
            else {
                setIsCatchOwner(false);
            }
        }
    }, [catches])

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
        <div className="bg-white max-w-sm rounded-lg overflow-hidden shadow-lg">
            <img src={catchItem.img} alt={catchItem.description} className="w-full max-w-sm h-48 object-cover"/>
            {isCatchOwner && isOpen &&
                    <button onClick={() => removeSubmission(submission)} className='delete-catch-button'>
                        X
                    </button>
                }
            <div className="px-6 py-4">
                <p className="text-gray-700 text-base">{catchItem.description}</p>
            </div>
            <div className="px-6 py-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">{catchItem.size} inches</span>
                <span className="text-gray-600">Caught by {userName}</span>
                <span className="text-gray-600"> on {catchDate} at {catchTime}</span>
            </div>
            {isHost && isOpen &&
                    <button onClick={() => declareWinner(submission)} className='declare-winner-button'>Declare winner</button>
                }
        </div>
    )
}

export default CatchCard;



        // <div className="catch-card-container">
        //     <div className='card-header'>
        //         <h4>{userName}'s Catch</h4>
        //         <p>Caught on {catchDate} at {catchTime}</p>
        //     </div>
        //     <div>
        //         <p>{catchItem.description}</p>
        //         <p>Size: {catchItem.size} inches</p>
        //         {isHost && isOpen &&
        //             <button onClick={() => declareWinner(submission)} className='declare-winner-button'>Declare winner</button>
        //         }
        //     </div>
        //     <div className='img-container'>
        //         <img className='card-img' src={catchItem.img}></img>
                
        //     </div>
        // </div>