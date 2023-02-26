import { useEffect } from "react";
import { createContext, useState } from "react";

import { getDocsInCollection } from "../utils/firebase/firebase.utils";

const clearTournament = (tournaments, tournamentToClear) => {
  return tournaments.filter(
    (tournament) => tournament.id !== tournamentToClear.id
  );
};

export const TournamentsContext = createContext({
  tournaments: [],
  catches: [],
  isLoading: false,
  addTournament: (tournament) => null,
  addCatch: (submission) => null,
  getTournament: (id) => null,
  getCatch: (id) => null,
});

export const TournamentsProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [catches, setCatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTournament = (tournamentToAdd) => {
    setTournaments([...tournaments, tournamentToAdd]);
  };

  const addCatch = (catchToAdd) => {
    setCatches([...catches, catchToAdd]);
  };

  useEffect(() => {
    async function getTournaments() {
      setIsLoading(true);
      const t = await getDocsInCollection("tournaments");
      setTournaments(t);
      const c = await getDocsInCollection("catches");
      setCatches(c);
      setIsLoading(false);
    }

    getTournaments();
  }, []);

  const getTournament = (id) => {
    return tournaments.find((t) => t.id === id);
  };

  const getCatch = (id) => {
    return catches.find((c) => c.id === id);
  };

  const value = {
    tournaments,
    isLoading,
    addTournament,
    addCatch,
    catches,
    getTournament,
    getCatch,
  };
  return (
    <TournamentsContext.Provider value={value}>
      {" "}
      {children}{" "}
    </TournamentsContext.Provider>
  );
};
