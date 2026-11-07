//Import de firebase
import {app, db} from './../protected/firebase_config.js';

//APP VNOTES

const crearNota = document.getElementById("crearNota");
const main = document.querySelector("main");
let idNota = 0;

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


    idNota++;
    const nota = document.createElement("div");
    nota.id = `nota-${idNota}`;
    nota.className = `notas ${colorSeleccionado}`;
    nota.textContent = texto;
    main.appendChild(nota);

    panelNota.classList.add("oculto");
    textoNota.value = "";
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