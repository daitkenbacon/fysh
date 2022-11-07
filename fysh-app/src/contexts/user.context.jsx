import { createContext, useState, useEffect } from 'react';

import { onAuthStateChangedListener, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils';

//actual value i want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,

});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser }

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => { //cleanup at end of stream
            if(user){
                createUserDocumentFromAuth(user);
            }
            setCurrentUser(user); //listener either returns null or a user, whether logged in, signing out, or default. Can set it here since listener is active to help performance
        })

        return unsubscribe; //stop listening when unmounted
    }, [])

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}