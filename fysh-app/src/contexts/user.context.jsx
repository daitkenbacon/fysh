import { createContext, useState, useEffect } from 'react';

import { onAuthStateChangedListener, createUserDocumentFromAuth, getDocInCollection } from '../utils/firebase/firebase.utils';

//actual value i want to access
export const UserContext = createContext({
    currentUser: null,
    currentUserUID: null,
    setCurrentUser: () => null,
    currentUserName: null,
    users: [],
    getUser: (id) => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserUID, setCurrentUserUID] = useState('');
    const [currentUserName, setCurrentUserName] = useState('');
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => { //cleanup at end of stream
            if(user){
                createUserDocumentFromAuth(user);
                setCurrentUserUID(user.uid);
                let userSnap = getDocInCollection('users', user.uid);
                userSnap.then((snap) => setCurrentUserName(snap.data().displayName));
            }
            setCurrentUser(user); //listener either returns null or a user, whether logged in, signing out, or default. Can set it here since listener is active to help performance
        })
        
        return unsubscribe; //stop listening when unmounted
    }, [])
    
    const value = { currentUser, setCurrentUser, currentUserUID, currentUserName, users }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}