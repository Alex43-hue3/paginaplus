"use strict";

/*=========================================================
                    CINEVERSE APP.JS
=========================================================*/

/*=========================================================
                    VARIABLES GLOBALES
=========================================================*/

let peliculas = [];

let peliculaActual = null;

let peliculasHero = [];

let indiceHero = 0;

let intervaloHero = null;


/*=========================================================
                    LOCAL STORAGE
=========================================================*/

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

const loadingScreen =
    document.getElementById("loadingScreen");

const movieCardTemplate =
    document.getElementById("movieCardTemplate");


/*=========================================================
                    INICIAR CINEVERSE
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.clear();

        console.log(
            "🎬 Iniciando CINEVERSE..."
        );

        await cargarPeliculas();

        if (!peliculas.length) {

            console.error(
                "❌ No hay películas disponibles"
            );

            ocultarPantallaCarga();

            return;
        }


        console.log(
            "🎞️ Películas cargadas:",
            peliculas.length
        );


        /*-------------------------------------------------
                        HERO
        -------------------------------------------------*/

        prepararHero();

        mostrarHero();

        iniciarHeroAutomatico();


        /*-------------------------------------------------
                    SECCIONES
        -------------------------------------------------*/

        cargarEstrenos();

        cargarTendencias();

        cargarMiLista();

        cargarContinuarViendo();


        /*-------------------------------------------------
                    CARRUSELES
        -------------------------------------------------*/

        configurarSlider(
            document.getElementById("estrenos"),
            "estrenosPrev",
            "estrenosNext"
        );

        configurarSlider(
            document.getElementById("tendencias"),
            "tendenciasPrev",
            "tendenciasNext"
        );


        /*-------------------------------------------------
                        BÚSQUEDA
        -------------------------------------------------*/

        configurarBusqueda();


        /*-------------------------------------------------
                        OTROS
        -------------------------------------------------*/

        configurarBotonArriba();

        configurarModal();


        /*-------------------------------------------------
                    OCULTAR LOADER
        -------------------------------------------------*/

        ocultarPantallaCarga();

    }
);


/*=========================================================
                    CARGAR PELÍCULAS
=========================================================*/

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


        if (!Array.isArray(peliculas)) {

            throw new Error(
                "peliculas.json no contiene un arreglo"
            );

        }


        console.log(
            "✅ JSON cargado correctamente"
        );


        console.log(
            "Películas:",
            peliculas.length
        );


    } catch (error) {

        console.error(
            "❌ Error cargando películas:",
            error
        );

        peliculas = [];

    }

}


/*=========================================================
                    PREPARAR HERO
=========================================================*/

function prepararHero() {

    /*
        El Hero solamente utilizará películas
        marcadas como:

        "destacada": true
    */

    peliculasHero =
        peliculas.filter(
            pelicula =>
                pelicula.destacada === true
        );


    /*
        Si ninguna película está marcada como
        destacada, usamos todas como respaldo.
    */

    if (!peliculasHero.length) {

        peliculasHero =
            [...peliculas];

        console.warn(
            "⚠️ No hay películas destacadas. Se utilizarán todas."
        );

    }


    indiceHero = 0;


    crearIndicadoresHero();

}


/*=========================================================
                    MOSTRAR HERO
=========================================================*/

