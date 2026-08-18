"use strict";

/* =========================================================
                    CINEVERSE
              REPRODUCTOR PRINCIPAL
========================================================= */


/* =========================================================
                    VARIABLES
========================================================= */

let peliculas = [];
let peliculaActual = null;

let videoActual = null;

let tipoReproductorActual = null;

let guardadoProgreso = null;


/* =========================================================
                    ELEMENTOS
========================================================= */

const loadingScreen =
    document.getElementById("loadingScreen");

const playerBackground =
    document.getElementById("playerBackground");

const moviePoster =
    document.getElementById("moviePoster");

const posterLoading =
    document.getElementById("posterLoading");

const videoPlayerSection =
    document.getElementById("videoPlayerSection");

const videoContainer =
    document.getElementById("videoContainer");

const fullscreenPlayer =
    document.getElementById("fullscreenPlayer");

const fullscreenVideoContainer =
    document.getElementById("fullscreenVideoContainer");

const relatedSlider =
    document.getElementById("relatedSlider");

const playerToast =
    document.getElementById("playerToast");


/* =========================================================
                    INICIO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciarPlayer
);


async function iniciarPlayer() {

    console.log("🎬 Iniciando reproductor CINEVERSE...");

    mostrarLoader();

    await cargarPeliculas();

    obtenerPelicula();

    if (!peliculaActual) {

        ocultarLoader();

        mostrarError(
            "No se encontró la película."
        );

        return;
    }

    console.log(
        "✅ Película:",
        peliculaActual.titulo
    );

    cargarInformacion();

    cargarPortada();

    inicializarBotones();

    cargarRelacionadas();

    actualizarMiLista();

    guardarEnContinuarViendo();

    ocultarLoader();

}


/* =========================================================
                    CARGAR JSON
========================================================= */

async function cargarPeliculas() {

    try {

        const respuesta =
            await fetch(
                "peliculas.json?v=" +
                Date.now()
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar peliculas.json"
            );

        }

        peliculas =
            await respuesta.json();

        console.log(
            "📚 Películas cargadas:",
            peliculas.length
        );

    }
    catch (error) {

        console.error(
            "❌ Error cargando peliculas.json:",
            error
        );

        peliculas = [];

    }

}


/* =========================================================
                    OBTENER PELÍCULA
========================================================= */

function obtenerPelicula() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const idTexto =
        parametros.get("id");

    const id =
        Number(idTexto);

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
            "❌ Película no encontrada:",
            id
        );

    }

}


/* =========================================================
                    PORTADA
========================================================= */

function cargarPortada() {

    if (!peliculaActual) {
        return;
    }

    const imagen =
        peliculaActual.poster ||
        peliculaActual.banner ||
        "";

    if (!moviePoster) {
        return;
    }

    if (!imagen) {

        moviePoster.style.display =
            "none";

        if (posterLoading) {

            posterLoading.innerHTML = `
                <i class="fa-solid fa-film"></i>
                <span>Sin portada</span>
            `;

        }

        return;
    }

    moviePoster.onload = () => {

        moviePoster.classList.add(
            "loaded"
        );

        if (posterLoading) {

            posterLoading.style.display =
                "none";

        }

    };

    moviePoster.onerror = () => {

        console.warn(
            "⚠️ No se pudo cargar el poster:",
            imagen
        );

        if (
            peliculaActual.banner &&
            peliculaActual.banner !== imagen
        ) {

            moviePoster.src =
                peliculaActual.banner;

            return;

        }

        if (posterLoading) {

            posterLoading.innerHTML = `
                <i class="fa-solid fa-image"></i>
                <span>Imagen no disponible</span>
            `;

        }

    };

    moviePoster.src = imagen;

}


/* =========================================================
                    INFORMACIÓN
========================================================= */

