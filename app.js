/* =========================================================
                    CINEVERSE
                 APP.JS COMPLETO
========================================================= */

"use strict";


/* =========================================================
                    CONFIGURACIÓN
========================================================= */

const JSON_URL = "peliculas.json";

let peliculas = [];
let peliculaActual = 0;

let heroTimer = null;
let heroPausa = false;


/* =========================================================
                    INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🎬 Iniciando CINEVERSE...");

    iniciarCineverse();

});


/* =========================================================
                INICIAR CINEVERSE
========================================================= */

async function iniciarCineverse() {

    try {

        mostrarLoading(true);

        await cargarPeliculas();

        console.log(
            "🎞️ Películas cargadas:",
            peliculas.length
        );


        /* HERO */

        inicializarHero();


        /* SECCIONES */

        cargarTendencias();

        cargarEstrenos();

        cargarMiLista();


        /*
         * CONTINUAR VIENDO
         *
         * Se desactiva completamente.
         * Ya no utilizaremos historial ni
         * porcentaje de reproducción.
         */

        ocultarContinuarViendo();


        /* CATEGORÍAS */

        inicializarCategorias();


        /* CARRUSELES */

        inicializarCarruseles();


        /* BÚSQUEDA */

        inicializarBusqueda();


        /* BOTÓN ARRIBA */

        inicializarBotonTop();


        /* MODAL */

        inicializarModal();


        /* BOTONES GENERALES */

        inicializarBotonesGenerales();


        ocultarLoading();


        console.log(
            "✅ CINEVERSE listo"
        );


    } catch (error) {

        console.error(
            "❌ Error iniciando CINEVERSE:",
            error
        );

        mostrarLoading(false);

    }

}


/* =========================================================
                    CARGAR JSON
========================================================= */

