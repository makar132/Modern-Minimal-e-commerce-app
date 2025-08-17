import { auth } from "./main.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("login-Form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem(
            "user",
            JSON.stringify({ uid: user.uid, email: user.email })
        );

        alert("Login successful!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
        console.error(error);
    }
});
