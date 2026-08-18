"use strict";

/* =========================================================
                    CINEVERSE PLAYER
========================================================= */

let peliculas = [];
let peliculaActual = null;


/* =========================================================
                    ELEMENTOS
========================================================= */

const videoContainer =
    document.getElementById("videoContainer");

const loadingScreen =
    document.getElementById("loadingScreen");

const background =
    document.getElementById("playerBackground");

const relatedSlider =
    document.getElementById("relatedSlider");


/* =========================================================
                    INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciarPlayer
);


/* =========================================================
                    FUNCIÓN PRINCIPAL
========================================================= */

async function iniciarPlayer(){

    mostrarLoader();

    await cargarPeliculas();

    obtenerPelicula();

    if(!peliculaActual){

        ocultarLoader();

        mostrarError();

        return;

    }

    cargarInformacion();

    cargarPortada();

    cargarFondo();

    inicializarMiLista();

    cargarRelacionadas();

    configurarBotones();

    configurarBotonReproducir();

    prepararPlayer();

    guardarContinuarViendo();

    ocultarLoader();

}


/* =========================================================
                    CARGAR JSON
========================================================= */

async function cargarPeliculas(){

    try{

        const respuesta =
            await fetch(
                "peliculas.json?v=" +
                Date.now()
            );

        if(!respuesta.ok){

            throw new Error(
                "No se pudo cargar peliculas.json"
            );

        }

        peliculas =
            await respuesta.json();

        console.log(
            "🎬 Películas cargadas:",
            peliculas.length
        );

    }
    catch(error){

        console.error(
            "❌ Error cargando películas:",
            error
        );

        peliculas = [];

    }

}


/* =========================================================
                    OBTENER PELÍCULA
========================================================= */

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
                Number(pelicula.id) === id
        );

    if(peliculaActual){

        console.log(
            "✅ Película encontrada:",
            peliculaActual.titulo
        );

    }
    else{

        console.error(
            "❌ No se encontró la película:",
            id
        );

    }

}


/* =========================================================
                    LOADER
========================================================= */

function mostrarLoader(){

    if(!loadingScreen){
        return;
    }

    loadingScreen.classList.remove(
        "oculto"
    );

}


function ocultarLoader(){

    if(!loadingScreen){
        return;
    }

    setTimeout(()=>{

        loadingScreen.classList.add(
            "oculto"
        );

    },500);

}


/* =========================================================
                    ERROR
========================================================= */

function mostrarError(){

    if(!videoContainer){
        return;
    }

    videoContainer.innerHTML = `

        <div class="videoLoading">

            <i class="fa-solid fa-circle-exclamation"></i>

            <h2>
                No se encontró la película
            </h2>

            <p>
                Verifica el ID y peliculas.json
            </p>

        </div>

    `;

}


/* =========================================================
                    INFORMACIÓN
========================================================= */

function cargarInformacion(){

    if(!peliculaActual){
        return;
    }


    /* TITULO */

    asignarTexto(
        "movieTitle",
        peliculaActual.titulo
    );


    /* TITULO ORIGINAL */

    asignarTexto(
        "movieOriginalTitle",
        peliculaActual.tituloOriginal
    );


    /* DESCRIPCIÓN */

    asignarTexto(
        "movieDescription",
        peliculaActual.descripcion
    );


    /* AÑO */

    asignarTexto(
        "movieYear",
        peliculaActual.anio
    );


    /* DURACIÓN */

    asignarTexto(
        "movieDuration",
        peliculaActual.duracion
    );


    /* CALIDAD */

    asignarTexto(
        "movieQuality",
        peliculaActual.calidad
    );


    /* GÉNERO */

    asignarTexto(
        "movieGenre",
        peliculaActual.genero
    );


    /* RATING */

    asignarTexto(
        "movieRating",
        peliculaActual.rating
    );


    asignarTexto(
        "movieScore",
        peliculaActual.rating
    );


    /* DIRECTOR */

    asignarTexto(
        "movieDirector",
        peliculaActual.director
    );


    /* IDIOMA */

    asignarTexto(
        "movieIdioma",
        peliculaActual.idioma
    );


    /* SUBTÍTULOS */

    asignarTexto(
        "movieSubs",
        peliculaActual.subtitulos
    );
asignarTexto(
    "movieSubsInfo",
    peliculaActual.subtitulos
);
asignarTexto(
    "movieDetailsText",
    peliculaActual.descripcion
);
    /* CLASIFICACIÓN */

    asignarTexto(
        "movieClasificacion",
        peliculaActual.clasificacion
    );


    /* ESTRENO */

    asignarTexto(
        "movieEstreno",
        peliculaActual.anio
    );


    /* PAÍS */

    asignarTexto(
        "moviePais",
        peliculaActual.pais
    );


    /* SUBGÉNERO */

    asignarTexto(
        "movieSubgenero",
        peliculaActual.subgenero
    );

}


