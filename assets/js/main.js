// main.js — entry point (placeholder). Route to page initializers here when implementing.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
  authDomain: "e-commerce-js-app.firebaseapp.com",
  projectId: "e-commerce-js-app",
  storageBucket: "e-commerce-js-app.firebasestorage.app",
  messagingSenderId: "383942089852",
  appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
  measurementId: "G-TV0G1TS360",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export the app object for use in other files
export { app };
const db = getFirestore(app);
export { db, collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc };

window.app = app;
window.db = db;