function mostrarHero() {

    if (!peliculasHero.length) {

        console.error(
            "❌ No hay películas para el Hero"
        );

        return;

    }


    peliculaActual =
        peliculasHero[indiceHero];


    if (!peliculaActual) {

        return;

    }


    console.log(
        "🎬 HERO:",
        peliculaActual.titulo
    );


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
            peliculaActual.descripcion ||
            "Disfruta esta película en CINEVERSE.";

    }


    /*-----------------------------------------------------
                        RATING
    -----------------------------------------------------*/

    if (heroRating) {

        heroRating.textContent =
            peliculaActual.rating || "0.0";

    }


    /*-----------------------------------------------------
                            AÑO
    -----------------------------------------------------*/

    if (heroAno) {

        heroAno.textContent =
            peliculaActual.anio || "";

    }


    /*-----------------------------------------------------
                        DURACIÓN
    -----------------------------------------------------*/

    if (heroDuracion) {

        heroDuracion.textContent =
            peliculaActual.duracion || "";

    }


    /*-----------------------------------------------------
                    IMAGEN HERO
    -----------------------------------------------------*/

    if (heroBackground) {

        const imagen =
            peliculaActual.banner ||
            peliculaActual.poster ||
            "";


        heroBackground.style.backgroundImage =
            `url("${imagen}")`;

    }


    /*-----------------------------------------------------
                    INDICADORES
    -----------------------------------------------------*/

    actualizarIndicadoresHero();


    /*-----------------------------------------------------
                        TRAILER
    -----------------------------------------------------*/

    actualizarBotonTrailer();


    console.log(
        "✅ HERO ACTUALIZADO"
    );

}


/*=========================================================
                HERO AUTOMÁTICO
=========================================================*/

function iniciarHeroAutomatico() {

    if (intervaloHero) {

        clearInterval(
            intervaloHero
        );

    }


    /*
        Cambiar cada 7 segundos
    */

    intervaloHero =
        setInterval(
            () => {

                siguienteHero();

            },
            7000
        );

}


/*=========================================================
                    SIGUIENTE HERO
=========================================================*/

function siguienteHero() {

    if (!peliculasHero.length) {

        return;

    }


    indiceHero++;


    if (
        indiceHero >=
        peliculasHero.length
    ) {

        indiceHero = 0;

    }


    mostrarHero();

}


/*=========================================================
                    HERO ANTERIOR
=========================================================*/

function anteriorHero() {

    if (!peliculasHero.length) {

        return;

    }


    indiceHero--;


    if (indiceHero < 0) {

        indiceHero =
            peliculasHero.length - 1;

    }


    mostrarHero();

}


/*=========================================================
                    FLECHA ANTERIOR
=========================================================*/

if (heroAnterior) {

    heroAnterior.addEventListener(
        "click",
        () => {

            anteriorHero();

            iniciarHeroAutomatico();

        }
    );

}


/*=========================================================
                    FLECHA SIGUIENTE
=========================================================*/

if (heroSiguiente) {

    heroSiguiente.addEventListener(
        "click",
        () => {

            siguienteHero();

            iniciarHeroAutomatico();

        }
    );

}


/*=========================================================
                    INDICADORES HERO
=========================================================*/

function crearIndicadoresHero() {

    if (!heroIndicadores) {

        return;

    }


    heroIndicadores.innerHTML = "";


    peliculasHero.forEach(
        (pelicula, indice) => {

            const indicador =
                document.createElement(
                    "span"
                );


            if (indice === indiceHero) {

                indicador.classList.add(
                    "activo"
                );

            }


            indicador.addEventListener(
                "click",
                () => {

                    indiceHero =
                        indice;

                    mostrarHero();

                    iniciarHeroAutomatico();

                }
            );


            heroIndicadores.appendChild(
                indicador
            );

        }
    );

}


/*=========================================================
            ACTUALIZAR INDICADORES HERO
=========================================================*/

function actualizarIndicadoresHero() {

    if (!heroIndicadores) {

        return;

    }


    const indicadores =
        heroIndicadores.querySelectorAll(
            "span"
        );


    indicadores.forEach(
        (indicador, indice) => {

            indicador.classList.toggle(
                "activo",
                indice === indiceHero
            );

        }
    );

}


/*=========================================================
                    BOTÓN VER
=========================================================*/

if (btnVer) {

    btnVer.addEventListener(
        "click",
        () => {

            if (!peliculaActual) {

                return;

            }


            window.location.href =
                `reproductor.html?id=${peliculaActual.id}`;

        }
    );

}


