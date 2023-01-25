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
    isLoading: false,
})



export const TournamentsProvider = ({children}) => {
    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const value = { tournaments, isLoading }
    
    useEffect(() => {
        async function getTournaments() {
            const t = await getDocsInCollection('tournaments');
            setTournaments(t);
        }
        setIsLoading(true);
        getTournaments();
        setIsLoading(false);
    }, [])

    return (
        <TournamentsContext.Provider value={value}> {children} </TournamentsContext.Provider>
    )
}