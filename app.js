"use strict";

/* =========================================================
                    CINEVERSE APP.JS
                    VERSIÓN FINAL
========================================================= */

let peliculas = [];
let peliculaActual = null;
let indiceHero = 0;
let listaHeroActual = [];

let miLista = [];

try {

    miLista =
        JSON.parse(
            localStorage.getItem("miLista")
        ) || [];

} catch (error) {

    miLista = [];

}


/* =========================================================
                    DOM PRINCIPAL
========================================================= */

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


/* =========================================================
                    CATÁLOGOS
========================================================= */

const tendencias =
    document.getElementById("tendencias");

const estrenos =
    document.getElementById("estrenos");

const miListaContenedor =
    document.getElementById("miLista");

const movieCardTemplate =
    document.getElementById(
        "movieCardTemplate"
    );


/* =========================================================
                    CATEGORÍAS
========================================================= */

const CATEGORIAS = [

    {
        nombre: "Acción",

        genero: "accion",

        icono: "fa-solid fa-bolt",

        clase: "accion",

        descripcion:
            "Explosiones, persecuciones y adrenalina."
    },

    {
        nombre: "Ciencia ficción",

        genero: "ciencia ficcion",

        icono: "fa-solid fa-rocket",

        clase: "ciencia",

        descripcion:
            "Viajes espaciales y mundos futuristas."
    },

    {
        nombre: "Fantasía",

        genero: "fantasia",

        icono:
            "fa-solid fa-wand-magic-sparkles",

        clase: "fantasia",

        descripcion:
            "Dragones, magia y aventuras épicas."
    },

    {
        nombre: "Terror",

        genero: "terror",

        icono: "fa-solid fa-ghost",

        clase: "terror",

        descripcion:
            "Suspenso y miedo hasta el último minuto."
    },

    {
        nombre: "Animación",

        genero: "animacion",

        icono: "fa-solid fa-clapperboard",

        clase: "animacion",

        descripcion:
            "Historias para disfrutar a cualquier edad."
    },

    {
        nombre: "Anime",

        genero: "anime",

        icono: "fa-solid fa-dragon",

        clase: "anime",

        descripcion:
            "Aventuras, mundos y personajes inolvidables."
    }

];


/* =========================================================
                INICIALIZACIÓN
========================================================= */

function iniciarCineverse() {

    console.clear();

    console.log(
        "===================================="
    );

    console.log(
        "🎬 INICIANDO CINEVERSE"
    );

    console.log(
        "===================================="
    );


    /*
     * Eliminamos completamente
     * Continuar viendo.
     */

    ocultarContinuarViendo();


    /*
     * Preparamos categorías.
     */

    prepararCategorias();


    /*
     * Cargamos películas.
     */

    cargarPeliculas()

        .then(() => {

            if (!peliculas.length) {

                console.error(
                    "❌ No hay películas disponibles."
                );

                ocultarPantallaCarga();

                return;

            }


            console.log(
                "🎬 Películas cargadas:",
                peliculas.length
            );


            prepararHero();

            renderizarCatalogo();

            configurarBotonesHero();

            configurarBusqueda();

            configurarSliders();

            configurarBotonSubir();

            configurarBotonDetalles();

            configurarVerTodo();

            ocultarPantallaCarga();


            console.log(
                "===================================="
            );

            console.log(
                "✅ CINEVERSE LISTO"
            );

            console.log(
                "===================================="
            );

        })

        .catch(error => {

            console.error(
                "❌ Error iniciando CINEVERSE:",
                error
            );

            ocultarPantallaCarga();

        });

}


/* =========================================================
                    CARGAR PELÍCULAS
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


        const datos =
            await respuesta.json();


        if (!Array.isArray(datos)) {

            throw new Error(
                "peliculas.json debe contener un arreglo"
            );

        }


        peliculas = datos;


        console.log(
            "✅ peliculas.json cargado:",
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
                    PREPARAR HERO
========================================================= */

function prepararHero() {

    const destacadas =
        peliculas.filter(
            pelicula =>
                pelicula.destacada === true
        );


    listaHeroActual =
        destacadas.length
            ? destacadas
            : peliculas;


    if (!listaHeroActual.length) {

        return;

    }


    indiceHero = 0;

    peliculaActual =
        listaHeroActual[0];


    mostrarHero();

    crearIndicadoresHero(
        listaHeroActual
    );

    iniciarHeroAutomatico();

}


