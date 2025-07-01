// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDdWfkbjgJiwso7H1kzLulnMSN49PKnQY",
  authDomain: "tuktukdrive-3e03d.firebaseapp.com",
  projectId: "tuktukdrive-3e03d",
  storageBucket: "tuktukdrive-3e03d.appspot.com", // ✅ fixed typo: was 'firebasestorage.app'
  messagingSenderId: "520727283152",
  appId: "1:520727283152:web:ad60f8d69057a19593e5d5",
  measurementId: "G-997ZNJC2DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
