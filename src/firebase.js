// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration 
// Replace with your own Firebase config after creating a project at https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: "AIzaSyDnQ95DDjZ507Le__HLK4UkbQWnRJ5MND4",
    authDomain: "booking-bridge-link.firebaseapp.com",
    projectId: "booking-bridge-link",
    storageBucket: "booking-bridge-link.firebasestorage.app",
    messagingSenderId: "462398293033",
    appId: "1:462398293033:web:a67f76916a35ef4a688838",
    measurementId: "G-WFKWKG9Q3G"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;