function cargarInformacion() {

    if (!peliculaActual) {
        return;
    }


    /* FONDO */

    if (playerBackground) {

        const fondo =
            peliculaActual.banner ||
            peliculaActual.poster ||
            "";

        if (fondo) {

            playerBackground.style.backgroundImage =
                `url("${fondo}")`;

        }

    }


    /* TÍTULO */

    asignarTexto(
        "movieTitle",
        peliculaActual.titulo ||
        "Película"
    );


    /* AÑO */

    asignarTexto(
        "movieYear",
        peliculaActual.anio ||
        ""
    );


    /* DURACIÓN */

    asignarTexto(
        "movieDuration",
        peliculaActual.duracion ||
        "Película"
    );


    /* GÉNERO */

    asignarTexto(
        "movieGenre",
        peliculaActual.genero ||
        ""
    );


    /* CALIDAD */

    asignarTexto(
        "movieQuality",
        peliculaActual.calidad ||
        "HD"
    );


    /* CLASIFICACIÓN */

    asignarTexto(
        "movieClasificacion",
        peliculaActual.clasificacion ||
        "A"
    );


    /* SUBTÍTULOS */

    asignarTexto(
        "movieSubs",
        peliculaActual.subtitulos ||
        "No"
    );


    /* IDIOMA */

    asignarTexto(
        "movieIdioma",
        peliculaActual.idioma ||
        "No disponible"
    );


    /* SUBTÍTULOS INFORMACIÓN */

    asignarTexto(
        "movieSubsInfo",
        peliculaActual.subtitulos ||
        "No disponible"
    );


    /* DIRECTOR */

    asignarTexto(
        "movieDirector",
        peliculaActual.director ||
        "No disponible"
    );


    /* PAÍS */

    asignarTexto(
        "moviePais",
        peliculaActual.pais ||
        "No disponible"
    );


    /* DESCRIPCIÓN */

    asignarTexto(
        "movieDescription",
        peliculaActual.descripcion ||
        "No hay descripción disponible."
    );

}


/* =========================================================
                    ASIGNAR TEXTO
========================================================= */

function asignarTexto(id, texto) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        texto ?? "";

}


/* =========================================================
                    BOTONES
========================================================= */

function inicializarBotones() {


    /* VER AHORA */

    const btnReproducir =
        document.getElementById(
            "btnReproducir"
        );

    if (btnReproducir) {

        btnReproducir.addEventListener(
            "click",
            abrirReproductor
        );

    }


    /* REGRESAR */

    const btnRegresar =
        document.getElementById(
            "btnRegresar"
        );

    if (btnRegresar) {

        btnRegresar.addEventListener(
            "click",
            regresar
        );

    }


    const btnRegresarFinal =
        document.getElementById(
            "btnRegresarFinal"
        );

    if (btnRegresarFinal) {

        btnRegresarFinal.addEventListener(
            "click",
            regresar
        );

    }


    /* CERRAR REPRODUCTOR */

    const btnCerrar =
        document.getElementById(
            "btnCerrarPlayer"
        );

    if (btnCerrar) {

        btnCerrar.addEventListener(
            "click",
            cerrarReproductor
        );

    }


    /* TRAILER */

    const btnTrailer =
        document.getElementById(
            "btnTrailer"
        );

    if (btnTrailer) {

        if (
            peliculaActual &&
            peliculaActual.trailer
        ) {

            btnTrailer.style.display =
                "inline-flex";

            btnTrailer.addEventListener(
                "click",
                abrirTrailer
            );

        }
        else {

            btnTrailer.style.display =
                "none";

        }

    }


    /* MI LISTA */

    const btnFavorito =
        document.getElementById(
            "btnFavorito"
        );

    if (btnFavorito) {

        btnFavorito.addEventListener(
            "click",
            toggleFavorito
        );

    }


    /* COMPARTIR ARRIBA */

    const btnCompartirTop =
        document.getElementById(
            "btnCompartirTop"
        );

    if (btnCompartirTop) {

        btnCompartirTop.addEventListener(
            "click",
            compartirPelicula
        );

    }


    /* COMPARTIR EN REPRODUCTOR */

    const btnFullscreenShare =
        document.getElementById(
            "btnFullscreenShare"
        );

    if (btnFullscreenShare) {

        btnFullscreenShare.addEventListener(
            "click",
            compartirPelicula
        );

    }


    /* TV */

    const btnTV =
        document.getElementById(
            "btnTV"
        );

    if (btnTV) {

        btnTV.addEventListener(
            "click",
            transmitir
        );

    }


    const btnFullscreenTV =
        document.getElementById(
            "btnFullscreenTV"
        );

    if (btnFullscreenTV) {

        btnFullscreenTV.addEventListener(
            "click",
            transmitir
        );

    }

}


/* =========================================================
                ABRIR REPRODUCTOR
========================================================= */

function abrirReproductor() {

    if (!peliculaActual) {

        mostrarToast(
            "No se encontró la película."
        );

        return;

    }

    console.log(
        "▶️ Reproduciendo:",
        peliculaActual.titulo
    );


    if (!fullscreenPlayer) {

        console.error(
            "❌ No existe fullscreenPlayer"
        );

        return;

    }


    fullscreenPlayer.style.display =
        "flex";

    document.body.classList.add(
        "playerOpen"
    );


    tipoReproductorActual =
        obtenerTipoVideo();


    crearReproductor();


    guardarEnContinuarViendo();

}