/* =========================================================
                    ASIGNAR TEXTO
========================================================= */

function asignarTexto(
    id,
    texto
){

    const elemento =
        document.getElementById(id);

    if(
        elemento &&
        texto !== undefined &&
        texto !== null
    ){

        elemento.textContent =
            texto;

    }

}


/* =========================================================
                    PORTADA
========================================================= */

function cargarPortada(){

    if(!peliculaActual){
        return;
    }

    const imagen =
        peliculaActual.poster ||
        peliculaActual.banner ||
        "";


    const poster =
        document.getElementById(
            "moviePoster"
        );


    const poster2 =
        document.getElementById(
            "posterMovie"
        );


    const poster3 =
        document.getElementById(
            "posterHero"
        );


    const imagenes = [
        poster,
        poster2,
        poster3
    ];


    imagenes.forEach(
        elemento => {

            if(!elemento){
                return;
            }

            elemento.src =
                imagen;

            elemento.alt =
                peliculaActual.titulo ||
                "Película";

            elemento.onerror = () => {

                if(
                    peliculaActual.banner &&
                    elemento.src !==
                    peliculaActual.banner
                ){

                    elemento.src =
                        peliculaActual.banner;

                }

            };

        }
    );

}


/* =========================================================
                    FONDO
========================================================= */

function cargarFondo(){

    if(
        !peliculaActual ||
        !background
    ){
        return;
    }

    const imagen =
        peliculaActual.banner ||
        peliculaActual.poster ||
        "";

    background.style.backgroundImage =
        `url("${imagen}")`;

}


/* =========================================================
                    BOTONES
========================================================= */

function configurarBotones(){

    /* REGRESAR */

    const regresar =
        document.getElementById(
            "btnBack"
        );

    if(regresar){

        regresar.addEventListener(
            "click",
            regresarAlMenu
        );

    }


    /* COMPARTIR */

    const compartir =
        document.getElementById(
            "btnCompartir"
        );

    if(compartir){

        compartir.addEventListener(
            "click",
            compartirPelicula
        );

    }


    /* TV */

    const tv =
        document.getElementById(
            "btnTV"
        );

    if(tv){

        tv.addEventListener(
            "click",
            transmitirTV
        );

    }


    /* TRAILER */

    const trailer =
        document.getElementById(
            "btnTrailer"
        );

    if(trailer){

        if(
            peliculaActual &&
            peliculaActual.trailer
        ){

            trailer.style.display =
                "flex";

            trailer.addEventListener(
                "click",
                abrirTrailer
            );

        }
        else{

            trailer.style.display =
                "none";

        }

    }

}


/* =========================================================
                    REGRESAR
========================================================= */

function regresarAlMenu(){

    /*
        Si el reproductor está abierto,
        primero se cierra.

        Esto evita que la flecha
        reproduzca accidentalmente
        la película.
    */

    if(
        document.body.classList.contains(
            "player-open"
        )
    ){

        cerrarReproductor();

        return;

    }


    if(
        document.referrer &&
        document.referrer.includes(
            window.location.hostname
        )
    ){

        history.back();

    }
    else{

        window.location.href =
            "index.html";

    }

}


/* =========================================================
                    REPRODUCIR
========================================================= */

