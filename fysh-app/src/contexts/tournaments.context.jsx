import { useEffect } from "react";
import { createContext, useState } from "react";

const addTournament = (tournaments, tournamentToAdd) => {
    return (
        [...tournaments, { ...tournamentToAdd, quantity: 1}]
    );
}

const clearTournament = (tournaments, tournamentToClear) => {
    return tournaments.filter(tournament => tournament.id !== tournamentToClear.id);
}

export const TournamentContext = createContext({
    addTournamentToList: () => {},
    clearTournamentFromList: () => {},
    name: "",

})



export const TournamentProvider = ({children}) => {
    const [tournaments, setTournaments] = useState([]);
    
    const addTournamentToList = (tournamentToAdd) => {
        setTournaments(addTournament(tournaments, tournamentToAdd));
    }

    const clearTournamentFromList = (tournamentToRemove) => {
        setTournaments(clearTournament(tournaments, tournamentToRemove));
    }

    const value = { addTournamentToList, clearTournamentFromList, tournaments };

    return (
        <TournamentContext.Provider value={value}> {children} </TournamentContext.Provider>
    )
}