/* =========================================================
                OBTENER TIPO
========================================================= */

function obtenerTipoVideo() {

    if (!peliculaActual) {
        return null;
    }

    if (
        peliculaActual.tipo &&
        peliculaActual.tipo.toLowerCase() ===
        "youtube"
    ) {

        return "youtube";

    }

    if (
        peliculaActual.tipo &&
        peliculaActual.tipo.toLowerCase() ===
        "mp4"
    ) {

        return "mp4";

    }

    if (
        peliculaActual.tipo &&
        peliculaActual.tipo.toLowerCase() ===
        "drive"
    ) {

        return "drive";

    }


    /* DETECTAR AUTOMÁTICAMENTE */

    const url =
        peliculaActual.url ||
        "";

    if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) {

        return "youtube";

    }


    if (
        url.includes("drive.google.com")
    ) {

        return "drive";

    }


    return "mp4";

}


/* =========================================================
                CREAR REPRODUCTOR
========================================================= */

function crearReproductor() {

    if (!fullscreenVideoContainer) {

        console.error(
            "❌ No existe fullscreenVideoContainer"
        );

        return;

    }


    destruirReproductorAnterior();


    if (
        tipoReproductorActual ===
        "youtube"
    ) {

        crearYoutube();

        return;

    }


    if (
        tipoReproductorActual ===
        "drive"
    ) {

        crearDrive();

        return;

    }


    if (
        tipoReproductorActual ===
        "mp4"
    ) {

        crearMP4();

        return;

    }


    mostrarError(
        "Formato de video no compatible."
    );

}


/* =========================================================
                YOUTUBE
========================================================= */

function crearYoutube() {

    const id =
        obtenerYoutubeID(
            peliculaActual.url
        );


    if (!id) {

        mostrarError(
            "No se pudo obtener el ID de YouTube."
        );

        return;

    }


    console.log(
        "▶️ YouTube ID:",
        id
    );


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.id =
        "youtubePlayer";


    iframe.className =
        "youtubePlayerFullscreen";


    iframe.src =
        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;


    iframe.title =
        peliculaActual.titulo ||
        "CINEVERSE";


    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


    iframe.allowFullscreen =
        true;


    iframe.setAttribute(
        "referrerpolicy",
        "strict-origin-when-cross-origin"
    );


    fullscreenVideoContainer.appendChild(
        iframe
    );


    tipoReproductorActual =
        "youtube";

}


/* =========================================================
                OBTENER ID YOUTUBE
========================================================= */

function obtenerYoutubeID(url) {

    if (!url) {
        return null;
    }


    try {

        const objeto =
            new URL(url);


        /* youtu.be */

        if (
            objeto.hostname.includes(
                "youtu.be"
            )
        ) {

            return objeto.pathname
                .replace("/", "")
                .split("/")[0];

        }


        /* youtube.com/watch */

        const videoID =
            objeto.searchParams.get(
                "v"
            );

        if (videoID) {

            return videoID;

        }


        /* youtube.com/embed */

        if (
            objeto.pathname.includes(
                "/embed/"
            )
        ) {

            return objeto.pathname
                .split("/embed/")[1]
                .split("/")[0];

        }


        /* youtube.com/shorts */

        if (
            objeto.pathname.includes(
                "/shorts/"
            )
        ) {

            return objeto.pathname
                .split("/shorts/")[1]
                .split("/")[0];

        }

    }
    catch (error) {

        console.error(
            "❌ URL YouTube inválida:",
            error
        );

    }


    return null;

}


/* =========================================================
                GOOGLE DRIVE
========================================================= */

function crearDrive() {

    const id =
        obtenerDriveID(
            peliculaActual.url
        );


    if (!id) {

        mostrarError(
            "No se pudo obtener el ID de Google Drive."
        );

        return;

    }


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.className =
        "drivePlayerFullscreen";


    iframe.src =
        `https://drive.google.com/file/d/${id}/preview`;


    iframe.allow =
        "autoplay";


    iframe.allowFullscreen =
        true;


    fullscreenVideoContainer.appendChild(
        iframe
    );

}


/* =========================================================
                OBTENER ID DRIVE
========================================================= */

function obtenerDriveID(url) {

    if (!url) {
        return null;
    }


    const resultado =
        url.match(
            /\/d\/([^/]+)/
        );


    if (resultado) {

        return resultado[1];

    }


    return null;

}


/* =========================================================
                    MP4
========================================================= */