/*=========================================================
                    BOTÓN TRAILER HERO
=========================================================*/

function actualizarBotonTrailer() {

    if (!btnTrailer) {

        return;

    }


    if (
        peliculaActual &&
        peliculaActual.trailer
    ) {

        btnTrailer.style.display =
            "";

        btnTrailer.onclick = () => {

            window.open(
                peliculaActual.trailer,
                "_blank"
            );

        };

    } else {

        btnTrailer.style.display =
            "none";

    }

}


/*=========================================================
                    DETALLES HERO
=========================================================*/

if (btnDetalles) {

    btnDetalles.addEventListener(
        "click",
        () => {

            if (!peliculaActual) {

                return;

            }


            abrirDetalles(
                peliculaActual
            );

        }
    );

}


/*=========================================================
                    CREAR TARJETA
=========================================================*/

function crearTarjeta(
    pelicula
) {

    if (!pelicula) {

        return null;

    }


    let tarjeta = null;


    /*-----------------------------------------------------
                USAR TEMPLATE DEL HTML
    -----------------------------------------------------*/

    if (movieCardTemplate) {

        const clon =
            movieCardTemplate.content.cloneNode(
                true
            );


        tarjeta =
            clon.querySelector(
                ".movieCard"
            );


    }


    /*-----------------------------------------------------
                RESPALDO SI NO HAY TEMPLATE
    -----------------------------------------------------*/

    if (!tarjeta) {

        tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.className =
            "movieCard";


        tarjeta.innerHTML = `

            <div class="moviePoster">

                <img
                    class="poster"
                    src=""
                    alt="">

                <div class="movieOverlay">

                    <button class="playMovie">

                        <i class="fa-solid fa-play"></i>

                    </button>

                </div>

            </div>

            <div class="movieInfo">

                <h3 class="movieTitle"></h3>

                <div class="movieMeta">

                    <span class="movieYear"></span>

                    <span class="movieRating"></span>

                </div>

            </div>

        `;

    }


    /*-----------------------------------------------------
                        POSTER
    -----------------------------------------------------*/

    const poster =
        tarjeta.querySelector(
            ".poster"
        );


    if (poster) {

        const imagen =
            pelicula.poster ||
            pelicula.banner ||
            "";


        let rutaImagen =
            imagen;


        /*
            Soporta nombres locales con espacios.
            Ejemplo:

            El Mago de Oz.jpg
        */

        if (
            rutaImagen &&
            !rutaImagen.startsWith(
                "http://"
            ) &&
            !rutaImagen.startsWith(
                "https://"
            )
        ) {

            rutaImagen =
                encodeURI(
                    rutaImagen
                );

        }


        poster.src =
            rutaImagen;


        poster.alt =
            pelicula.titulo ||
            "Película";


        poster.onerror =
            () => {

                if (
                    pelicula.banner &&
                    pelicula.banner !==
                    pelicula.poster
                ) {

                    let banner =
                        pelicula.banner;


                    if (
                        !banner.startsWith(
                            "http://"
                        ) &&
                        !banner.startsWith(
                            "https://"
                        )
                    ) {

                        banner =
                            encodeURI(
                                banner
                            );

                    }


                    poster.onerror =
                        null;

                    poster.src =
                        banner;

                }

            };

    }


    /*-----------------------------------------------------
                        TÍTULO
    -----------------------------------------------------*/

    const titulo =
        tarjeta.querySelector(
            ".movieTitle"
        );


    if (titulo) {

        titulo.textContent =
            pelicula.titulo ||
            "Sin título";

    }


    /*-----------------------------------------------------
                        AÑO
    -----------------------------------------------------*/

    const anio =
        tarjeta.querySelector(
            ".movieYear"
        );


    if (anio) {

        anio.textContent =
            pelicula.anio ||
            "";

    }


    /*-----------------------------------------------------
                        RATING
    -----------------------------------------------------*/

    const rating =
        tarjeta.querySelector(
            ".movieRating"
        );


    if (rating) {

        rating.textContent =
            pelicula.rating
                ? `⭐ ${pelicula.rating}`
                : "";

    }


    /*-----------------------------------------------------
                        CLIC TARJETA
    -----------------------------------------------------*/

    tarjeta.addEventListener(
        "click",
        () => {

            window.location.href =
                `reproductor.html?id=${pelicula.id}`;

        }
    );


    /*-----------------------------------------------------
                    BOTÓN PLAY
    -----------------------------------------------------*/

    const botonPlay =
        tarjeta.querySelector(
            ".playMovie"
        );


    if (botonPlay) {

        botonPlay.addEventListener(
            "click",
            (evento) => {

                evento.stopPropagation();


                window.location.href =
                    `reproductor.html?id=${pelicula.id}`;

            }
        );

    }


    return tarjeta;

}


