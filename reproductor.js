
/*=========================================================
                    CINEVERSE PLAYER
=========================================================*/

"use strict";

/*=========================================================
                    VARIABLES
=========================================================*/

let peliculas = [];

let peliculaActual = null;


/*=========================================================
                    ELEMENTOS
=========================================================*/

const videoContainer =
document.getElementById("videoContainer");

const loadingScreen =
document.getElementById("loadingScreen");

const background =
document.getElementById("playerBackground");

const relatedSlider =
document.getElementById("relatedSlider");


/*=========================================================
                    INICIAR
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

iniciarPlayer();

}

);
/*=========================================================
                FUNCIÓN PRINCIPAL
=========================================================*/

async function iniciarPlayer(){

mostrarLoader();

await cargarPeliculas();

obtenerPelicula();

if(!peliculaActual){

ocultarLoader();

mostrarError();

return;

}

ocultarLoader();
crearReproductor();

if(peliculaActual.tipo === "mp4"){
    inicializarControlesMP4();
}

cargarInformacion();
guardarContinuarViendo();
inicializarMiLista();
cargarRelacionadas();
iniciarModoCine();
compartirPelicula();
abrirTrailer();
}
/*=========================================================
                CARGAR JSON
=========================================================*/

async function cargarPeliculas(){

try{

const respuesta =
await fetch("peliculas.json");

peliculas =
await respuesta.json();

}
catch(error){

console.error(error);

}

}
/*=========================================================
            OBTENER PELÍCULA
=========================================================*/
function obtenerPelicula(){

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const id =
        Number(
            parametros.get("id")
        );

    console.log(
        "🎬 ID recibido:",
        id
    );

    peliculaActual =
        peliculas.find(
            pelicula =>
                pelicula.id === id
        );

    if(peliculaActual){

        console.log(
            "✅ Película encontrada:",
            peliculaActual.titulo
        );

    }else{

        console.error(
            "❌ No se encontró la película con ID:",
            id
        );

    }

}
/*=========================================================
                LOADER
=========================================================*/

function mostrarLoader(){

loadingScreen.classList.remove(

"oculto"

);

}



function ocultarLoader(){

setTimeout(()=>{

loadingScreen.classList.add(

"oculto"

);

},600);

}
/*=========================================================
                ERROR
=========================================================*/

function mostrarError(){

videoContainer.innerHTML=`

<div class="videoLoading">

<i class="fa-solid fa-circle-exclamation"></i>

<h2>

No se encontró la película

</h2>

<p>

Verifica peliculas.json

</p>

</div>

`;

}
/*=========================================================
            CREAR REPRODUCTOR
=========================================================*/

function crearReproductor(){

if(!peliculaActual){

return;

}

let html="";

switch(peliculaActual.tipo){

case "youtube":

html=crearYoutube(
peliculaActual.url
);

break;

case "drive":

html=crearDrive(
peliculaActual.url
);

break;

case "mp4":

html=crearMP4(
peliculaActual.url
);

break;

default:

html=`

<div class="videoLoading">

<i class="fa-solid fa-circle-xmark"></i>

<h2>

Formato no compatible

</h2>

<p>

El tipo de video no existe.

</p>

</div>

`;

}

videoContainer.innerHTML=html;

}
/*=========================================================
            YOUTUBE
=========================================================*/

function crearYoutube(url){

const id = obtenerYoutubeID(url);

if(!id){

return `
<div class="videoLoading">
<i class="fa-solid fa-circle-exclamation"></i>
<h2>Video de YouTube no válido</h2>
<p>No se pudo obtener el ID del video.</p>
</div>
`;

}

return `
<div class="playerSource youtubeSource">

<iframe
id="youtubePlayer"
src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
title="${peliculaActual ? peliculaActual.titulo : "CINEVERSE"}"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>

</div>
`;
}

/*=========================================================
            GOOGLE DRIVE
=========================================================*/

function crearDrive(url){

const id = obtenerDriveID(url);

return `

<iframe

src="https://drive.google.com/file/d/${id}/preview"

allow="autoplay"

allowfullscreen>

</iframe>

`;

}
/*=========================================================
                MP4
=========================================================*/

