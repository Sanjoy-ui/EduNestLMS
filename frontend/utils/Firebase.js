import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "edunest-lms.firebaseapp.com",
  projectId: "edunest-lms",
  storageBucket: "edunest-lms.firebasestorage.app",
  messagingSenderId: "116564189077",
  appId: "1:116564189077:web:fdc3b4cbd2c244debfa09c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}