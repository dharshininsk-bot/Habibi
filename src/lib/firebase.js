import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// TODO: Replace with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDhO50SltHbUK60YqxPquJLlDrJudOQ80o",
  authDomain: "habibi-3fb3c.firebaseapp.com",
  projectId: "habibi-3fb3c",
  storageBucket: "habibi-3fb3c.firebasestorage.app",
  messagingSenderId: "1015272973928",
  appId: "1:1015272973928:web:83065b862b70c6a5293ddd",
  measurementId: "G-16383M2L3F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection References
export const pathwaysCol = collection(db, "pathways");
export const historyCol = collection(db, "history");
export const galleryCol = collection(db, "gallery");
