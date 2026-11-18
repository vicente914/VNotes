  //Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
  //TODO: Add SDKs for Firebase products that you want to use
  //https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBEmNs2gpLART40CaIsm1n8-hzaW-iQ_IE",
  authDomain: "vnotes-79e54.firebaseapp.com",
  projectId: "vnotes-79e54",
  storageBucket: "vnotes-79e54.firebasestorage.app",
  messagingSenderId: "15522310869",
  appId: "1:15522310869:web:ed75640f3eee980313505c",
  measurementId: "G-NY5PC9QHDG"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  export var user = null;

  //exportamos lo que nuestro js publico necesita usar

  export {app, db, auth};

  //Elementos HTML
  const main = document.querySelector("main");
  const panelSesion = document.getElementById("panelSesion");
  const botonSesion = document.getElementById("sesion");
  const errorSesion = document.getElementById("errorSesion");
  const correo = document.getElementById("correo");
  const password = document.getElementById("password");
  

// ---------- REGISTRO con correo y contraseña ----------
document.getElementById("registrar").addEventListener("touchend", ()=>{
  const email = correo.value;
  const pass = password.value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential)=>{
      // Signed up
      const user = userCredential.user;
      console.log("Usuario registrado:", user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorSesion.textContent = errorCode;
      console.log(errorMessage);
    });
});



// ---------- LOGIN con correo y contraseña ----------
document.getElementById("entrar").addEventListener("touchend", ()=>{
  const email = correo.value;
  const pass = password.value;

  signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      console.log("Sesión iniciada:", user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorSesion.textContent = errorCode;
      console.log(errorMessage);
    });
});



// ---------- LOGIN con Google ----------
document.getElementById("entrarGoogle").addEventListener("touchend", ()=>{
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      user = result.user;
      console.log("Sesión con Google:", user.displayName, token);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used (puede no existir en algunos errores).
      const email = error.customData ? error.customData.email : null;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      errorSesion.textContent = errorCode;
      console.log(errorMessage, email, credential);
    });
});


// ---------- CERRAR SESIÓN ----------
botonSesion.addEventListener("touchend", ()=>{
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sesión cerrada");
    })
    .catch((error) => {
      // An error happened.
      console.log(error.code);
    });
});


// ---------- ESTADO DE LA SESIÓN ----------
// Firebase llama a esta función al cargar la página y cada vez que alguien entra o sale
onAuthStateChanged(auth, user =>{
  if (user) {
    // User is signed in
    panelSesion.classList.add("oculto");
    main.classList.remove("oculto");
    botonSesion.classList.remove("oculto");
    errorSesion.textContent = "";
    correo.value = "";
    password.value = "";
  } 
  else {
    // User is signed out
    panelSesion.classList.remove("oculto");
    main.classList.add("oculto");
    botonSesion.classList.add("oculto");
  }
});