/*=========================================================
                    LLENAR CARRUSEL
=========================================================*/

function llenarCarrusel(
    contenedor,
    lista
) {

    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    if (!lista.length) {

        return;

    }


    lista.forEach(
        pelicula => {

            const tarjeta =
                crearTarjeta(
                    pelicula
                );


            if (tarjeta) {

                contenedor.appendChild(
                    tarjeta
                );

            }

        }
    );

}


/*=========================================================
                    ESTRENOS
=========================================================*/

function cargarEstrenos() {

    const contenedor =
        document.getElementById(
            "estrenos"
        );


    if (!contenedor) {

        return;

    }


    const estrenos =
        peliculas.filter(
            pelicula =>
                pelicula.nuevo === true
        );


    /*
        Si no hay ninguna marcada como nuevo,
        mostramos todas como respaldo.
    */

    llenarCarrusel(
        contenedor,
        estrenos.length
            ? estrenos
            : peliculas
    );

}


/*=========================================================
                    TENDENCIAS
=========================================================*/

function cargarTendencias() {

    const contenedor =
        document.getElementById(
            "tendencias"
        );


    if (!contenedor) {

        return;

    }


    const tendencias =
        peliculas.filter(
            pelicula =>
                pelicula.tendencia === true
        );


    llenarCarrusel(
        contenedor,
        tendencias.length
            ? tendencias
            : peliculas
    );

}


/*=========================================================
                    MI LISTA
=========================================================*/

function cargarMiLista() {

    const contenedor =
        document.getElementById(
            "miLista"
        );


    if (!contenedor) {

        return;

    }


    const favoritos =
        peliculas.filter(
            pelicula =>
                miLista.includes(
                    pelicula.id
                )
        );


    llenarCarrusel(
        contenedor,
        favoritos
    );

}


/*=========================================================
                    CONFIGURAR SLIDER
=========================================================*/

function configurarSlider(
    contenedor,
    idPrev,
    idNext
) {

    if (!contenedor) {

        return;

    }


    const anterior =
        document.getElementById(
            idPrev
        );


    const siguiente =
        document.getElementById(
            idNext
        );


    if (anterior) {

        anterior.addEventListener(
            "click",
            () => {

                contenedor.scrollBy({

                    left: -500,

                    behavior: "smooth"

                });

            }
        );

    }


    if (siguiente) {

        siguiente.addEventListener(
            "click",
            () => {

                contenedor.scrollBy({

                    left: 500,

                    behavior: "smooth"

                });

            }
        );

    }

}


/*=========================================================
                    BÚSQUEDA
=========================================================*/

