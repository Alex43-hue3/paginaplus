/*=========================================================
    CINEVERSE v2.0
    APP PRINCIPAL
=========================================================*/

"use strict";

/*=========================================================
                VARIABLES GLOBALES
=========================================================*/

let peliculas = [];
let peliculaActual = null;
let indiceHero = 0;
let intervaloHero = null;

let miLista =
JSON.parse(
localStorage.getItem("miLista")
) || [];

let continuarViendo =
JSON.parse(
localStorage.getItem("continuarViendo")
) || [];

/*=========================================================
                ELEMENTOS DEL DOM
=========================================================*/

const heroTitulo =
document.getElementById("heroTitle");

const heroDescripcion =
document.getElementById("heroDescription");

const heroPoster =
document.getElementById("heroPoster");

const heroBanner =
document.getElementById("heroBanner");

const heroRating =
document.getElementById("heroRating");

const heroYear =
document.getElementById("heroYear");

const heroDuration =
document.getElementById("heroDuration");

const btnVerPelicula =
document.getElementById("btnVerPelicula");

const btnTrailer =
document.getElementById("btnTrailer");

const btnDetalles =
document.getElementById("btnDetalles");

const buscador =
document.getElementById("searchInput");

const heroPrev =
document.getElementById("heroPrev");

const heroNext =
document.getElementById("heroNext");

const heroIndicators =
document.getElementById("heroIndicators");
/*=========================================================
            INICIAR CINEVERSE
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

async()=>{

console.clear();

console.log("🚀 Iniciando CINEVERSE...");

await cargarPeliculas();

if(!peliculas.length){

console.error("No se encontraron películas.");

return;

}

indiceHero=0;

peliculaActual=peliculas[0];

mostrarHero();

activarBotones();

iniciarHeroAutomatico();

console.log("✅ CINEVERSE cargado.");

});
/*=========================================================
            CARGAR JSON
=========================================================*/

async function cargarPeliculas(){

try{

const respuesta=

await fetch("peliculas.json");

peliculas=

await respuesta.json();

console.log(

"Películas cargadas:",

peliculas.length

);

}catch(error){

console.error(error);

}

}
/*=========================================================
            MOSTRAR HERO
=========================================================*/

function mostrarHero(){

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

if(heroPoster){

heroPoster.src=
peliculaActual.poster;

}

if(heroBanner){

heroBanner.style.backgroundImage=

`url(${peliculaActual.banner})`;

}

}
