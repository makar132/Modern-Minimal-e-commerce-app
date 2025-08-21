import { auth, db } from "../main.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const loginForm = document.getElementById("login-Form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim(); // trim added

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docInfo = await getDoc(doc(db, "users", user.uid));

      if (docInfo.exists()) {
        const role = docInfo.data().Role || "Customer";
        const name = docInfo.data().Name || "Guest";

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            role,
            name,
          })
        );

        if (role === "Admin") {
          location.href = "admin/";
        } else {
          location.href = "index.html";
        }
      } else {
        alert("No user data found in Firestore!");
      }
    } catch (error) {
      console.error("Login error:", error.code, error.message);

      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/user-not-found":
          alert("User not found.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password.");
          break;
        case "auth/user-disabled":
          alert("This account has been disabled.");
          break;
        default:
          alert("Login failed: " + error.message);
      }
    }
  });
}
