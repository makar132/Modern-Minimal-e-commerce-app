// /admin/js/admin-guard.js
import { onAuthStateChanged, auth, getDoc, doc, db } from "../main.js";

const APP_BASE = "/Modern-Minimal-e-commerce-app/";
const goto = (p) =>
  location.replace(new URL(p, location.origin + APP_BASE).href);

onAuthStateChanged(auth, async (user) => {
  if (!user) return goto("login.html");

  // Check role from Firestore
  const snap = await getDoc(doc(db, "users", user.uid));
  const role = snap.exists() ? snap.data().Role : null;
  if (role === "Admin") {
    document.documentElement.classList.add("admin-ok");
  } else {
    goto("index.html"); // not admin → send to home
  }
});
