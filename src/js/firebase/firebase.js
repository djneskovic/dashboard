// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyB6R-Kb7O0aFOr_Vl3vifZ5DOU1k-S0Hfs",
	authDomain: "dashboard-faf55.firebaseapp.com",
	projectId: "dashboard-faf55",
	storageBucket: "dashboard-faf55.appspot.com",
	messagingSenderId: "715309548347",
	appId: "1:715309548347:web:317cffc90be128fbc7ad1e",
	measurementId: "G-KH0KZHSEK3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Firestore database

// Export the auth and db objects to use in your components
export { auth, db };
