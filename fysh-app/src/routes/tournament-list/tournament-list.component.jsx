import './tournament-list.styles.css'

import TournamentCard from '../../components/tournament-card/tournament-card.component';
import { Button, TextField, Typography, CircularProgress } from '@mui/material';

import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

import { getDocsInCollection, getDocInCollection } from '../../utils/firebase/firebase.utils';
import { useEffect, useState } from 'react';

const TournamentList = () => {

    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getTournaments() {
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
            setFilteredTournaments(t);
            setIsLoading(false);
        }

        getTournaments();
    }, [])

    const [search, setSearch] = useState('');
    const [filteredTournaments, setFilteredTournaments] = useState(tournaments);

    const filterList = (e) => {
        const keyword = e.target.value;

        if(keyword && (keyword !== '')){
            const results = tournaments.filter((t) => {
                //If keyword exists in tournament's title or description
                return (t.name.toLowerCase().includes(keyword) || t.description.toLowerCase().includes(keyword));
            });
            setFilteredTournaments(results);
        } else {
            setFilteredTournaments(tournaments);
        }

        setSearch(keyword);
    }

    const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
]
    
    return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tournaments</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {(filteredTournaments && filteredTournaments.length > 0) ?
                filteredTournaments.map((tournament) => {
                    return (
                        <TournamentCard key={tournament.id} tournament={tournament}/>
                    )
                }) :
                ''
            }
        </div>
      </div>
    </div>
    )
}

export default TournamentList;

//  <div>
//     <div className='header'>
//         <Typography sx={{
//             fontFamily: 'Abril Fatface, cursive',
//             color: '#d1dbbd',
//             textShadow: '2px 2px 5px #193441',
//             fontSize: '6vw'
//         }} variant='h1'
//         >
//             Tournaments
//         </Typography>
//         <Button component={RouterLink} to='/new-tournament' sx={{height: 50, mt: 5, backgroundColor: '#193441'}} variant='contained'>New Tournament</Button>

//     </div>
//     <div className='filtered-container' >
//         <TextField sx={{margin: '2%'}} variant='outlined' type='search' value={search} placeholder='Search for a tournament' onChange={filterList}/>
//         {isLoading &&
//             <CircularProgress color='info' sx={{margin: 'auto'}}/>
//         }
//         <div className='tournaments-container'>
//             {(filteredTournaments && filteredTournaments.length > 0) ?
//                 filteredTournaments.map((tournament) => {
//                     return (
//                         <TournamentCard key={tournament.id} tournament={tournament}/>
//                     )
//                 }) :
//                 ''
//             }
//         </div>
//     </div>
// </div>