/* =========================================================
                    MOSTRAR HERO
========================================================= */

function mostrarHero() {

    if (!peliculaActual) {

        return;

    }


    if (heroTitulo) {

        heroTitulo.textContent =
            peliculaActual.titulo ||
            "Sin título";

    }


    if (heroDescripcion) {

        heroDescripcion.textContent =
            peliculaActual.descripcion ||
            "Sin descripción disponible.";

    }


    if (heroRating) {

        heroRating.textContent =
            peliculaActual.rating ||
            "0.0";

    }


    if (heroAno) {

        heroAno.textContent =
            peliculaActual.anio ||
            "";

    }


    if (heroDuracion) {

        heroDuracion.textContent =
            peliculaActual.duracion ||
            "";

    }


    if (heroBackground) {

        const imagen =
            peliculaActual.banner ||
            peliculaActual.poster ||
            "";


        if (imagen) {

            heroBackground.style.backgroundImage =
                `url("${imagen}")`;

        }

    }


    if (btnTrailer) {

        const trailer =
            peliculaActual.trailer ||
            "";


        btnTrailer.disabled =
            !trailer;


        btnTrailer.onclick = () => {

            if (!trailer) {

                mostrarToast(
                    "Esta película no tiene tráiler disponible."
                );

                return;

            }


            abrirEnlaceVideo(
                trailer
            );

        };

    }


    console.log(
        "🎬 Hero:",
        peliculaActual.titulo
    );

}


/* =========================================================
                    HERO AUTOMÁTICO
========================================================= */

let heroInterval = null;


function iniciarHeroAutomatico() {

    if (heroInterval) {

        clearInterval(
            heroInterval
        );

    }


    if (
        listaHeroActual.length <= 1
    ) {

        return;

    }


    heroInterval =
        setInterval(
            () => {

                cambiarHero(
                    indiceHero + 1
                );

            },
            7000
        );

}


/* =========================================================
                    CAMBIAR HERO
========================================================= */

function cambiarHero(
    nuevoIndice
) {

    if (!listaHeroActual.length) {

        return;

    }


    indiceHero =
        (
            nuevoIndice +
            listaHeroActual.length
        ) %
        listaHeroActual.length;


    peliculaActual =
        listaHeroActual[
            indiceHero
        ];


    mostrarHero();

    actualizarIndicadoresHero();

}


/* =========================================================
                    HERO BOTONES
========================================================= */

function configurarBotonesHero() {

    if (heroAnterior) {

        heroAnterior.addEventListener(
            "click",
            () => {

                cambiarHero(
                    indiceHero - 1
                );

                iniciarHeroAutomatico();

            }
        );

    }


    if (heroSiguiente) {

        heroSiguiente.addEventListener(
            "click",
            () => {

                cambiarHero(
                    indiceHero + 1
                );

                iniciarHeroAutomatico();

            }
        );

    }


    if (btnVer) {

        btnVer.addEventListener(
            "click",
            () => {

                if (!peliculaActual) {

                    return;

                }


                abrirPelicula(
                    peliculaActual
                );

            }
        );

    }

}


/* =========================================================
                    INDICADORES HERO
========================================================= */

function crearIndicadoresHero(
    lista
) {

    if (!heroIndicadores) {

        return;

    }


    heroIndicadores.innerHTML =
        "";


    lista.forEach(
        (
            pelicula,
            index
        ) => {

            const indicador =
                document.createElement(
                    "button"
                );


            indicador.type =
                "button";


            indicador.className =
                "heroIndicador";


            if (
                index === indiceHero
            ) {

                indicador.classList.add(
                    "activo"
                );

            }


            indicador.setAttribute(
                "aria-label",
                `Mostrar ${pelicula.titulo}`
            );


            indicador.addEventListener(
                "click",
                () => {

                    cambiarHero(
                        index
                    );

                    iniciarHeroAutomatico();

                }
            );


            heroIndicadores.appendChild(
                indicador
            );

        }
    );

}


