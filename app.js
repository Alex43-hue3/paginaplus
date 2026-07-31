/*=========================================================
    CINEVERSE v1.0
    Archivo principal
=========================================================*/

"use strict";

/*=========================================================
                    VARIABLES GLOBALES
=========================================================*/

let peliculas = [];

let peliculaActual = null;

let indiceHero = 0;

let intervaloHero = null;

let miLista = JSON.parse(localStorage.getItem("miLista")) || [];

let continuarViendo =
JSON.parse(localStorage.getItem("continuarViendo")) || [];

/*=========================================================
                    ELEMENTOS DEL DOM
=========================================================*/

const hero = document.querySelector(".hero");

const heroTitulo = document.getElementById("heroTitle");

const heroDescripcion = document.getElementById("heroDescription");

const heroPoster = document.getElementById("heroPoster");

const heroBanner = document.getElementById("heroBanner");

const heroRating = document.getElementById("heroRating");

const heroYear = document.getElementById("heroYear");

const heroDuration = document.getElementById("heroDuration");

const btnVerPelicula =
document.getElementById("btnVerPelicula");

const btnTrailer =
document.getElementById("btnTrailer");

const btnDetalles =
document.getElementById("btnDetalles");

const buscador =
document.getElementById("searchInput");

const indicadorHero =
document.getElementById("heroIndicators");

/*=========================================================
                INICIALIZAR APLICACIÓN
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

async()=>{

await cargarPeliculas();

if(peliculas.length===0){

console.error("No hay películas.");

return;

}

peliculaActual=peliculas[0];

crearHero();

crearCarruseles();

activarBotones();

activarBuscador();

iniciarHeroAutomatico();

});
/*=========================================================
                CARGAR PELICULAS
=========================================================*/

async function cargarPeliculas(){

try{

const respuesta=

await fetch("peliculas.json");

peliculas=

await respuesta.json();

}catch(error){

console.error(error);

peliculas=[];

}

}
/*=========================================================
                ACTUALIZAR HERO
=========================================================*/

function crearHero(){

if(!peliculaActual){

return;

}

heroTitulo.textContent=

peliculaActual.titulo;

heroDescripcion.textContent=

peliculaActual.descripcion;

heroRating.textContent=

peliculaActual.rating;

heroYear.textContent=

peliculaActual.anio;

heroDuration.textContent=

peliculaActual.duracion;
/*==============================
        IMÁGENES
==============================*/

if(heroPoster){

heroPoster.src=peliculaActual.poster;

heroPoster.alt=peliculaActual.titulo;

}

if(heroBanner){

heroBanner.style.backgroundImage=

`url(${peliculaActual.banner})`;

}

/*==============================
        INDICADORES
==============================*/

crearIndicadores();

actualizarIndicadores();

}
/*=========================================================
            INDICADORES HERO
=========================================================*/

function crearIndicadores(){

if(!indicadorHero){

return;

}

indicadorHero.innerHTML="";

peliculas.forEach((pelicula,index)=>{

const punto=

document.createElement("button");

punto.className="heroIndicator";

if(index===indiceHero){

punto.classList.add("active");

}

punto.addEventListener(

"click",

()=>{

indiceHero=index;

peliculaActual=

peliculas[indiceHero];

crearHero();

}

);

indicadorHero.appendChild(punto);

});

}
/*=========================================================
        ACTUALIZAR INDICADORES
=========================================================*/

function actualizarIndicadores(){

if(!indicadorHero){

return;

}

const puntos=

indicadorHero.querySelectorAll(

".heroIndicator"

);

puntos.forEach((punto,index)=>{

punto.classList.toggle(

"active",

index===indiceHero

);

});

}
/*=========================================================
            HERO AUTOMÁTICO
=========================================================*/

function iniciarHeroAutomatico(){

clearInterval(

intervaloHero

);

intervaloHero=

setInterval(()=>{

siguienteHero();

},7000);

}
/*=========================================================
            SIGUIENTE HERO
=========================================================*/

function siguienteHero(){

indiceHero++;

if(indiceHero>=peliculas.length){

indiceHero=0;

}

peliculaActual=

peliculas[indiceHero];

crearHero();

}
/*=========================================================
            HERO ANTERIOR
=========================================================*/

function heroAnterior(){

indiceHero--;

if(indiceHero<0){

indiceHero=

peliculas.length-1;

}

peliculaActual=

peliculas[indiceHero];

crearHero();

}
/*=========================================================
            FLECHAS HERO
=========================================================*/

const heroPrev=

document.getElementById(

"heroPrev"

);

const heroNext=

document.getElementById(

"heroNext"

);

if(heroPrev){

heroPrev.addEventListener(

"click",

()=>{

heroAnterior();

});

}

if(heroNext){

heroNext.addEventListener(

"click",

()=>{

siguienteHero();

});

}
/*=========================================================
                BOTONES PRINCIPALES
=========================================================*/

function activarBotones(){

    // VER PELÍCULA
    if(btnVerPelicula){

        btnVerPelicula.onclick = ()=>{

            abrirPelicula();

        };

    }

    // TRAILER
    if(btnTrailer){

        btnTrailer.onclick = ()=>{

            abrirTrailer();

        };

    }

    // DETALLES
    if(btnDetalles){

        btnDetalles.onclick = ()=>{

            mostrarDetalles();

        };

    }

    // MI LISTA
    const btnMiLista = document.getElementById("btnMiLista");

    if(btnMiLista){

        btnMiLista.onclick = ()=>{

            agregarMiLista();

        };

    }

}


/*==============================
        DETALLES
==============================*/

if(btnDetalles){

btnDetalles.onclick=()=>{

mostrarDetalles();

};

}

}
/*=========================================================
            ABRIR PELÍCULA
=========================================================*/

function abrirPelicula(){

if(!peliculaActual){

return;

}

localStorage.setItem(

"peliculaSeleccionada",

peliculaActual.id

);

window.location.href=

"reproductor.html";

}
/*=========================================================
                ABRIR TRAILER
=========================================================*/

function abrirTrailer(){

if(!peliculaActual){

return;

}

if(!peliculaActual.trailer){

alert(

"No existe trailer."

);

return;

}

window.open(

peliculaActual.trailer,

"_blank"

);

}
/*=========================================================
            MOSTRAR DETALLES
=========================================================*/

function mostrarDetalles(){

if(!peliculaActual){

return;

}

let informacion=`

🎬 ${peliculaActual.titulo}

━━━━━━━━━━━━━━━━━━

📅 Año:
${peliculaActual.anio}

🎭 Género:
${peliculaActual.genero}

⭐ Rating:
${peliculaActual.rating}

🎥 Director:
${peliculaActual.director}

🌎 Idioma:
${peliculaActual.idioma}

⏱️ Duración:
${peliculaActual.duracion}

━━━━━━━━━━━━━━━━━━

${peliculaActual.descripcion}

`;

alert(informacion);

}
/*=========================================================
                MI LISTA
=========================================================*/

function agregarMiLista(){

if(!peliculaActual){

return;

}

const existe=

miLista.find(

id=>id===peliculaActual.id

);

if(existe){

alert(

"La película ya está en Mi Lista."

);

return;

}

miLista.push(

peliculaActual.id

);

localStorage.setItem(

"miLista",

JSON.stringify(miLista)

);

alert(

"Película agregada a Mi Lista."

);

}
