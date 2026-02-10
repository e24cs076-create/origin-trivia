import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "activity-hub-85662",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkRecipients() {
    console.log("Listing ALL users to check structure...");
    try {
        const q = collection(db, "users");
        const querySnapshot = await getDocs(q);
        console.log(`Found ${querySnapshot.size} total users.`);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`ID: ${doc.id} | Role: '${data.role}' | Branch: '${data.branch}' | Sem: '${data.semester}'`);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

checkRecipients();
