// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
  authDomain: "e-commerce-js-app.firebaseapp.com",
  projectId: "e-commerce-js-app",
  storageBucket: "e-commerce-js-app.appspot.com", 
  messagingSenderId: "383942089852",
  appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
  measurementId: "G-TV0G1TS360",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Exports
export {
  app,
  db,
  auth,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
};


function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
function setText(el, txt) {
  if (el) el.textContent = txt;
}
export { qs, qsa, setText };

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
