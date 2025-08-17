
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login form
const loginForm = document.getElementById('login-Form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);//obj contain data user login 
        const user = userCredential.user; // to store in localStorge 

        // localStorage (id & Email)
        localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email
        }));

        alert('Login successful!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    }
});

