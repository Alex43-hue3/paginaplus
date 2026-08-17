"use strict";

/*=========================================================
                    VARIABLES
=========================================================*/

let peliculas = [];
let peliculaActual = null;

let youtubePlayer = null;
let youtubeAPILista = false;
let youtubeAPIEsperando = [];

let guardadoProgresoIntervalo = null;


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
            INICIAR API DE YOUTUBE
=========================================================*/

function cargarYouTubeAPI() {

    if (window.YT && window.YT.Player) {

        youtubeAPILista = true;
        ejecutarColaYouTube();

        return;

    }

    if (
        document.querySelector(
            'script[src="https://www.youtube.com/iframe_api"]'
        )
    ) {

        return;

    }

    window.onYouTubeIframeAPIReady = function () {

        youtubeAPILista = true;

        ejecutarColaYouTube();

    };

    const script =
        document.createElement("script");

    script.src =
        "https://www.youtube.com/iframe_api";

    document.head.appendChild(script);

}


function ejecutarColaYouTube() {

    while (youtubeAPIEsperando.length) {

        const funcion =
            youtubeAPIEsperando.shift();

        funcion();

    }

}


/*=========================================================
                    DOM READY
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarYouTubeAPI();

        iniciarPlayer();

    }
);


/*=========================================================
                FUNCIÓN PRINCIPAL
=========================================================*/

async function iniciarPlayer() {

    mostrarLoader();

    await cargarPeliculas();

    obtenerPelicula();

    if (!peliculaActual) {

        ocultarLoader();

        mostrarError();

        return;

    }

    crearReproductor();

    cargarInformacion();

    inicializarMiLista();

    cargarRelacionadas();

    iniciarModoCine();

    compartirPelicula();

    abrirTrailer();

    configurarBotonReproducir();

    /*
     * IMPORTANTE:
     * Guardamos la película solamente cuando
     * realmente empieza la reproducción.
     */

    ocultarLoader();

}


/*=========================================================
                CARGAR JSON
=========================================================*/