function configurarBusqueda() {

    if (!buscar) {

        return;

    }


    buscar.addEventListener(
        "input",
        () => {

            const texto =
                buscar.value
                    .toLowerCase()
                    .trim();


            const estrenos =
                document.getElementById(
                    "estrenos"
                );


            const tendencias =
                document.getElementById(
                    "tendencias"
                );


            if (!texto) {

                cargarEstrenos();

                cargarTendencias();

                return;

            }


            const resultados =
                peliculas.filter(
                    pelicula => {

                        const titulo =
                            (
                                pelicula.titulo ||
                                ""
                            ).toLowerCase();


                        const genero =
                            (
                                pelicula.genero ||
                                ""
                            ).toLowerCase();


                        const tags =
                            Array.isArray(
                                pelicula.tags
                            )
                                ? pelicula.tags.join(
                                    " "
                                ).toLowerCase()
                                : "";


                        return (
                            titulo.includes(
                                texto
                            ) ||
                            genero.includes(
                                texto
                            ) ||
                            tags.includes(
                                texto
                            )
                        );

                    }
                );


            llenarCarrusel(
                estrenos,
                resultados
            );


            llenarCarrusel(
                tendencias,
                resultados
            );

        }
    );

}


/*=========================================================
                CONTINUAR VIENDO
=========================================================*/

function cargarContinuarViendo() {

    const poster =
        document.getElementById(
            "continuarPoster"
        );

    const titulo =
        document.getElementById(
            "continuarTitulo"
        );

    const descripcion =
        document.getElementById(
            "continuarDescripcion"
        );

    const progreso =
        document.getElementById(
            "continuarProgreso"
        );

    const tiempo =
        document.getElementById(
            "continuarTiempo"
        );

    const btnContinuar =
        document.getElementById(
            "btnContinuar"
        );


    if (
        !titulo ||
        !btnContinuar
    ) {

        return;

    }


    const historial =
        JSON.parse(
            localStorage.getItem(
                "continuarViendo"
            )
        ) || [];


    if (!historial.length) {

        titulo.textContent =
            "No hay películas recientes";


        descripcion.textContent =
            "Cuando empieces a ver una película aparecerá aquí para continuar exactamente donde la dejaste.";


        if (progreso) {

            progreso.style.width =
                "0%";

        }


        if (tiempo) {

            tiempo.textContent =
                "0%";

        }


        btnContinuar.style.display =
            "none";


        return;

    }


    /*
        Por ahora usamos la última película
        guardada por el reproductor.
    */

    const ultima =
        historial[0];


    const pelicula =
        peliculas.find(
            pelicula =>
                pelicula.id === ultima.id
        );


    if (!pelicula) {

        return;

    }


    titulo.textContent =
        pelicula.titulo;


    descripcion.textContent =
        pelicula.descripcion ||
        "Continúa viendo esta película.";


    if (poster) {

        poster.style.backgroundImage =
            `url("${pelicula.poster || pelicula.banner}")`;

    }


    /*
        Si posteriormente el reproductor guarda
        porcentaje real, esta parte lo utilizará.
    */

    const porcentaje =
        Number(
            ultima.progreso || 0
        );


    if (progreso) {

        progreso.style.width =
            `${porcentaje}%`;

    }


    if (tiempo) {

        tiempo.textContent =
            `${Math.round(porcentaje)}%`;

    }


    btnContinuar.style.display =
        "";


    btnContinuar.onclick =
        () => {

            window.location.href =
                `reproductor.html?id=${pelicula.id}`;

        };

}


/*=========================================================
                    MODAL
=========================================================*/

function configurarModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    const cerrar =
        document.getElementById(
            "cerrarModal"
        );


    if (cerrar && modal) {

        cerrar.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "activo"
                );

            }
        );

    }

}


function abrirDetalles(
    pelicula
) {

    const modal =
        document.getElementById(
            "modal"
        );


    const cuerpo =
        document.getElementById(
            "modalBody"
        );


    if (
        !modal ||
        !cuerpo
    ) {

        return;

    }


    cuerpo.innerHTML = `

        <h2>
            ${pelicula.titulo}
        </h2>

        <p>
            ${pelicula.descripcion || ""}
        </p>

        <div class="detalleInfo">

            <p>
                <strong>Año:</strong>
                ${pelicula.anio || "—"}
            </p>

            <p>
                <strong>Género:</strong>
                ${pelicula.genero || "—"}
            </p>

            <p>
                <strong>Duración:</strong>
                ${pelicula.duracion || "—"}
            </p>

            <p>
                <strong>Calificación:</strong>
                ⭐ ${pelicula.rating || "—"}
            </p>

            <p>
                <strong>Director:</strong>
                ${pelicula.director || "—"}
            </p>

        </div>

    `;


    modal.classList.add(
        "activo"
    );

}


