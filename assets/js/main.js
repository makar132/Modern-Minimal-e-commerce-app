/**
 * Main module (bootstrap, Firebase, shared UI)
 *
 * Initializes Firebase, exports shared helpers, and wires up global UI bits (theme/nav/logout).
 *
 */
// main.js — entry point
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
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);

// Exports
export {
  app,
  db,
  auth,
  onAuthStateChanged,
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

// Logout functionality
const LOGOUT_URL = new URL("/Modern-Minimal-e-commerce-app/", location.origin);
const logoutBtn =
  document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Clear any client-side auth markers and send user to login
    try {
      localStorage.removeItem("user");
      auth.signOut();
    } catch (_) {}
    window.location.href = LOGOUT_URL.href;
  });
}

// --- Utilities & UI behaviors (added in refactor) ---

// Basic UI helpers

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

// Dark mode toggle: persists preference.
(function setupThemeToggle() {
  const btn = document.getElementById("modeToggle");
  const root = document.body;
  const STORAGE_KEY = "theme";
  // Apply persisted theme on load
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") root.classList.add("dark");
  } catch (_) {}

  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      try {
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
      } catch (_) {}
      btn.textContent = isDark ? "Light Mode" : "Dark Mode";
    });
    // Initialize button label
    btn.textContent = root.classList.contains("dark")
      ? "Light Mode"
      : "Dark Mode";
  }
})();

// Mobile nav toggle: toggles `.open` on the navbar
(function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");
  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
    });
  }
})();