async function cargarPeliculas() {

    try {

        const respuesta =
            await fetch(
                "peliculas.json?v=" + Date.now()
            );

        if (!respuesta.ok) {

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
    catch (error) {

        console.error(
            "❌ Error cargando películas:",
            error
        );

    }

}


/*=========================================================
            OBTENER PELÍCULA
=========================================================*/

function obtenerPelicula() {

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

    if (peliculaActual) {

        console.log(
            "✅ Película encontrada:",
            peliculaActual.titulo
        );

    }
    else {

        console.error(
            "❌ No se encontró la película con ID:",
            id
        );

    }

}


/*=========================================================
                    LOADER
=========================================================*/

function mostrarLoader() {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.remove(
        "oculto"
    );

}


function ocultarLoader() {

    if (!loadingScreen) {
        return;
    }

    setTimeout(() => {

        loadingScreen.classList.add(
            "oculto"
        );

    }, 500);

}


/*=========================================================
                    ERROR
=========================================================*/

function mostrarError() {

    if (!videoContainer) {
        return;
    }

    videoContainer.innerHTML = `

        <div class="videoLoading">

            <i class="fa-solid fa-circle-exclamation"></i>

            <h2>
                No se encontró la película
            </h2>

            <p>
                Verifica el ID de la película
                y peliculas.json.
            </p>

        </div>

    `;

}


/*=========================================================
                CREAR REPRODUCTOR
=========================================================*/

function crearReproductor() {

    if (!peliculaActual || !videoContainer) {
        return;
    }

    let html = "";

    switch (peliculaActual.tipo) {

        case "youtube":

            html =
                crearYoutube(
                    peliculaActual.url
                );

            break;


        case "drive":

            html =
                crearDrive(
                    peliculaActual.url
                );

            break;


        case "mp4":

            html =
                crearMP4(
                    peliculaActual.url
                );

            break;


        default:

            html = `

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

    videoContainer.innerHTML =
        html;


    /*
     * Después de insertar el HTML
     * inicializamos el reproductor.
     */

    if (
        peliculaActual.tipo === "mp4"
    ) {

        inicializarControlesMP4();

    }


    if (
        peliculaActual.tipo === "youtube"
    ) {

        inicializarYouTube();

    }

}


/*=========================================================
                    YOUTUBE
=========================================================*/

function crearYoutube(url) {

    const id =
        obtenerYoutubeID(url);

    if (!id) {

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

        <div
            class="playerSource youtubeSource"
            style="width:100%;height:100%;">

            <div
                id="youtubePlayer"
                style="width:100%;height:100%;">

            </div>

        </div>

    `;

}


/*=========================================================
            INICIALIZAR YOUTUBE API
=========================================================*/

function inicializarYouTube() {

    if (!peliculaActual) {
        return;
    }

    const id =
        obtenerYoutubeID(
            peliculaActual.url
        );

    if (!id) {
        return;
    }

    const iniciar = () => {

        if (
            !window.YT ||
            !window.YT.Player
        ) {

            return;

        }

        const elemento =
            document.getElementById(
                "youtubePlayer"
            );

        if (!elemento) {
            return;
        }

        youtubePlayer =
            new YT.Player(
                "youtubePlayer",
                {

                    videoId: id,

                    playerVars: {

                        autoplay: 1,

                        rel: 0,

                        modestbranding: 1,

                        playsinline: 1

                    },

                    events: {

                        onReady:
                            youtubeReady,

                        onStateChange:
                            youtubeStateChange

                    }

                }
            );

    };


    if (youtubeAPILista) {

        iniciar();

    }
    else {

        youtubeAPIEsperando.push(
            iniciar
        );

    }

}


/*=========================================================
                YOUTUBE READY
=========================================================*/

function youtubeReady(event) {

    console.log(
        "▶️ YouTube listo"
    );


    /*
     * Intentamos recuperar el progreso
     * anterior.
     */

    const progreso =
        obtenerProgreso();

    if (
        progreso &&
        progreso.segundos > 5
    ) {

        try {

            event.target.seekTo(
                progreso.segundos,
                true
            );

            console.log(
                "⏩ Continuando YouTube desde:",
                progreso.segundos
            );

        }
        catch (error) {

            console.warn(
                "No se pudo recuperar progreso YouTube",
                error
            );

        }

    }


    /*
     * YouTube puede bloquear autoplay.
     * No pasa nada: el usuario puede
     * pulsar reproducir.
     */

    try {

        event.target.playVideo();

    }
    catch (error) {

        console.log(
            "ℹ️ YouTube requiere interacción del usuario."
        );

    }

}


/*=========================================================
            CAMBIO DE ESTADO YOUTUBE
=========================================================*/

function youtubeStateChange(event) {

    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        console.log(
            "▶️ Reproduciendo YouTube"
        );

        guardarContinuarViendo();

        iniciarGuardadoYouTube();

    }


    if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        guardarProgresoYouTube();

    }


    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        console.log(
            "✅ YouTube terminado"
        );

        eliminarContinuarViendo();

        detenerGuardadoYouTube();

    }

}


/*=========================================================
            GUARDAR PROGRESO YOUTUBE
=========================================================*/

function iniciarGuardadoYouTube() {

    detenerGuardadoYouTube();

    guardadoProgresoIntervalo =
        setInterval(
            () => {

                guardarProgresoYouTube();

            },
            5000
        );

}


function detenerGuardadoYouTube() {

    if (
        guardadoProgresoIntervalo
    ) {

        clearInterval(
            guardadoProgresoIntervalo
        );

        guardadoProgresoIntervalo =
            null;

    }

}


function guardarProgresoYouTube() {

    if (
        !youtubePlayer ||
        !peliculaActual
    ) {

        return;

    }

    try {

        const actual =
            youtubePlayer.getCurrentTime();

        const duracion =
            youtubePlayer.getDuration();

        if (
            !Number.isFinite(actual) ||
            !Number.isFinite(duracion) ||
            duracion <= 0
        ) {

            return;

        }

        guardarProgreso(
            actual,
            duracion
        );

    }
    catch (error) {

        console.log(
            "No se pudo guardar progreso YouTube",
            error
        );

    }

}