function crearMP4() {

    if (!peliculaActual.url) {

        mostrarError(
            "Esta película no tiene un enlace MP4."
        );

        return;

    }


    let url =
        peliculaActual.url.trim();


    /*
        Dropbox:

        dl=0
        cambia a
        dl=1

        para intentar obtener
        el archivo directamente.
    */

    if (
        url.includes(
            "dropbox.com"
        )
    ) {

        url =
            convertirDropboxURL(
                url
            );

    }


    console.log(
        "🎞️ URL MP4:",
        url
    );


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "mp4PlayerWrapper";


    const video =
        document.createElement(
            "video"
        );


    video.id =
        "videoPlayer";


    video.className =
        "cineverseVideo";


    video.controls =
        false;


    video.preload =
        "metadata";


    video.playsInline =
        true;


    video.setAttribute(
        "webkit-playsinline",
        "true"
    );


    video.setAttribute(
        "crossorigin",
        "anonymous"
    );


    const source =
        document.createElement(
            "source"
        );


    source.src =
        url;


    source.type =
        "video/mp4";


    video.appendChild(
        source
    );


    wrapper.appendChild(
        video
    );


    crearControlesMP4(
        wrapper,
        video
    );


    fullscreenVideoContainer.appendChild(
        wrapper
    );


    videoActual =
        video;


    configurarMP4(
        video
    );

}


/* =========================================================
            CONVERTIR DROPBOX
========================================================= */

function convertirDropboxURL(url) {

    try {

        const objeto =
            new URL(url);


        /*
            Dropbox funciona mejor
            con dl=1 para descarga directa.
        */

        objeto.searchParams.set(
            "dl",
            "1"
        );


        return objeto.toString();

    }
    catch {

        return url;

    }

}


/* =========================================================
            CONTROLES MP4
========================================================= */

function crearControlesMP4(
    wrapper,
    video
) {

    const controls =
        document.createElement(
            "div"
        );


    controls.className =
        "cineverseControls";


    controls.innerHTML = `

        <button
            id="mp4Play"
            class="cineControlButton"
            type="button"
            aria-label="Reproducir">

            <i class="fa-solid fa-play"></i>

        </button>


        <button
            id="mp4Back"
            class="cineControlButton"
            type="button"
            aria-label="Retroceder 10 segundos">

            <i class="fa-solid fa-rotate-left"></i>

            <small>10</small>

        </button>


        <div class="mp4ProgressContainer">

            <input
                id="mp4Progress"
                class="mp4Progress"
                type="range"
                min="0"
                max="100"
                value="0"
                step="0.1">

        </div>


        <span
            id="mp4Time"
            class="mp4Time">

            0:00 / 0:00

        </span>


        <button
            id="mp4Forward"
            class="cineControlButton"
            type="button"
            aria-label="Avanzar 10 segundos">

            <small>10</small>

            <i class="fa-solid fa-rotate-right"></i>

        </button>


        <button
            id="mp4Mute"
            class="cineControlButton"
            type="button"
            aria-label="Silenciar">

            <i class="fa-solid fa-volume-high"></i>

        </button>


        <input
            id="mp4Volume"
            class="mp4Volume"
            type="range"
            min="0"
            max="1"
            value="1"
            step="0.05">


        <button
            id="mp4Fullscreen"
            class="cineControlButton"
            type="button"
            aria-label="Pantalla completa">

            <i class="fa-solid fa-expand"></i>

        </button>

    `;


    wrapper.appendChild(
        controls
    );

}


/* =========================================================
            CONFIGURAR MP4
========================================================= */

