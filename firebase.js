// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlXXs0ZbQEtXjZedkOaOuZ2dpCVlkc3-k",
  authDomain: "flashcard-saas-13165.firebaseapp.com",
  projectId: "flashcard-saas-13165",
  storageBucket: "flashcard-saas-13165.appspot.com",
  messagingSenderId: "122076081997",
  appId: "1:122076081997:web:7b9b62dd3cc2ddee4e9104",
  measurementId: "G-WNXS5MZBNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}