function actualizarIndicadoresHero() {

    if (!heroIndicadores) {

        return;

    }


    const indicadores =
        heroIndicadores.querySelectorAll(
            "button"
        );


    indicadores.forEach(
        (
            indicador,
            index
        ) => {

            indicador.classList.toggle(
                "activo",
                index === indiceHero
            );

        }
    );

}


/* =========================================================
                CATEGORÍAS / UNIVERSOS
========================================================= */

function prepararCategorias() {

    const seccion =
        document.querySelector(
            ".universos"
        );


    if (!seccion) {

        console.warn(
            "⚠️ No se encontró .universos"
        );

        return;

    }


    const grid =
        seccion.querySelector(
            ".universosGrid"
        );


    if (!grid) {

        console.warn(
            "⚠️ No se encontró .universosGrid"
        );

        return;

    }


    /*
     * Evitamos crear varios carruseles
     * si app.js se ejecuta nuevamente.
     */

    let carrusel =
        seccion.querySelector(
            ".universosCarrusel"
        );


    if (!carrusel) {

        carrusel =
            document.createElement(
                "div"
            );


        carrusel.className =
            "universosCarrusel";


        grid.parentNode.insertBefore(
            carrusel,
            grid
        );


        carrusel.appendChild(
            grid
        );

    }


    /*
     * Limpiamos tarjetas anteriores.
     */

    grid.innerHTML =
        "";


    /*
     * Clase para el slider.
     */

    grid.classList.add(
        "universosSlider"
    );


    /*
     * Creamos las 6 categorías.
     */

    CATEGORIAS.forEach(
        categoria => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                `universoCard ${categoria.clase}`;


            card.dataset.genero =
                categoria.genero;


            card.setAttribute(
                "role",
                "button"
            );


            card.setAttribute(
                "tabindex",
                "0"
            );


            /*
             * IMPORTANTE:
             *
             * La estructura está separada:
             *
             * ICONO
             * INFORMACIÓN
             *
             * Esto evita que el icono se
             * monte sobre el texto.
             */

            card.innerHTML = `

                <div class="universoGlow"></div>

                <div class="universoOverlay"></div>

                <div class="universoIcon">

                    <i class="${categoria.icono}"></i>

                </div>

                <div class="universoInfo">

                    <h3>
                        ${categoria.nombre}
                    </h3>

                    <p>
                        ${categoria.descripcion}
                    </p>

                </div>

            `;


            /*
             * CLICK
             */

            card.addEventListener(
                "click",
                () => {

                    seleccionarCategoria(
                        categoria.genero,
                        categoria.nombre
                    );

                }
            );


            /*
             * TECLADO
             */

            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        seleccionarCategoria(
                            categoria.genero,
                            categoria.nombre
                        );

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    /*
     * Creamos flechas.
     */

    crearFlechasCategorias(
        carrusel,
        grid
    );


    /*
     * Ajustes visuales mínimos
     * desde JS para garantizar
     * la estructura.
     */

    prepararEstiloCategorias(
        seccion,
        carrusel,
        grid
    );


    console.log(
        "✅ Categorías preparadas:",
        CATEGORIAS.length
    );

}


/* =========================================================
            ESTILO BASE DE CATEGORÍAS
========================================================= */

function prepararEstiloCategorias(
    seccion,
    carrusel,
    slider
) {

    if (!seccion || !carrusel || !slider) {

        return;

    }


    /*
     * El carrusel será la referencia
     * para las flechas.
     */

    carrusel.style.position =
        "relative";


    /*
     * El slider mantiene el
     * desplazamiento horizontal.
     */

    slider.style.overflowX =
        "auto";


    slider.style.scrollBehavior =
        "smooth";


    slider.style.scrollbarWidth =
        "none";


    /*
     * Evita que las tarjetas
     * se aplasten.
     */

    slider.style.display =
        "flex";


    slider.style.flexWrap =
        "nowrap";


    slider.style.alignItems =
        "stretch";


    /*
     * Tarjetas.
     */

    slider
        .querySelectorAll(
            ".universoCard"
        )
        .forEach(
            card => {

                card.style.position =
                    "relative";


                card.style.flex =
                    "0 0 auto";


                /*
                 * El icono queda separado
                 * de la información.
                 */

                const icono =
                    card.querySelector(
                        ".universoIcon"
                    );


                if (icono) {

                    icono.style.position =
                        "absolute";

                    icono.style.zIndex =
                        "3";

                }


                const info =
                    card.querySelector(
                        ".universoInfo"
                    );


                if (info) {

                    info.style.position =
                        "absolute";

                    info.style.zIndex =
                        "4";

                }

            }
        );

}


/* =========================================================
                FLECHAS CATEGORÍAS
========================================================= */

function crearFlechasCategorias(
    contenedor,
    slider
) {

    if (!contenedor || !slider) {

        return;

    }


    /*
     * Eliminamos cualquier flecha
     * creada anteriormente.
     */

    contenedor
        .querySelectorAll(
            ".universosArrow"
        )
        .forEach(
            flecha => {

                flecha.remove();

            }
        );


    /*
     * ANTERIOR
     */

    const anterior =
        document.createElement(
            "button"
        );


    anterior.type =
        "button";


    anterior.className =
        "universosArrow universosArrowLeft";


    anterior.innerHTML =
        `<i class="fa-solid fa-chevron-left"></i>`;


    anterior.setAttribute(
        "aria-label",
        "Categorías anteriores"
    );


    /*
     * SIGUIENTE
     */

    const siguiente =
        document.createElement(
            "button"
        );


    siguiente.type =
        "button";


    siguiente.className =
        "universosArrow universosArrowRight";


    siguiente.innerHTML =
        `<i class="fa-solid fa-chevron-right"></i>`;


    siguiente.setAttribute(
        "aria-label",
        "Siguientes categorías"
    );


    /*
     * Añadimos las flechas
     * directamente al carrusel.
     */

    contenedor.appendChild(
        anterior
    );


    contenedor.appendChild(
        siguiente
    );


    /*
     * Movimiento.
     */

    function mover(
        direccion
    ) {

        const tarjeta =
            slider.querySelector(
                ".universoCard"
            );


        let desplazamiento =
            420;


        if (tarjeta) {

            const ancho =
                tarjeta.getBoundingClientRect()
                    .width;


            const espacio =
                14;


            desplazamiento =
                (
                    ancho +
                    espacio
                ) * 2;

        }


        slider.scrollBy({

            left:
                direccion *
                desplazamiento,

            behavior:
                "smooth"

        });

    }


    /*
     * EVENTOS
     */

    anterior.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            mover(-1);

        }
    );


    siguiente.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            mover(1);

        }
    );


    /*
     * Estado de flechas.
     */

    function actualizarFlechas() {

        const limite =
            slider.scrollWidth -
            slider.clientWidth;


        const posicion =
            slider.scrollLeft;


        const necesitaFlechas =
            limite > 5;


        anterior.classList.toggle(
            "disabled",
            !necesitaFlechas ||
            posicion <= 5
        );


        siguiente.classList.toggle(
            "disabled",
            !necesitaFlechas ||
            posicion >=
            limite - 5
        );


        /*
         * Si no hay desplazamiento,
         * ocultamos las flechas.
         */

        contenedor.classList.toggle(
            "sinMovimiento",
            !necesitaFlechas
        );

    }


    slider.addEventListener(
        "scroll",
        actualizarFlechas,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        actualizarFlechas
    );


    setTimeout(
        actualizarFlechas,
        100
    );


    setTimeout(
        actualizarFlechas,
        500
    );

}


