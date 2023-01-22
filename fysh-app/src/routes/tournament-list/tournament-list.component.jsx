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
            setIsLoading(true);
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
            setFilteredTournaments(t);
            setIsLoading(false);
            console.log('getTournamentData');
        }

        getTournaments();
    }, [1])

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
        <div className='flex justify-between gap-10 flex-row align-center items-center'>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tournaments</h2>
            <div>
                <div className="relative mt-1 rounded-sm shadow-sm">
                    <input
                        onChange={filterList}
                        value={search}
                        type="text"
                        name="filter"
                        id="filter"
                        className="block w-full rounded-md border-gray-300 pl-4 pr-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
                        placeholder="Search tournaments..."
                    />
                </div>
            </div>
        </div>
        {isLoading &&
             <div className="text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        {!isLoading &&
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
        }
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