/*=========================================================
                    BOTÓN SUBIR
=========================================================*/

function configurarBotonArriba() {

    const boton =
        document.getElementById(
            "btnTop"
        );


    if (!boton) {

        return;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                boton.classList.add(
                    "visible"
                );

            } else {

                boton.classList.remove(
                    "visible"
                );

            }

        }
    );


    boton.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/*=========================================================
                PANTALLA DE CARGA
=========================================================*/

function ocultarPantallaCarga() {

    if (!loadingScreen) {

        return;

    }


    loadingScreen.classList.add(
        "hide"
    );


    setTimeout(
        () => {

            loadingScreen.style.display =
                "none";

        },
        800
    );

}


/*=========================================================
                    FIN APP.JS
=========================================================*/

console.log(
    "🔥 CINEVERSE APP.JS cargado correctamente"
);
/* =========================================================
        CINEVERSE — CONTINUAR VIENDO
        MULTIPELÍCULA
========================================================= */

function cargarContinuarViendo(){

    const lista =
        document.getElementById(
            "continuarLista"
        );

    const vacio =
        document.getElementById(
            "continuarVacio"
        );


    if(!lista){

        return;

    }


    /* =====================================================
                    LEER HISTORIAL
    ===================================================== */

    let historial = [];

    try{

        historial =
            JSON.parse(
                localStorage.getItem(
                    "continuarViendo"
                )
            ) || [];

    }catch(error){

        console.error(
            "❌ Error leyendo continuarViendo:",
            error
        );

        historial = [];

    }


    /* =====================================================
                CALCULAR PORCENTAJE
    ===================================================== */

    function obtenerPorcentaje(pelicula){

        const valores = [

            pelicula.porcentaje,

            pelicula.progreso,

            pelicula.progress,

            pelicula.percent

        ];


        for(
            const valor of valores
        ){

            if(
                valor !== undefined &&
                valor !== null &&
                valor !== ""
            ){

                let numero =
                    Number(valor);


                if(
                    numero > 1 &&
                    numero <= 100
                ){

                    return Math.min(
                        100,
                        Math.max(
                            0,
                            numero
                        )
                    );

                }


                if(
                    numero >= 0 &&
                    numero <= 1
                ){

                    return Math.min(
                        100,
                        Math.max(
                            0,
                            numero * 100
                        )
                    );

                }

            }

        }


        return 0;

    }


    /* =====================================================
                ELIMINAR TERMINADAS
    ===================================================== */

    historial =
        historial.filter(
            pelicula =>
                obtenerPorcentaje(
                    pelicula
                ) < 100
        );


    localStorage.setItem(

        "continuarViendo",

        JSON.stringify(
            historial
        )

    );


    /* =====================================================
                LIMPIAR TARJETAS
    ===================================================== */

    lista
        .querySelectorAll(
            ".continuarItem"
        )
        .forEach(
            tarjeta =>
                tarjeta.remove()
        );


    /* =====================================================
                    SIN PELÍCULAS
    ===================================================== */

    if(
        historial.length === 0
    ){

        if(vacio){

            vacio.style.display =
                "block";

        }

        return;

    }


    if(vacio){

        vacio.style.display =
            "none";

    }


    /* =====================================================
                CREAR TARJETAS
    ===================================================== */

    historial.forEach(
        pelicula => {

            const porcentaje =
                obtenerPorcentaje(
                    pelicula
                );


            const titulo =
                pelicula.titulo ||
                "Película";


            const poster =
                pelicula.poster ||
                pelicula.banner ||
                "";


            const descripcion =
                pelicula.descripcion ||
                "Continúa viendo esta película desde donde la dejaste.";


            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "continuarItem";


            tarjeta.innerHTML = `

                <div
                    class="continuarItemPoster">

                    <img
                        src="${poster}"
                        alt="${titulo.replace(
                            /"/g,
                            "&quot;"
                        )}"
                        loading="lazy">

                </div>


                <div
                    class="continuarItemContenido">


                    <span
                        class="continuarItemEtiqueta">

                        <i
                            class="fa-solid fa-play">
                        </i>

                        CONTINUAR

                    </span>


                    <h3
                        class="continuarItemTitulo">

                        ${titulo}

                    </h3>


                    <p
                        class="continuarItemDescripcion">

                        ${descripcion}

                    </p>


                    <div
                        class="continuarItemProgress">


                        <div
                            class="continuarItemProgressBar">

                            <div
                                class="continuarItemProgressValue"
                                style="
                                    width:${porcentaje}%;
                                ">

                            </div>

                        </div>


                        <span
                            class="continuarItemPorcentaje">

                            ${Math.round(
                                porcentaje
                            )}%

                        </span>


                    </div>


                    <div
                        class="continuarItemBotones">


                        <button
                            class="btnPrincipal continuarItemBtn"
                            type="button">

                            <i
                                class="fa-solid fa-play">
                            </i>

                            Continuar

                        </button>


                    </div>


                </div>

            `;


            /* =========================================
                        CONTINUAR
            ========================================= */

            const boton =
                tarjeta.querySelector(
                    ".continuarItemBtn"
                );


            if(boton){

                boton.addEventListener(
                    "click",
                    () => {

                        if(
                            pelicula.id !==
                            undefined
                        ){

                            window.location.href =
                                `reproductor.html?id=${pelicula.id}`;

                        }

                    }
                );

            }


            /* =========================================
                    FALLBACK DE IMAGEN
            ========================================= */

            const imagen =
                tarjeta.querySelector(
                    "img"
                );


            if(imagen){

                imagen.addEventListener(
                    "error",
                    () => {

                        if(
                            pelicula.banner &&
                            imagen.src !==
                            pelicula.banner
                        ){

                            imagen.src =
                                pelicula.banner;

                        }

                    }
                );

            }


            lista.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================================================
        ACTUALIZAR AUTOMÁTICAMENTE
========================================================= */

window.actualizarContinuarViendo =
    cargarContinuarViendo;


/* =========================================================
        CARGAR AL INICIAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarContinuarViendo();

    }
);


/* =========================================================
        SI OTRA PÁGINA MODIFICA LOCALSTORAGE
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if(
            event.key ===
            "continuarViendo"
        ){

            cargarContinuarViendo();

        }

    }
);
/* =========================================================
        CONTINUAR VIENDO — CONTROLES DEL CARRUSEL
========================================================= */

function configurarCarruselContinuar(){

    const contenedor =
        document.getElementById(
            "continuarLista"
        );

    const anterior =
        document.getElementById(
            "continuarAnterior"
        );

    const siguiente =
        document.getElementById(
            "continuarSiguiente"
        );


    if(
        !contenedor ||
        !anterior ||
        !siguiente
    ){

        return;

    }


    function moverCarrusel(direccion){

        const tarjeta =
            contenedor.querySelector(
                ".continuarItem"
            );


        if(!tarjeta){

            return;

        }


        const ancho =
            tarjeta.offsetWidth;


        const espacio =
            24;


        contenedor.scrollBy({

            left:
                direccion *
                (ancho + espacio),

            behavior:"smooth"

        });

    }


    anterior.addEventListener(
        "click",
        () => {

            moverCarrusel(-1);

        }
    );


    siguiente.addEventListener(
        "click",
        () => {

            moverCarrusel(1);

        }
    );

}


/* =========================================================
            INICIAR CARRUSEL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarCarruselContinuar();

    }
);
