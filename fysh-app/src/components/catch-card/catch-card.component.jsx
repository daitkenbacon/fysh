import './catch-card.styles.scss';
import { getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { TournamentsContext } from '../../contexts/tournaments.context';

import { ClipboardIcon, CalendarIcon, ClockIcon, TrophyIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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
    const {isHost, declareWinner, isOpen, removeSubmission, submission, openModal} = props;
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
        <div className={`${isCatchOwner ? 'bg-gray-500' : 'bg-white'} max-w-sm rounded-lg overflow-hidden shadow-lg`}>
            <img onClick={() => openModal(catchItem)} src={catchItem.img} alt={catchItem.description} className="hover:opacity-70 cursor-pointer w-full rounded shadow max-w-sm h-48 object-cover"/>
            <div className="px-6 py-3">
                <p className={`${isCatchOwner ? 'text-white' : 'text-gray-800'} text-base`}>{catchItem.description}</p>
            </div>
            <div className="px-2 pb-4">
                <span className="inline-flex gap-1 flex-row bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
                    <ClipboardIcon className='w-5'/>
                    {catchItem.size} inches
                    </span>
                <span className="inline-flex gap-1 bg-blue-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
                    <UserCircleIcon className='w-5'/>
                    {userName}
                    </span>
                <span className="inline-flex gap-1 bg-green-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
                     <CalendarIcon className='w-5'/>
                     {catchDate}
                     </span>
                <span className="inline-flex gap-1 bg-green-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2">
                     <ClockIcon className='w-5'/>
                     {catchTime}
                     </span>
            </div>
            <div className='flex flex-row'>
                {isHost && isOpen &&
                    <button onClick={() => declareWinner(submission)} className='bg-blue-600 text-white hover:bg-blue-700 p-2 left-0 w-full bottom-0 declare-winner-button'>Declare winner</button>
                }
                {isCatchOwner && isOpen &&
                    <button onClick={() => removeSubmission(submission)} className='bg-red-600 hover:bg-red-700 text-white p-2 right-0 bottom-0 w-full delete-catch-button'>
                        Delete
                    </button>
                }
            </div>
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