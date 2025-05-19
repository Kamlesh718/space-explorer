// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXbUTHsDmxNtws8JpoCFBCnRqZILVN2NE",
  authDomain: "space-explorer-3d502.firebaseapp.com",
  projectId: "space-explorer-3d502",
  storageBucket: "space-explorer-3d502.firebasestorage.app",
  messagingSenderId: "42244326731",
  appId: "1:42244326731:web:247720a4950fbeae2994ce",
  measurementId: "G-3BT2RWJMYV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