async function cargarPeliculas() {

    try {

        const respuesta =
            await fetch(
                `${JSON_URL}?v=${Date.now()}`
            );


        if (!respuesta.ok) {

            throw new Error(
                `HTTP ${respuesta.status}`
            );

        }


        peliculas =
            await respuesta.json();


        if (!Array.isArray(peliculas)) {

            throw new Error(
                "peliculas.json no contiene un array"
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
            "❌ Error cargando peliculas.json:",
            error
        );

        peliculas = [];

        throw error;

    }

}


/* =========================================================
                    UTILIDADES
========================================================= */

function obtenerTitulo(pelicula) {

    return (

        pelicula.titulo ||

        pelicula.title ||

        pelicula.nombre ||

        "Sin título"

    );

}


function obtenerPoster(pelicula) {

    return (

        pelicula.poster ||

        pelicula.portada ||

        pelicula.imagen ||

        pelicula.posterUrl ||

        ""

    );

}


function obtenerBanner(pelicula) {

    return (

        pelicula.banner ||

        pelicula.backdrop ||

        pelicula.hero ||

        pelicula.fondo ||

        obtenerPoster(pelicula)

    );

}


function obtenerDescripcion(pelicula) {

    return (

        pelicula.descripcion ||

        pelicula.description ||

        pelicula.sinopsis ||

        "Sin descripción disponible."

    );

}


function obtenerAnio(pelicula) {

    return (

        pelicula.año ||

        pelicula.anio ||

        pelicula.year ||

        pelicula.estreno ||

        ""

    );

}


function obtenerRating(pelicula) {

    return (

        pelicula.rating ||

        pelicula.calificacion ||

        pelicula.puntuacion ||

        "0.0"

    );

}


function obtenerDuracion(pelicula) {

    return (

        pelicula.duracion ||

        pelicula.duration ||

        pelicula.runtime ||

        ""

    );

}


function obtenerGenero(pelicula) {

    return (

        pelicula.genero ||

        pelicula.generos ||

        pelicula.genre ||

        "Película"

    );

}


function obtenerFuente(pelicula) {

    return (

        pelicula.url ||

        pelicula.video ||

        pelicula.videoUrl ||

        pelicula.src ||

        pelicula.link ||

        pelicula.fuente ||

        ""

    );

}


function obtenerTrailer(pelicula) {

    return (

        pelicula.trailer ||

        pelicula.trailerUrl ||

        pelicula.youtube ||

        pelicula.youtubeUrl ||

        ""

    );

}


/* =========================================================
                        HERO
========================================================= */

function inicializarHero() {

    if (!peliculas.length) {

        console.warn(
            "⚠️ No hay películas para el HERO"
        );

        return;

    }


    const anterior =
        document.getElementById(
            "heroAnterior"
        );


    const siguiente =
        document.getElementById(
            "heroSiguiente"
        );


    anterior?.addEventListener(
        "click",
        () => cambiarHero(-1)
    );


    siguiente?.addEventListener(
        "click",
        () => cambiarHero(1)
    );


    const hero =
        document.getElementById(
            "hero"
        );


    hero?.addEventListener(
        "mouseenter",
        () => {

            heroPausa = true;

        }
    );


    hero?.addEventListener(
        "mouseleave",
        () => {

            heroPausa = false;

        }
    );


    actualizarHero();

    iniciarHeroAutomatico();

}


function actualizarHero() {

    if (!peliculas.length) return;


    const pelicula =
        peliculas[peliculaActual];


    const titulo =
        document.getElementById(
            "heroTitulo"
        );


    const rating =
        document.getElementById(
            "heroRating"
        );


    const anio =
        document.getElementById(
            "heroAno"
        );


    const duracion =
        document.getElementById(
            "heroDuracion"
        );


    const descripcion =
        document.getElementById(
            "heroDescripcion"
        );


    const fondo =
        document.getElementById(
            "heroBackground"
        );


    if (titulo) {

        titulo.textContent =
            obtenerTitulo(
                pelicula
            );

    }


    if (rating) {

        rating.textContent =
            obtenerRating(
                pelicula
            );

    }


    if (anio) {

        anio.textContent =
            obtenerAnio(
                pelicula
            );

    }


    if (duracion) {

        duracion.textContent =
            obtenerDuracion(
                pelicula
            ) ||
            "Película";

    }


    if (descripcion) {

        descripcion.textContent =
            obtenerDescripcion(
                pelicula
            );

    }


    if (fondo) {

        const banner =
            obtenerBanner(
                pelicula
            );


        if (banner) {

            fondo.style.backgroundImage =
                `url("${banner}")`;

        }

    }


    actualizarIndicadores();

}


function cambiarHero(direccion) {

    if (!peliculas.length) return;


    peliculaActual += direccion;


    if (
        peliculaActual >=
        peliculas.length
    ) {

        peliculaActual = 0;

    }


    if (peliculaActual < 0) {

        peliculaActual =
            peliculas.length - 1;

    }


    actualizarHero();

}


function iniciarHeroAutomatico() {

    detenerHeroAutomatico();


    heroTimer =
        setInterval(
            () => {

                if (!heroPausa) {

                    cambiarHero(1);

                }

            },
            7000
        );

}


function detenerHeroAutomatico() {

    if (heroTimer) {

        clearInterval(
            heroTimer
        );

        heroTimer = null;

    }

}


function actualizarIndicadores() {

    const contenedor =
        document.getElementById(
            "heroIndicadores"
        );


    if (!contenedor) return;


    const indicadores =
        contenedor.querySelectorAll(
            "span"
        );


    indicadores.forEach(
        (
            indicador,
            indice
        ) => {

            indicador.classList.toggle(
                "activo",
                indice ===
                peliculaActual
            );

        }
    );

}


/* =========================================================
                BOTONES DEL HERO
========================================================= */

function inicializarBotonesGenerales() {

    const btnVer =
        document.getElementById(
            "btnVer"
        );


    const btnTrailer =
        document.getElementById(
            "btnTrailer"
        );


    const btnDetalles =
        document.getElementById(
            "btnDetalles"
        );


    btnVer?.addEventListener(
        "click",
        () => {

            abrirPelicula(
                peliculas[
                    peliculaActual
                ]
            );

        }
    );


    btnTrailer?.addEventListener(
        "click",
        () => {

            abrirTrailer(
                peliculas[
                    peliculaActual
                ]
            );

        }
    );


    btnDetalles?.addEventListener(
        "click",
        () => {

            mostrarDetalles(
                peliculas[
                    peliculaActual
                ]
            );

        }
    );

}


/* =========================================================
                    ABRIR PELÍCULA
========================================================= */

function abrirPelicula(pelicula) {

    if (!pelicula) return;


    const indice =
        peliculas.indexOf(
            pelicula
        );


    if (indice >= 0) {

        localStorage.setItem(
            "cineverseUltimaPelicula",
            String(indice)
        );

    }


    localStorage.setItem(
        "cineversePeliculaSeleccionada",
        JSON.stringify(
            pelicula
        )
    );


    const id =
        pelicula.id ||
        pelicula.slug ||
        indice;


    window.location.href =
        `reproductor.html?id=${encodeURIComponent(id)}`;

}


/* =========================================================
                        TRAILER
========================================================= */

function abrirTrailer(pelicula) {

    if (!pelicula) return;


    const trailer =
        obtenerTrailer(
            pelicula
        );


    if (!trailer) {

        mostrarToast(
            "Esta película no tiene tráiler disponible."
        );

        return;

    }


    window.open(
        trailer,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
                    TENDENCIAS
========================================================= */

function cargarTendencias() {

    const contenedor =
        document.getElementById(
            "tendencias"
        );


    if (!contenedor) return;


    contenedor.innerHTML = "";


    const lista =
        peliculas.slice(
            0,
            Math.min(
                10,
                peliculas.length
            )
        );


    lista.forEach(
        pelicula => {

            contenedor.appendChild(
                crearTarjetaPelicula(
                    pelicula
                )
            );

        }
    );

}


/* =========================================================
                    ESTRENOS
========================================================= */

function cargarEstrenos() {

    const contenedor =
        document.getElementById(
            "estrenos"
        );


    if (!contenedor) return;


    contenedor.innerHTML = "";


    const lista =
        [...peliculas]
            .sort(
                (a, b) =>

                    Number(
                        obtenerAnio(
                            b
                        )
                    )

                    -

                    Number(
                        obtenerAnio(
                            a
                        )
                    )

            )
            .slice(
                0,
                Math.min(
                    10,
                    peliculas.length
                )
            );


    lista.forEach(
        pelicula => {

            contenedor.appendChild(
                crearTarjetaPelicula(
                    pelicula
                )
            );

        }
    );

}


/* =========================================================
                CREAR TARJETA
========================================================= */

function crearTarjetaPelicula(
    pelicula
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "movieCard";


    const poster =
        obtenerPoster(
            pelicula
        );


    const titulo =
        obtenerTitulo(
            pelicula
        );


    const anio =
        obtenerAnio(
            pelicula
        );


    const rating =
        obtenerRating(
            pelicula
        );


    tarjeta.innerHTML = `

        <div class="moviePoster">

            <img
                class="poster"
                src="${poster}"
                alt="${titulo}"
                loading="lazy"
            >

            <div class="movieOverlay">

                <button
                    class="playMovie"
                    type="button"
                    aria-label="Ver ${titulo}"
                >

                    <i class="fa-solid fa-play"></i>

                </button>

            </div>

        </div>


        <div class="movieInfo">

            <h3 class="movieTitle">

                ${titulo}

            </h3>


            <div class="movieMeta">

                <span class="movieYear">

                    ${anio}

                </span>


                <span class="movieRating">

                    ⭐ ${rating}

                </span>

            </div>

        </div>

    `;


    tarjeta.addEventListener(
        "click",
        () => {

            abrirPelicula(
                pelicula
            );

        }
    );


    return tarjeta;

}


/* =========================================================
                        MI LISTA
========================================================= */

function cargarMiLista() {

    const contenedor =
        document.getElementById(
            "miLista"
        );


    if (!contenedor) return;


    contenedor.innerHTML = "";


    const favoritos =
        obtenerMiLista();


    if (!favoritos.length) {

        contenedor.innerHTML = `

            <div class="miListaVacia">

                <i class="fa-regular fa-heart"></i>

                <p>

                    Todavía no tienes
                    películas en tu lista.

                </p>

            </div>

        `;

        return;

    }


    favoritos.forEach(
        pelicula => {

            contenedor.appendChild(
                crearTarjetaPelicula(
                    pelicula
                )
            );

        }
    );

}


function obtenerMiLista() {

    try {

        return (

            JSON.parse(
                localStorage.getItem(
                    "cineverseMiLista"
                )
            ) || []

        );

    } catch {

        return [];

    }

}


/* =========================================================
              CONTINUAR VIENDO DESACTIVADO
========================================================= */

/*
 * Esta función se mantiene solamente para
 * evitar errores si alguna parte antigua
 * de la página intenta llamarla.
 *
 * Ya NO carga historial.
 * Ya NO muestra porcentajes.
 * Ya NO crea tarjetas.
 */

function cargarContinuarViendo() {

    ocultarContinuarViendo();

}


function ocultarContinuarViendo() {

    const seccion =
        document.getElementById(
            "continuarSection"
        );


    if (seccion) {

        seccion.style.display =
            "none";

    }


    /*
     * También ocultamos cualquier
     * contenedor antiguo que pudiera
     * haber quedado en el HTML.
     */

    const listas =
        document.querySelectorAll(
            "#continuarLista"
        );


    listas.forEach(
        lista => {

            lista.innerHTML = "";

        }
    );


    const vacio =
        document.getElementById(
            "continuarVacio"
        );


    if (vacio) {

        vacio.style.display =
            "none";

    }

}


/* =========================================================
                    CATEGORÍAS
========================================================= */

/*
 * Categorías oficiales de CINEVERSE.
 *
 * Los iconos se agregan desde JS para que
 * el diseño permanezca consistente aunque
 * el HTML tenga solamente el texto.
 */

const CATEGORIAS_CINEVERSE = {

    "accion": {

        icono:
            "fa-solid fa-bolt",

        clase:
            "accion"

    },

    "ciencia-ficcion": {

        icono:
            "fa-solid fa-rocket",

        clase:
            "ciencia"

    },

    "ciencia ficcion": {

        icono:
            "fa-solid fa-rocket",

        clase:
            "ciencia"

    },

    "ciencia": {

        icono:
            "fa-solid fa-rocket",

        clase:
            "ciencia"

    },

    "fantasia": {

        icono:
            "fa-solid fa-wand-magic-sparkles",

        clase:
            "fantasia"

    },

    "fantasía": {

        icono:
            "fa-solid fa-wand-magic-sparkles",

        clase:
            "fantasia"

    },

    "terror": {

        icono:
            "fa-solid fa-ghost",

        clase:
            "terror"

    },

    "animacion": {

        icono:
            "fa-solid fa-clapperboard",

        clase:
            "animacion"

    },

    "animación": {

        icono:
            "fa-solid fa-clapperboard",

        clase:
            "animacion"

    },

    "anime": {

        icono:
            "fa-solid fa-dragon",

        clase:
            "anime"

    }

};


/* =========================================================
                INICIALIZAR CATEGORÍAS
========================================================= */

function inicializarCategorias() {

    const categorias =
        document.querySelectorAll(
            ".universoCard"
        );


    if (!categorias.length) {

        console.warn(
            "⚠️ No se encontraron categorías."
        );

        return;

    }


    categorias.forEach(
        card => {

            prepararCategoria(
                card
            );


            card.addEventListener(
                "click",
                () => {

                    const genero =
                        card.dataset.genero;


                    if (!genero) {

                        console.log(
                            "⚠️ Categoría sin género"
                        );

                        return;

                    }


                    console.log(
                        "🎬 Género seleccionado:",
                        genero
                    );


                    localStorage.setItem(
                        "cineverseGeneroSeleccionado",
                        genero
                    );


                    /*
                     * Dejamos preparado el enlace
                     * para conectar posteriormente
                     * con peliculas.html.
                     *
                     * No lo activamos todavía para
                     * no alterar el funcionamiento
                     * actual.
                     */

                    // window.location.href =
                    // `peliculas.html?genero=${encodeURIComponent(genero)}`;

                }
            );

        }
    );


    prepararFlechasUniversos();

}


/* =========================================================
            PREPARAR TARJETA DE CATEGORÍA
========================================================= */

function prepararCategoria(
    card
) {

    let genero =
        card.dataset.genero;


    if (!genero) {

        const titulo =
            card.querySelector(
                "h3"
            );


        if (titulo) {

            genero =
                titulo.textContent
                    .trim()
                    .toLowerCase();

            card.dataset.genero =
                genero;

        }

    }


    if (!genero) return;


    const clave =
        genero
            .trim()
            .toLowerCase();


    const categoria =
        CATEGORIAS_CINEVERSE[
            clave
        ];


    if (!categoria) return;


    /*
     * Aplicamos clase correspondiente.
     */

    if (
        categoria.clase &&
        !card.classList.contains(
            categoria.clase
        )
    ) {

        card.classList.add(
            categoria.clase
        );

    }


    /*
     * Si ya existe icono no creamos
     * otro.
     */

    if (
        card.querySelector(
            ".universoIcon"
        )
    ) {

        return;

    }


    const info =
        card.querySelector(
            ".universoInfo"
        );


    if (!info) return;


    const icono =
        document.createElement(
            "div"
        );


    icono.className =
        "universoIcon";


    icono.innerHTML = `

        <i class="${categoria.icono}"></i>

    `;


    /*
     * Lo colocamos al principio
     * de la información.
     */

    info.insertBefore(
        icono,
        info.firstChild
    );

}


/* =========================================================
            FLECHAS UNIVERSOS
========================================================= */

function prepararFlechasUniversos() {

    const grid =
        document.querySelector(
            ".universosGrid"
        );


    if (!grid) return;


    const section =
        grid.closest(
            ".universos"
        );


    if (!section) return;


    /*
     * Si las flechas ya existen,
     * solamente las conectamos.
     */

    let anterior =
        document.getElementById(
            "universosAnterior"
        );


    let siguiente =
        document.getElementById(
            "universosSiguiente"
        );


    /*
     * Si NO existen, las creamos.
     */

    if (!anterior) {

        anterior =
            document.createElement(
                "button"
            );


        anterior.id =
            "universosAnterior";


        anterior.className =
            "universosFlecha universosFlechaIzquierda";


        anterior.type =
            "button";


        anterior.setAttribute(
            "aria-label",
            "Categorías anteriores"
        );


        anterior.innerHTML = `

            <i class="fa-solid fa-chevron-left"></i>

        `;

    }


    if (!siguiente) {

        siguiente =
            document.createElement(
                "button"
            );


        siguiente.id =
            "universosSiguiente";


        siguiente.className =
            "universosFlecha universosFlechaDerecha";


        siguiente.type =
            "button";


        siguiente.setAttribute(
            "aria-label",
            "Siguientes categorías"
        );


        siguiente.innerHTML = `

            <i class="fa-solid fa-chevron-right"></i>

        `;

    }


    /*
     * Creamos un contenedor para
     * las flechas si todavía no existe.
     */

    let controles =
        section.querySelector(
            ".universosControles"
        );


    if (!controles) {

        controles =
            document.createElement(
                "div"
            );


        controles.className =
            "universosControles";


        section.appendChild(
            controles
        );

    }


    /*
     * Movemos las flechas al
     * contenedor correcto.
     */

    if (
        !controles.contains(
            anterior
        )
    ) {

        controles.appendChild(
            anterior
        );

    }


    if (
        !controles.contains(
            siguiente
        )
    ) {

        controles.appendChild(
            siguiente
        );

    }


    /*
     * Evitamos registrar eventos
     * duplicados.
     */

    if (
        anterior.dataset.cineverseReady !==
        "true"
    ) {

        anterior.addEventListener(
            "click",
            event => {

                event.preventDefault();

                moverUniversos(
                    -1
                );

            }
        );


        anterior.dataset.cineverseReady =
            "true";

    }


    if (
        siguiente.dataset.cineverseReady !==
        "true"
    ) {

        siguiente.addEventListener(
            "click",
            event => {

                event.preventDefault();

                moverUniversos(
                    1
                );

            }
        );


        siguiente.dataset.cineverseReady =
            "true";

    }


    actualizarEstadoFlechasUniversos();

}


/* =========================================================
                MOVER UNIVERSOS
========================================================= */

function moverUniversos(
    direccion
) {

    const grid =
        document.querySelector(
            ".universosGrid"
        );


    if (!grid) return;


    /*
     * Calculamos el desplazamiento
     * según el tamaño real de las tarjetas.
     */

    const tarjeta =
        grid.querySelector(
            ".universoCard"
        );


    let cantidad;


    if (tarjeta) {

        const ancho =
            tarjeta.getBoundingClientRect()
                .width;


        const estilos =
            window.getComputedStyle(
                grid
            );


        const gap =
            parseFloat(
                estilos.columnGap ||
                estilos.gap ||
                "16"
            );


        cantidad =
            ancho + gap;

    } else {

        cantidad =
            Math.max(
                240,
                grid.clientWidth * 0.75
            );

    }


    grid.scrollBy({

        left:
            cantidad *
            direccion,

        behavior:
            "smooth"

    });


    setTimeout(
        actualizarEstadoFlechasUniversos,
        350
    );

}


/* =========================================================
            ESTADO DE FLECHAS UNIVERSOS
========================================================= */

function actualizarEstadoFlechasUniversos() {

    const grid =
        document.querySelector(
            ".universosGrid"
        );


    if (!grid) return;


    const anterior =
        document.getElementById(
            "universosAnterior"
        );


    const siguiente =
        document.getElementById(
            "universosSiguiente"
        );


    const margen =
        5;


    if (anterior) {

        anterior.disabled =
            grid.scrollLeft <=
            margen;

    }


    if (siguiente) {

        siguiente.disabled =
            grid.scrollLeft +
            grid.clientWidth >=
            grid.scrollWidth -
            margen;

    }

}


/* =========================================================
                    CARRUSELES
========================================================= */

function inicializarCarruseles() {

    /*
     * Universos
     */

    prepararFlechasUniversos();


    /*
     * Tendencias
     */

    configurarCarrusel(
        "tendencias",
        "tendenciasPrev",
        "tendenciasNext"
    );


    /*
     * Estrenos
     */

    configurarCarrusel(
        "estrenos",
        "estrenosPrev",
        "estrenosNext"
    );


    /*
     * Ya NO inicializamos
     * Continuar viendo.
     */

}


/* =========================================================
                CARRUSEL GENERAL
========================================================= */

function configurarCarrusel(
    listaId,
    anteriorId,
    siguienteId
) {

    const lista =
        document.getElementById(
            listaId
        );


    const anterior =
        document.getElementById(
            anteriorId
        );


    const siguiente =
        document.getElementById(
            siguienteId
        );


    if (!lista) return;


    function mover(
        direccion
    ) {

        const tarjeta =
            lista.querySelector(
                ".movieCard"
            );


        let cantidad;


        if (tarjeta) {

            const ancho =
                tarjeta.getBoundingClientRect()
                    .width;


            const estilos =
                window.getComputedStyle(
                    lista
                );


            const gap =
                parseFloat(
                    estilos.gap ||
                    "16"
                );


            cantidad =
                ancho + gap;

        } else {

            cantidad =
                Math.max(
                    250,
                    lista.clientWidth * 0.75
                );

        }


        lista.scrollBy({

            left:
                cantidad *
                direccion,

            behavior:
                "smooth"

        });

    }


    anterior?.addEventListener(
        "click",
        () => mover(-1)
    );


    siguiente?.addEventListener(
        "click",
        () => mover(1)
    );

}


/* =========================================================
                    BÚSQUEDA
========================================================= */

function inicializarBusqueda() {

    const buscador =
        document.getElementById(
            "buscar"
        );


    if (!buscador) return;


    buscador.addEventListener(
        "input",
        () => {

            const texto =
                buscador.value
                    .trim()
                    .toLowerCase();


            if (!texto) {

                restaurarPeliculas();

                return;

            }


            const resultados =
                peliculas.filter(
                    pelicula => {

                        const titulo =
                            obtenerTitulo(
                                pelicula
                            )
                            .toLowerCase();


                        const genero =
                            String(
                                obtenerGenero(
                                    pelicula
                                )
                            )
                            .toLowerCase();


                        return (

                            titulo.includes(
                                texto
                            )

                            ||

                            genero.includes(
                                texto
                            )

                        );

                    }
                );


            mostrarResultadosBusqueda(
                resultados
            );

        }
    );

}


/* =========================================================
            MOSTRAR RESULTADOS BÚSQUEDA
========================================================= */

function mostrarResultadosBusqueda(
    resultados
) {

    const tendencias =
        document.getElementById(
            "tendencias"
        );


    if (!tendencias) return;


    tendencias.innerHTML =
        "";


    if (!resultados.length) {

        tendencias.innerHTML = `

            <div class="sinResultados">

                <i class="fa-solid fa-film"></i>

                <p>
                    No encontramos películas.
                </p>

            </div>

        `;

        return;

    }


    resultados.forEach(
        pelicula => {

            tendencias.appendChild(
                crearTarjetaPelicula(
                    pelicula
                )
            );

        }
    );

}


/* =========================================================
            RESTAURAR PELÍCULAS
========================================================= */

function restaurarPeliculas() {

    cargarTendencias();

}


/* =========================================================
                        MODAL
========================================================= */

function inicializarModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    const cerrar =
        document.getElementById(
            "cerrarModal"
        );


    if (!modal) return;


    cerrar?.addEventListener(
        "click",
        cerrarModal
    );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                cerrarModal();

            }

        }
    );

}


