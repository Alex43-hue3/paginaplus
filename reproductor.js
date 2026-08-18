"use strict";

/* =====================================================
                    VARIABLES
===================================================== */

let peliculas = [];

let peliculaActual = null;


/* =====================================================
                    DOM
===================================================== */

const loadingScreen =
    document.getElementById("loadingScreen");

const background =
    document.getElementById("playerBackground");

const moviePoster =
    document.getElementById("moviePoster");

const movieTitle =
    document.getElementById("movieTitle");

const movieDescription =
    document.getElementById("movieDescription");

const videoOverlay =
    document.getElementById("videoOverlay");

const youtubeContainer =
    document.getElementById("youtubeContainer");

const youtubePlayer =
    document.getElementById("youtubePlayer");

const mp4Container =
    document.getElementById("mp4Container");

const videoPlayer =
    document.getElementById("videoPlayer");

const relatedSlider =
    document.getElementById("relatedSlider");


/* =====================================================
                    INICIAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar(){

    mostrarLoader();

    await cargarPeliculas();

    obtenerPelicula();

    if(!peliculaActual){

        ocultarLoader();

        mostrarError();

        return;

    }

    cargarInformacion();

    cargarRelacionadas();

    inicializarBotones();

    inicializarMiLista();

    inicializarFlechas();

    ocultarLoader();

}


/* =====================================================
                    CARGAR JSON
===================================================== */

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


/* =====================================================
                OBTENER PELÍCULA
===================================================== */

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
            "❌ Película no encontrada:",
            id
        );

    }

}


/* =====================================================
                    LOADER
===================================================== */

function mostrarLoader(){

    if(!loadingScreen){
        return;
    }

    loadingScreen.classList.remove(
        "hidden"
    );

}


function ocultarLoader(){

    if(!loadingScreen){
        return;
    }

    setTimeout(
        ()=>{
            loadingScreen.classList.add(
                "hidden"
            );
        },
        300
    );

}


/* =====================================================
                INFORMACIÓN
===================================================== */

function cargarInformacion(){

    if(!peliculaActual){
        return;
    }


    /* ---------------------------------------------
                    FONDO
    --------------------------------------------- */

    if(background){

        background.style.backgroundImage =
            `url("${peliculaActual.banner || peliculaActual.poster}")`;

    }


    /* ---------------------------------------------
                    POSTER
    --------------------------------------------- */

    if(moviePoster){

        moviePoster.src =
            peliculaActual.poster ||
            peliculaActual.banner ||
            "";

        moviePoster.alt =
            peliculaActual.titulo ||
            "Película";

    }


    /* ---------------------------------------------
                    TÍTULO
    --------------------------------------------- */

    asignarTexto(
        "movieTitle",
        peliculaActual.titulo
    );


    /* ---------------------------------------------
                DESCRIPCIÓN
    --------------------------------------------- */

    asignarTexto(
        "movieDescription",
        peliculaActual.descripcion
    );


    /* ---------------------------------------------
                    AÑO
    --------------------------------------------- */

    asignarTexto(
        "movieYear",
        peliculaActual.anio
    );


    /* ---------------------------------------------
                DURACIÓN
    --------------------------------------------- */

    asignarTexto(
        "movieDuration",
        peliculaActual.duracion
    );


    /* ---------------------------------------------
                    GÉNERO
    --------------------------------------------- */

    asignarTexto(
        "movieGenre",
        peliculaActual.genero
    );


    /* ---------------------------------------------
                CLASIFICACIÓN
    --------------------------------------------- */

    asignarTexto(
        "movieClasificacion",
        peliculaActual.clasificacion || "A"
    );


    /* ---------------------------------------------
                    CALIDAD
    --------------------------------------------- */

    asignarTexto(
        "movieQuality",
        peliculaActual.calidad || "HD"
    );


    /* ---------------------------------------------
                SUBTÍTULOS
    --------------------------------------------- */

    asignarTexto(
        "movieSubs",
        peliculaActual.subtitulos || "CC"
    );


    asignarTexto(
        "movieSubsInfo",
        peliculaActual.subtitulos || "No disponible"
    );


    /* ---------------------------------------------
                    AUDIO
    --------------------------------------------- */

    asignarTexto(
        "movieAudio",
        "AD"
    );


    /* ---------------------------------------------
                    DIRECTOR
    --------------------------------------------- */

    asignarTexto(
        "movieDirector",
        peliculaActual.director ||
        "No disponible"
    );


    /* ---------------------------------------------
                    IDIOMA
    --------------------------------------------- */

    asignarTexto(
        "movieIdioma",
        peliculaActual.idioma ||
        "No disponible"
    );


    /* ---------------------------------------------
                    PAÍS
    --------------------------------------------- */

    asignarTexto(
        "moviePais",
        peliculaActual.pais ||
        "No disponible"
    );


    document.title =
        "CINEVERSE | " +
        peliculaActual.titulo;

}