function configurarMP4(video) {

    const play =
        document.getElementById(
            "mp4Play"
        );

    const back =
        document.getElementById(
            "mp4Back"
        );

    const forward =
        document.getElementById(
            "mp4Forward"
        );

    const progress =
        document.getElementById(
            "mp4Progress"
        );

    const time =
        document.getElementById(
            "mp4Time"
        );

    const mute =
        document.getElementById(
            "mp4Mute"
        );

    const volume =
        document.getElementById(
            "mp4Volume"
        );

    const fullscreen =
        document.getElementById(
            "mp4Fullscreen"
        );


    if (!video) {

        console.error(
            "❌ No se encontró video."
        );

        return;

    }


    /* PLAY */

    if (play) {

        play.addEventListener(
            "click",
            () => {

                if (video.paused) {

                    video.play()
                        .catch(
                            error => {

                                console.warn(
                                    "No se pudo iniciar automáticamente:",
                                    error
                                );

                                mostrarToast(
                                    "Presiona reproducir para comenzar."
                                );

                            }
                        );

                }
                else {

                    video.pause();

                }

            }
        );

    }


    /* RETROCEDER */

    if (back) {

        back.addEventListener(
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


    /* AVANZAR */

    if (forward) {

        forward.addEventListener(
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


    /* PROGRESO */

    if (progress) {

        progress.addEventListener(
            "input",
            () => {

                if (
                    Number.isFinite(
                        video.duration
                    )
                ) {

                    video.currentTime =
                        video.duration *
                        (
                            Number(
                                progress.value
                            ) / 100
                        );

                }

            }
        );

    }


    /* SILENCIO */

    if (mute) {

        mute.addEventListener(
            "click",
            () => {

                video.muted =
                    !video.muted;

                actualizarIconoMute(
                    video,
                    mute
                );

            }
        );

    }


    /* VOLUMEN */

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

                actualizarIconoMute(
                    video,
                    mute
                );

            }
        );

    }


    /* PANTALLA COMPLETA */

    if (fullscreen) {

        fullscreen.addEventListener(
            "click",
            () => {

                const wrapper =
                    video.parentElement;

                if (
                    document.fullscreenElement
                ) {

                    document.exitFullscreen();

                    return;

                }


                if (
                    wrapper &&
                    wrapper.requestFullscreen
                ) {

                    wrapper.requestFullscreen();

                }

            }
        );

    }


    /* PLAY */

    video.addEventListener(
        "play",
        () => {

            actualizarIconoPlay(
                video,
                play
            );

        }
    );


    /* PAUSE */

    video.addEventListener(
        "pause",
        () => {

            actualizarIconoPlay(
                video,
                play
            );

        }
    );


    /* TIEMPO */

    video.addEventListener(
        "timeupdate",
        () => {

            actualizarProgreso(
                video,
                progress,
                time
            );

            guardarProgresoVideo();

        }
    );


    /* METADATA */

    video.addEventListener(
        "loadedmetadata",
        () => {

            actualizarProgreso(
                video,
                progress,
                time
            );


            /* CONTINUAR DESDE DONDE SE QUEDÓ */

            const progresoGuardado =
                obtenerProgresoGuardado();

            if (
                progresoGuardado > 10 &&
                progresoGuardado <
                video.duration - 10
            ) {

                video.currentTime =
                    progresoGuardado;

            }


            /* INTENTAR REPRODUCIR */

            video.play()
                .catch(
                    () => {

                        console.log(
                            "ℹ️ El navegador espera interacción del usuario."
                        );

                    }
                );

        }
    );


    /* ERROR */

    video.addEventListener(
        "error",
        () => {

            console.error(
                "❌ Error reproduciendo MP4:",
                video.error
            );


            mostrarErrorVideo();

        }
    );


    /* ENDED */

    video.addEventListener(
        "ended",
        () => {

            eliminarDeContinuarViendo();

            limpiarProgreso();

            actualizarIconoPlay(
                video,
                play
            );

            mostrarToast(
                "Película terminada."
            );

        }
    );


    actualizarIconoPlay(
        video,
        play
    );


    actualizarIconoMute(
        video,
        mute
    );

}


/* =========================================================
            ICONO PLAY
========================================================= */

function actualizarIconoPlay(
    video,
    boton
) {

    if (!boton) {
        return;
    }


    if (video.paused) {

        boton.innerHTML =
            '<i class="fa-solid fa-play"></i>';

    }
    else {

        boton.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

    }

}


/* =========================================================
            ICONO VOLUMEN
========================================================= */

function actualizarIconoMute(
    video,
    boton
) {

    if (!boton) {
        return;
    }


    if (
        video.muted ||
        video.volume === 0
    ) {

        boton.innerHTML =
            '<i class="fa-solid fa-volume-xmark"></i>';

    }
    else {

        boton.innerHTML =
            '<i class="fa-solid fa-volume-high"></i>';

    }

}


/* =========================================================
            ACTUALIZAR PROGRESO
========================================================= */

function actualizarProgreso(
    video,
    progress,
    time
) {

    if (!video) {
        return;
    }


    if (
        progress &&
        Number.isFinite(
            video.duration
        ) &&
        video.duration > 0
    ) {

        progress.value =
            (
                video.currentTime /
                video.duration
            ) * 100;

    }


    if (time) {

        time.textContent =
            `${formatearTiempo(video.currentTime)} / ${formatearTiempo(video.duration)}`;

    }

}


/* =========================================================
            FORMATEAR TIEMPO
========================================================= */

function formatearTiempo(segundos) {

    if (
        !Number.isFinite(
            segundos
        )
    ) {

        return "0:00";

    }


    const horas =
        Math.floor(
            segundos / 3600
        );


    const minutos =
        Math.floor(
            (segundos % 3600) / 60
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


    if (horas > 0) {

        return `${horas}:${minutos
            .toString()
            .padStart(2, "0")}:${segundosRestantes}`;

    }


    return `${minutos}:${segundosRestantes}`;

}


/* =========================================================
            ERROR VIDEO
========================================================= */

function mostrarErrorVideo() {

    if (!fullscreenVideoContainer) {
        return;
    }


    const mensaje =
        document.createElement(
            "div"
        );


    mensaje.className =
        "videoError";


    mensaje.innerHTML = `

        <i class="fa-solid fa-circle-exclamation"></i>

        <h2>
            No se pudo reproducir el video
        </h2>

        <p>
            El archivo MP4 no pudo cargarse correctamente.
        </p>

        <button
            type="button"
            onclick="cerrarReproductor()">

            Cerrar

        </button>

    `;


    fullscreenVideoContainer.appendChild(
        mensaje
    );

}


/* =========================================================
            ERROR GENERAL
========================================================= */

function mostrarError(mensaje) {

    if (!videoContainer) {
        return;
    }


    videoContainer.innerHTML = `

        <div class="videoError">

            <i class="fa-solid fa-circle-exclamation"></i>

            <h2>
                ${mensaje}
            </h2>

        </div>

    `;

}


/* =========================================================
                CERRAR REPRODUCTOR
========================================================= */

function cerrarReproductor() {

    guardarProgresoVideo();

    destruirReproductorAnterior();


    if (fullscreenPlayer) {

        fullscreenPlayer.style.display =
            "none";

    }


    document.body.classList.remove(
        "playerOpen"
    );


    videoActual = null;


    tipoReproductorActual = null;

}


/* =========================================================
            DESTRUIR REPRODUCTOR
========================================================= */

function destruirReproductorAnterior() {

    if (videoActual) {

        try {

            videoActual.pause();

        }
        catch {}

        videoActual.src = "";

        videoActual.load();

        videoActual = null;

    }


    if (fullscreenVideoContainer) {

        fullscreenVideoContainer.innerHTML =
            "";

    }

}


/* =========================================================
                REGRESAR
========================================================= */

function regresar() {

    guardarProgresoVideo();

    window.history.back();

}


/* =========================================================
                TRAILER
========================================================= */

function abrirTrailer() {

    if (
        !peliculaActual ||
        !peliculaActual.trailer
    ) {

        mostrarToast(
            "Esta película no tiene tráiler."
        );

        return;

    }


    window.open(
        peliculaActual.trailer,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
                MI LISTA
========================================================= */

function obtenerMiLista() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "miLista"
            )
        ) || [];

    }
    catch {

        return [];

    }

}


