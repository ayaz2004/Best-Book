// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "best-book-8e869.firebaseapp.com",
  projectId: "best-book-8e869",
  storageBucket: "best-book-8e869.firebasestorage.app",
  messagingSenderId: "365711317440",
  appId: "1:365711317440:web:2fc5132598ed630b339025",
  measurementId: "G-LR0M35ZMRE",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
