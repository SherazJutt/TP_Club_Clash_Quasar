import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD1TeEickK3IvXbWdLv0Mbf015z89pq0y4",
    authDomain: "tp-club-clash-624c2.firebaseapp.com",
    projectId: "tp-club-clash-624c2",
    storageBucket: "tp-club-clash-624c2.appspot.com",
    messagingSenderId: "940449573209",
    appId: "1:940449573209:web:3ada867e954edbe77d4448",
    measurementId: "G-YMTD9SCFPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// exports
export { app, db, auth }



