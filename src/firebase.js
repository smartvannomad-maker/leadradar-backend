import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_eDIEMvJ7cuq_oxSOSVmca6ILy2WTRn0",
  authDomain: "leadradar-saas.firebaseapp.com",
  projectId: "leadradar-saas",
  storageBucket: "leadradar-saas.firebasestorage.app",
  messagingSenderId: "847110995859",
  appId: "1:847110995859:web:63a97a7eeccf30abf03266"
};

const app = initializeApp(firebaseConfig);

// ✅ THIS IS WHAT YOU WERE MISSING
export const auth = getAuth(app);
export const db = getFirestore(app);