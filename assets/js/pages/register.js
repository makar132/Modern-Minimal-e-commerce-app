import { auth, db, setDoc, doc, serverTimestamp } from "../main.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const role = document.getElementById("role").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      Id: user.uid,
      Name: name,
      Email: email,
      Role: role,
      createdAt: serverTimestamp(),
    });

    localStorage.setItem("user", {
      uid: user.uid,
      email: user.email,
      role,
      name,
    });
    // localStorage.setItem("userName", name);
    // localStorage.setItem("Email", email);

    alert("User registered successfully!");
    form.reset();

    if (role === "Admin") {
      location.href = "admin/";
    } else {
      location.href = "index.html";
    }
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        alert(
          "That email is already registered. Try signing in or use another email."
        );
        break;
      case "auth/invalid-email":
        alert("Please enter a valid email address.");
        break;
      case "auth/weak-password":
        alert("Password is too weak (minimum 6 characters).");
        break;
      case "auth/operation-not-allowed":
        alert("Email/password sign-up is disabled for this project.");
        break;
      case "auth/network-request-failed":
        alert("Network error — check your connection.");
        break;
      case "auth/too-many-requests":
        alert("Too many attempts — please try again later.");
        break;
      default:
        alert("Couldn’t create the account. Please try again.");
        break;
    }
  }
});