function crearMP4(url){

return `
<div class="playerSource mp4Source">

<video
id="videoPlayer"
preload="metadata"
playsinline
autoplay>

<source
src="${url}"
type="video/mp4">

Tu navegador no soporta video HTML5.

</video>

<div
id="cineverseControls"
class="cineverseControls">

<button
id="btnPlay"
type="button"
aria-label="Reproducir o pausar">
<i class="fa-solid fa-play"></i>
</button>

<button
id="btnBack10"
type="button"
aria-label="Retroceder 10 segundos">
<i class="fa-solid fa-rotate-left"></i> 10
</button>

<input
id="progressBar"
type="range"
min="0"
max="100"
value="0"
step="0.1"
aria-label="Progreso">

<span id="timeDisplay">0:00 / 0:00</span>

<button
id="btnForward10"
type="button"
aria-label="Avanzar 10 segundos">
10 <i class="fa-solid fa-rotate-right"></i>
</button>

<button
id="btnMute"
type="button"
aria-label="Silenciar">
<i class="fa-solid fa-volume-high"></i>
</button>

<input
id="volumeBar"
type="range"
min="0"
max="1"
value="1"
step="0.05"
aria-label="Volumen">

<button
id="btnFullscreen"
type="button"
aria-label="Pantalla completa">
<i class="fa-solid fa-expand"></i>
</button>

</div>

</div>
`;
}

/*=========================================================
            CONTROLES MP4 CINEVERSE
=========================================================*/

function inicializarControlesMP4(){

const video =
document.getElementById("videoPlayer");

const play =
document.getElementById("btnPlay");

const back10 =
document.getElementById("btnBack10");

const forward10 =
document.getElementById("btnForward10");

const progress =
document.getElementById("progressBar");

const time =
document.getElementById("timeDisplay");

const mute =
document.getElementById("btnMute");

const volume =
document.getElementById("volumeBar");

const fullscreen =
document.getElementById("btnFullscreen");

const container =
document.getElementById("videoContainer");

if(!video){

console.error("❌ No se encontró videoPlayer");

return;

}

function formatearTiempo(segundos){

if(!Number.isFinite(segundos)){

return "0:00";

}

const minutos =
Math.floor(segundos / 60);

const segundosRestantes =
Math.floor(segundos % 60)
.toString()
.padStart(2,"0");

const horas =
Math.floor(minutos / 60);

if(horas > 0){

const minutosRestantes =
(minutos % 60)
.toString()
.padStart(2,"0");

return `${horas}:${minutosRestantes}:${segundosRestantes}`;

}

return `${minutos}:${segundosRestantes}`;

}

function actualizarPlay(){

if(video.paused){

play.innerHTML =
'<i class="fa-solid fa-play"></i>';

}else{

play.innerHTML =
'<i class="fa-solid fa-pause"></i>';

}

}

function actualizarTiempo(){

const porcentaje =
video.duration ?
(video.currentTime / video.duration) * 100 :
0;

progress.value = porcentaje;

time.textContent =
`${formatearTiempo(video.currentTime)} / ${formatearTiempo(video.duration)}`;

}

function actualizarMute(){

if(video.muted || video.volume === 0){

mute.innerHTML =
'<i class="fa-solid fa-volume-xmark"></i>';

}else{

mute.innerHTML =
'<i class="fa-solid fa-volume-high"></i>';

}

}

play.addEventListener("click",()=>{

if(video.paused){

video.play().catch(error=>{
console.log("Reproducción automática bloqueada:",error);
});

}else{

video.pause();

}

});

back10.addEventListener("click",()=>{

video.currentTime =
Math.max(0, video.currentTime - 10);

});

forward10.addEventListener("click",()=>{

video.currentTime =
Math.min(video.duration || 0, video.currentTime + 10);

});

progress.addEventListener("input",()=>{

if(video.duration){

video.currentTime =
(video.duration * Number(progress.value)) / 100;

}

});

mute.addEventListener("click",()=>{

video.muted = !video.muted;

actualizarMute();

});

volume.addEventListener("input",()=>{

video.volume =
Number(volume.value);

video.muted =
video.volume === 0;

actualizarMute();

});

fullscreen.addEventListener("click",()=>{

if(document.fullscreenElement){

document.exitFullscreen();

return;

}

if(container.requestFullscreen){

container.requestFullscreen();

}

});

video.addEventListener("play",actualizarPlay);
video.addEventListener("pause",actualizarPlay);
video.addEventListener("timeupdate",actualizarTiempo);
video.addEventListener("loadedmetadata",actualizarTiempo);
video.addEventListener("volumechange",actualizarMute);

video.addEventListener("ended",()=>{

video.currentTime = 0;

actualizarPlay();

});

actualizarPlay();
actualizarMute();
actualizarTiempo();

video.play().catch(()=>{
console.log("ℹ️ El navegador requiere una acción del usuario para iniciar el MP4.");
});

}

