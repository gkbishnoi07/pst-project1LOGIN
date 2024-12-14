// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Firebase Config Object
const firebaseConfig = {
    apiKey: "AIzaSyDmSC8v-A1e1UlAbBnaonpP6oTYuqaDB38",
    authDomain: "login-page-8e88a.firebaseapp.com",
    projectId: "login-page-8e88a",
    storageBucket: "login-page-8e88a.appspot.com",
    messagingSenderId: "345353738525",
    appId: "1:345353738525:web:246c7b889ed13c38bd29f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");

// Signup Form Elements
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupage = document.getElementById("signupage");
const signupweight = document.getElementById("signupweight");
const signupPassword = document.getElementById("signupPassword");
const repeatPassword = document.getElementById("repeatPassword");

// Switch Forms
showSignup.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});
showLogin.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
});

// Sign Up
signupButton.addEventListener("click", async () => {
    const name = signupName.value;
    const email = signupEmail.value;
    const age = signupage.value;
    const weight = signupweight.value;
    const password = signupPassword.value;
    const confirmPassword = repeatPassword.value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user details to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
        });

        alert("Account created successfully!");
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered. Please try logging in or resetting your password.");
        } else {
            console.error("Error saving user data:", error);
            alert("Error: " + error.message);
        }
    }
});

// Login
loginButton.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user details from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data:", userData);
            alert(`Welcome ${userData.name}!`);
        } else {
            console.log("No user data found.");
        }

        alert("Logged in successfully!");
        window.location.href = "https://gkbishnoi07.github.io/PST-Project01/"; // Replace with your desired URL
    } catch (error) {
        if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } else if (error.code === "auth/user-not-found") {
            alert("No user found with this email. Please sign up.");
        } else {
            console.error("Error logging in:", error);
            alert("Error: " + error.message);
        }
    }
});
