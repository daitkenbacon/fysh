import { useEffect } from "react";
import { createContext, useState } from "react";

import { getDocsInCollection } from '../utils/firebase/firebase.utils';

const addTournament = (tournaments, tournamentToAdd) => {
    return (
        [...tournaments, { ...tournamentToAdd, quantity: 1}]
    );
}

const clearTournament = (tournaments, tournamentToClear) => {
    return tournaments.filter(tournament => tournament.id !== tournamentToClear.id);
}

export const TournamentsContext = createContext({
    tournaments: [],
    catches: [],
    isLoading: false,
    addTournament: () => null,
    getTournament: (id) => null,
    getCatch: (id) => null,
})



export const TournamentsProvider = ({children}) => {
    const [tournaments, setTournaments] = useState([]);
    const [catches, setCatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        async function getTournaments() {
            setIsLoading(true);
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
            const c = await getDocsInCollection('catches');
            setCatches(c);
            setIsLoading(false);
        }
        
        getTournaments();
    }, [])
    
    const getTournament = (id) => {
        return tournaments.find(t => t.id === id);
    }

    const getCatch = (id) => {
        return catches.find(c => c.id === id);
    }
    
    const value = { tournaments, isLoading, addTournament, catches, getTournament, getCatch }
    return (
        <TournamentsContext.Provider value={value}> {children} </TournamentsContext.Provider>
    )
}