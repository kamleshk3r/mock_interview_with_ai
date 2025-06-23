import {initializeApp, getApp, getApps } from 'firebase/app';
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHW8mMbyFKyYm82cFcAL8McSG-dpJu_xs",
    authDomain: "mockmate-b1740.firebaseapp.com",
    projectId: "mockmate-b1740",
    storageBucket: "mockmate-b1740.firebasestorage.app",
    messagingSenderId: "228073473123",
    appId: "1:228073473123:web:4f82481c64c7483f836456",
    measurementId: "G-HMZL5HWGBV"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth =getAuth(app);
export const db = getFirestore(app);