import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import './tournament-details.styles.css';

import { getDocInCollection } from "../../utils/firebase/firebase.utils";

const TournamentDetails = () => {
    const { id } = useParams();
    const [tournament, setTournament] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
            <h1>{tournament.name}</h1>
            <div className="tournament-details-body">
                <img src={tournament.image}/>
                <div className='content'>
                    <div>
                        <h4>Description</h4>
                        <p>{tournament.description}</p>
                    </div>
                    <div >
                        <h4>Rules</h4>
                        <p>{tournament.rules}</p>
                    </div>
                </div>
                <div className='content'>
                    <div >
                        <h4>Dates</h4>
                        <p>{startDate} - {endDate}</p>
                    </div>
                    <div >
                        <h4>Registered Fyshers</h4>
                        <p>{tournament.participants ? tournament.participants.length : 0}/{tournament.max_participants}</p>
                    </div>
                    <div >
                        <h4>Registration Fee</h4>
                        <p>${tournament.registration_fee}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TournamentDetails;