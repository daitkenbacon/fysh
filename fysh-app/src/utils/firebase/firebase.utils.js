// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBStw892kcZwL_9nc3vOwP1U2Ud8be1FOo",
  authDomain: "fysh-poc-db.firebaseapp.com",
  projectId: "fysh-poc-db",
  storageBucket: "fysh-poc-db.appspot.com",
  messagingSenderId: "1021165233957",
  appId: "1:1021165233957:web:0e5c8e4d576e0cd0e0dccc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
  
export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.error('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } catch(err) {
      console.error(err);
    }
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const createDocInCollection = async (objectToAdd, collectionToPut) => {
  try {
    const col = collection(db, collectionToPut);
    const docRef = await addDoc(col, objectToAdd);
  
    //logs the doc ID as an object field
    await updateDoc(docRef,{id: docRef.id})
    const res = getDocInCollection(collectionToPut, docRef.id);
    return res;
  } catch (err) {
    console.error(err);
  }
}

export const deleteDocInCollection = async (docId, collectionName) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const res = await deleteDoc(docRef);
    return res;
  } catch (err) {
    console.error(err);
  }
}

export const updateDocInCollection = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const res = await updateDoc(docRef,data);
    return res;
  } catch (err) {
    console.error(err);
  }
}

export const getDocsInCollection = async (collectionToGetFrom) => {
  try {
    const colRef = collection(db, collectionToGetFrom);
    const docsSnap = await getDocs(colRef);
    const docsArr = [];
    docsSnap.docs.forEach((doc) => {
      docsArr.push({
        ...doc.data(),
        id: doc.id,
      });
    })

    return docsArr;

  } catch(error) {
    console.error(error);
  }
}

export const getDocInCollection = async (collectionToGetFrom, docId) => {
  try {
    const docRef = doc(db, collectionToGetFrom, docId);
    const docSnap = await getDoc(docRef);
    if(!docSnap){
      console.error("No such document exists.")
      return;
    }
    return docSnap;
  } catch(error) {
    console.error('getDocInCollection error: ', docId, error);
  }
}