function configurarBotonReproducir(){

    const botones = [

        document.getElementById(
            "btnPlayMovie"
        ),

        document.getElementById(
            "btnVerAhora"
        ),

        document.getElementById(
            "btnWatch"
        ),

        document.getElementById(
            "posterPlayButton"
        )

    ];


    botones.forEach(
        boton => {

            if(!boton){
                return;
            }

            boton.addEventListener(
                "click",
                iniciarReproduccion
            );

        }
    );

}


/* =========================================================
                    PREPARAR PLAYER
========================================================= */

function prepararPlayer(){

    const overlay =
        document.getElementById(
            "videoPlayerOverlay"
        );

    if(!overlay){
        return;
    }

    overlay.classList.remove(
        "active"
    );

}


/* =========================================================
                INICIAR REPRODUCCIÓN
========================================================= */

function iniciarReproduccion(){

    if(!peliculaActual){
        return;
    }


    const overlay =
        document.getElementById(
            "videoPlayerOverlay"
        );


    if(!overlay){

        console.error(
            "❌ No existe videoPlayerOverlay"
        );

        return;

    }


    overlay.classList.add(
        "active"
    );


    document.body.classList.add(
        "player-open"
    );


    crearReproductor();


    bloquearScroll();


    solicitarPantallaCompleta();

}


/* =========================================================
                CREAR REPRODUCTOR
========================================================= */

function crearReproductor(){

    const contenedor =
        document.getElementById(
            "videoPlayerContainer"
        ) ||
        document.getElementById(
            "videoContainer"
        );


    if(!contenedor){

        console.error(
            "❌ No existe contenedor del reproductor"
        );

        return;

    }


    contenedor.innerHTML = "";


    switch(
        peliculaActual.tipo
    ){

        case "youtube":

            contenedor.innerHTML =
                crearYoutube(
                    peliculaActual.url
                );

            break;


        case "drive":

            contenedor.innerHTML =
                crearDrive(
                    peliculaActual.url
                );

            break;


        case "mp4":

            contenedor.innerHTML =
                crearMP4(
                    peliculaActual.url
                );

            inicializarControlesMP4();

            break;


        default:

            contenedor.innerHTML = `

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

}


/* =========================================================
                    YOUTUBE
========================================================= */

function crearYoutube(url){

    const id =
        obtenerYoutubeID(url);


    if(!id){

        return `

            <div class="videoLoading">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>
                    Video de YouTube no válido
                </h2>

                <p>
                    No se pudo obtener el ID del video.
                </p>

            </div>

        `;

    }


    return `

        <div class="playerSource youtubeSource">

            <iframe

                id="youtubePlayer"

                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1"

                title="${escapeHTML(
                    peliculaActual.titulo
                )}"

                allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share
                "

                allowfullscreen>

            </iframe>

        </div>

    `;

}


/* =========================================================
                    DRIVE
========================================================= */

function crearDrive(url){

    const id =
        obtenerDriveID(url);


    if(!id){

        return `

            <div class="videoLoading">

                <h2>
                    Google Drive no válido
                </h2>

            </div>

        `;

    }


    return `

        <div class="playerSource driveSource">

            <iframe

                src="https://drive.google.com/file/d/${id}/preview"

                allow="autoplay"

                allowfullscreen>

            </iframe>

        </div>

    `;

}


/* =========================================================
                    MP4
========================================================= */

function crearMP4(url){

    return `

        <div class="playerSource mp4Source">

            <video

                id="videoPlayer"

                preload="metadata"

                playsinline

                autoplay>

                <source

                    src="${escapeAttribute(url)}"

                    type="video/mp4">

                Tu navegador no soporta video HTML5.

            </video>


            <div
                id="cineverseControls"
                class="cineverseControls">

                <button
                    id="btnPlay"
                    type="button">

                    <i class="fa-solid fa-play"></i>

                </button>


                <button
                    id="btnBack10"
                    type="button">

                    <i class="fa-solid fa-rotate-left"></i>
                    10

                </button>


                <input
                    id="progressBar"
                    type="range"
                    min="0"
                    max="100"
                    value="0"
                    step="0.1">


                <span id="timeDisplay">
                    0:00 / 0:00
                </span>


                <button
                    id="btnForward10"
                    type="button">

                    10
                    <i class="fa-solid fa-rotate-right"></i>

                </button>


                <button
                    id="btnMute"
                    type="button">

                    <i class="fa-solid fa-volume-high"></i>

                </button>


                <input
                    id="volumeBar"
                    type="range"
                    min="0"
                    max="1"
                    value="1"
                    step="0.05">


                <button
                    id="btnFullscreen"
                    type="button">

                    <i class="fa-solid fa-expand"></i>

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
                CONTROLES MP4
