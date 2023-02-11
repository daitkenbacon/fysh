import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom"

import './tournament-details.styles.scss';
import { UserContext } from '../../contexts/user.context';

import { updateDocInCollection, deleteDocInCollection } from "../../utils/firebase/firebase.utils";

import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { ClockIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

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
    const { tournaments, getTournament, getCatch } = useContext(TournamentsContext);
    
    const { id } = useParams();
    
    const [tournament, setTournament] = useState([]);

    const [startDate, setStartDate] = useState('');
    const [winnerCatch, setWinnerCatch] = useState('');
    const [endDate, setEndDate] = useState('');

    const [daysOpen, setDaysOpen] = useState(1);

    const [selectedCatch, setSelectedCatch] = useState();
    
    const [openFormModal, setOpenFormModal] = useState(false);
    const [openCatchModal, setOpenCatchModal] = useState(false);
    const [isHost, setisHost] = useState(false);
    const [isTournamentOpen, setIsTournamentOpen] = useState(false);
    const [trigger, setTrigger] = useState(false);

    const handleOpenFormModal = () => {
        if(!participants.includes(currentUserUID)){
            toast.error('You are not registered for this tournament!')
        } else {
            setOpenFormModal(true);
        }
    }
    const handleCloseFormModal = () => setOpenFormModal(false);

    const handleOpenCatchModal = (catchItem) => {
        if(catchItem){
            setSelectedCatch(catchItem);
            setOpenCatchModal(true);
        }
    }
    const handleCloseCatchModal = () => setOpenCatchModal(false);
    
    const { name, description, image, rules, participants, max_participants, registration_fee, catches, winner, isOpen } = tournament;
    
    useEffect(() => {
        if(tournaments.length > 0) {
            const t = getTournament(id);
            setTournament(t);
            setStartDate(new Date(t.start_date.seconds * 1000).toLocaleDateString('en-US'));
            setEndDate(new Date(t.end_date.seconds * 1000).toLocaleDateString('en-US'));
            setisHost(t.author===currentUserUID);
            setIsTournamentOpen(t.isOpen);

            var d1 = new Date(t.start_date.seconds * 1000);
            var d2 = new Date(t.end_date.seconds * 1000)

            var timeDiff = d2.getTime() - d1.getTime();

            setDaysOpen((timeDiff * 1000 * 3600 * 24) + 1);
        }
    }, [tournaments])

    useEffect(() => {
        if(winner){
            let item = getCatch(winner)
                setWinnerCatch(item);
            }
    }, [winner])

    const declareWinner = async (submissionId) => {
        try {
            updateDocInCollection('tournaments', id, {...tournament, winner: submissionId, isOpen: false});
            setIsTournamentOpen(false);
            setWinnerCatch(getCatch(submissionId));
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
            <Toaster />
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
                        {winnerCatch &&
                            <button
                            onClick={() => {handleOpenCatchModal(winnerCatch)}}
                            className="lg:border-b flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                See Winning Catch!
                            </button>
                        }
                        {isTournamentOpen && !participants.includes(currentUserUID) &&
                            <button
                            type="submit"
                            className="lg:border-b flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Register for Tournament
                            </button>
                        }
                        <div className="mt-5 flex flex-row content-center items-center gap-1 justify-center">
                            <CalendarDaysIcon className="h-8 w-8 text-leaf-600"/>
                            <p className="text-2xl tracking-tight text-gray-900">{startDate}</p>
                        </div>
                        <div className="mt-5 flex flex-row content-center items-center gap-1 justify-center">
                            <ClockIcon className="h-8 text-leaf-600 w-8"/>
                            <p className="text-2xl tracking-tight text-gray-900">{`${daysOpen} ${daysOpen > 1 ? 'Days' : 'Day'}`}</p>
                        </div>
                        <div className="mt-5 flex flex-row content-center items-center gap-1 justify-center rounded">
                            <UserGroupIcon className="h-8 text-leaf-600"/>
                            <p className="text-2xl tracking-tight text-gray-900">{participants? participants.length : '0'} / {max_participants}</p>
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
                            <h2 className="text-lg font-bold text-gray-900">Rules</h2>
                            <div className="mt-4 space-y-6">
                                <p className="text-md text-gray-600">{rules}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catches Footer */}
            <div className="mx-auto max-w-2xl px-4 pt-5 pb-16 sm:px-6 lg:grid lg:max-w-7xl">
                <div className="mx-auto w-full pt-2 border-t flex flex-row justify-between">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Catches {catches && catches.length > 0 ? `(${catches.length})` : ''}
                        </h1>
                    {isTournamentOpen &&
                    <button 
                    disabled={!isTournamentOpen}
                    onClick={handleOpenFormModal}
                    className="lg:border-b flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-3 px-8 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Submit a Catch
                    </button>
                    }
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {catches && //CatchCard list
                    catches.map(card => (
                        <CatchCard
                        openModal={handleOpenCatchModal}
                        userID={currentUserUID} 
                        isOpen={isTournamentOpen} 
                        declareWinner={declareWinner} 
                        removeSubmission={deleteSubmission} 
                        isHost={isHost} key={card} 
                        submission={card}/>
                    ))}
                </div>
            </div>

            {openFormModal && //Catch Form Modal
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <DocumentPlusIcon className="opacity-50 h-3/4" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">Submit a Catch</h3>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Submit your catch for the tournament!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CatchForm userID={currentUserUID} tournament={tournament} setOpenFormModal={setOpenFormModal}/>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {openCatchModal && //Catch Image Modal
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    <div className="fixed inset-0 z-10">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform pt-1 overflow-hidden rounded-lg bg-white text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                {selectedCatch.description}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <img className="w-full rounded-t" src={selectedCatch.img}/>
                                                <button className="p-3 text-white hover:bg-red-600 font-bold w-full bg-red-500 rounded-b" onClick={handleCloseCatchModal}>
                                                    Close
                                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
//                     <Button onClick={handleOpenFormModal} variant='contained'>Submit a Catch</Button>
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
//                 open={openFormModal}
//                 onClose={handleCloseFormModal}
//                 aria-labelledby="Submit a Catch"
//                 aria-describedby="Upload a catch to submit to the tournament."
//             >
//                 <Box sx={modalStyle}>
//                     <CatchForm setOpenFormModal={setOpenFormModal} userID={currentUserUID} tournament={tournament}/>
//                 </Box>
//             </Modal>
//         </div>