/*=========================================================
            OBTENER ID YOUTUBE
=========================================================*/

function obtenerYoutubeID(url){

try{

const objeto = new URL(url);

if(objeto.hostname.includes("youtu.be")){

return objeto.pathname.substring(1);

}

return objeto.searchParams.get("v");

}
catch{

return url;

}

}
/*=========================================================
        OBTENER ID DRIVE
=========================================================*/

function obtenerDriveID(url){

const expresion=

/\/d\/([^/]+)/;

const resultado=

url.match(expresion);

return resultado ?

resultado[1] :

url;

}
/*=========================================================
            LLENAR INFORMACIÓN
=========================================================*/

function cargarInformacion(){

if(!peliculaActual){

return;

}

/*==============================
        FONDO
==============================*/

if(background){

background.style.backgroundImage=

`url(${peliculaActual.banner})`;

}

/*==============================
        TITULO
==============================*/

asignarTexto(

"movieTitle",

peliculaActual.titulo

);

/*==============================
        DESCRIPCIÓN
==============================*/

asignarTexto(

"movieDescription",

peliculaActual.descripcion

);

/*==============================
        AÑO
==============================*/

asignarTexto(

"movieYear",

peliculaActual.anio

);

/*==============================
        DURACIÓN
==============================*/

asignarTexto(

"movieDuration",

peliculaActual.duracion

);

/*==============================
        CALIDAD
==============================*/

asignarTexto(

"movieQuality",

peliculaActual.calidad

);

/*==============================
        GÉNERO
==============================*/

asignarTexto(

"movieGenre",

peliculaActual.genero

);

/*==============================
        RATING
==============================*/

asignarTexto(

"movieRating",

"⭐ " + peliculaActual.rating

);

asignarTexto(

"movieScore",

peliculaActual.rating

);

/*==============================
        DIRECTOR
==============================*/

asignarTexto(

"movieDirector",

peliculaActual.director

);

/*==============================
        IDIOMA
==============================*/

asignarTexto(

"movieIdioma",

peliculaActual.idioma

);

/*==============================
        SUBTÍTULOS
==============================*/

asignarTexto(

"movieSubs",

peliculaActual.subtitulos

);

/*==============================
        CLASIFICACIÓN
==============================*/

asignarTexto(

"movieClasificacion",

peliculaActual.clasificacion

);

/*==============================
        ESTRENO
==============================*/

asignarTexto(

"movieEstreno",

peliculaActual.anio

);

}
/*=========================================================
            ASIGNAR TEXTO
=========================================================*/

function asignarTexto(

id,

texto

){

const elemento=

document.getElementById(id);

if(

elemento &&

texto!==undefined

){

elemento.textContent=

texto;

}

}
/*=========================================================
                MI LISTA
=========================================================*/

function inicializarMiLista(){

const boton=

document.getElementById(

"btnFavorito"

);

if(!boton){

return;

}

actualizarBotonFavorito();

boton.addEventListener(

"click",

toggleFavorito

);

}



/*=========================================================
                FAVORITOS
=========================================================*/

function toggleFavorito(){

let favoritos=

JSON.parse(

localStorage.getItem(

"miLista"

)

)||[];



const existe=

favoritos.includes(

peliculaActual.id

);



if(existe){

favoritos=

favoritos.filter(

id=>id!==peliculaActual.id

);

}else{

favoritos.push(

peliculaActual.id

);

}



localStorage.setItem(

"miLista",

JSON.stringify(favoritos)

);



actualizarBotonFavorito();

}
/*=========================================================
            ACTUALIZAR BOTÓN
=========================================================*/

