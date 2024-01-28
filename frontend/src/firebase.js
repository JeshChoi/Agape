// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjhWNE8arO7A_ocjYChgOnAv9wrbnsvV0",
  authDomain: "ai-authentication.firebaseapp.com",
  projectId: "ai-authentication",
  storageBucket: "ai-authentication.appspot.com",
  messagingSenderId: "503794924140",
  appId: "1:503794924140:web:8a40747e74488426c8b649",
  measurementId: "G-2T45XK4ZHL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