/* =========================================================
                TOGGLE FAVORITO
========================================================= */

function toggleFavorito() {

    if (!peliculaActual) {
        return;
    }


    let lista =
        obtenerMiLista();


    const id =
        Number(
            peliculaActual.id
        );


    const existe =
        lista.some(
            item =>
                Number(item) === id
        );


    if (existe) {

        lista =
            lista.filter(
                item =>
                    Number(item) !== id
            );

        mostrarToast(
            "Eliminada de Mi Lista."
        );

    }
    else {

        lista.push(id);

        mostrarToast(
            "Agregada a Mi Lista."
        );

    }


    localStorage.setItem(
        "miLista",
        JSON.stringify(lista)
    );


    actualizarMiLista();

}


/* =========================================================
                ACTUALIZAR MI LISTA
========================================================= */

function actualizarMiLista() {

    const boton =
        document.getElementById(
            "btnFavorito"
        );


    if (!boton || !peliculaActual) {
        return;
    }


    const lista =
        obtenerMiLista();


    const existe =
        lista.some(
            item =>
                Number(item) ===
                Number(peliculaActual.id)
        );


    if (existe) {

        boton.innerHTML = `

            <i class="fa-solid fa-heart"></i>

            <span>
                En Mi Lista
            </span>

        `;

    }
    else {

        boton.innerHTML = `

            <i class="fa-regular fa-heart"></i>

            <span>
                Mi lista
            </span>

        `;

    }

}


/* =========================================================
            CONTINUAR VIENDO
========================================================= */

function guardarEnContinuarViendo() {

    if (!peliculaActual) {
        return;
    }


    let lista;


    try {

        lista =
            JSON.parse(
                localStorage.getItem(
                    "continuarViendo"
                )
            ) || [];

    }
    catch {

        lista = [];

    }


    const id =
        Number(
            peliculaActual.id
        );


    lista =
        lista.filter(
            item =>
                Number(item.id) !== id
        );


    lista.unshift({

        id:
            peliculaActual.id,

        titulo:
            peliculaActual.titulo,

        poster:
            peliculaActual.poster,

        banner:
            peliculaActual.banner,

        porcentaje:
            0,

        progreso:
            0,

        fecha:
            Date.now()

    });


    if (lista.length > 20) {

        lista =
            lista.slice(
                0,
                20
            );

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(lista)
    );

}