========================================================= */

function inicializarControlesMP4(){

    const video =
        document.getElementById(
            "videoPlayer"
        );


    if(!video){

        console.error(
            "❌ No se encontró videoPlayer"
        );

        return;

    }


    const play =
        document.getElementById(
            "btnPlay"
        );

    const back10 =
        document.getElementById(
            "btnBack10"
        );

    const forward10 =
        document.getElementById(
            "btnForward10"
        );

    const progress =
        document.getElementById(
            "progressBar"
        );

    const time =
        document.getElementById(
            "timeDisplay"
        );

    const mute =
        document.getElementById(
            "btnMute"
        );

    const volume =
        document.getElementById(
            "volumeBar"
        );

    const fullscreen =
        document.getElementById(
            "btnFullscreen"
        );


    /* PLAY */

    if(play){

        play.addEventListener(
            "click",
            ()=>{

                if(video.paused){

                    video.play().catch(
                        console.error
                    );

                }
                else{

                    video.pause();

                }

            }
        );

    }


    /* ATRÁS 10 */

    if(back10){

        back10.addEventListener(
            "click",
            ()=>{

                video.currentTime =
                    Math.max(
                        0,
                        video.currentTime - 10
                    );

            }
        );

    }


    /* ADELANTE 10 */

    if(forward10){

        forward10.addEventListener(
            "click",
            ()=>{

                video.currentTime =
                    Math.min(
                        video.duration || 0,
                        video.currentTime + 10
                    );

            }
        );

    }


    /* PROGRESO */

    if(progress){

        progress.addEventListener(
            "input",
            ()=>{

                if(video.duration){

                    video.currentTime =
                        (
                            video.duration *
                            Number(
                                progress.value
                            )
                        ) / 100;

                }

            }
        );

    }


    /* MUTE */

    if(mute){

        mute.addEventListener(
            "click",
            ()=>{

                video.muted =
                    !video.muted;

                actualizarMute(
                    video,
                    mute
                );

            }
        );

    }


    /* VOLUMEN */

    if(volume){

        volume.addEventListener(
            "input",
            ()=>{

                video.volume =
                    Number(
                        volume.value
                    );

                video.muted =
                    video.volume === 0;

                actualizarMute(
                    video,
                    mute
                );

            }
        );

    }


    /* FULLSCREEN */

    if(fullscreen){

        fullscreen.addEventListener(
            "click",
            ()=>{

                if(
                    document.fullscreenElement
                ){

                    document.exitFullscreen();

                }
                else if(
                    video.requestFullscreen
                ){

                    video.requestFullscreen();

                }

            }
        );

    }


    /* EVENTOS */

    video.addEventListener(
        "play",
        ()=>{
            actualizarPlay(
                video,
                play
            );
        }
    );


    video.addEventListener(
        "pause",
        ()=>{
            actualizarPlay(
                video,
                play
            );
        }
    );


    video.addEventListener(
        "timeupdate",
        ()=>{
            actualizarTiempo(
                video,
                progress,
                time
            );

            guardarProgresoVideo(
                video
            );

        }
    );


    video.addEventListener(
        "loadedmetadata",
        ()=>{
            actualizarTiempo(
                video,
                progress,
                time
            );

            restaurarProgresoVideo(
                video
            );

        }
    );


    video.addEventListener(
        "volumechange",
        ()=>{
            actualizarMute(
                video,
                mute
            );
        }
    );


    video.addEventListener(
        "ended",
        ()=>{

            eliminarContinuarViendo();

            video.currentTime = 0;

            actualizarPlay(
                video,
                play
            );

        }
    );


    video.play().catch(
        ()=>{
            console.log(
                "ℹ️ El navegador requiere interacción."
            );
        }
    );

}


