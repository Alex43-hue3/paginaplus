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
                    CARGAR PELÍCULAS
=========================================================*/

async function cargarPeliculas() {

    try {

        const respuesta =
            await fetch("peliculas.json");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar peliculas.json"
            );
        }

        peliculas =
            await respuesta.json();

        console.log(
            "Películas:",
            peliculas.length
        );

    } catch (error) {

        console.error(
            "❌ Error cargando películas:",
            error
        );

    }

}


/*=========================================================
                        INICIAR
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.clear();

        console.log(
            "Iniciando CINEVERSE..."
        );

        await cargarPeliculas();

        if (!peliculas.length) {

            console.error(
                "❌ No hay películas"
            );

            return;
        }

        peliculaActual =
            peliculas[0];

        mostrarHero();

    }
);


/*=========================================================
                            HERO
=========================================================*/

function mostrarHero() {

    console.log(
        "================================"
    );

    console.log(
        "ENTRÓ A mostrarHero()"
    );

    console.log(
        "peliculaActual:",
        peliculaActual
    );

    console.log(
        "================================"
    );


    if (!peliculaActual) {

        console.error(
            "❌ peliculaActual está vacío"
        );

        return;
    }


    /*-----------------------------------------------------
                        TÍTULO
    -----------------------------------------------------*/

    if (heroTitulo) {

        heroTitulo.textContent =
            peliculaActual.titulo;

    }


    /*-----------------------------------------------------
                      DESCRIPCIÓN
    -----------------------------------------------------*/

    if (heroDescripcion) {

        heroDescripcion.textContent =
            peliculaActual.descripcion;

    }


    /*-----------------------------------------------------
                         RATING
    -----------------------------------------------------*/

    if (heroRating) {

        heroRating.textContent =
            peliculaActual.rating;

    }


    /*-----------------------------------------------------
                           AÑO
    -----------------------------------------------------*/

    if (heroAno) {

        heroAno.textContent =
            peliculaActual.anio;

    }


    /*-----------------------------------------------------
                        DURACIÓN
    -----------------------------------------------------*/

    if (heroDuracion) {

        heroDuracion.textContent =
            peliculaActual.duracion;

    }


    /*-----------------------------------------------------
                    IMAGEN DEL HERO
    -----------------------------------------------------*/

    if (heroBackground) {

        heroBackground.style.backgroundImage =
            `url("${peliculaActual.banner}")`;

    }


    console.log(
        "✅ HERO ACTUALIZADO"
    );

}
console.log("🔥 ESTE ES EL APP.JS NUEVO");
