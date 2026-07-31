/*==========================================================
                CINEVERSE 3.0
==========================================================*/

"use strict";

/*==========================================================
                    CONFIGURACIÓN
==========================================================*/

const APP = {

    nombre: "CINEVERSE",

    version: "3.0.0",

    peliculas: [],

    peliculaActual: null,

    bannerActual: 0,

    intervaloBanner: null

};


/*==========================================================
                    ELEMENTOS HTML
==========================================================*/

const heroTitulo =
document.getElementById("heroTitulo");

const heroDescripcion =
document.getElementById("heroDescripcion");

const heroAno =
document.getElementById("heroAno");

const heroDuracion =
document.getElementById("heroDuracion");

const heroRating =
document.getElementById("heroRating");

const heroBackground =
document.getElementById("heroBackground");

const btnVer =
document.getElementById("btnVer");

const btnTrailer =
document.getElementById("btnTrailer");

const btnDetalles =
document.getElementById("btnDetalles");

const inputBuscar =
document.getElementById("buscar");

const tendencias =
document.getElementById("tendencias");

const estrenos =
document.getElementById("estrenos");

const continuarViendo =
document.getElementById("continuarViendo");


/*==========================================================
                    CARGAR JSON
==========================================================*/

async function cargarPeliculas(){

    try{

        const respuesta =
        await fetch("peliculas.json");

        if(!respuesta.ok){

            throw new Error("No se encontró peliculas.json");

        }

        const datos =
        await respuesta.json();

        APP.peliculas =
        datos.peliculas;

        console.log("Películas cargadas:",
        APP.peliculas.length);

        iniciarAplicacion();

    }

    catch(error){

        console.error(error);

        heroTitulo.textContent =
        "Error cargando películas";

        heroDescripcion.textContent =
        "No fue posible leer peliculas.json";

    }

}



/*==========================================================
                INICIAR APP
==========================================================*/

function iniciarAplicacion(){

    if(APP.peliculas.length===0){

        return;

    }

    crearBannerPrincipal();

}



/*==========================================================
                CREAR BANNER
==========================================================*/

function crearBannerPrincipal(){

    let destacadas =
    APP.peliculas.filter(

        pelicula=>pelicula.destacada===true

    );

    if(destacadas.length===0){

        destacadas=
        APP.peliculas;

    }

    APP.bannerActual=0;

    APP.peliculaActual=
    destacadas[0];

    actualizarBanner();

    iniciarBannerAutomatico(
        destacadas
    );

}



/*==========================================================
            ACTUALIZAR BANNER
==========================================================*/

function actualizarBanner(){

    const pelicula=
    APP.peliculaActual;

    if(!pelicula){

        return;

    }

    heroTitulo.textContent=
    pelicula.titulo;

    heroDescripcion.textContent=
    pelicula.descripcion;

    heroAno.textContent=
    pelicula.anio;

    heroDuracion.textContent=
    pelicula.duracion;

    heroRating.textContent=
    pelicula.rating;

    heroBackground.style.backgroundImage=

    `url(${pelicula.banner})`;

}



/*==========================================================
        CAMBIO AUTOMÁTICO
==========================================================*/

function iniciarBannerAutomatico(lista){

    clearInterval(
        APP.intervaloBanner
    );

    APP.intervaloBanner=
    setInterval(()=>{

        APP.bannerActual++;

        if(APP.bannerActual>=lista.length){

            APP.bannerActual=0;

        }

        APP.peliculaActual=
        lista[
            APP.bannerActual
        ];

        actualizarBanner();

    },8000);

}



/*==========================================================
            BOTONES
==========================================================*/

btnVer.addEventListener(

"click",

()=>{

    if(!APP.peliculaActual)
    return;

    localStorage.setItem(

        "peliculaSeleccionada",

        JSON.stringify(

            APP.peliculaActual

        )

    );

    location.href=
    "reproductor.html";

}

);



btnTrailer.addEventListener(

"click",

()=>{

    if(!APP.peliculaActual)
    return;

    window.open(

        APP.peliculaActual.trailer.url,

        "_blank"

    );

}

);



btnDetalles.addEventListener(

"click",

()=>{

    if(!APP.peliculaActual)
    return;

    localStorage.setItem(

        "peliculaSeleccionada",

        JSON.stringify(

            APP.peliculaActual

        )

    );

    location.href=
    "detalles.html";

}

);



/*==========================================================
                INICIAR
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    cargarPeliculas();

}

);