/* =====================================================
                ASIGNAR TEXTO
===================================================== */

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


/* =====================================================
                BOTONES
===================================================== */

function inicializarBotones(){

    /* ---------------------------------------------
                VER AHORA
    --------------------------------------------- */

    const btnReproducir =
        document.getElementById(
            "btnReproducir"
        );

    if(btnReproducir){

        btnReproducir.addEventListener(
            "click",
            abrirReproductor
        );

    }


    /* ---------------------------------------------
                    REGRESAR
    --------------------------------------------- */

    const btnBack =
        document.getElementById(
            "btnBack"
        );

    if(btnBack){

        btnBack.addEventListener(
            "click",
            ()=>{
                history.back();
            }
        );

    }


    /* ---------------------------------------------
                CERRAR REPRODUCTOR
    --------------------------------------------- */

    const btnClosePlayer =
        document.getElementById(
            "btnClosePlayer"
        );

    if(btnClosePlayer){

        btnClosePlayer.addEventListener(
            "click",
            cerrarReproductor
        );

    }


    /* ---------------------------------------------
                    TRAILER
    --------------------------------------------- */

    const btnTrailer =
        document.getElementById(
            "btnTrailer"
        );

    if(btnTrailer){

        if(
            !peliculaActual.trailer
        ){

            btnTrailer.style.display =
                "none";

        }
        else{

            btnTrailer.addEventListener(
                "click",
                ()=>{
                    window.open(
                        peliculaActual.trailer,
                        "_blank"
                    );
                }
            );

        }

    }


    /* ---------------------------------------------
                    COMPARTIR
    --------------------------------------------- */

    const btnShareTop =
        document.getElementById(
            "btnShareTop"
        );

    if(btnShareTop){

        btnShareTop.addEventListener(
            "click",
            compartirPelicula
        );

    }


    const btnVideoShare =
        document.getElementById(
            "btnVideoShare"
        );

    if(btnVideoShare){

        btnVideoShare.addEventListener(
            "click",
            compartirPelicula
        );

    }


    /* ---------------------------------------------
                    CAST
    --------------------------------------------- */

    const btnCast =
        document.getElementById(
            "btnCast"
        );

    if(btnCast){

        btnCast.addEventListener(
            "click",
            mostrarCast
        );

    }


    const btnVideoCast =
        document.getElementById(
            "btnVideoCast"
        );

    if(btnVideoCast){

        btnVideoCast.addEventListener(
            "click",
            mostrarCast
        );

    }

}


/* =====================================================
                ABRIR REPRODUCTOR
===================================================== */

function abrirReproductor(){

    if(!peliculaActual){

        return;

    }


    videoOverlay.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    prepararFuente();


    guardarContinuarViendo();

}


/* =====================================================
            PREPARAR FUENTE
===================================================== */