/* =========================================================
                    PLAY
========================================================= */

function actualizarPlay(
    video,
    boton
){

    if(!boton){
        return;
    }

    boton.innerHTML =
        video.paused
        ?
        '<i class="fa-solid fa-play"></i>'
        :
        '<i class="fa-solid fa-pause"></i>';

}


/* =========================================================
                    TIEMPO
========================================================= */

function actualizarTiempo(
    video,
    progress,
    time
){

    if(!progress || !time){
        return;
    }


    const porcentaje =
        video.duration
        ?
        (
            video.currentTime /
            video.duration
        ) * 100
        :
        0;


    progress.value =
        porcentaje;


    time.textContent =
        `${formatearTiempo(
            video.currentTime
        )} / ${formatearTiempo(
            video.duration
        )}`;

}


/* =========================================================
                    MUTE
========================================================= */

function actualizarMute(
    video,
    boton
){

    if(!boton){
        return;
    }


    boton.innerHTML =
        video.muted ||
        video.volume === 0

        ?

        '<i class="fa-solid fa-volume-xmark"></i>'

        :

        '<i class="fa-solid fa-volume-high"></i>';

}


/* =========================================================
                    TIEMPO FORMATEADO
========================================================= */

function formatearTiempo(
    segundos
){

    if(
        !Number.isFinite(
            segundos
        )
    ){

        return "0:00";

    }


    const minutos =
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        Math.floor(
            segundos % 60
        )
        .toString()
        .padStart(
            2,
            "0"
        );


    const horas =
        Math.floor(
            minutos / 60
        );


    if(horas > 0){

        const minutosRestantes =
            (
                minutos % 60
            )
            .toString()
            .padStart(
                2,
                "0"
            );

        return `${horas}:${minutosRestantes}:${segundosRestantes}`;

    }


    return `${minutos}:${segundosRestantes}`;

}


/* =========================================================
                    YOUTUBE ID
========================================================= */

function obtenerYoutubeID(
    url
){

    try{

        const objeto =
            new URL(url);


        if(
            objeto.hostname.includes(
                "youtu.be"
            )
        ){

            return objeto.pathname
                .substring(1)
                .split("?")[0];

        }


        if(
            objeto.hostname.includes(
                "youtube.com"
            )
        ){

            if(
                objeto.pathname.includes(
                    "/shorts/"
                )
            ){

                return objeto.pathname
                    .split("/shorts/")[1]
                    .split("/")[0];

            }


            if(
                objeto.pathname.includes(
                    "/embed/"
                )
            ){

                return objeto.pathname
                    .split("/embed/")[1]
                    .split("/")[0];

            }


            return objeto.searchParams.get(
                "v"
            );

        }


        return null;

    }
    catch{

        return null;

    }

}


/* =========================================================
                    DRIVE ID
========================================================= */

function obtenerDriveID(
    url
){

    try{

        const resultado =
            String(url).match(
                /\/d\/([^/]+)/
            );

        return resultado
            ?
            resultado[1]
            :
            null;

    }
    catch{

        return null;

    }

}


/* =========================================================
                    MI LISTA
========================================================= */

function inicializarMiLista(){

    const boton =
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


/* =========================================================
                    FAVORITOS
========================================================= */

function toggleFavorito(){

    if(!peliculaActual){
        return;
    }


    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "miLista"
            )
        ) || [];


    const existe =
        favoritos.includes(
            peliculaActual.id
        );


    if(existe){

        favoritos =
            favoritos.filter(
                id =>
                    id !==
                    peliculaActual.id
            );

    }
    else{

        favoritos.push(
            peliculaActual.id
        );

    }


    localStorage.setItem(
        "miLista",
        JSON.stringify(
            favoritos
        )
    );


    actualizarBotonFavorito();

}


/* =========================================================
                ACTUALIZAR FAVORITO
========================================================= */

