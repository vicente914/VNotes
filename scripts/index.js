//Import de firebase
import { collection, doc, setDoc, updateDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
//APP VNOTES

//DATOS NECESARIOS
const crearNota = document.getElementById("crearNota");
const main = document.querySelector("main");
let idNota = 0;
let notaEditando = null;
let cargando = false;

/*Pantalla oculta que se muestra al crear una nota
te deja escoger entre 4 colores y escribir el texto para tu nota*/
const panelNota = document.getElementById("panelNota");
const textoNota = document.getElementById("textoNota");
const colores = document.getElementById("colores");
const confirmarNota = document.getElementById("confirmarNota");
const cancelarNota = document.getElementById("cancelarNota");
let colorSeleccionado = "amarillo";

/*Color de cada boton*/
const colorAmarillo = document.getElementById("colorAmarillo");
const colorAzul = document.getElementById("colorAzul");
const colorVerde = document.getElementById("colorVerde");
const colorRojo = document.getElementById("colorRojo");

//Evita que el padding del header afecte a la altura del boton al arrastrarlo
const headerHeight = document.querySelector("header").offsetHeight;
let arrastrando;




/*FUNCIONES Y EVENTOS*/

//Movimiento de arrastre para boton crear notas
crearNota.addEventListener("touchmove", (e)=>{
    let toque = e.touches[0];
    //obtenemos ancho y alto del boton
    const anchoBoton = crearNota.offsetWidth;
    const altoBoton = crearNota.offsetHeight;

    //Se le resta la mitad de su ancho y alto(en el css no le hemos especificado ancho y alto) para que el centro quede en el dedo
    const posicionX = toque.clientX - (anchoBoton/2);
    const posicionY = toque.clientY - (altoBoton/2) - headerHeight;


    //le asignamos la posicion restada a nuestro circulo
    crearNota.style.left = posicionX + "px";
    crearNota.style.top = posicionY + "px";

    //evitamos que touchend involuntarios al final del touchmove
    arrastrando = true;
    

});

//Creamos la nota con sus caracteristicas elegidas previamente en su configuracion
function crearNuevaNota(){
    const texto = textoNota.value;
    if(!texto) return; //Si la nota esta vacia, no se crea

     //Si venimos de un doble toque, actualizamos la nota en vez de crear otra
    if(notaEditando){
        guardarEdicionNota(texto);
        return;
    }

    idNota++;
    const nota = document.createElement("div");
    nota.id = `nota-${idNota}`;
    nota.className = `notas ${colorSeleccionado}`;
    nota.textContent = texto;
    main.appendChild(nota);

    //para centrar la nota en el main/tablero despues de crearla
    nota.style.left = (main.clientWidth - nota.offsetWidth) / 2 + "px";
    nota.style.top = (main.clientHeight - nota.offsetHeight) / 2 + "px"

    hacerArrastrable(nota);

    panelNota.classList.add("oculto");
    textoNota.value = "";

    guardarNotaEnFirebase(nota, texto);
}

//Añadimos funcionalidad al boton crear notas
//Muestra el pane de configuracion para crear tu nota
crearNota.addEventListener("touchend", (e)=>{
    //evitamos touchend involuntarios al final del touchmove
    if(arrastrando){
        arrastrando = false;
        return;
    }

    panelNota.classList.remove("oculto");
});

//añadimos funcionalidades para escoger color para la nota
//en el panel de configuracion de la nota
colorAmarillo.addEventListener("touchend", ()=>{
    colorSeleccionado = "amarillo";
    marcarColor(colorAmarillo);
});

colorAzul.addEventListener("touchend", ()=>{
    colorSeleccionado = "azul";
    marcarColor(colorAzul);
});

colorVerde.addEventListener("touchend", ()=>{
    colorSeleccionado = "verde";
    marcarColor(colorVerde);
});

colorRojo.addEventListener("touchend", ()=>{
    colorSeleccionado = "rojo";
    marcarColor(colorRojo);
});

confirmarNota.addEventListener("touchend", crearNuevaNota);

//Volvemos a ocultar el panel si deciden cancelar la nota que creaban
cancelarNota.addEventListener("touchend", ()=>{
    panelNota.classList.add("oculto");
    notaEditando = null;
    textoNota.value = "";

});


//funcionalidad para que el usuario pueda ver que color ha escogido para su nota
function marcarColor(color){
    //quitamos el seleccionado de todos
    colorAmarillo.classList.remove("seleccionado");
    colorAzul.classList.remove("seleccionado");
    colorVerde.classList.remove("seleccionado");
    colorRojo.classList.remove("seleccionado");

    //se lo asignamos al boton que se haya elegido
    color.classList.add("seleccionado");
}


//Movimiento de arrastre para cada nota
function hacerArrastrable(nota){
    //distancia entre el dedo y la esquina de la nota
    let offsetX = 0;
    let offsetY = 0;

    //Con estos datos distinguimos entre arrastrar, swipe, doble toque
    let inicioX = 0;
    let inicioY = 0;
    let tiempoInicio = 0;
    let posicionInicialX = 0;
    let posicionInicialY = 0;
    let ultimoToque = 0;

    nota.addEventListener("touchstart", (e)=>{
        let toque = e.touches[0];
        //guardamos donde ha tocado el dedo dentro de la nota, para que no salte al centro
        offsetX = toque.clientX - nota.offsetLeft;
        offsetY = toque.clientY - headerHeight - nota.offsetTop;

        //Guardamos en donde empezo el toque, cuando y donde estaba la nota
        inicioX = toque.clientX;
        inicioY = toque.clientY;
        tiempoInicio = Date.now();
        posicionInicialX = nota.offsetLeft;
        posicionInicialY = nota.offsetTop;
    });

    nota.addEventListener("touchmove", (e)=>{
        let toque = e.touches[0];
        e.preventDefault();
        //posicion del dedo menos el punto donde agarramos la nota
        nota.style.left = (toque.clientX - offsetX) + "px";
        nota.style.top = (toque.clientY - headerHeight - offsetY) + "px";
    });

    nota.addEventListener("touchend", (e)=>{
        //Se mide lo que se ha movido el dedo y cuanto ha tardado
        let toque = e.changedTouches[0];
        const distanciaX = toque.clientX - inicioX;
        const distanciaY = toque.clientY - inicioY;
        const tiempo = Date.now() - tiempoInicio;
        

        //SWIPE: se mide con recorrido horizontal rapido y poco recorrido vertical
        if(Math.abs(distanciaX) > 100 && Math.abs(distanciaY) < 30 && tiempo < 500){
            if(confirm("¿Seguro que quires borrar esta nota?")){
                deleteDoc(doc(db, "Usuario-"+user.uid, nota.id));
                nota.remove();
            }
            else{
                //El usuario cancela borrar su nota
                nota.style.left = posicionInicialX + "px";
                nota.style.top = posicionInicialY + "px";
            }
            return;
        }

        //Con esta condicion permitimos añadir funcionalidad para editar la nota
        if(Math.abs(distanciaX) < 5 && Math.abs(distanciaY) < 5){
            const ahora = Date.now();
            if(ahora - ultimoToque < 300){
                abrirEdicion(nota);
                ultimoToque = 0;
            }
            else{
                ultimoToque = ahora;
            }
            return;
        }
        
        updateDoc(doc(db, "Usuario-"+user.uid, nota.id), {
            coordenadaX: nota.offsetLeft,
            coordenadaY: nota.offsetTop
        });
    });
}

//Funcionalidad que nos permitira guardar las notaas creadas y su contenido
//en nuestra base de datos
async function guardarNotaEnFirebase(nota, texto){
    //Id unico de firestore
    const referencia = doc(collection(db, "Usuario-"+user.uid));
    nota.id = referencia.id; //asi la nota tiene el mismo id que en la base de datos

    //Guardamos la nota con cada uno de sus campos
    await setDoc(referencia, {
        id: referencia.id,
        texto: texto,
        color: colorSeleccionado,
        coordenadaX: nota.offsetLeft,
        coordenadaY: nota.offsetTop,
        fechaCreacion: Date.now()
    });
}

function abrirEdicion(nota){
    notaEditando = nota;
    textoNota.value = nota.textContent;

    //miramos el color de la nota que queremos editar
    if(nota.classList.contains("amarillo")){
        colorSeleccionado = "amarillo";
        marcarColor(colorAmarillo);
    }
    if(nota.classList.contains("azul")){
        colorSeleccionado = "azul";
        marcarColor(colorAzul);
    }
    if(nota.classList.contains("verde")){
        colorSeleccionado = "verde";
        marcarColor(colorVerde);
    }
    if(nota.classList.contains("rojo")){
        colorSeleccionado = "rojo";
        marcarColor(colorRojo);
    }

    panelNota.classList.remove("oculto");

}


function guardarEdicionNota(texto){
    notaEditando.textContent = texto;
    notaEditando.className = `notas ${colorSeleccionado}`;

    updateDoc(doc(db, "Notas", notaEditando.id),{
        texto: texto,
        color: colorSeleccionado
    });
    notaEditando = null;
    panelNota.classList.add("oculto");
    textoNota.value = "";
}


//funcionalidad que al abrir la pagina, leera las notas guardadas en la base de datos
//y las cargara en la pagina
const iniciarSesion = document.getElementById("entrar");
async function cargarNotas(){
    if(!cargando){
        cargando = true;
        console.log(user);
        const resultado = await getDocs(collection(db, "Usuario-"+user.uid));

        resultado.forEach((documento)=>{
            const datos = documento.data();

            const nota = document.createElement("div");
            nota.id = datos.id;
            nota.className = `notas ${datos.color}`;
            nota.textContent = datos.texto;
            nota.style.left = datos.coordenadaX + "px";
            nota.style.top = datos.coordenadaY + "px";
            main.appendChild(nota);

            hacerArrastrable(nota);
        });
    }
}




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
  var user = null;

  //exportamos lo que nuestro js publico necesita usar

  export {app, db, auth};

  //Elementos HTML
  //const main = document.querySelector("main");
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
      user = userCredential.user;
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
      cargarNotas();
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
      cargarNotas();
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
      cargando = false;//CUando cerramos sesion, dejamos la variable cargando en false
      user = null;
      main.querySelectorAll("div").forEach(nota =>{
        main.removeChild(nota);
      });
    })
    .catch((error) => {
      // An error happened.
      console.log(error.code);
    });
});


// ---------- ESTADO DE LA SESIÓN ----------
// Firebase llama a esta función al cargar la página y cada vez que alguien entra o sale
onAuthStateChanged(auth, usr =>{
  if (usr){
    // User is signed in
    panelSesion.classList.add("oculto");
    main.classList.remove("oculto");
    botonSesion.classList.remove("oculto");
    errorSesion.textContent = "";
    correo.value = "";
    password.value = "";
  } 
  else {
    // Cuando el usuario cierra sesión
    panelSesion.classList.remove("oculto");
    main.classList.add("oculto");
    botonSesion.classList.add("oculto");
    user = null;
    main.querySelectorAll("div").forEach(nota =>{
        main.removeChild(nota);
      });
  }
});