function prepararFuente(){

    ocultarFuente(
        youtubeContainer
    );

    ocultarFuente(
        mp4Container
    );


    /* =============================================
                    YOUTUBE
    ============================================= */

    if(
        peliculaActual.tipo ===
        "youtube"
    ){

        const id =
            obtenerYoutubeID(
                peliculaActual.url
            );


        if(!id){

            mostrarErrorVideo(
                "No se pudo obtener el ID de YouTube."
            );

            return;

        }


        youtubeContainer.classList.add(
            "active"
        );


        youtubePlayer.src =
            `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

        return;

    }


    /* =============================================
                    MP4
    ============================================= */

    if(
        peliculaActual.tipo ===
        "mp4"
    ){

        mp4Container.classList.add(
            "active"
        );


        if(videoPlayer){

            videoPlayer.src =
                convertirUrlVideo(
                    peliculaActual.url
                );

            videoPlayer.load();

            inicializarControlesMP4();

        }

        return;

    }


    /* =============================================
                    DRIVE
    ============================================= */

    if(
        peliculaActual.tipo ===
        "drive"
    ){

        mostrarErrorVideo(
            "Google Drive se abrirá desde su reproductor externo."
        );

        window.open(
            peliculaActual.url,
            "_blank"
        );

        return;

    }


    mostrarErrorVideo(
        "Formato de video no compatible."
    );

}


/* =====================================================
            CONVERTIR URL DROPBOX
===================================================== */

function convertirUrlVideo(url){

    if(!url){
        return "";
    }


    try{

        const objeto =
            new URL(url);


        if(
            objeto.hostname.includes(
                "dropbox.com"
            )
        ){

            objeto.searchParams.set(
                "dl",
                "1"
            );


            return objeto.toString();

        }


        return url;

    }
    catch{

        return url;

    }

}


/* =====================================================
                CERRAR REPRODUCTOR
===================================================== */

function cerrarReproductor(){

    videoOverlay.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    /* ---------------------------------------------
                    MP4
    --------------------------------------------- */

    if(videoPlayer){

        videoPlayer.pause();

        videoPlayer.removeAttribute(
            "src"
        );

        videoPlayer.load();

    }


    /* ---------------------------------------------
                    YOUTUBE
    --------------------------------------------- */

    if(youtubePlayer){

        youtubePlayer.src = "";

    }

}


/* =====================================================
                YOUTUBE ID
===================================================== */

function obtenerYoutubeID(url){

    if(!url){
        return null;
    }


    try{

        const objeto =
            new URL(url);


        if(
            objeto.hostname.includes(
                "youtu.be"
            )
        ){

            return objeto.pathname
                .replace(
                    "/",
                    ""
                );

        }


        if(
            objeto.hostname.includes(
                "youtube.com"
            )
        ){

            if(
                objeto.pathname ===
                "/watch"
            ){

                return objeto.searchParams.get(
                    "v"
                );

            }


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

        }

    }
    catch{

        return null;

    }


    return null;

}


/* =====================================================
                CONTROLES MP4
===================================================== */

let controlesInicializados = false;


function inicializarControlesMP4(){

    if(
        !videoPlayer ||
        controlesInicializados
    ){

        return;

    }


    controlesInicializados = true;


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


    /* ---------------------------------------------
                    PLAY
    --------------------------------------------- */

    play.addEventListener(
        "click",
        ()=>{

            if(
                videoPlayer.paused
            ){

                videoPlayer.play()
                    .catch(
                        error =>
                            console.log(
                                error
                            )
                    );

            }
            else{

                videoPlayer.pause();

            }

        }
    );


    /* ---------------------------------------------
                RETROCEDER
    --------------------------------------------- */

    back10.addEventListener(
        "click",
        ()=>{

            videoPlayer.currentTime =
                Math.max(
                    0,
                    videoPlayer.currentTime - 10
                );

        }
    );


    /* ---------------------------------------------
                    ADELANTAR
    --------------------------------------------- */

    forward10.addEventListener(
        "click",
        ()=>{

            videoPlayer.currentTime =
                Math.min(
                    videoPlayer.duration || 0,
                    videoPlayer.currentTime + 10
                );

        }
    );


    /* ---------------------------------------------
                    PROGRESO
    --------------------------------------------- */

    progress.addEventListener(
        "input",
        ()=>{

            if(
                videoPlayer.duration
            ){

                videoPlayer.currentTime =
                    (
                        videoPlayer.duration *
                        Number(progress.value)
                    ) / 100;

            }

        }
    );


    /* ---------------------------------------------
                    MUTE
    --------------------------------------------- */

    mute.addEventListener(
        "click",
        ()=>{

            videoPlayer.muted =
                !videoPlayer.muted;

            actualizarIconoMute();

        }
    );


    /* ---------------------------------------------
                    VOLUMEN
    --------------------------------------------- */

    volume.addEventListener(
        "input",
        ()=>{

            videoPlayer.volume =
                Number(volume.value);

            videoPlayer.muted =
                videoPlayer.volume === 0;

            actualizarIconoMute();

        }
    );


    /* ---------------------------------------------
                PANTALLA COMPLETA
    --------------------------------------------- */

    fullscreen.addEventListener(
        "click",
        ()=>{

            if(
                document.fullscreenElement
            ){

                document.exitFullscreen();

                return;

            }


            if(
                videoOverlay.requestFullscreen
            ){

                videoOverlay.requestFullscreen();

            }

        }
    );


    /* ---------------------------------------------
                    EVENTOS
    --------------------------------------------- */

    videoPlayer.addEventListener(
        "play",
        actualizarIconoPlay
    );


    videoPlayer.addEventListener(
        "pause",
        actualizarIconoPlay
    );


    videoPlayer.addEventListener(
        "timeupdate",
        actualizarProgreso
    );


    videoPlayer.addEventListener(
        "loadedmetadata",
        actualizarProgreso
    );


    videoPlayer.addEventListener(
        "volumechange",
        actualizarIconoMute
    );


    videoPlayer.addEventListener(
        "ended",
        peliculaTerminada
    );


    actualizarIconoPlay();

    actualizarIconoMute();

}


/* =====================================================
                ICONO PLAY
===================================================== */

function actualizarIconoPlay(){

    const play =
        document.getElementById(
            "btnPlay"
        );


    if(!play){
        return;
    }


    play.innerHTML =
        videoPlayer.paused

            ? '<i class="fa-solid fa-play"></i>'

            : '<i class="fa-solid fa-pause"></i>';

}


/* =====================================================
                ICONO MUTE
===================================================== */

function actualizarIconoMute(){

    const mute =
        document.getElementById(
            "btnMute"
        );


    if(!mute){
        return;
    }


    if(
        videoPlayer.muted ||
        videoPlayer.volume === 0
    ){

        mute.innerHTML =
            '<i class="fa-solid fa-volume-xmark"></i>';

    }
    else{

        mute.innerHTML =
            '<i class="fa-solid fa-volume-high"></i>';

    }

}


/* =====================================================
                PROGRESO
===================================================== */

function actualizarProgreso(){

    const progress =
        document.getElementById(
            "progressBar"
        );

    const time =
        document.getElementById(
            "timeDisplay"
        );


    if(!progress || !time){
        return;
    }


    const porcentaje =
        videoPlayer.duration

            ? (
                videoPlayer.currentTime /
                videoPlayer.duration
            ) * 100

            : 0;


    progress.value =
        porcentaje;


    time.textContent =
        `${formatearTiempo(
            videoPlayer.currentTime
        )} / ${formatearTiempo(
            videoPlayer.duration
        )}`;

}


/* =====================================================
                FORMATEAR TIEMPO
===================================================== */

function formatearTiempo(segundos){

    if(
        !Number.isFinite(segundos)
    ){

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


    if(horas > 0){

        return `${horas}:${minutos
            .toString()
            .padStart(2,"0")
        }:${segundosRestantes}`;

    }


    return `${minutos}:${segundosRestantes}`;

}


/* =====================================================
                PELÍCULA TERMINADA
===================================================== */

function peliculaTerminada(){

    guardarContinuarViendo();

}


/* =====================================================
                MI LISTA
===================================================== */

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


function toggleFavorito(){

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


    if(
        favoritos.includes(id)
    ){

        favoritos =
            favoritos.filter(
                item =>
                    Number(item) !== id
            );

    }
    else{

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


function actualizarBotonFavorito(){

    const boton =
        document.getElementById(
            "btnFavorito"
        );


    if(!boton){
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
            id =>
                Number(id) ===
                Number(peliculaActual.id)
        );


    if(existe){

        boton.innerHTML =
            '<i class="fa-solid fa-heart"></i> En mi lista';

    }
    else{

        boton.innerHTML =
            '<i class="fa-regular fa-heart"></i> Mi lista';

    }

}


/* =====================================================
            CONTINUAR VIENDO
===================================================== */

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
                Number(pelicula.id) !==
                Number(peliculaActual.id)
        );


    historial.unshift({

        id:peliculaActual.id,

        titulo:peliculaActual.titulo,

        poster:peliculaActual.poster,

        banner:peliculaActual.banner,

        fecha:Date.now()

    });


    if(
        historial.length > 20
    ){

        historial.pop();

    }


    localStorage.setItem(
        "continuarViendo",
        JSON.stringify(
            historial
        )
    );

}


/* =====================================================
                RELACIONADAS
===================================================== */

function cargarRelacionadas(){

    if(!relatedSlider){
        return;
    }


    relatedSlider.innerHTML =
        "";


    let relacionadas = [];


    /* ---------------------------------------------
        PRIMERO: RELACIONADAS DEL JSON
    --------------------------------------------- */

    if(
        Array.isArray(
            peliculaActual.relacionadas
        )
    ){

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


    /* ---------------------------------------------
        SI NO HAY SUFICIENTES
    --------------------------------------------- */

    if(
        relacionadas.length < 4
    ){

        const adicionales =
            peliculas.filter(
                pelicula =>
                    Number(pelicula.id) !==
                    Number(peliculaActual.id) &&
                    !relacionadas.some(
                        item =>
                            Number(item.id) ===
                            Number(pelicula.id)
                    )
            );


        relacionadas =
            [
                ...relacionadas,
                ...adicionales
            ];

    }


    relacionadas =
        relacionadas.slice(
            0,
            8
        );


    relacionadas.forEach(
        pelicula =>
            crearTarjetaRelacionada(
                pelicula
            )
    );

}


function crearTarjetaRelacionada(
    pelicula
){

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "relatedCard";


    tarjeta.innerHTML = `

        <div class="relatedPoster">

            <img
                src="${pelicula.poster || pelicula.banner || ""}"
                alt="${escaparHTML(
                    pelicula.titulo
                )}">

        </div>

        <div class="relatedInfo">

            <h3>
                ${escaparHTML(
                    pelicula.titulo
                )}
            </h3>

            <div class="relatedMeta">

                <span>
                    ${pelicula.anio || ""}
                </span>

                <span>
                    ${pelicula.duracion || ""}
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