/* =========================================================
                    MOSTRAR DETALLES
========================================================= */

function mostrarDetalles(
    pelicula
) {

    if (!pelicula) return;


    const modal =
        document.getElementById(
            "modal"
        );


    const body =
        document.getElementById(
            "modalBody"
        );


    if (!modal || !body) return;


    body.innerHTML = `

        <div class="modalMovie">

            <img
                src="${obtenerPoster(pelicula)}"
                alt="${obtenerTitulo(pelicula)}"
            >


            <div>

                <h2>

                    ${obtenerTitulo(pelicula)}

                </h2>


                <p>

                    ${obtenerDescripcion(pelicula)}

                </p>


                <div>

                    <strong>
                        Año:
                    </strong>

                    ${obtenerAnio(pelicula)}

                </div>

            </div>

        </div>

    `;


    modal.classList.add(
        "activo"
    );

}


/* =========================================================
                    CERRAR MODAL
========================================================= */

function cerrarModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    modal?.classList.remove(
        "activo"
    );

}


/* =========================================================
                    BOTÓN TOP
========================================================= */

function inicializarBotonTop() {

    const boton =
        document.getElementById(
            "btnTop"
        );


    if (!boton) return;


    window.addEventListener(
        "scroll",
        () => {

            boton.classList.toggle(
                "visible",
                window.scrollY > 500
            );

        }
    );


    boton.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top:0,

                behavior:
                    "smooth"

            });

        }
    );

}


