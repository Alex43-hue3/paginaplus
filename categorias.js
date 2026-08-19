"use strict";

/* =========================================================
                    CINEVERSE
                CATEGORÍAS.JS
========================================================= */

let peliculas = [];
let categoriaActual = "";


/* =========================================================
                    CONFIGURACIÓN
========================================================= */

const CATEGORIAS = {

    "accion": {
        nombre: "Acción",
        descripcion:
            "Explosiones, persecuciones y adrenalina."
    },

    "ciencia ficcion": {
        nombre: "Ciencia ficción",
        descripcion:
            "Viajes espaciales, tecnología y mundos futuristas."
    },

    "ciencia-ficcion": {
        nombre: "Ciencia ficción",
        descripcion:
            "Viajes espaciales, tecnología y mundos futuristas."
    },

    "cienciaficcion": {
        nombre: "Ciencia ficción",
        descripcion:
            "Viajes espaciales, tecnología y mundos futuristas."
    },

    "fantasia": {
        nombre: "Fantasía",
        descripcion:
            "Magia, criaturas increíbles y aventuras épicas."
    },

    "terror": {
        nombre: "Terror",
        descripcion:
            "Suspenso, misterio y miedo hasta el último minuto."
    },

    "animacion": {
        nombre: "Animación",
        descripcion:
            "Historias animadas para disfrutar a cualquier edad."
    },

    "anime": {
        nombre: "Anime",
        descripcion:
            "Aventuras, mundos extraordinarios y personajes inolvidables."
    }

};


/* =========================================================
                    DOM
========================================================= */

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryDescription =
    document.getElementById("categoryDescription");

const popularMovies =
    document.getElementById("popularMovies");

const allMovies =
    document.getElementById("allMovies");

const movieCount =
    document.getElementById("movieCount");

const emptyState =
    document.getElementById("emptyState");

const emptyText =
    document.getElementById("emptyText");

const loadingScreen =
    document.getElementById("loadingScreen");

const popularPrev =
    document.getElementById("popularPrev");

const popularNext =
    document.getElementById("popularNext");

const movieCardTemplate =
    document.getElementById("movieCardTemplate");


/* =========================================================
                    INICIAR
========================================================= */

async function iniciarCategoria() {

    console.log(
        "===================================="
    );

    console.log(
        "🎬 CINEVERSE - CATEGORÍA"
    );

    console.log(
        "===================================="
    );


    try {

        obtenerCategoria();

        actualizarEncabezado();

        await cargarPeliculas();

        mostrarPeliculas();

        configurarSlider();

        ocultarLoading();


        console.log(
            "✅ CATEGORÍA CARGADA:",
            categoriaActual
        );


    } catch (error) {

        console.error(
            "❌ Error cargando categoría:",
            error
        );

        mostrarError();

        ocultarLoading();

    }

}


/* =========================================================
                OBTENER CATEGORÍA
========================================================= */

function obtenerCategoria() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    let categoria =
        parametros.get("genero") ||
        parametros.get("categoria") ||
        parametros.get("genre") ||
        "";


    categoria =
        normalizarTexto(
            categoria
        );


    categoriaActual =
        categoria;


    console.log(
        "🎬 Categoría detectada:",
        categoriaActual
    );


    return categoriaActual;

}


/* =========================================================
                ACTUALIZAR ENCABEZADO
========================================================= */

function actualizarEncabezado() {

    const datos =
        CATEGORIAS[
            categoriaActual
        ];


    if (datos) {

        if (categoryTitle) {

            categoryTitle.textContent =
                datos.nombre;

        }


        if (categoryDescription) {

            categoryDescription.textContent =
                datos.descripcion;

        }


        document.title =
            `CINEVERSE - ${datos.nombre}`;

        return;

    }


    /* -----------------------------------------------------
                    SI NO EXISTE
    ----------------------------------------------------- */

    if (categoryTitle) {

        categoryTitle.textContent =
            "Categoría";

    }


    if (categoryDescription) {

        categoryDescription.textContent =
            "Descubre películas seleccionadas para ti.";

    }

}


/* =========================================================
                CARGAR PELÍCULAS
========================================================= */

