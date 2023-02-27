import { createContext, useState, useEffect, useContext } from "react";

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  getDocInCollection,
  getDocsInCollection,
} from "../utils/firebase/firebase.utils";
import { TournamentsContext } from "./tournaments.context";

//actual value i want to access
export const UserContext = createContext({
  currentUser: null,
  currentUserUID: null,
  setCurrentUser: () => null,
  currentUserName: null,
  currentUserDoc: null,
  users: [],
  getUser: (id) => null,
  currentTournament: null,
  upcomingTournaments: [],
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserDoc, setCurrentUserDoc] = useState(null);
  const [currentUserUID, setCurrentUserUID] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [users, setUsers] = useState([]);

  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [currentTournament, setCurrentTournament] = useState(null);

  const { tournaments, getCatch, catches } = useContext(TournamentsContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      //cleanup at end of stream
      if (user) {
        createUserDocumentFromAuth(user);
        setCurrentUserUID(user.uid);
        setCurrentUser(user); //auth  user ref, not user doc
        let userSnap = getDocInCollection("users", user.uid);
        userSnap.then((snap) => {
          setCurrentUserName(snap.data().displayName);
          setCurrentUserDoc(snap.data());
        });
      }
      setCurrentUser(user); //listener either returns null or a user, whether logged in, signing out, or default. Can set it here since listener is active to help performance
    });
    async function getUsers() {
      const u = await getDocsInCollection("users");
      setUsers(u);
    }

    getUsers();
    return unsubscribe; //stop listening when unmounted
  }, []);

  useEffect(() => {
    const today = new Date();
    if (tournaments) {
      let userTourns = tournaments.filter((tournament) =>
        tournament.participants.includes(currentUserUID)
      ); //If any tournaments' participants includes user, add them to array.
      let activeTourns = userTourns.filter(
        (tournament) => new Date(tournament.end_date) >= today
      ); //Only tournaments that haven't ended yet.
      let sortedTourns = activeTourns.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
      setUpcomingTournaments(sortedTourns);

      if (sortedTourns && sortedTourns.length > 0) {
        let currentTourn = sortedTourns.filter(
          (tournament) =>
            today >= new Date(tournament.start_date) &&
            today <= new Date(tournament.end_date)
        );
        if (currentTourn[0]) {
          let userCatches = currentTourn[0].catches.filter((c) => {
            let catchDoc = getCatch(c);
            if (catchDoc) {
              return catchDoc.author === currentUserUID;
            } else {
              return false;
            }
          });
          setCurrentTournament({ ...currentTourn[0], catches: userCatches });
        } else {
          setCurrentTournament(null);
        }
      }
    }
    // eslint-disable-next-line
  }, [tournaments, currentUserUID, catches]);

  const getUser = (id) => {
    if (users) {
      return users.find((user) => user.id === id);
    } else {
      return null;
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    currentUserUID,
    currentUserName,
    currentUserDoc,
    users,
    getUser,
    currentTournament,
    upcomingTournaments,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