/* =========================================================
            GUARDAR PROGRESO VIDEO
========================================================= */

function guardarProgresoVideo() {

    if (
        !peliculaActual ||
        !videoActual ||
        !Number.isFinite(
            videoActual.duration
        )
    ) {

        return;

    }


    const id =
        Number(
            peliculaActual.id
        );


    let lista;


    try {

        lista =
            JSON.parse(
                localStorage.getItem(
                    "continuarViendo"
                )
            ) || [];

    }
    catch {

        lista = [];

    }


    const porcentaje =
        videoActual.duration > 0
            ? (
                videoActual.currentTime /
                videoActual.duration
            ) * 100
            : 0;


    const existente =
        lista.find(
            item =>
                Number(item.id) === id
        );


    if (existente) {

        existente.progreso =
            videoActual.currentTime;

        existente.porcentaje =
            porcentaje;

        existente.fecha =
            Date.now();

    }
    else {

        lista.unshift({

            id:
                peliculaActual.id,

            titulo:
                peliculaActual.titulo,

            poster:
                peliculaActual.poster,

            banner:
                peliculaActual.banner,

            progreso:
                videoActual.currentTime,

            porcentaje:
                porcentaje,

            fecha:
                Date.now()

        });

    }


    /*
        Si llegó prácticamente al final,
        se elimina automáticamente.
    */

    if (
        porcentaje >= 95
    ) {

        lista =
            lista.filter(
                item =>
                    Number(item.id) !== id
            );

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(lista)
    );

}


/* =========================================================
            OBTENER PROGRESO GUARDADO
========================================================= */

function obtenerProgresoGuardado() {

    if (!peliculaActual) {
        return 0;
    }


    let lista;


    try {

        lista =
            JSON.parse(
                localStorage.getItem(
                    "continuarViendo"
                )
            ) || [];

    }
    catch {

        return 0;

    }


    const pelicula =
        lista.find(
            item =>
                Number(item.id) ===
                Number(peliculaActual.id)
        );


    if (!pelicula) {
        return 0;
    }


    return Number(
        pelicula.progreso || 0
    );

}


/* =========================================================
            ELIMINAR AL TERMINAR
========================================================= */

function eliminarDeContinuarViendo() {

    if (!peliculaActual) {
        return;
    }


    let lista;


    try {

        lista =
            JSON.parse(
                localStorage.getItem(
                    "continuarViendo"
                )
            ) || [];

    }
    catch {

        lista = [];

    }


    lista =
        lista.filter(
            item =>
                Number(item.id) !==
                Number(peliculaActual.id)
        );


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(lista)
    );

}


/* =========================================================
            LIMPIAR PROGRESO
========================================================= */

function limpiarProgreso() {

    if (!peliculaActual) {
        return;
    }


    localStorage.removeItem(
        `progreso_${peliculaActual.id}`
    );

}


/* =========================================================
                    COMPARTIR
========================================================= */

