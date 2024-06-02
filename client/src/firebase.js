// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dvnblog-db4b9.firebaseapp.com",
  projectId: "dvnblog-db4b9",
  storageBucket: "dvnblog-db4b9.appspot.com",
  messagingSenderId: "890758188011",
  appId: "1:890758188011:web:5d48b48fb5c7e28166a7ae",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
