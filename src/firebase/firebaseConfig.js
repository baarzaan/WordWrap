import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDfvvUnG-19Pd0-sjF3YzWGxUhMw-liYdY",
    authDomain: "barzanchat-c26ea.firebaseapp.com",
    projectId: "barzanchat-c26ea",
    storageBucket: "barzanchat-c26ea.appspot.com",
    messagingSenderId: "448542790741",
    appId: "1:448542790741:web:431c934c651066fb0230dc",
    measurementId: "G-EYMGLSEPKH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }