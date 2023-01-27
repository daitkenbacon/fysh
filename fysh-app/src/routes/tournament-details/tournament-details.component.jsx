import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"

import './tournament-details.styles.scss';
import { UserContext } from '../../contexts/user.context';

import { getDocInCollection, updateDocInCollection, deleteDocInCollection } from "../../utils/firebase/firebase.utils";

import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/solid';

import { toast, Toaster } from 'react-hot-toast';
import CatchForm from "../../components/catch-form/catch-form.component";
import CatchCard from '../../components/catch-card/catch-card.component';
import { deleteField } from "firebase/firestore";
import { TournamentsContext } from "../../contexts/tournaments.context";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#193441',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
};

const TournamentDetails = () => {
    const { currentUserUID } = useContext(UserContext);
    const { tournaments, getTournament } = useContext(TournamentsContext);
    const { id } = useParams();
    const [tournament, setTournament] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [winnerCatch, setWinnerCatch] = useState('');
    const [isTournamentOpen, setIsTournamentOpen] = useState(false);
    const [endDate, setEndDate] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [isHost, setisHost] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const handleOpen = () => {
        if(!participants.includes(currentUserUID)){
            toast.error('You are not registered for this tournament!')
            return;
        } else {
            setOpenModal(true);
        }
    }
    const handleClose = () => setOpenModal(false);

    const { name, description, image, rules, participants, max_participants, registration_fee, catches, winner, isOpen } = tournament;

    useEffect(() => {
        if(tournaments.length > 0) {
            const t = getTournament(id);
            setTournament(t);
            setStartDate(new Date(t.start_date.seconds * 1000).toLocaleDateString('en-US'));
            setEndDate(new Date(t.end_date.seconds * 1000).toLocaleDateString('en-US'));
            setisHost(t.author==currentUserUID);
            setIsTournamentOpen(isOpen);
            setWinnerCatch(winner);
        }
    }, [tournaments])

    const declareWinner = async (submissionId) => {
        try {
            updateDocInCollection('tournaments', id, {...tournament, winner: submissionId, isOpen: false});
            setIsTournamentOpen(false);
            setWinnerCatch(submissionId);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteSubmission = async (submissionId) => {
        if(catches) {
            try {
                let newCatches = catches.filter((item) => item !== submissionId);
                updateDocInCollection('tournaments', id, {catches: deleteField()});
                updateDocInCollection('tournaments', id, {catches: newCatches});
                deleteDocInCollection(submissionId, 'catches');
                setTrigger(!trigger);
                toast('You have successfully deleted your catch.')
            } catch (err) {
                console.error(err);
            }
        }
    }

    return(tournament &&
        <div className="bg-white">
            <div className="pt-6">
                {/* Cover image */}
                <div className="mx-auto mt-6 max-w-5xl rounded-lg pl-5 pr-5">
                    <div className="aspect-w-6 aspect-h-4 rounded-lg lg:block">
                        <img
                        src={image}
                        alt={image}
                        className="h-full w-full object-cover rounded-lg object-center"
                        />
                    </div>
                </div>
                <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{name}</h1>
                    </div>
                    {/* Options */}
                    <div className="lg:row-span-3 lg:mt-0 flex flex-col items-center">
                        <button
                            type="submit"
                            className="lg:border-b flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Register for Tournament
                        </button>
                        <div className="mt-5 flex flex-row content-center items-center gap-1 justify-center">
                            <CalendarDaysIcon className="h-8 w-8"/>
                            <p className="text-2xl tracking-tight text-gray-900">{startDate}</p>
                            <p className="text-2xl tracking-tight text-gray-900">-</p>
                            <p className="text-2xl tracking-tight text-gray-900"> {endDate}</p>
                        </div>
                    </div>
                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                        {/* Description and details */}
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Rules</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{rules}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-2xl px-4 pt-5 pb-16 sm:px-6 lg:grid lg:max-w-7xl">
                <div className="mx-auto w-full pt-2 border-t">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Catches</h1>
                </div>
                <div className="lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-8 lg:pb-8">
                {catches &&
                    catches.map(card => (
                        <CatchCard 
                        userID={currentUserUID} 
                        isOpen={isTournamentOpen} 
                        declareWinner={declareWinner} 
                        removeSubmission={deleteSubmission} 
                        isHost={isHost} key={card} 
                        submission={card}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TournamentDetails;

//  <div className="tournament-details-container">
//             <Toaster/>
//             <h1>{name}</h1>
//             <div className="tournament-details-body">
//                 <img alt={name} src={image}/>
//                 <div className='content-top'>
//                     <div>
//                         <h4>Description</h4>
//                         <p>{description}</p>
//                     </div>
//                     <div >
//                         <h4>Rules</h4>
//                         <p>{rules}</p>
//                     </div>
//                 </div>
//                 <div className='content-bottom'>
//                     <div >
//                         <h4>Tournament Dates</h4>
//                         <p>{startDate} - {endDate}</p>
//                     </div>
//                     <div >
//                         <h4>Registered Fyshers</h4>
//                         <p>{participants ? participants.length : 0}/{max_participants}</p>
//                     </div>
//                     <div >
//                         <h4>Registration Fee</h4>
//                         <p>${registration_fee}</p>
//                     </div>
//                 </div>
//             </div>
//             <div className="tournament-details-submissions">
//                 <div className="winning-submission">
//                     {winnerCatch &&
//                     <div>
//                         <h2>Winning Catch:</h2>
//                         <CatchCard submission={winnerCatch}/>
//                     </div>
//                     }
//                 </div>
//                 <h2>{`${catches ? catches.length : 'No'} Submissions${isTournamentOpen ? '' : ' (CLOSED)'}`}</h2>
//                 {isTournamentOpen &&
//                     <Button onClick={handleOpen} variant='contained'>Submit a Catch</Button>
//                 }
//                 <div className="submissions-container">
//                     {catches &&
//                         catches.map((submission) => {
//                             return (
//                                 <CatchCard userID={currentUserUID} isOpen={isTournamentOpen} declareWinner={declareWinner} removeSubmission={deleteSubmission} isHost={isHost} key={submission} submission={submission}/>
//                             )
//                         })
//                     }
//                 </div>
//             </div>
//             <Modal
//                 open={openModal}
//                 onClose={handleClose}
//                 aria-labelledby="Submit a Catch"
//                 aria-describedby="Upload a catch to submit to the tournament."
//             >
//                 <Box sx={modalStyle}>
//                     <CatchForm setOpenModal={setOpenModal} userID={currentUserUID} tournament={tournament}/>
//                 </Box>
//             </Modal>
//         </div>