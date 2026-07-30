import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase web configuration is intentionally public. Access is governed by
// Firestore security rules, never by hiding these client-side values.
const firebaseConfig = {
  apiKey: "AIzaSyCD2RW2GX-qSK8zEARSESGl47-CbnabYMk",
  authDomain: "qui-choisit.firebaseapp.com",
  projectId: "qui-choisit",
  storageBucket: "qui-choisit.firebasestorage.app",
  messagingSenderId: "408011563148",
  appId: "1:408011563148:web:bbd200de9f2b73624edba9",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
