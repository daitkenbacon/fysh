import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom"

import './tournament-details.styles.scss';
import { UserContext } from '../../contexts/user.context';

import { getDocInCollection, updateDocInCollection } from "../../utils/firebase/firebase.utils";
import { Modal, Button, Box } from "@mui/material";

import { toast, Toaster } from 'react-hot-toast';
import CatchForm from "../../components/catch-form/catch-form.component";
import CatchCard from '../../components/catch-card/catch-card.component';

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
    const { id } = useParams();
    const [tournament, setTournament] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => {
        if(!participants.includes(currentUserUID)){
            toast.error('You are not registered for this tournament!')
            return;
        } else {
            setOpenModal(true);
        }
    }
    const handleClose = () => setOpenModal(false);

    const { name, description, image, rules, participants, max_participants, registration_fee, catches } = tournament;

    useEffect(() => {
        async function getTournament() {
            try {
                const t = await getDocInCollection('tournaments', id);
                setTournament(t.data());
                setStartDate(new Date(t.data().start_date.seconds * 1000).toLocaleDateString('en-US'));
                setEndDate(new Date(t.data().end_date.seconds * 1000).toLocaleDateString('en-US'));
            } catch(error) {
                console.log(error);
            }
        }
        getTournament();
    }, [])

    

    return(tournament &&
        <div className="tournament-details-container">
            <Toaster/>
            <h1>{name}</h1>
            <div className="tournament-details-body">
                <img alt={name} src={image}/>
                <div className='content-top'>
                    <div>
                        <h4>Description</h4>
                        <p>{description}</p>
                    </div>
                    <div >
                        <h4>Rules</h4>
                        <p>{rules}</p>
                    </div>
                </div>
                <div className='content-bottom'>
                    <div >
                        <h4>Tournament Dates</h4>
                        <p>{startDate} - {endDate}</p>
                    </div>
                    <div >
                        <h4>Registered Fyshers</h4>
                        <p>{participants ? participants.length : 0}/{max_participants}</p>
                    </div>
                    <div >
                        <h4>Registration Fee</h4>
                        <p>${registration_fee}</p>
                    </div>
                </div>
            </div>
            <div className="tournament-details-submissions">
                <h2>{`${catches ? catches.length : 'No'} Submissions`}</h2>
                <Button onClick={handleOpen} variant='contained'>Submit a Catch</Button>
                <div className="submissions-container">
                    {catches &&
                        catches.map((submission) => {
                            return (
                                <CatchCard key={submission} submission={submission}/>
                            )
                        })
                    }
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="Submit a Catch"
                aria-describedby="Upload a catch to submit to the tournament."
            >
                <Box sx={modalStyle}>
                    <CatchForm userID={currentUserUID} tournament={tournament}/>
                </Box>
            </Modal>
        </div>
    )
}

export default TournamentDetails;