async function cargarPeliculas() {

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
            "peliculas.json debe contener un arreglo."
        );

    }


    peliculas =
        datos;


    console.log(
        "🎬 Películas encontradas:",
        peliculas.length
    );

}


/* =========================================================
                MOSTRAR PELÍCULAS
========================================================= */

function mostrarPeliculas() {

    const resultados =
        peliculas.filter(
            pelicula =>
                coincideCategoria(
                    pelicula,
                    categoriaActual
                )
        );


    console.log(
        "🎬 Películas de categoría:",
        resultados.length
    );


    if (!resultados.length) {

        mostrarEstadoVacio();

        return;

    }


    ocultarEstadoVacio();


    /* -----------------------------------------------------
                    ORDENAR POPULARES
    ----------------------------------------------------- */

    const populares =
        [...resultados]
            .sort(
                (a, b) =>
                    obtenerNumero(
                        b.rating
                    ) -
                    obtenerNumero(
                        a.rating
                    )
            );


    /* -----------------------------------------------------
                    MOSTRAR MÁS VISTAS
    ----------------------------------------------------- */

    renderizarPeliculas(
        popularMovies,
        populares.slice(
            0,
            Math.min(
                8,
                populares.length
            )
        )
    );


    /* -----------------------------------------------------
                    MOSTRAR TODAS
    ----------------------------------------------------- */

    renderizarPeliculas(
        allMovies,
        resultados
    );


    /* -----------------------------------------------------
                    CONTADOR
    ----------------------------------------------------- */

    if (movieCount) {

        movieCount.textContent =
            resultados.length === 1
                ? "1 película"
                : `${resultados.length} películas`;

    }

}


/* =========================================================
                COMPROBAR CATEGORÍA
========================================================= */

