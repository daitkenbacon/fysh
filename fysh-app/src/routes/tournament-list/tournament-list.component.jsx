//import tournaments from '../../tournaments-data.json'
import './tournament-list.styles.css'

import TournamentCard from '../../components/tournament-card/tournament-card.component';
import { Typography } from '@mui/material';

import { getDocsInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState } from 'react';

const TournamentList = () => {

    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        async function getTournaments() {
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
        }

        if(tournaments.length === 0){
            getTournaments();
        }
    }, [])

    console.log(tournaments);
    
    return (
        <div>
            <Typography variant='h3'>Tournaments</Typography>
            <div style={{
            }} 
            className='tournament-list-container'
            >
                
                {tournaments &&
                    tournaments.map((tournament, index) => {
                        return (
                            <TournamentCard key={index} tournament={tournament}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TournamentList;