/* =========================================================
                SELECCIONAR CATEGORÍA
========================================================= */

function seleccionarCategoria(
    genero,
    nombre
) {

    console.log(
        "🎬 Género seleccionado:",
        nombre
    );


    const resultados =
        peliculas.filter(
            pelicula =>
                peliculaCoincideGenero(
                    pelicula,
                    genero
                )
        );


    if (!resultados.length) {

        mostrarToast(
            `Todavía no hay películas de ${nombre}.`
        );

        return;

    }


    renderizarSeccion(
        tendencias,
        resultados,
        nombre
    );


    if (estrenos) {

        estrenos.innerHTML =
            "";

    }


    if (miListaContenedor) {

        miListaContenedor.innerHTML =
            "";

    }


    /*
     * Buscamos la sección
     * de películas.
     */

    const secciones =
        document.querySelectorAll(
            ".moviesSection"
        );


    const seccion =
        secciones.length
            ? secciones[0]
            : null;


    if (seccion) {

        const titulo =
            seccion.querySelector(
                ".sectionHeader h2"
            );


        if (titulo) {

            titulo.textContent =
                nombre;

        }


        const mini =
            seccion.querySelector(
                ".sectionMini"
            );


        if (mini) {

            mini.textContent =
                "Categoría seleccionada";

        }


        seccion.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}


/* =========================================================
                COMPROBAR GÉNERO
========================================================= */

function peliculaCoincideGenero(
    pelicula,
    generoBuscado
) {

    if (!pelicula) {

        return false;

    }


    const objetivo =
        normalizarTexto(
            generoBuscado
        );


    const campos = [];


    if (pelicula.genero) {

        campos.push(
            pelicula.genero
        );

    }


    if (pelicula.subgenero) {

        campos.push(
            pelicula.subgenero
        );

    }


    if (Array.isArray(pelicula.generos)) {

        campos.push(
            ...pelicula.generos
        );

    }


    if (Array.isArray(pelicula.tags)) {

        campos.push(
            ...pelicula.tags
        );

    }


    return campos.some(
        valor =>
            normalizarTexto(
                valor
            ).includes(
                objetivo
            )
    );

}


/* =========================================================
                    NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    )
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


/* =========================================================
                    CATÁLOGO
========================================================= */

function renderizarCatalogo() {

    const listaTendencias =
        peliculas.filter(
            pelicula =>
                pelicula.tendencia === true
        );


    renderizarSeccion(
        tendencias,
        listaTendencias.length
            ? listaTendencias
            : peliculas,
        "Tendencias"
    );


    const listaEstrenos =
        peliculas.filter(
            pelicula =>
                pelicula.nuevo === true
        );


    renderizarSeccion(
        estrenos,
        listaEstrenos.length
            ? listaEstrenos
            : peliculas,
        "Estrenos"
    );


    const favoritas =
        obtenerPeliculasPorId(
            miLista
        );


    renderizarSeccion(
        miListaContenedor,
        favoritas,
        "Mi Lista"
    );


    if (
        miListaContenedor &&
        !favoritas.length
    ) {

        const mensaje =
            document.createElement(
                "p"
            );


        mensaje.className =
            "listaVacia";


        mensaje.textContent =
            "Todavía no tienes películas en Mi Lista.";


        miListaContenedor.appendChild(
            mensaje
        );

    }

}


/* =========================================================
                RENDERIZAR SECCIÓN
========================================================= */

function renderizarSeccion(
    contenedor,
    lista,
    nombre
) {

    if (!contenedor) {

        return;

    }


    contenedor.innerHTML =
        "";


    if (
        !Array.isArray(lista) ||
        !lista.length
    ) {

        console.log(
            `ℹ️ ${nombre}: sin películas`
        );

        return;

    }


    lista.forEach(
        pelicula => {

            const tarjeta =
                crearTarjetaPelicula(
                    pelicula
                );


            if (tarjeta) {

                contenedor.appendChild(
                    tarjeta
                );

            }

        }
    );


    console.log(
        `✅ ${nombre}:`,
        lista.length
    );

}


/* =========================================================
                    CREAR TARJETA
========================================================= */

function crearTarjetaPelicula(
    pelicula
) {

    if (!pelicula) {

        return null;

    }


    let tarjeta;


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
                    alt=""
                >

                <div class="movieOverlay">

                    <button
                        class="playMovie"
                        type="button"
                    >

                        <i
                            class="fa-solid fa-play"
                        ></i>

                    </button>

                </div>

            </div>

            <div class="movieInfo">

                <h3
                    class="movieTitle">
                </h3>

                <div class="movieMeta">

                    <span
                        class="movieYear">
                    </span>

                    <span
                        class="movieRating">
                    </span>

                </div>

            </div>

        `;

    }


    /*
     * POSTER
     */

    const poster =
        tarjeta.querySelector(
            ".poster"
        );


    if (poster) {

        const imagen =
            pelicula.poster ||
            pelicula.banner ||
            "";


        poster.src =
            prepararRutaImagen(
                imagen
            );


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

                    poster.onerror =
                        null;


                    poster.src =
                        prepararRutaImagen(
                            pelicula.banner
                        );

                }

            };

    }


    /*
     * TÍTULO
     */

    const titulo =
        tarjeta.querySelector(
            ".movieTitle"
        );


    if (titulo) {

        titulo.textContent =
            pelicula.titulo ||
            "Sin título";

    }


    /*
     * AÑO
     */

    const anio =
        tarjeta.querySelector(
            ".movieYear"
        );


    if (anio) {

        anio.textContent =
            pelicula.anio ||
            "";

    }


    /*
     * RATING
     */

    const rating =
        tarjeta.querySelector(
            ".movieRating"
        );


    if (rating) {

        rating.textContent =
            `⭐ ${
                pelicula.rating ||
                "0.0"
            }`;

    }


    tarjeta.dataset.id =
        pelicula.id;


    tarjeta.style.cursor =
        "pointer";


    /*
     * PLAY
     */

    const play =
        tarjeta.querySelector(
            ".playMovie"
        );


    if (play) {

        play.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                abrirPelicula(
                    pelicula
                );

            }
        );

    }


    /*
     * CLICK TARJETA
     */

    tarjeta.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    ".playMovie"
                )
            ) {

                return;

            }


            abrirPelicula(
                pelicula
            );

        }
    );


    return tarjeta;

}


/* =========================================================
                    RUTA DE IMAGEN
========================================================= */

function prepararRutaImagen(
    imagen
) {

    if (!imagen) {

        return "";

    }


    if (
        imagen.startsWith(
            "http://"
        ) ||
        imagen.startsWith(
            "https://"
        ) ||
        imagen.startsWith(
            "data:"
        )
    ) {

        return imagen;

    }


    return encodeURI(
        imagen
    );

}


/* =========================================================
                    ABRIR PELÍCULA
========================================================= */

function abrirPelicula(
    pelicula
) {

    if (!pelicula) {

        return;

    }


    if (
        pelicula.id === undefined ||
        pelicula.id === null
    ) {

        console.error(
            "❌ Película sin ID:",
            pelicula
        );

        return;

    }


    console.log(
        "🎬 Abriendo:",
        pelicula.titulo
    );


    window.location.href =
        `reproductor.html?id=${
            encodeURIComponent(
                pelicula.id
            )
        }`;

}


/* =========================================================
                        BÚSQUEDA
========================================================= */

function configurarBusqueda() {

    if (!buscar) {

        return;

    }


    buscar.addEventListener(
        "input",
        () => {

            const texto =
                normalizarTexto(
                    buscar.value
                );


            if (!texto) {

                renderizarCatalogo();

                return;

            }


            const resultados =
                peliculas.filter(
                    pelicula => {

                        const titulo =
                            normalizarTexto(
                                pelicula.titulo
                            );


                        const genero =
                            normalizarTexto(
                                pelicula.genero
                            );


                        const subgenero =
                            normalizarTexto(
                                pelicula.subgenero
                            );


                        const tags =
                            Array.isArray(
                                pelicula.tags
                            )
                                ? pelicula.tags.join(" ")
                                : "";


                        return (

                            titulo.includes(
                                texto
                            ) ||

                            genero.includes(
                                texto
                            ) ||

                            subgenero.includes(
                                texto
                            ) ||

                            normalizarTexto(
                                tags
                            ).includes(
                                texto
                            )

                        );

                    }
                );


            renderizarSeccion(
                tendencias,
                resultados,
                "Resultados"
            );


            if (estrenos) {

                estrenos.innerHTML =
                    "";

            }


            if (miListaContenedor) {

                miListaContenedor.innerHTML =
                    "";

            }

        }
    );

}


/* =========================================================
                    SLIDERS
========================================================= */

function configurarSliders() {

    configurarSlider(
        tendencias,
        "tendenciasPrev",
        "tendenciasNext"
    );


    configurarSlider(
        estrenos,
        "estrenosPrev",
        "estrenosNext"
    );

}


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

                    left:
                        -500,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    if (siguiente) {

        siguiente.addEventListener(
            "click",
            () => {

                contenedor.scrollBy({

                    left:
                        500,

                    behavior:
                        "smooth"

                });

            }
        );

    }

}


/* =========================================================
                    MI LISTA
========================================================= */

function obtenerPeliculasPorId(
    ids
) {

    if (!Array.isArray(ids)) {

        return [];

    }


    return ids
        .map(
            id => {

                return peliculas.find(
                    pelicula =>
                        String(
                            pelicula.id
                        ) ===
                        String(id)
                );

            }
        )
        .filter(Boolean);

}


/* =========================================================
                    TRAILER
========================================================= */

function abrirEnlaceVideo(
    enlace
) {

    if (!enlace) {

        return;

    }


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


    try {

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }

    catch (error) {

        window.location.href =
            url;

    }

}


/* =========================================================
                    DETALLES
========================================================= */

function configurarBotonDetalles() {

    if (!btnDetalles) {

        return;

    }


    btnDetalles.addEventListener(
        "click",
        () => {

            const seccion =
                document.querySelector(
                    ".moviesSection"
                );


            if (seccion) {

                seccion.scrollIntoView({

                    behavior:
                        "smooth"

                });

            }

        }
    );

}


/* =========================================================
                    VER TODO
========================================================= */

function configurarVerTodo() {

    document
        .querySelectorAll(
            ".verTodo"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const seccion =
                            boton.closest(
                                "section"
                            );


                        if (seccion) {

                            seccion.scrollIntoView({

                                behavior:
                                    "smooth"

                            });

                        }

                    }
                );

            }
        );

}


/* =========================================================
                ELIMINAR CONTINUAR VIENDO
========================================================= */

function ocultarContinuarViendo() {

    /*
     * Eliminamos cualquier sección
     * de continuar viendo.
     */

    document
        .querySelectorAll(
            ".continuar, #continuarSection"
        )
        .forEach(
            seccion => {

                seccion.remove();

            }
        );


    /*
     * Eliminamos solamente los
     * contenedores visuales de
     * continuar viendo.
     */

    document
        .querySelectorAll(
            "#continuarLista, #continuarVacio"
        )
        .forEach(
            elemento => {

                elemento.remove();

            }
        );


    /*
     * IMPORTANTE:
     *
     * NO borramos localStorage.
     *
     * De esta manera Mi Lista
     * y otros datos permanecen.
     */

    console.log(
        "🗑️ Continuar viendo desactivado."
    );

}


/* =========================================================
                    BOTÓN SUBIR
========================================================= */

function configurarBotonSubir() {

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

            boton.classList.toggle(
                "visible",
                window.scrollY >
                500
            );

        },
        {
            passive:
                true
        }
    );


    boton.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });

        }
    );

}


/* =========================================================
                        TOAST
========================================================= */

function mostrarToast(
    mensaje
) {

    let toast =
        document.getElementById(
            "cineverseToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "cineverseToast";


        document.body.appendChild(
            toast
        );


        toast.style.position =
            "fixed";


        toast.style.left =
            "50%";


        toast.style.bottom =
            "30px";


        toast.style.transform =
            "translateX(-50%) translateY(20px)";


        toast.style.zIndex =
            "99999";


        toast.style.padding =
            "12px 18px";


        toast.style.borderRadius =
            "12px";


        toast.style.background =
            "rgba(20,20,30,.94)";


        toast.style.border =
            "1px solid rgba(255,255,255,.12)";


        toast.style.color =
            "#fff";


        toast.style.fontSize =
            "13px";


        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,.4)";


        toast.style.opacity =
            "0";


        toast.style.transition =
            "all .3s ease";

    }


    toast.textContent =
        mensaje;


    toast.style.opacity =
        "1";


    toast.style.transform =
        "translateX(-50%) translateY(0)";


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";


                toast.style.transform =
                    "translateX(-50%) translateY(20px)";

            },
            2800
        );

}


/* =========================================================
                    PANTALLA DE CARGA
========================================================= */

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


/* =========================================================
                    INICIAR APP
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCineverse
    );

}

else {

    iniciarCineverse();

}


/* =========================================================
                        DEBUG
========================================================= */

console.log(
    "🔥 CINEVERSE APP.JS FINAL CARGADO"
);
