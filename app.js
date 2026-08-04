"use strict";

/*=========================================================
                    VARIABLES GLOBALES
=========================================================*/

let peliculas = [];
let peliculaActual = null;
let indiceHero = 0;
let intervaloHero = null;

let miLista =
JSON.parse(localStorage.getItem("miLista")) || [];

let continuarViendo =
JSON.parse(localStorage.getItem("continuarViendo")) || [];
/*=========================================================
                        DOM
=========================================================*/

const heroTitulo =
document.getElementById("heroTitulo");

const heroDescripcion =
document.getElementById("heroDescripcion");



const heroBackground =
document.getElementById("heroBackground");

const heroRating =
document.getElementById("heroRating");

const heroAno =
document.getElementById("heroAno");

const heroDuracion =
document.getElementById("heroDuracion");

const heroAnterior =
document.getElementById("heroAnterior");

const heroSiguiente =
document.getElementById("heroSiguiente");

const heroIndicadores =
document.getElementById("heroIndicadores");

const btnVer =
document.getElementById("btnVer");

const btnTrailer =
document.getElementById("btnTrailer");

const btnDetalles =
document.getElementById("btnDetalles");

const buscar =
document.getElementById("buscar");
/*=========================================================
                CARGAR PELICULAS
=========================================================*/

async function cargarPeliculas(){

    try{

        const respuesta =
        await fetch("peliculas.json");

        peliculas =
        await respuesta.json();

        console.log(
            "Películas:",
            peliculas.length
        );

    }catch(error){

        console.error(error);

    }

}
/*=========================================================
                    INICIAR
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

async()=>{

    console.clear();

    console.log("Iniciando CINEVERSE...");

    await cargarPeliculas();

    if(!peliculas.length){

        console.error("No hay películas");

        return;

    }

    peliculaActual = peliculas[0];

    mostrarHero();

});
/*=========================================================
                    HERO
=========================================================*/

function mostrarHero(){

    heroTitulo.textContent =
    peliculaActual.titulo;

    heroDescripcion.textContent =
    peliculaActual.descripcion;

    heroRating.textContent =
    peliculaActual.rating;

    heroAno.textContent =
    peliculaActual.anio;

    heroDuracion.textContent =
    peliculaActual.duracion;

 

    heroBackground.style.backgroundImage =
    `url('${peliculaActual.banner}')`;

}