/* =====================================================
            FLECHAS RELACIONADAS
===================================================== */

function inicializarFlechas(){

    const prev =
        document.getElementById(
            "relatedPrev"
        );


    const next =
        document.getElementById(
            "relatedNext"
        );


    if(prev){

        prev.addEventListener(
            "click",
            ()=>{
                relatedSlider.scrollBy({

                    left:-450,

                    behavior:"smooth"

                });
            }
        );

    }


    if(next){

        next.addEventListener(
            "click",
            ()=>{
                relatedSlider.scrollBy({

                    left:450,

                    behavior:"smooth"

                });
            }
        );

    }

}


/* =====================================================
                    COMPARTIR
===================================================== */

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

            mostrarAviso(
                "Enlace copiado"
            );

        }
        else{

            prompt(
                "Copia este enlace:",
                enlace
            );

        }

    }
    catch(error){

        console.log(
            "Compartir cancelado",
            error
        );

    }

}


/* =====================================================
                CAST / TV
===================================================== */

function mostrarCast(){

    mostrarAviso(
        "La función de transmisión a TV estará disponible próximamente."
    );

}


/* =====================================================
                    ERROR
===================================================== */

function mostrarError(){

    document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#08080d;
            color:white;
            font-family:Poppins,sans-serif;
            text-align:center;
            padding:30px;
        ">

            <div>

                <h1>
                    Película no encontrada
                </h1>

                <p style="
                    color:#999;
                ">
                    Verifica el ID de la película.
                </p>

                <button
                    onclick="history.back()"
                    style="
                        padding:12px 20px;
                        border:0;
                        border-radius:8px;
                        background:#7c3aed;
                        color:white;
                        cursor:pointer;
                    ">

                    Regresar

                </button>

            </div>

        </div>

    `;

}


/* =====================================================
                ERROR VIDEO
===================================================== */

function mostrarErrorVideo(
    mensaje
){

    youtubeContainer.classList.remove(
        "active"
    );

    mp4Container.classList.remove(
        "active"
    );


    videoOverlay.classList.add(
        "active"
    );


    const contenedor =
        document.getElementById(
            "videoContainer"
        );


    contenedor.innerHTML = `

        <div style="
            color:white;
            text-align:center;
            padding:30px;
            font-family:Poppins,sans-serif;
        ">

            <i
                class="fa-solid fa-circle-exclamation"
                style="
                    font-size:40px;
                    margin-bottom:15px;
                ">
            </i>

            <h2>
                No se pudo reproducir
            </h2>

            <p style="
                color:#aaa;
            ">
                ${escaparHTML(mensaje)}
            </p>

        </div>

    `;

}


/* =====================================================
                OCULTAR FUENTE
===================================================== */

function ocultarFuente(
    elemento
){

    if(elemento){

        elemento.classList.remove(
            "active"
        );

    }

}


/* =====================================================
                AVISO
===================================================== */

function mostrarAviso(
    mensaje
){

    const aviso =
        document.createElement(
            "div"
        );


    aviso.textContent =
        mensaje;


    aviso.style.position =
        "fixed";


    aviso.style.bottom =
        "25px";


    aviso.style.left =
        "50%";


    aviso.style.transform =
        "translateX(-50%)";


    aviso.style.zIndex =
        "20000";


    aviso.style.padding =
        "12px 20px";


    aviso.style.borderRadius =
        "10px";


    aviso.style.background =
        "rgba(20,20,30,.95)";


    aviso.style.border =
        "1px solid rgba(255,255,255,.12)";


    aviso.style.color =
        "white";


    aviso.style.fontFamily =
        "Poppins,sans-serif";


    aviso.style.fontSize =
        "13px";


    document.body.appendChild(
        aviso
    );


    setTimeout(
        ()=>{
            aviso.remove();
        },
        2500
    );

}


/* =====================================================
                ESCAPAR HTML
===================================================== */

function escaparHTML(
    texto
){

    if(
        texto === undefined ||
        texto === null
    ){

        return "";

    }


    return String(texto)
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


/* =====================================================
            TECLA ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape" &&
            videoOverlay &&
            videoOverlay.classList.contains(
                "active"
            )
        ){

            cerrarReproductor();

        }

    }
);
