
  //Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
  import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc, getFirestore } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
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


  //exportamos lo que nuestro js publico necesita usar

  export {app, db};