/*=========================================================
                    GOOGLE DRIVE
=========================================================*/

function crearDrive(url) {

    const id =
        obtenerDriveID(url);

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

function crearMP4(url) {

    return `

        <div
            class="playerSource mp4Source"
            style="width:100%;height:100%;">

            <video
                id="videoPlayer"
                preload="metadata"
                playsinline>

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
                    type="button">

                    <i
                        class="fa-solid fa-play">
                    </i>

                </button>


                <button
                    id="btnBack10"
                    type="button">

                    <i
                        class="fa-solid fa-rotate-left">
                    </i>

                    10

                </button>


                <input
                    id="progressBar"
                    type="range"
                    min="0"
                    max="100"
                    value="0"
                    step="0.1">


                <span
                    id="timeDisplay">

                    0:00 / 0:00

                </span>


                <button
                    id="btnForward10"
                    type="button">

                    10

                    <i
                        class="fa-solid fa-rotate-right">
                    </i>

                </button>


                <button
                    id="btnMute"
                    type="button">

                    <i
                        class="fa-solid fa-volume-high">
                    </i>

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

                    <i
                        class="fa-solid fa-expand">
                    </i>

                </button>


            </div>

        </div>

    `;

}


/*=========================================================
            CONTROLES MP4
=========================================================*/

function inicializarControlesMP4() {

    const video =
        document.getElementById(
            "videoPlayer"
        );

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

    const container =
        document.getElementById(
            "videoContainer"
        );


    if (!video) {

        console.error(
            "❌ No se encontró videoPlayer"
        );

        return;

    }


    /*---------------------------------------------
                    TIEMPO
    ---------------------------------------------*/

    function formatearTiempo(
        segundos
    ) {

        if (
            !Number.isFinite(
                segundos
            )
        ) {

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


        if (horas > 0) {

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


    /*---------------------------------------------
                    PLAY
    ---------------------------------------------*/

    function actualizarPlay() {

        if (!play) {
            return;
        }

        if (video.paused) {

            play.innerHTML =
                '<i class="fa-solid fa-play"></i>';

        }
        else {

            play.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        }

    }


    /*---------------------------------------------
                    TIEMPO
    ---------------------------------------------*/

    function actualizarTiempo() {

        if (!progress || !time) {
            return;
        }

        const porcentaje =
            video.duration
                ? (
                    video.currentTime /
                    video.duration
                ) * 100
                : 0;


        progress.value =
            porcentaje;


        time.textContent =
            `${formatearTiempo(video.currentTime)} / ${formatearTiempo(video.duration)}`;

    }


    /*---------------------------------------------
                    MUTE
    ---------------------------------------------*/

    function actualizarMute() {

        if (!mute) {
            return;
        }

        if (
            video.muted ||
            video.volume === 0
        ) {

            mute.innerHTML =
                '<i class="fa-solid fa-volume-xmark"></i>';

        }
        else {

            mute.innerHTML =
                '<i class="fa-solid fa-volume-high"></i>';

        }

    }


    /*---------------------------------------------
                PLAY / PAUSE
    ---------------------------------------------*/

    if (play) {

        play.addEventListener(
            "click",
            () => {

                if (video.paused) {

                    video.play()
                        .catch(() => {});

                }
                else {

                    video.pause();

                }

            }
        );

    }


    /*---------------------------------------------
                    ATRÁS 10
    ---------------------------------------------*/

    if (back10) {

        back10.addEventListener(
            "click",
            () => {

                video.currentTime =
                    Math.max(
                        0,
                        video.currentTime - 10
                    );

            }
        );

    }


    /*---------------------------------------------
                    ADELANTE 10
    ---------------------------------------------*/

    if (forward10) {

        forward10.addEventListener(
            "click",
            () => {

                video.currentTime =
                    Math.min(
                        video.duration || 0,
                        video.currentTime + 10
                    );

            }
        );

    }


    /*---------------------------------------------
                    BARRA
    ---------------------------------------------*/

    if (progress) {

        progress.addEventListener(
            "input",
            () => {

                if (
                    video.duration
                ) {

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


    /*---------------------------------------------
                    MUTE
    ---------------------------------------------*/

    if (mute) {

        mute.addEventListener(
            "click",
            () => {

                video.muted =
                    !video.muted;

                actualizarMute();

            }
        );

    }


    /*---------------------------------------------
                    VOLUMEN
    ---------------------------------------------*/

    if (volume) {

        volume.addEventListener(
            "input",
            () => {

                video.volume =
                    Number(
                        volume.value
                    );

                video.muted =
                    video.volume === 0;

                actualizarMute();

            }
        );

    }


    /*---------------------------------------------
                PANTALLA COMPLETA
    ---------------------------------------------*/

    if (fullscreen) {

        fullscreen.addEventListener(
            "click",
            () => {

                if (
                    document.fullscreenElement
                ) {

                    document.exitFullscreen();

                    return;

                }


                if (
                    container &&
                    container.requestFullscreen
                ) {

                    container.requestFullscreen();

                }

            }
        );

    }


    /*---------------------------------------------
                    EVENTOS VIDEO
    ---------------------------------------------*/

    video.addEventListener(
        "play",
        () => {

            actualizarPlay();

            guardarContinuarViendo();

        }
    );


    video.addEventListener(
        "pause",
        () => {

            actualizarPlay();

            guardarProgresoMP4();

        }
    );


    video.addEventListener(
        "timeupdate",
        () => {

            actualizarTiempo();

            /*
             * Guardamos cada cierto avance.
             * No usamos localStorage en cada frame.
             */

            if (
                Math.floor(
                    video.currentTime
                ) % 5 === 0
            ) {

                guardarProgresoMP4();

            }

        }
    );


    video.addEventListener(
        "loadedmetadata",
        () => {

            actualizarTiempo();

            recuperarProgresoMP4();

        }
    );


    video.addEventListener(
        "volumechange",
        actualizarMute
    );


    /*---------------------------------------------
                    TERMINÓ
    ---------------------------------------------*/

    video.addEventListener(
        "ended",
        () => {

            console.log(
                "✅ Película MP4 terminada"
            );

            eliminarContinuarViendo();

            video.currentTime = 0;

            actualizarPlay();

            actualizarTiempo();

        }
    );


    actualizarPlay();

    actualizarMute();

    actualizarTiempo();

}


/*=========================================================
            RECUPERAR PROGRESO MP4
=========================================================*/

function recuperarProgresoMP4() {

    const video =
        document.getElementById(
            "videoPlayer"
        );

    if (!video) {
        return;
    }

    const progreso =
        obtenerProgreso();

    if (
        !progreso ||
        !progreso.segundos
    ) {

        return;

    }


    /*
     * Evitamos recuperar una posición
     * prácticamente terminada.
     */

    if (
        progreso.duracion &&
        progreso.segundos >=
        progreso.duracion - 10
    ) {

        eliminarContinuarViendo();

        return;

    }


    try {

        video.currentTime =
            progreso.segundos;

        console.log(
            "⏩ Continuando desde:",
            progreso.segundos
        );

    }
    catch (error) {

        console.log(
            "No se pudo recuperar progreso",
            error
        );

    }

}


/*=========================================================
            GUARDAR PROGRESO MP4
=========================================================*/

function guardarProgresoMP4() {

    const video =
        document.getElementById(
            "videoPlayer"
        );

    if (
        !video ||
        !peliculaActual
    ) {

        return;

    }


    if (
        !Number.isFinite(
            video.currentTime
        ) ||
        !Number.isFinite(
            video.duration
        ) ||
        video.duration <= 0
    ) {

        return;

    }


    guardarProgreso(
        video.currentTime,
        video.duration
    );

}


/*=========================================================
                GUARDAR PROGRESO
=========================================================*/

function guardarProgreso(
    segundos,
    duracion
) {

    if (!peliculaActual) {
        return;
    }


    let historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    const porcentaje =
        duracion > 0
            ? (
                segundos /
                duracion
            ) * 100
            : 0;


    /*
     * Si ya está prácticamente terminada,
     * la eliminamos.
     */

    if (
        porcentaje >= 95
    ) {

        eliminarContinuarViendo();

        return;

    }


    historial =
        historial.filter(
            pelicula =>
                Number(pelicula.id) !==
                Number(peliculaActual.id)
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

        segundos:
            segundos,

        duracion:
            duracion,

        porcentaje:
            porcentaje,

        fecha:
            Date.now()

    });


    /*
     * Permitimos varias películas.
     */

    if (
        historial.length > 20
    ) {

        historial =
            historial.slice(
                0,
                20
            );

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );


    console.log(
        "💾 Progreso guardado:",
        peliculaActual.titulo,
        Math.round(porcentaje) + "%"
    );

}


/*=========================================================
            GUARDAR EN CONTINUAR VIENDO
=========================================================*/

function guardarContinuarViendo() {

    if (!peliculaActual) {
        return;
    }


    let historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    const existente =
        historial.find(
            pelicula =>
                Number(pelicula.id) ===
                Number(peliculaActual.id)
        );


    /*
     * Si ya existe con progreso,
     * NO lo reemplazamos.
     */

    if (existente) {
        return;
    }


    historial.unshift({

        id:
            peliculaActual.id,

        titulo:
            peliculaActual.titulo,

        poster:
            peliculaActual.poster,

        banner:
            peliculaActual.banner,

        segundos:
            0,

        duracion:
            0,

        porcentaje:
            0,

        fecha:
            Date.now()

    });


    if (
        historial.length > 20
    ) {

        historial =
            historial.slice(
                0,
                20
            );

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );

}


/*=========================================================
            OBTENER PROGRESO
=========================================================*/

function obtenerProgreso() {

    if (!peliculaActual) {
        return null;
    }


    const historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    return (
        historial.find(
            pelicula =>
                Number(pelicula.id) ===
                Number(peliculaActual.id)
        ) || null
    );

}


/*=========================================================
            ELIMINAR AUTOMÁTICAMENTE
=========================================================*/

function eliminarContinuarViendo() {

    if (!peliculaActual) {
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
                Number(pelicula.id) !==
                Number(peliculaActual.id)
        );


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );


    console.log(
        "🗑️ Eliminada de Continuar viendo:",
        peliculaActual.titulo
    );

}


/*=========================================================
                OBTENER ID YOUTUBE
=========================================================*/

function obtenerYoutubeID(url) {

    try {

        const objeto =
            new URL(url);


        /*
         * youtu.be
         */

        if (
            objeto.hostname.includes(
                "youtu.be"
            )
        ) {

            return objeto.pathname
                .substring(1)
                .split("?")[0];

        }


        /*
         * youtube.com/watch?v=
         */

        const videoID =
            objeto.searchParams.get(
                "v"
            );

        if (videoID) {

            return videoID;

        }


        /*
         * youtube.com/embed/ID
         */

        if (
            objeto.pathname.includes(
                "/embed/"
            )
        ) {

            return objeto.pathname
                .split("/embed/")[1]
                .split("/")[0];

        }


        return null;

    }
    catch {

        return null;

    }

}


/*=========================================================
                OBTENER ID DRIVE
=========================================================*/

function obtenerDriveID(url) {

    const expresion =
        /\/d\/([^/]+)/;

    const resultado =
        String(url)
            .match(
                expresion
            );


    return resultado
        ? resultado[1]
        : url;

}


/*=========================================================
                INFORMACIÓN
=========================================================*/

function cargarInformacion() {

    if (!peliculaActual) {
        return;
    }


    if (background) {

        background.style.backgroundImage =
            `url("${peliculaActual.banner}")`;

    }


    asignarTexto(
        "movieTitle",
        peliculaActual.titulo
    );


    asignarTexto(
        "movieDescription",
        peliculaActual.descripcion
    );


    asignarTexto(
        "movieYear",
        peliculaActual.anio
    );


    asignarTexto(
        "movieDuration",
        peliculaActual.duracion
    );


    asignarTexto(
        "movieQuality",
        peliculaActual.calidad
    );


    asignarTexto(
        "movieGenre",
        peliculaActual.genero
    );


    asignarTexto(
        "movieRating",
        "⭐ " +
        peliculaActual.rating
    );


    asignarTexto(
        "movieScore",
        peliculaActual.rating
    );


    asignarTexto(
        "movieDirector",
        peliculaActual.director
    );


    asignarTexto(
        "movieIdioma",
        peliculaActual.idioma
    );


    asignarTexto(
        "movieSubs",
        peliculaActual.subtitulos
    );


    asignarTexto(
        "movieClasificacion",
        peliculaActual.clasificacion
    );


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
) {

    const elemento =
        document.getElementById(
            id
        );


    if (
        elemento &&
        texto !== undefined &&
        texto !== null
    ) {

        elemento.textContent =
            texto;

    }

}


/*=========================================================
            BOTÓN REPRODUCIR
=========================================================*/

function configurarBotonReproducir() {

    const boton =
        document.getElementById(
            "btnReproducir"
        );


    if (!boton) {
        return;
    }


    boton.addEventListener(
        "click",
        () => {

            const video =
                document.getElementById(
                    "videoPlayer"
                );


            /*
             * MP4
             */

            if (video) {

                video.play()
                    .catch(() => {});

                return;

            }


            /*
             * YouTube
             */

            if (
                youtubePlayer &&
                youtubePlayer.playVideo
            ) {

                youtubePlayer.playVideo();

            }

        }
    );

}


/*=========================================================
                    MI LISTA
=========================================================*/

function inicializarMiLista() {

    const boton =
        document.getElementById(
            "btnFavorito"
        );


    if (!boton) {
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

function toggleFavorito() {

    if (!peliculaActual) {
        return;
    }


    let favoritos =
        JSON.parse(
            localStorage.getItem(
                "miLista"
            )
        ) || [];


    const id =
        Number(
            peliculaActual.id
        );


    const existe =
        favoritos.some(
            favorito =>
                Number(favorito) === id
        );


    if (existe) {

        favoritos =
            favoritos.filter(
                favorito =>
                    Number(favorito) !== id
            );

    }
    else {

        favoritos.push(id);

    }


    localStorage.setItem(
        "miLista",
        JSON.stringify(
            favoritos
        )
    );


    actualizarBotonFavorito();

}


/*=========================================================
            ACTUALIZAR FAVORITO
=========================================================*/

function actualizarBotonFavorito() {

    const boton =
        document.getElementById(
            "btnFavorito"
        );


    if (
        !boton ||
        !peliculaActual
    ) {

        return;

    }


    const favoritos =
        JSON.parse(
            localStorage.getItem(
                "miLista"
            )
        ) || [];


    const existe =
        favoritos.some(
            favorito =>
                Number(favorito) ===
                Number(
                    peliculaActual.id
                )
        );


    if (existe) {

        boton.innerHTML =
            '<i class="fa-solid fa-heart"></i> En Mi Lista';

    }
    else {

        boton.innerHTML =
            '<i class="fa-regular fa-heart"></i> Mi Lista';

    }

}


/*=========================================================
                RELACIONADAS
=========================================================*/

function cargarRelacionadas() {

    const contenedor =
        document.getElementById(
            "relatedSlider"
        );


    if (
        !contenedor ||
        !peliculaActual
    ) {

        return;

    }


    contenedor.innerHTML =
        "";


    let relacionadas = [];


    /*
     * Primero usamos el campo
     * "relacionadas" del JSON.
     */

    if (
        Array.isArray(
            peliculaActual.relacionadas
        )
    ) {

        relacionadas =
            peliculaActual.relacionadas
                .map(
                    id =>
                        peliculas.find(
                            pelicula =>
                                Number(
                                    pelicula.id
                                ) ===
                                Number(id)
                        )
                )
                .filter(Boolean);

    }


    /*
     * Si no existen relacionadas,
     * buscamos por género.
     */

    if (
        !relacionadas.length
    ) {

        relacionadas =
            peliculas.filter(
                pelicula =>
                    Number(
                        pelicula.id
                    ) !==
                    Number(
                        peliculaActual.id
                    ) &&
                    pelicula.genero ===
                    peliculaActual.genero
            );

    }


    relacionadas =
        relacionadas.slice(
            0,
            4
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

                <div class="relatedPoster">

                    <img
                        src="${pelicula.poster || pelicula.banner || ""}"
                        alt="${pelicula.titulo || "Película"}">

                    <div class="relatedOverlay">

                        <div class="relatedPlay">

                            <i
                                class="fa-solid fa-play">
                            </i>

                        </div>

                    </div>

                </div>


                <div class="relatedInfo">

                    <h3>
                        ${pelicula.titulo}
                    </h3>

                    <div class="relatedMeta">

                        <span>
                            ${pelicula.anio || ""}
                        </span>

                        <span>
                            ${pelicula.duracion || ""}
                        </span>

                    </div>

                    <span class="relatedGenre">

                        ${pelicula.genero || ""}

                    </span>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `reproductor.html?id=${pelicula.id}`;

                }
            );


            contenedor.appendChild(
                tarjeta
            );

        }
    );

}


/*=========================================================
                    MODO CINE
=========================================================*/

function iniciarModoCine() {

    /*
     * Tu HTML utiliza modoCine,
     * no btnCinema.
     */

    const boton =
        document.getElementById(
            "modoCine"
        );


    if (!boton) {
        return;
    }


    boton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "cinemaMode"
            );

        }
    );

}


/*=========================================================
                    COMPARTIR
=========================================================*/

function compartirPelicula() {

    const boton =
        document.getElementById(
            "btnCompartir"
        );


    if (!boton) {
        return;
    }


    boton.addEventListener(
        "click",
        async () => {

            if (!peliculaActual) {
                return;
            }


            const enlace =
                window.location.href;


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share({

                        title:
                            peliculaActual.titulo,

                        text:
                            peliculaActual.descripcion,

                        url:
                            enlace

                    });

                }
                else if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        enlace
                    );

                    alert(
                        "Enlace copiado."
                    );

                }

            }
            catch (error) {

                console.log(
                    "Compartir cancelado:",
                    error
                );

            }

        }
    );

}