function actualizarBotonFavorito(){

    const boton =
        document.getElementById(
            "btnFavorito"
        );


    if(!boton || !peliculaActual){
        return;
    }


    const favoritos =
        JSON.parse(
            localStorage.getItem(
                "miLista"
            )
        ) || [];


    const existe =
        favoritos.includes(
            peliculaActual.id
        );


    if(existe){

        boton.innerHTML =
            '<i class="fa-solid fa-heart"></i> En Mi Lista';

    }
    else{

        boton.innerHTML =
            '<i class="fa-regular fa-heart"></i> Mi Lista';

    }

}


/* =========================================================
                CONTINUAR VIENDO
========================================================= */

function guardarContinuarViendo(){

    if(!peliculaActual){
        return;
    }


    let historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    historial =
        historial.filter(
            pelicula =>
                pelicula.id !==
                peliculaActual.id
        );


    historial.unshift({

        id:
            peliculaActual.id,

        titulo:
            peliculaActual.titulo,

        poster:
            peliculaActual.poster,

        banner:
            peliculaActual.banner,

        fecha:
            Date.now(),

        progreso:
            0

    });


    if(historial.length > 20){

        historial.pop();

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );

}


/* =========================================================
                GUARDAR PROGRESO
========================================================= */

function guardarProgresoVideo(
    video
){

    if(
        !peliculaActual ||
        !video.duration
    ){
        return;
    }


    let historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    const porcentaje =
        (
            video.currentTime /
            video.duration
        ) * 100;


    historial =
        historial.map(
            pelicula => {

                if(
                    pelicula.id ===
                    peliculaActual.id
                ){

                    return {

                        ...pelicula,

                        progreso:
                            porcentaje,

                        tiempo:
                            video.currentTime,

                        fecha:
                            Date.now()

                    };

                }


                return pelicula;

            }
        );


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );

}


/* =========================================================
            RESTAURAR PROGRESO
========================================================= */

function restaurarProgresoVideo(
    video
){

    if(!peliculaActual){
        return;
    }


    const historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    const pelicula =
        historial.find(
            item =>
                item.id ===
                peliculaActual.id
        );


    if(
        pelicula &&
        pelicula.tiempo > 5 &&
        pelicula.progreso < 95
    ){

        video.currentTime =
            pelicula.tiempo;

    }

}


/* =========================================================
            ELIMINAR AL TERMINAR
========================================================= */

function eliminarContinuarViendo(){

    if(!peliculaActual){
        return;
    }


    let historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    historial =
        historial.filter(
            pelicula =>
                pelicula.id !==
                peliculaActual.id
        );


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );

}


/* =========================================================
                    RELACIONADAS
========================================================= */