async function compartirPelicula() {

    if (!peliculaActual) {
        return;
    }


    const url =
        window.location.href;


    try {

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    peliculaActual.titulo,

                text:
                    peliculaActual.descripcion ||
                    "Mira esta película en CINEVERSE.",

                url:
                    url

            });

        }
        else if (
            navigator.clipboard
        ) {

            await navigator.clipboard.writeText(
                url
            );

            mostrarToast(
                "Enlace copiado."
            );

        }
        else {

            mostrarToast(
                "No se puede compartir desde este navegador."
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


/* =========================================================
                TRANSMITIR A TV
========================================================= */

async function transmitir() {

    /*
        La API de Cast de Google no está
        disponible directamente en todos
        los navegadores.

        Primero intentamos Remote Playback.
    */


    if (
        videoActual &&
        typeof videoActual.remote !==
        "undefined"
    ) {

        try {

            if (
                videoActual.remote.state ===
                "disconnected"
            ) {

                await videoActual.remote.prompt();

                mostrarToast(
                    "Conectando con el dispositivo..."
                );

                return;

            }

        }
        catch (error) {

            console.log(
                "Remote Playback:",
                error
            );

        }

    }


    mostrarToast(
        "La transmisión depende del dispositivo y navegador."
    );

}


/* =========================================================
            PELÍCULAS RELACIONADAS
========================================================= */

function cargarRelacionadas() {

    if (!relatedSlider) {
        return;
    }


    relatedSlider.innerHTML =
        "";


    if (!peliculaActual) {
        return;
    }


    let relacionadas = [];


    /*
        Primero intenta utilizar
        el arreglo relacionadas del JSON.
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
        Si no existen suficientes,
        busca por género.
    */

    if (
        relacionadas.length < 4
    ) {

        const extras =
            peliculas.filter(
                pelicula => {

                    if (
                        Number(
                            pelicula.id
                        ) ===
                        Number(
                            peliculaActual.id
                        )
                    ) {

                        return false;

                    }


                    if (
                        relacionadas.some(
                            item =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    pelicula.id
                                )
                        )
                    ) {

                        return false;

                    }


                    return (
                        pelicula.genero ===
                        peliculaActual.genero
                    );

                }
            );


        relacionadas =
            [
                ...relacionadas,
                ...extras
            ];

    }


    relacionadas =
        relacionadas.slice(
            0,
            8
        );


    relacionadas.forEach(
        crearTarjetaRelacionada
    );


    configurarFlechasRelacionadas();

}


/* =========================================================
            TARJETA RELACIONADA
========================================================= */

function crearTarjetaRelacionada(
    pelicula
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "relatedCard";


    tarjeta.dataset.id =
        pelicula.id;


    tarjeta.innerHTML = `

        <div class="relatedPoster">

            <img
                src="${pelicula.poster || pelicula.banner || ""}"
                alt="${escaparHTML(pelicula.titulo || "Película")}"
                loading="lazy">

            <div class="relatedOverlay">

                <div class="relatedPlay">

                    <i class="fa-solid fa-play"></i>

                </div>

            </div>

        </div>


        <div class="relatedInfo">

            <h3>
                ${escaparHTML(
                    pelicula.titulo ||
                    "Película"
                )}
            </h3>


            <div class="relatedMeta">

                <span>
                    ${escaparHTML(
                        pelicula.anio ||
                        ""
                    )}
                </span>

                <span>
                    ${escaparHTML(
                        pelicula.duracion ||
                        ""
                    )}
                </span>

            </div>


            <span class="relatedGenre">

                ${escaparHTML(
                    pelicula.genero ||
                    ""
                )}

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


    relatedSlider.appendChild(
        tarjeta
    );

}


/* =========================================================
        FLECHAS RELACIONADAS
========================================================= */

function configurarFlechasRelacionadas() {

    const anterior =
        document.getElementById(
            "relatedPrev"
        );


    const siguiente =
        document.getElementById(
            "relatedNext"
        );


    if (anterior) {

        anterior.onclick =
            () => {

                relatedSlider.scrollBy({

                    left:
                        -360,

                    behavior:
                        "smooth"

                });

            };

    }


    if (siguiente) {

        siguiente.onclick =
            () => {

                relatedSlider.scrollBy({

                    left:
                        360,

                    behavior:
                        "smooth"

                });

            };

    }

}


/* =========================================================
                ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;

}


/* =========================================================
                TOAST
========================================================= */

function mostrarToast(
    mensaje
) {

    if (!playerToast) {
        return;
    }


    const texto =
        playerToast.querySelector(
            "span"
        );


    if (texto) {

        texto.textContent =
            mensaje;

    }


    playerToast.classList.add(
        "show"
    );


    clearTimeout(
        playerToast._timeout
    );


    playerToast._timeout =
        setTimeout(
            () => {

                playerToast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
                TECLA ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                fullscreenPlayer &&
                fullscreenPlayer.style.display !==
                "none"
            ) {

                cerrarReproductor();

            }

        }

    }
);


/* =========================================================
                VISIBILIDAD
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            videoActual
        ) {

            guardarProgresoVideo();

        }

    }
);


/* =========================================================
                ANTES DE SALIR
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        guardarProgresoVideo();

    }
);


/* =========================================================
                LOADER
========================================================= */

function mostrarLoader() {

    if (!loadingScreen) {
        return;
    }

    loadingScreen.classList.remove(
        "oculto"
    );

    loadingScreen.classList.remove(
        "hide"
    );

}


function ocultarLoader() {

    if (!loadingScreen) {
        return;
    }


    loadingScreen.classList.add(
        "oculto"
    );


    loadingScreen.classList.add(
        "hide"
    );


    setTimeout(
        () => {

            loadingScreen.style.display =
                "none";

        },
        500
    );

}


/* =========================================================
            EXPONER FUNCIONES
========================================================= */

window.cerrarReproductor =
    cerrarReproductor;

window.abrirReproductor =
    abrirReproductor;

window.toggleFavorito =
    toggleFavorito;