/* =========================================================
                    LOADING
========================================================= */

function mostrarLoading(
    mostrar
) {

    const loading =
        document.getElementById(
            "loadingScreen"
        );


    if (!loading) return;


    if (mostrar) {

        loading.style.display =
            "flex";

    } else {

        loading.style.display =
            "none";

    }

}


function ocultarLoading() {

    const loading =
        document.getElementById(
            "loadingScreen"
        );


    if (!loading) return;


    loading.classList.add(
        "oculto"
    );


    setTimeout(
        () => {

            loading.style.display =
                "none";

        },
        500
    );

}


/* =========================================================
                        TOAST
========================================================= */

function mostrarToast(
    mensaje
) {

    const toast =
        document.getElementById(
            "cineverseToast"
        );


    if (!toast) {

        console.log(
            mensaje
        );

        return;

    }


    toast.textContent =
        mensaje;


    toast.classList.add(
        "mostrar"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "mostrar"
            );

        },
        3000
    );

}


/* =========================================================
            ACTUALIZAR FLECHAS AL REDIMENSIONAR
========================================================= */

window.addEventListener(
    "resize",
    () => {

        actualizarEstadoFlechasUniversos();

    }
);


/* =========================================================
                EXPOSICIÓN GLOBAL
========================================================= */

window.CINEVERSE = {

    peliculas,

    abrirPelicula,

    abrirTrailer,

    mostrarDetalles,

    cargarMiLista,

    /*
     * Se conserva el nombre para evitar
     * errores con código anterior,
     * pero ya no muestra historial.
     */

    cargarContinuarViendo,

    cambiarHero,

    mostrarToast

};


console.log(
    "🚀 CINEVERSE APP.JS cargado correctamente"
);
