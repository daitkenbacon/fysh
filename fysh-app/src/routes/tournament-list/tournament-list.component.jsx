import './tournament-list.styles.css'

import TournamentCard from '../../components/tournament-card/tournament-card.component';
import { Button, TextField, Typography } from '@mui/material';

import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { getDocsInCollection, getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState } from 'react';

const TournamentList = () => {

    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        async function getTournaments() {
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
            setFilteredTournaments(t);
        }

        getTournaments();
    }, [])

    const [search, setSearch] = useState('');
    const [filteredTournaments, setFilteredTournaments] = useState(tournaments);

    const filterList = (e) => {
        const keyword = e.target.value;

        if(keyword && (keyword !== '')){
            const results = tournaments.filter((t) => {
                return t.name.toLowerCase().includes(keyword);
            });
            setFilteredTournaments(results);
        } else {
            setFilteredTournaments(tournaments);
        }

        setSearch(keyword);
        console.log(keyword);
    }
    console.log(filteredTournaments);
    
    return (
        <div>
            <div className='header'>
                <Typography sx={{
                    fontFamily: 'Abril Fatface, cursive',
                    color: '#d1dbbd',
                    textShadow: '2px 2px 5px #193441',
                    fontSize: '6vw'
                }} variant='h1'
                >
                    Tournaments
                </Typography>
                <Button component={RouterLink} to='/new-tournament' sx={{height: 50, mt: 5, backgroundColor: '##FCFFF5'}} variant='contained'>New Tournament</Button>

            </div>
            <div className='filtered-container' >
                <TextField sx={{margin: '2%'}} variant='outlined' type='search' value={search} placeholder='Filter' onChange={filterList}/>
                <div className='tournaments-container'>
                    {(filteredTournaments && filteredTournaments.length > 0) ?
                        filteredTournaments.map((tournament) => {
                            return (
                                <TournamentCard key={tournament.id} tournament={tournament}/>
                            )
                        }) :
                        <Typography>No tournaments found!</Typography>
                    }
                </div>
            </div>
        </div>
    )
}

export default TournamentList;