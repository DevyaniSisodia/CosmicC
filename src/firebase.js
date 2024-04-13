import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, where, query } from 'firebase/firestore'; // Import collection from firestore

const firebaseConfig = {
  apiKey: "AIzaSyAkAtmGybpUh1AljmwLH3J0Ye3hwvWcVwE",
  authDomain: "cosmic-calm.firebaseapp.com",
  projectId: "cosmic-calm",
  storageBucket: "cosmic-calm.appspot.com",
  messagingSenderId: "229859945766",
  appId: "1:229859945766:web:1c3708c79677dcc072a5e7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const googleAuthProvider = new GoogleAuthProvider();

export {where, query, updateDoc, getDoc, doc, auth, db, googleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, getDocs, setDoc };
