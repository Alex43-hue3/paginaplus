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

document.addEventListener("DOMContentLoaded", () => {
    iniciarPlayer();
});


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

    guardarContinuarViendo();

    inicializarMiLista();

    cargarRelacionadas();

    iniciarModoCine();

    compartirPelicula();

    abrirTrailer();

    configurarBotonReproducir();

    ocultarLoader();
}


/*=========================================================
                CARGAR JSON
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
            OBTENER PELÍCULA POR ID
=========================================================*/

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

        console.log(
            "📺 Tipo:",
            peliculaActual.tipo
        );

        console.log(
            "🔗 URL:",
            peliculaActual.url
        );

    }
    else {

        console.error(
            "❌ No se encontró película con ID:",
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

    loadingScreen.classList.remove("oculto");
}


function ocultarLoader() {

    if (!loadingScreen) {
        return;
    }

    setTimeout(() => {

        loadingScreen.classList.add("oculto");

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
                Verifica el ID utilizado en la URL.
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

    console.log(
        "🎥 Creando reproductor:",
        peliculaActual.tipo
    );

    let html = "";

    const tipo =
        String(
            peliculaActual.tipo || ""
        ).toLowerCase().trim();

    switch (tipo) {

        case "youtube":

            html =
                crearYoutube(
                    peliculaActual.url
                );

            break;


        case "mp4":

            html =
                crearMP4(
                    peliculaActual.url
                );

            break;


        case "drive":

            html =
                crearDrive(
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
                        Tipo detectado:
                        ${peliculaActual.tipo || "ninguno"}
                    </p>

                </div>

            `;

            break;
    }

    videoContainer.innerHTML = html;


    /*-----------------------------------------------------
                    CONTROLES MP4
    -----------------------------------------------------*/

    if (tipo === "mp4") {

        inicializarControlesMP4();

    }
}


/*=========================================================
                YOUTUBE
=========================================================*/

function crearYoutube(url) {

    const id =
        obtenerYoutubeID(url);

    console.log(
        "▶️ ID YouTube:",
        id
    );

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

        <div class="playerSource youtubeSource">

            <iframe

                id="youtubePlayer"

                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"

                title="${
                    peliculaActual?.titulo ||
                    "CINEVERSE"
                }"

                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

                allowfullscreen>

            </iframe>

        </div>

    `;
}


/*=========================================================
        OBTENER ID DE YOUTUBE
=========================================================*/

function obtenerYoutubeID(url) {

    if (!url) {
        return null;
    }

    try {

        const texto =
            String(url).trim();

        /*----------------------------------------------
                    URL normal
        ----------------------------------------------*/

        const objeto =
            new URL(texto);


        /*----------------------------------------------
                    youtube.com/watch?v=XXXXX
        ----------------------------------------------*/

        if (
            objeto.hostname.includes("youtube.com") &&
            objeto.pathname === "/watch"
        ) {

            return objeto.searchParams.get("v");

        }


        /*----------------------------------------------
                    youtu.be/XXXXX
        ----------------------------------------------*/

        if (
            objeto.hostname.includes("youtu.be")
        ) {

            return objeto.pathname
                .split("/")
                .filter(Boolean)[0]
                ?.split("?")[0]
                ?.split("&")[0];

        }


        /*----------------------------------------------
                    youtube.com/embed/XXXXX
        ----------------------------------------------*/

        if (
            objeto.hostname.includes("youtube.com") &&
            objeto.pathname.startsWith("/embed/")
        ) {

            return objeto.pathname
                .split("/embed/")[1]
                ?.split("/")[0]
                ?.split("?")[0];

        }


        /*----------------------------------------------
                    youtube.com/shorts/XXXXX
        ----------------------------------------------*/

        if (
            objeto.hostname.includes("youtube.com") &&
            objeto.pathname.startsWith("/shorts/")
        ) {

            return objeto.pathname
                .split("/shorts/")[1]
                ?.split("/")[0]
                ?.split("?")[0];

        }


        /*----------------------------------------------
                    youtube.com/live/XXXXX
        ----------------------------------------------*/

        if (
            objeto.hostname.includes("youtube.com") &&
            objeto.pathname.startsWith("/live/")
        ) {

            return objeto.pathname
                .split("/live/")[1]
                ?.split("/")[0]
                ?.split("?")[0];

        }


        return null;

    }
    catch (error) {

        console.error(
            "❌ Error obteniendo ID de YouTube:",
            error
        );

        return null;
    }
}


/*=========================================================
                GOOGLE DRIVE
=========================================================*/

function crearDrive(url) {

    const id =
        obtenerDriveID(url);

    if (!id) {

        return `

            <div class="videoLoading">

                <h2>
                    Video de Google Drive no válido
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


function obtenerDriveID(url) {

    if (!url) {
        return null;
    }

    const expresion =
        /\/d\/([^/]+)/;

    const resultado =
        String(url).match(expresion);

    return resultado
        ? resultado[1]
        : null;
}


/*=========================================================
                    MP4
=========================================================*/

function crearMP4(url) {

    if (!url) {

        return `

            <div class="videoLoading">

                <h2>
                    Video MP4 no válido
                </h2>

            </div>

        `;
    }

    return `

        <div class="playerSource mp4Source">

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
                    type="button"
                    aria-label="Reproducir o pausar">

                    <i class="fa-solid fa-play"></i>

                </button>


                <button
                    id="btnBack10"
                    type="button"
                    aria-label="Retroceder 10 segundos">

                    <i class="fa-solid fa-rotate-left"></i>

                    10

                </button>


                <input
                    id="progressBar"
                    type="range"
                    min="0"
                    max="100"
                    value="0"
                    step="0.1"
                    aria-label="Progreso">


                <span id="timeDisplay">

                    0:00 / 0:00

                </span>


                <button
                    id="btnForward10"
                    type="button"
                    aria-label="Avanzar 10 segundos">

                    10

                    <i class="fa-solid fa-rotate-right"></i>

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

function inicializarControlesMP4() {

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


    if (!video) {

        console.error(
            "❌ No se encontró videoPlayer"
        );

        return;
    }


    function formatearTiempo(segundos) {

        if (!Number.isFinite(segundos)) {
            return "0:00";
        }

        const minutos =
            Math.floor(segundos / 60);

        const segundosRestantes =
            Math.floor(segundos % 60)
                .toString()
                .padStart(2, "0");

        const horas =
            Math.floor(minutos / 60);


        if (horas > 0) {

            const minutosRestantes =
                (minutos % 60)
                    .toString()
                    .padStart(2, "0");

            return `${horas}:${minutosRestantes}:${segundosRestantes}`;
        }

        return `${minutos}:${segundosRestantes}`;
    }


    function actualizarPlay() {

        if (!play) {
            return;
        }

        play.innerHTML =
            video.paused

                ? '<i class="fa-solid fa-play"></i>'

                : '<i class="fa-solid fa-pause"></i>';
    }


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


    /*----------------------------------------------
                    PLAY
    ----------------------------------------------*/

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


    /*----------------------------------------------
                    ATRÁS 10
    ----------------------------------------------*/

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


    /*----------------------------------------------
                    ADELANTE 10
    ----------------------------------------------*/

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


    /*----------------------------------------------
                    BARRA PROGRESO
    ----------------------------------------------*/

    if (progress) {

        progress.addEventListener(
            "input",
            () => {

                if (video.duration) {

                    video.currentTime =
                        (
                            video.duration *
                            Number(progress.value)
                        ) / 100;

                }

            }
        );

    }


    /*----------------------------------------------
                    SILENCIO
    ----------------------------------------------*/

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


    /*----------------------------------------------
                    VOLUMEN
    ----------------------------------------------*/

    if (volume) {

        volume.addEventListener(
            "input",
            () => {

                video.volume =
                    Number(volume.value);

                video.muted =
                    video.volume === 0;

                actualizarMute();

            }
        );

    }


    /*----------------------------------------------
                    PANTALLA COMPLETA
    ----------------------------------------------*/

    if (fullscreen) {

        fullscreen.addEventListener(
            "click",
            () => {

                if (document.fullscreenElement) {

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


    video.addEventListener(
        "play",
        actualizarPlay
    );

    video.addEventListener(
        "pause",
        actualizarPlay
    );

    video.addEventListener(
        "timeupdate",
        actualizarTiempo
    );

    video.addEventListener(
        "loadedmetadata",
        actualizarTiempo
    );

    video.addEventListener(
        "volumechange",
        actualizarMute
    );


    /*----------------------------------------------
                TERMINÓ LA PELÍCULA
    ----------------------------------------------*/

    video.addEventListener(
        "ended",
        () => {

            video.currentTime = 0;

            actualizarPlay();

            eliminarContinuarViendo();

        }
    );


    actualizarPlay();
    actualizarMute();
    actualizarTiempo();


    console.log(
        "✅ Controles MP4 inicializados"
    );
}


/*=========================================================
        ELIMINAR DE CONTINUAR VIENDO AL TERMINAR
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
                pelicula.id !==
                peliculaActual.id
        );


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(historial)
    );


    console.log(
        "✅ Película terminada y eliminada de Continuar viendo"
    );
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
            `url("${peliculaActual.banner || peliculaActual.poster}")`;

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
        "⭐ " + peliculaActual.rating
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

function asignarTexto(id, texto) {

    const elemento =
        document.getElementById(id);

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


function toggleFavorito() {

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


    if (existe) {

        favoritos =
            favoritos.filter(
                id =>
                    id !==
                    peliculaActual.id
            );

    }
    else {

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


function actualizarBotonFavorito() {

    const boton =
        document.getElementById(
            "btnFavorito"
        );

    if (!boton) {
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
            CONTINUAR VIENDO
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


    historial =
        historial.filter(
            pelicula =>
                pelicula.id !==
                peliculaActual.id
        );


    historial.unshift({

        id: peliculaActual.id,

        titulo: peliculaActual.titulo,

        poster: peliculaActual.poster,

        banner: peliculaActual.banner,

        fecha: Date.now()

    });


    if (historial.length > 20) {
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

function cargarRelacionadas() {

    const contenedor =
        document.getElementById(
            "relatedSlider"
        );

    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    let relacionadas = [];


    /*----------------------------------------------
            PRIMERO: RELACIONADAS DEL JSON
    ----------------------------------------------*/

    if (
        Array.isArray(
            peliculaActual.relacionadas
        )
    ) {

        relacionadas =
            peliculaActual.relacionadas
                .map(id =>
                    peliculas.find(
                        pelicula =>
                            Number(pelicula.id) ===
                            Number(id)
                    )
                )
                .filter(Boolean);

    }


    /*----------------------------------------------
        SI NO HAY SUFICIENTES, USAR MISMO GÉNERO
    ----------------------------------------------*/

    if (relacionadas.length < 4) {

        const adicionales =
            peliculas.filter(
                pelicula =>

                    pelicula.id !==
                    peliculaActual.id &&

                    pelicula.genero ===
                    peliculaActual.genero &&

                    !relacionadas.some(
                        r =>
                            r.id === pelicula.id
                    )
            );


        relacionadas =
            relacionadas.concat(
                adicionales
            );

    }


    relacionadas =
        relacionadas
            .filter(
                pelicula =>
                    pelicula.id !==
                    peliculaActual.id
            )
            .slice(0, 4);


    /*----------------------------------------------
                    CREAR TARJETAS
    ----------------------------------------------*/

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
                        src="${pelicula.poster || pelicula.banner}"
                        alt="${pelicula.titulo}">

                    <div class="relatedOverlay">

                        <div class="relatedPlay">

                            <i class="fa-solid fa-play"></i>

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


    console.log(
        "🎬 Relacionadas:",
        relacionadas.length
    );
}


/*=========================================================
            MODO CINE
=========================================================*/

function iniciarModoCine() {

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
                else {

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


            /*------------------------------------------
                    MP4
            ------------------------------------------*/

            if (video) {

                if (video.paused) {

                    video.play()
                        .catch(() => {});

                }
                else {

                    video.pause();

                }

                return;
            }


            /*------------------------------------------
                    YOUTUBE
            ------------------------------------------*/

            const iframe =
                document.getElementById(
                    "youtubePlayer"
                );


            if (iframe) {

                iframe.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }

        }
    );
}
