// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config 
const firebaseConfig = {
    apiKey: "AIzaSyAcictnKPsnIq7Udyiz2XGIuMo72dRdlvU",
    authDomain: "e-commerce-js-app.firebaseapp.com",
    projectId: "e-commerce-js-app",
    storageBucket: "e-commerce-js-app.appspot.com",
    messagingSenderId: "383942089852",
    appId: "1:383942089852:web:99224fda7fd586e7cafdf9",
    measurementId: "G-TV0G1TS360"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form reference
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const role = document.getElementById("role").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data in Firestore
        await setDoc(doc(db, "Users", user.uid), {
            Id: user.uid,
            Name: name,
            Email: email,
            Role: role,
            createdAt: serverTimestamp()
        });

        alert("User registered successfully!");
        form.reset();

        // Redirect to login page
        window.location.href = 'login.html';

    } catch (error) {
        console.error("Error:", error.message);
        alert(error.message);
    }
});
