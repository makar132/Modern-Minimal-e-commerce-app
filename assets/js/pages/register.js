import { auth, db, setDoc, doc, serverTimestamp } from "./main.js";
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "Users", user.uid), {
      Id: user.uid,
      Name: name,
      Email: email,
      Role: role,
      createdAt: serverTimestamp(),
    });

    alert("User registered successfully!");
    form.reset();
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error:", error.message);
    alert(error.message);
  }
});
