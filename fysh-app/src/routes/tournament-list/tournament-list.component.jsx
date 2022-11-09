//import tournaments from '../../tournaments-data.json'
import './tournament-list.styles.css'

import TournamentCard from '../../components/tournament-card/tournament-card.component';
import { Button, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { getDocsInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState } from 'react';

const TournamentList = () => {

    function Router(props) {
        const { children } = props;
        if (typeof window === 'undefined') {
        return <StaticRouter location="/">{children}</StaticRouter>;
        }

        return <MemoryRouter>{children}</MemoryRouter>;
    }

  Router.propTypes = {
    children: PropTypes.node,
  };

    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        async function getTournaments() {
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
        }

        getTournaments();
    }, [])

    console.log(tournaments);
    
    return (
        <div>
            <div className='header'>
            <Typography sx={{
                fontFamily: 'Abril Fatface, cursive',
                color: '#d1dbbd'
            }} variant='h1'
            >
                Tournaments
            </Typography>
            <Button component={RouterLink} to='/new-tournament' sx={{height: 50, mt: 5, backgroundColor: '#3E606F'}} variant='contained'>New Tournament</Button>

            </div>
            <div className='tournaments-container' >
                {tournaments &&
                    tournaments.map((tournament, index) => {
                        return (
                            <TournamentCard key={tournament.id} tournament={tournament}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TournamentList;