function coincideCategoria(
    pelicula,
    categoria
) {

    if (!pelicula) {

        return false;

    }


    const objetivo =
        normalizarTexto(
            categoria
        );


    if (!objetivo) {

        return false;

    }


    const campos = [];


    /* género */

    if (pelicula.genero) {

        campos.push(
            pelicula.genero
        );

    }


    /* subgénero */

    if (pelicula.subgenero) {

        campos.push(
            pelicula.subgenero
        );

    }


    /* géneros */

    if (
        Array.isArray(
            pelicula.generos
        )
    ) {

        campos.push(
            ...pelicula.generos
        );

    }


    /* tags */

    if (
        Array.isArray(
            pelicula.tags
        )
    ) {

        campos.push(
            ...pelicula.tags
        );

    }


    /* -----------------------------------------------------
                    COMPARACIÓN
    ----------------------------------------------------- */

    return campos.some(
        campo => {

            const valor =
                normalizarTexto(
                    campo
                );


            return (
                valor === objetivo ||
                valor.includes(
                    objetivo
                ) ||
                objetivo.includes(
                    valor
                )
            );

        }
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
        .replace(
            /[_-]+/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
                    NÚMEROS
========================================================= */

function obtenerNumero(
    valor
) {

    const numero =
        parseFloat(
            String(
                valor || ""
            ).replace(
                ",",
                "."
            )
        );


    return Number.isFinite(
        numero
    )
        ? numero
        : 0;

}


/* =========================================================
                RENDERIZAR PELÍCULAS
========================================================= */

function renderizarPeliculas(
    contenedor,
    lista
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


/* =========================================================
                    CREAR TARJETA
========================================================= */

function crearTarjeta(
    pelicula
) {

    let tarjeta = null;


    /* -----------------------------------------------------
                    USAR TEMPLATE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
                    FALLBACK
    ----------------------------------------------------- */

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

                    <button
                        class="playMovie"
                        type="button">

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


    /* -----------------------------------------------------
                        POSTER
    ----------------------------------------------------- */

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
            prepararImagen(
                imagen
            );


        poster.alt =
            pelicula.titulo ||
            "Película";


        poster.loading =
            "lazy";


        poster.onerror =
            () => {

                if (
                    pelicula.banner &&
                    pelicula.banner !== pelicula.poster
                ) {

                    poster.onerror =
                        null;

                    poster.src =
                        prepararImagen(
                            pelicula.banner
                        );

                }

            };

    }


    /* -----------------------------------------------------
                        TÍTULO
    ----------------------------------------------------- */

    const titulo =
        tarjeta.querySelector(
            ".movieTitle"
        );


    if (titulo) {

        titulo.textContent =
            pelicula.titulo ||
            "Sin título";

    }


    /* -----------------------------------------------------
                        AÑO
    ----------------------------------------------------- */

    const anio =
        tarjeta.querySelector(
            ".movieYear"
        );


    if (anio) {

        anio.textContent =
            pelicula.anio ||
            "";

    }


    /* -----------------------------------------------------
                        RATING
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
                        DATA
    ----------------------------------------------------- */

    if (
        pelicula.id !== undefined
    ) {

        tarjeta.dataset.id =
            pelicula.id;

    }


    /* -----------------------------------------------------
                    CURSOR
    ----------------------------------------------------- */

    tarjeta.style.cursor =
        "pointer";


    /* -----------------------------------------------------
                        PLAY
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
                    TARJETA
    ----------------------------------------------------- */

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
                PREPARAR IMAGEN
========================================================= */

function prepararImagen(
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

        mostrarToast(
            "Esta película no tiene un ID válido."
        );

        return;

    }


    window.location.href =
        `reproductor.html?id=${
            encodeURIComponent(
                pelicula.id
            )
        }`;

}


/* =========================================================
                    SLIDER
========================================================= */

function configurarSlider() {

    if (!popularMovies) {

        return;

    }


    if (popularPrev) {

        popularPrev.addEventListener(
            "click",
            () => {

                popularMovies.scrollBy({

                    left:
                        -500,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    if (popularNext) {

        popularNext.addEventListener(
            "click",
            () => {

                popularMovies.scrollBy({

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
                ESTADO VACÍO
========================================================= */

function mostrarEstadoVacio() {

    if (popularMovies) {

        popularMovies.innerHTML =
            "";

    }


    if (allMovies) {

        allMovies.innerHTML =
            "";

    }


    const popularSection =
        document.getElementById(
            "popularSection"
        );


    if (popularSection) {

        popularSection.style.display =
            "none";

    }


    const allSection =
        document.getElementById(
            "allSection"
        );


    if (allSection) {

        allSection.style.display =
            "none";

    }


    if (emptyState) {

        emptyState.hidden =
            false;

    }


    if (emptyText) {

        const datos =
            CATEGORIAS[
                categoriaActual
            ];


        emptyText.textContent =
            datos
                ? `Todavía no hay películas de ${datos.nombre}.`
                : "Todavía no hay películas en esta categoría.";

    }

}


/* =========================================================
                OCULTAR ESTADO VACÍO
========================================================= */

function ocultarEstadoVacio() {

    const popularSection =
        document.getElementById(
            "popularSection"
        );


    if (popularSection) {

        popularSection.style.display =
            "";

    }


    const allSection =
        document.getElementById(
            "allSection"
        );


    if (allSection) {

        allSection.style.display =
            "";

    }


    if (emptyState) {

        emptyState.hidden =
            true;

    }

}


/* =========================================================
                    ERROR
========================================================= */

function mostrarError() {

    if (categoryTitle) {

        categoryTitle.textContent =
            "No se pudo cargar";

    }


    if (categoryDescription) {

        categoryDescription.textContent =
            "Ocurrió un problema al cargar esta categoría.";

    }


    if (emptyState) {

        emptyState.hidden =
            false;

    }


    if (emptyText) {

        emptyText.textContent =
            "Verifica que peliculas.json y categorias.js estén disponibles.";

    }

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

    }


    toast.textContent =
        mensaje;


    toast.classList.add(
        "visible"
    );


    clearTimeout(
        toast._timeout
    );


    toast._timeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "visible"
                );

            },
            3000
        );

}


/* =========================================================
                    LOADING
========================================================= */

function ocultarLoading() {

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
        700
    );

}


/* =========================================================
                    INICIO
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarCategoria
    );

} else {

    iniciarCategoria();

}


/* =========================================================
                    DEBUG
========================================================= */

console.log(
    "🔥 CINEVERSE categorias.js cargado correctamente"
);