function cargarRelacionadas(){

    if(!relatedSlider){
        return;
    }


    relatedSlider.innerHTML = "";


    if(!peliculaActual){
        return;
    }


    const relacionadas =
        peliculas
            .filter(
                pelicula =>
                    pelicula.id !==
                    peliculaActual.id
            )
            .filter(
                pelicula => {

                    if(
                        pelicula.genero ===
                        peliculaActual.genero
                    ){

                        return true;

                    }


                    if(
                        Array.isArray(
                            peliculaActual.relacionadas
                        )
                    ){

                        return peliculaActual.relacionadas
                            .includes(
                                pelicula.id
                            );

                    }


                    return false;

                }
            )
            .slice(
                0,
                8
            );


    relacionadas.forEach(
        pelicula => {

            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "relatedCard";


            tarjeta.innerHTML = `

                <img

                    src="${escapeAttribute(
                        pelicula.poster ||
                        pelicula.banner ||
                        ""
                    )}"

                    alt="${escapeAttribute(
                        pelicula.titulo
                    )}"

                    loading="lazy">

                <div class="relatedInfo">

                    <h3>
                        ${escapeHTML(
                            pelicula.titulo
                        )}
                    </h3>

                    <div class="relatedMeta">

                        <span>
                            ${escapeHTML(
                                pelicula.anio ||
                                ""
                            )}
                        </span>

                        <span>
                            ⭐
                            ${escapeHTML(
                                pelicula.rating ||
                                ""
                            )}
                        </span>

                    </div>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                ()=>{

                    window.location.href =
                        `reproductor.html?id=${pelicula.id}`;

                }
            );


            relatedSlider.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================================
                    TRAILER
========================================================= */

function abrirTrailer(){

    if(
        !peliculaActual ||
        !peliculaActual.trailer
    ){

        return;

    }


    window.open(
        peliculaActual.trailer,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
                    COMPARTIR
========================================================= */

async function compartirPelicula(){

    if(!peliculaActual){
        return;
    }


    const enlace =
        window.location.href;


    try{

        if(
            navigator.share
        ){

            await navigator.share({

                title:
                    peliculaActual.titulo,

                text:
                    peliculaActual.descripcion,

                url:
                    enlace

            });

        }
        else if(
            navigator.clipboard
        ){

            await navigator.clipboard.writeText(
                enlace
            );

            mostrarMensaje(
                "Enlace copiado"
            );

        }

    }
    catch(error){

        console.log(
            "Compartir cancelado:",
            error
        );

    }

}


/* =========================================================
                    TRANSMITIR TV
========================================================= */

function transmitirTV(){

    mostrarMensaje(
        "Usa el botón de transmitir de tu navegador o dispositivo para enviar el video a tu TV."
    );

}


/* =========================================================
                CERRAR REPRODUCTOR
========================================================= */

function cerrarReproductor(){

    const overlay =
        document.getElementById(
            "videoPlayerOverlay"
        );


    if(!overlay){
        return;
    }


    const video =
        document.getElementById(
            "videoPlayer"
        );


    if(video){

        video.pause();

        guardarProgresoVideo(
            video
        );

    }


    overlay.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "player-open"
    );


    desbloquearScroll();


    const contenedor =
        document.getElementById(
            "videoPlayerContainer"
        ) ||
        document.getElementById(
            "videoContainer"
        );


    if(contenedor){

        contenedor.innerHTML = "";

    }


    if(
        document.fullscreenElement
    ){

        document.exitFullscreen()
            .catch(
                ()=>{}
            );

    }

}


/* =========================================================
                BOTÓN CERRAR PLAYER
========================================================= */

document.addEventListener(
    "click",
    event => {

        const boton =
            event.target.closest(
                "#btnClosePlayer"
            );


        if(boton){

            cerrarReproductor();

        }

    }
);


/* =========================================================
                    ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key ===
            "Escape"
        ){

            const overlay =
                document.getElementById(
                    "videoPlayerOverlay"
                );


            if(
                overlay &&
                overlay.classList.contains(
                    "active"
                )
            ){

                cerrarReproductor();

            }

        }

    }
);


/* =========================================================
                BLOQUEAR SCROLL
========================================================= */

function bloquearScroll(){

    document.body.style.overflow =
        "hidden";

}


function desbloquearScroll(){

    document.body.style.overflow =
        "";

}


/* =========================================================
            PANTALLA COMPLETA
========================================================= */

async function solicitarPantallaCompleta(){

    /*
        No forzamos fullscreen inmediatamente
        porque Chrome y Safari pueden bloquearlo.

        El reproductor queda listo para que
        el usuario pueda activar fullscreen.
    */

    if(
        window.innerWidth <= 900
    ){

        console.log(
            "📱 Reproductor móvil preparado"
        );

    }

}


/* =========================================================
                    MENSAJE
========================================================= */

function mostrarMensaje(
    mensaje
){

    const existente =
        document.querySelector(
            ".cineverseToast"
        );


    if(existente){

        existente.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "cineverseToast";


    toast.textContent =
        mensaje;


    document.body.appendChild(
        toast
    );


    setTimeout(
        ()=>{
            toast.classList.add(
                "show"
            );
        },
        20
    );


    setTimeout(
        ()=>{

            toast.classList.remove(
                "show"
            );

            setTimeout(
                ()=>{
                    toast.remove();
                },
                300
            );

        },
        3000
    );

}


/* =========================================================
                ESCAPAR HTML
========================================================= */

function escapeHTML(
    texto
){

    return String(
        texto ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
            ESCAPAR ATRIBUTO
========================================================= */

function escapeAttribute(
    texto
){

    return escapeHTML(
        texto
    );

}


/* =========================================================
                    FIN
========================================================= */

console.log(
    "🎬 CINEVERSE reproductor.js cargado correctamente"
);
