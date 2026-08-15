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
    () => {

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

    cargarInformacion();

    crearReproductor();

    guardarContinuarViendo();

    inicializarMiLista();

    cargarRelacionadas();

    iniciarModoCine();

    compartirPelicula();

    abrirTrailer();

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

        peliculas = [];

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

    setTimeout(
        () => {

            loadingScreen.classList.add(
                "oculto"
            );

        },
        400
    );

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
                Verifica peliculas.json
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


    const tipo =
        String(
            peliculaActual.tipo || ""
        ).toLowerCase().trim();


    console.log(
        "🎥 Creando reproductor:",
        tipo
    );


    switch (tipo) {

        case "youtube":

            videoContainer.innerHTML =
                crearYoutube(
                    peliculaActual.url
                );

            break;


        case "drive":

            videoContainer.innerHTML =
                crearDrive(
                    peliculaActual.url
                );

            break;


        case "mp4":

            videoContainer.innerHTML =
                crearMP4(
                    peliculaActual.url
                );

            inicializarControlesMP4();

            break;


        default:

            videoContainer.innerHTML = `

                <div class="videoLoading">

                    <i class="fa-solid fa-circle-xmark"></i>

                    <h2>
                        Formato no compatible
                    </h2>

                    <p>
                        El tipo de video
                        "${tipo}"
                        no es compatible.
                    </p>

                </div>

            `;

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

        <div class="playerSource youtubeSource">

            <iframe

                id="youtubePlayer"

                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"

                title="${escaparHTML(
                    peliculaActual.titulo
                )}"

                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

                allowfullscreen>

            </iframe>

        </div>

    `;

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
                    Google Drive no válido
                </h2>

            </div>

        `;

    }


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

    const videoURL =
        convertirDropboxURL(url);


    console.log(
        "🎞️ URL MP4 final:",
        videoURL
    );


    return `

        <div class="playerSource mp4Source">

            <video

                id="videoPlayer"

                preload="metadata"

                playsinline>

                <source

                    src="${escaparAtributo(videoURL)}"

                    type="video/mp4">

                Tu navegador no soporta
                video HTML5.

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
            CONVERTIR DROPBOX A ENLACE DIRECTO
=========================================================*/

function convertirDropboxURL(url) {

    if (!url) {

        return "";

    }


    let nuevaURL =
        String(url).trim();


    if (
        nuevaURL.includes(
            "dropbox.com"
        )
    ) {

        nuevaURL =
            nuevaURL.replace(
                "www.dropbox.com",
                "dl.dropboxusercontent.com"
            );


        nuevaURL =
            nuevaURL.replace(
                "dropbox.com",
                "dl.dropboxusercontent.com"
            );


        nuevaURL =
            nuevaURL.replace(
                /[?&]dl=0/g,
                ""
            );


        nuevaURL =
            nuevaURL.replace(
                /[?&]dl=1/g,
                ""
            );


        if (
            nuevaURL.includes("?")
        ) {

            nuevaURL +=
                "&raw=1";

        }
        else {

            nuevaURL +=
                "?raw=1";

        }

    }


    return nuevaURL;

}


/*=========================================================
            CONTROLES MP4 CINEVERSE
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
            `${formatearTiempo(
                video.currentTime
            )} / ${formatearTiempo(
                video.duration
            )}`;

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


    /*-----------------------------------------------------
                        PLAY
    -----------------------------------------------------*/

    if (play) {

        play.addEventListener(
            "click",
            () => {

                if (video.paused) {

                    video.play()
                        .catch(
                            error => {

                                console.error(
                                    "Error reproduciendo:",
                                    error
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


    /*-----------------------------------------------------
                    RETROCEDER
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                        AVANZAR
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                    BARRA PROGRESO
    -----------------------------------------------------*/

    if (progress) {

        progress.addEventListener(
            "input",
            () => {

                if (video.duration) {

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


    /*-----------------------------------------------------
                        SILENCIO
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                        VOLUMEN
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                    PANTALLA COMPLETA
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                    EVENTOS VIDEO
    -----------------------------------------------------*/

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
        () => {

            console.log(
                "✅ MP4 cargado correctamente"
            );

            actualizarTiempo();

        }
    );


    video.addEventListener(
        "volumechange",
        actualizarMute
    );


    video.addEventListener(
        "error",
        () => {

            console.error(
                "❌ Error al cargar el MP4"
            );

            console.error(
                video.error
            );

        }
    );


    video.addEventListener(
        "ended",
        () => {

            actualizarPlay();

        }
    );


    actualizarPlay();

    actualizarMute();

    actualizarTiempo();


    console.log(
        "🎮 Controles MP4 CINEVERSE listos"
    );

}


/*=========================================================
            OBTENER ID YOUTUBE
=========================================================*/

function obtenerYoutubeID(url) {

    try {

        const objeto =
            new URL(url);


        if (
            objeto.hostname.includes(
                "youtu.be"
            )
        ) {

            return objeto.pathname
                .substring(1);

        }


        return objeto.searchParams.get(
            "v"
        );

    }
    catch {

        return url;

    }

}


/*=========================================================
            OBTENER ID DRIVE
=========================================================*/

function obtenerDriveID(url) {

    const expresion =
        /\/d\/([^/]+)/;


    const resultado =
        String(url).match(
            expresion
        );


    return resultado
        ? resultado[1]
        : url;

}


/*=========================================================
            LLENAR INFORMACIÓN
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
        peliculaActual.id;


    const existe =
        favoritos.some(
            favorito =>
                Number(favorito) ===
                Number(id)
        );


    if (existe) {

        favoritos =
            favoritos.filter(
                favorito =>
                    Number(favorito) !==
                    Number(id)
            );

    }
    else {

        favoritos.push(
            id
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


/*=========================================================
            ACTUALIZAR BOTÓN FAVORITO
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
                Number(pelicula.id) !==
                Number(
                    peliculaActual.id
                )
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
            Date.now()

    });


    if (
        historial.length > 20
    ) {

        historial.pop();

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
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


    contenedor.innerHTML =
        "";


    let relacionadas = [];


    /*-----------------------------------------------------
                USAR IDs RELACIONADOS DEL JSON
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                    RESPALDO POR GÉNERO
    -----------------------------------------------------*/

    if (!relacionadas.length) {

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
            )
            .slice(
                0,
                4
            );

    }


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

                        src="${escaparAtributo(
                            pelicula.poster
                        )}"

                        alt="${escaparAtributo(
                            pelicula.titulo
                        )}">

                    <div class="relatedOverlay">

                        <div class="relatedPlay">

                            <i class="fa-solid fa-play"></i>

                        </div>

                    </div>

                </div>


                <div class="relatedInfo">

                    <h3>

                        ${escaparHTML(
                            pelicula.titulo
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
                        `reproductor.html?id=${
                            encodeURIComponent(
                                pelicula.id
                            )
                        }`;

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

            abrirEnlace(
                peliculaActual.trailer
            );

        }
    );

}


/*=========================================================
                    ABRIR ENLACE
=========================================================*/

function abrirEnlace(
    enlace
) {

    let url =
        String(
            enlace
        ).trim();


    const markdown =
        url.match(
            /\((https?:\/\/[^)]+)\)/
        );


    if (markdown) {

        url =
            markdown[1];

    }


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


/*=========================================================
                    SEGURIDAD HTML
=========================================================*/

function escaparHTML(
    texto
) {

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


function escaparAtributo(
    texto
) {

    return escaparHTML(
        texto
    );

}


/*=========================================================
                    FIN
=========================================================*/

console.log(
    "🔥 reproductor.js CINEVERSE V5 cargado"
);

