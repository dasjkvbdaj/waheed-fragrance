// Firebase Client Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCUbB-RryWiUw7rBOk7dwirbJBIZTU2mwM",
    authDomain: "waheed-fragrance.firebaseapp.com",
    projectId: "waheed-fragrance",
    storageBucket: "waheed-fragrance.appspot.com",
    messagingSenderId: "871970223770",
    appId: "1:871970223770:web:115d4965144b1470f01123",
    measurementId: "G-7GZSS1HPE5"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
