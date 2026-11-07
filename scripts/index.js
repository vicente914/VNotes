//Import de firebase
import {app, db} from './../protected/firebase_config.js';
import { collection, doc, setDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";
//APP VNOTES

//DATOS NECESARIOS
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


    idNota++;
    const nota = document.createElement("div");
    nota.id = `nota-${idNota}`;
    nota.className = `notas ${colorSeleccionado}`;
    nota.textContent = texto;
    main.appendChild(nota);
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

    nota.addEventListener("touchstart", (e)=>{
        let toque = e.touches[0];
        //guardamos donde ha tocado el dedo dentro de la nota, para que no salte al centro
        offsetX = toque.clientX - nota.offsetLeft;
        offsetY = toque.clientY - headerHeight - nota.offsetTop;
    });

    nota.addEventListener("touchmove", (e)=>{
        let toque = e.touches[0];
        //posicion del dedo menos el punto donde agarramos la nota
        nota.style.left = (toque.clientX - offsetX) + "px";
        nota.style.top = (toque.clientY - headerHeight - offsetY) + "px";
    });

    nota.addEventListener("touchend", ()=>{
        updateDoc(doc(db, "Notas", nota.id), {
            coordenadaX: nota.offsetLeft,
            coordenadaY: nota.offsetTop
        });
    });
}

//Funcionalidad que nos permitira guardar las notaas creadas y su contenido
//en nuestra base de datos
async function guardarNotaEnFirebase(nota, texto){
    //Id unico de firestore
    const referencia = doc(collection(db, "Notas"));
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


//funcionalidad que al abrir la pagina, leera las notas guardadas en la base de datos
//y las cargara en la pagina
async function cargarNotas(){
    const resultado = await getDocs(collection(db, "Notas"));

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

cargarNotas();