function actualizarBotonFavorito(){

const boton=

document.getElementById(

"btnFavorito"

);

if(!boton){

return;

}



const favoritos=

JSON.parse(

localStorage.getItem(

"miLista"

)

)||[];



const existe=

favoritos.includes(

peliculaActual.id

);



if(existe){

boton.innerHTML=

'<i class="fa-solid fa-heart"></i> En Mi Lista';

}else{

boton.innerHTML=

'<i class="fa-regular fa-heart"></i> Mi Lista';

}

}
/*=========================================================
            CONTINUAR VIENDO
=========================================================*/

function guardarContinuarViendo(){

let historial=

JSON.parse(

localStorage.getItem(

"continuarViendo"

)

)||[];



historial=

historial.filter(

pelicula=>pelicula.id!==peliculaActual.id

);



historial.unshift({

id:peliculaActual.id,

titulo:peliculaActual.titulo,

poster:peliculaActual.poster,

banner:peliculaActual.banner,

fecha:Date.now()

});



if(historial.length>20){

historial.pop();

}



localStorage.setItem(

"continuarViendo",

JSON.stringify(historial)

);

}
/*=========================================================
                PELÍCULAS RELACIONADAS
=========================================================*/

function cargarRelacionadas(){

const contenedor =
document.getElementById("relatedSlider");

if(!contenedor){

return;

}

contenedor.innerHTML="";

const relacionadas = peliculas.filter(pelicula=>{

return pelicula.id!==peliculaActual.id &&

pelicula.genero===peliculaActual.genero;

}).slice(0,4);

relacionadas.forEach(pelicula=>{

const tarjeta=document.createElement("div");

tarjeta.className="relatedCard";

tarjeta.innerHTML=`

<div class="relatedPoster">

<img src="${pelicula.poster}" alt="${pelicula.titulo}">

<div class="relatedOverlay">

<div class="relatedPlay">

<i class="fa-solid fa-play"></i>

</div>

</div>

</div>

<div class="relatedInfo">

<h3>${pelicula.titulo}</h3>

<div class="relatedMeta">

<span>${pelicula.anio}</span>

<span>${pelicula.duracion}</span>

</div>

<span class="relatedGenre">

${pelicula.genero}

</span>

</div>

`;

tarjeta.addEventListener("click",()=>{

window.location.href =
`reproductor.html?id=${pelicula.id}`;

});

contenedor.appendChild(tarjeta);

});

}
/*=========================================================
        NAVEGACIÓN DE PELÍCULAS RELACIONADAS
=========================================================*/

/*
Las tarjetas relacionadas navegan mediante ?id=.
obtenerPelicula() utiliza ese parámetro para cargar
la película correcta al abrir el reproductor.
*/

/*=========================================================
                MODO CINE
=========================================================*/

function iniciarModoCine(){

const boton =

document.getElementById(

"btnCinema"

);

if(!boton){

return;

}

boton.addEventListener(

"click",

()=>{

document.body.classList.toggle(

"cinemaMode"

);

}

);

}
/*=========================================================
                COMPARTIR
=========================================================*/

function compartirPelicula(){

const boton =

document.getElementById(

"btnCompartir"

);

if(!boton){

return;

}

boton.addEventListener(

"click",

async()=>{

const enlace=

window.location.href;

try{

if(navigator.share){

await navigator.share({

title:peliculaActual.titulo,

text:peliculaActual.descripcion,

url:enlace

});

}else{

await navigator.clipboard.writeText(

enlace

);

alert(

"Enlace copiado."

);

}

}catch(e){

console.log(e);

}

});

}
/*=========================================================
                TRAILER
=========================================================*/

function abrirTrailer(){

const boton =

document.getElementById(

"btnTrailer"

);

if(!boton){

return;

}

if(!peliculaActual.trailer){

boton.style.display="none";

return;

}

boton.addEventListener(

"click",

()=>{

window.open(

peliculaActual.trailer,

"_blank"

);

}

);

}
