//Import de firebase
import {app, db} from './../protected/firebase_config.js';

//app VNotes
const crearNota = document.getElementById("crearNota");

//Evita que el padding del header afecte a la altura del boton al arrastrarlo
const headerHeight = document.querySelector("header").offsetHeight;


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

});

//Añadimos funcionalidad al boton crear notas

