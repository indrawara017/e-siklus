// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx8q50kTF4czNLYAVIPcwEMjTruAaytms",
  authDomain: "e-siklus.firebaseapp.com",
  projectId: "e-siklus",
  storageBucket: "e-siklus.firebasestorage.app",
  messagingSenderId: "135350572493",
  appId: "1:135350572493:web:dc865e81aeed59aa65a084",
  measurementId: "G-M37DDSFC1W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