/*=========================================================
                    TRAILER
=========================================================*/

function abrirTrailer() {

    const boton =
        document.getElementById(
            "btnTrailer"
        );


    if (!boton) {
        return;
    }


    if (
        !peliculaActual ||
        !peliculaActual.trailer
    ) {

        boton.style.display =
            "none";

        return;

    }


    boton.addEventListener(
        "click",
        () => {

            window.open(
                peliculaActual.trailer,
                "_blank"
            );

        }
    );

}


/*=========================================================
                GUARDAR AL SALIR
=========================================================*/

window.addEventListener(
    "beforeunload",
    () => {

        /*
         * MP4
         */

        if (
            peliculaActual &&
            peliculaActual.tipo === "mp4"
        ) {

            guardarProgresoMP4();

        }


        /*
         * YouTube
         */

        if (
            peliculaActual &&
            peliculaActual.tipo === "youtube"
        ) {

            guardarProgresoYouTube();

        }

    }
);


/*=========================================================
                VISIBILIDAD DE PÁGINA
=========================================================*/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            if (
                peliculaActual &&
                peliculaActual.tipo === "mp4"
            ) {

                guardarProgresoMP4();

            }


            if (
                peliculaActual &&
                peliculaActual.tipo === "youtube"
            ) {

                guardarProgresoYouTube();

            }

        }

    }
);
