"use strict";

/* =========================================================
                    CINEVERSE
                  CATEGORIA.JS
========================================================= */

let peliculas = [];


/* =========================================================
                    CONFIGURACIÓN
========================================================= */

const CATEGORIAS = {

    accion: {
        nombre: "Acción",
        descripcion:
            "Explosiones, persecuciones y adrenalina."
    },

    "ciencia ficcion": {
        nombre: "Ciencia ficción",
        descripcion:
            "Viajes espaciales y mundos futuristas."
    },

    fantasia: {
        nombre: "Fantasía",
        descripcion:
            "Dragones, magia y aventuras épicas."
    },

    terror: {
        nombre: "Terror",
        descripcion:
            "Suspenso y miedo hasta el último minuto."
    },

    animacion: {
        nombre: "Animación",
        descripcion:
            "Historias para disfrutar a cualquier edad."
    },

    anime: {
        nombre: "Anime",
        descripcion:
            "Aventuras, mundos y personajes inolvidables."
    }

};


/* =========================================================
                    ELEMENTOS DOM
========================================================= */

const loadingScreen =
    document.getElementById(
        "loadingScreen"
    );


const categoriaTitulo =
    document.getElementById(
        "categoriaTitulo"
    );


const categoriaDescripcion =
    document.getElementById(
        "categoriaDescripcion"
    );


const peliculasDestacadas =
    document.getElementById(
        "peliculasDestacadas"
    );


const todasPeliculas =
    document.getElementById(
        "todasPeliculas"
    );


const mensajeVacio =
    document.getElementById(
        "mensajeVacio"
    );


const mensajeVacioTitulo =
    document.getElementById(
        "mensajeVacioTitulo"
    );


const mensajeVacioTexto =
    document.getElementById(
        "mensajeVacioTexto"
    );


const btnVolver =
    document.getElementById(
        "btnVolver"
    );


const btnVolverInicio =
    document.getElementById(
        "btnVolverInicio"
    );


const movieCardTemplate =
    document.getElementById(
        "movieCardTemplate"
    );


/* =========================================================
                    INICIAR
========================================================= */

function iniciarCategoria() {

    console.log(
        "🎬 CINEVERSE - Página de categoría"
    );


    /* -----------------------------------------------------
                    BOTÓN VOLVER
    ----------------------------------------------------- */

    configurarBotonesVolver();


    /* -----------------------------------------------------
                    OBTENER CATEGORÍA
    ----------------------------------------------------- */

    const genero =
        obtenerGeneroURL();


    console.log(
        "🎬 Categoría:",
        genero
    );


    /* -----------------------------------------------------
                    CARGAR PELÍCULAS
    ----------------------------------------------------- */

    cargarPeliculas()
        .then(() => {

            procesarCategoria(
                genero
            );

            ocultarPantallaCarga();

        })
        .catch(error => {

            console.error(
                "❌ Error:",
                error
            );

            mostrarError();

            ocultarPantallaCarga();

        });

}


/* =========================================================
                OBTENER GÉNERO DE URL
========================================================= */

function obtenerGeneroURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    let genero =
        parametros.get(
            "genero"
        );


    if (!genero) {

        genero =
            parametros.get(
                "categoria"
            );

    }


    if (!genero) {

        genero =
            "accion";

    }


    return normalizarTexto(
        decodeURIComponent(
            genero
        )
    );

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


        const datos =
            await respuesta.json();


        if (!Array.isArray(datos)) {

            throw new Error(
                "peliculas.json no contiene un arreglo válido."
            );

        }


        peliculas =
            datos;


        console.log(
            "✅ Películas cargadas:",
            peliculas.length
        );

    }
    catch (error) {

        console.error(
            "❌ Error cargando películas:",
            error
        );

        peliculas = [];


        throw error;

    }

}


/* =========================================================
                PROCESAR CATEGORÍA
========================================================= */

function procesarCategoria(
    genero
) {

    const informacion =
        CATEGORIAS[genero];


    let nombre =
        informacion
            ? informacion.nombre
            : capitalizar(
                genero
            );


    let descripcion =
        informacion
            ? informacion.descripcion
            : `Películas de ${nombre}.`;


    /* -----------------------------------------------------
                    ENCABEZADO
    ----------------------------------------------------- */

    if (categoriaTitulo) {

        categoriaTitulo.textContent =
            nombre;

    }


    if (categoriaDescripcion) {

        categoriaDescripcion.textContent =
            descripcion;

    }


    document.title =
        `${nombre} | CINEVERSE`;


    /* -----------------------------------------------------
                    FILTRAR PELÍCULAS
    ----------------------------------------------------- */

    const resultados =
        peliculas.filter(
            pelicula =>
                peliculaCoincideGenero(
                    pelicula,
                    genero
                )
        );


    console.log(
        `🎬 Películas de ${nombre}:`,
        resultados.length
    );


    /* -----------------------------------------------------
                    SIN RESULTADOS
    ----------------------------------------------------- */

    if (!resultados.length) {

        mostrarCategoriaVacia(
            nombre
        );

        return;

    }


    ocultarCategoriaVacia();


    /* -----------------------------------------------------
                    MÁS VISTAS
    ----------------------------------------------------- */

    const masVistas =
        resultados
            .filter(
                pelicula =>
                    pelicula.tendencia === true ||
                    pelicula.destacada === true ||
                    pelicula.mostViewed === true
            );


    /*
     * Si todavía no tenemos suficientes
     * películas marcadas como tendencia,
     * usamos las primeras películas de
     * la categoría como respaldo.
     */

    const destacadas =
        masVistas.length
            ? masVistas
            : resultados.slice(
                0,
                Math.min(
                    6,
                    resultados.length
                )
            );


    renderizarPeliculas(
        peliculasDestacadas,
        destacadas
    );


    /* -----------------------------------------------------
                    TODAS LAS PELÍCULAS
    ----------------------------------------------------- */

    renderizarPeliculas(
        todasPeliculas,
        resultados
    );

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


    /* -----------------------------------------------------
                        GENERO
    ----------------------------------------------------- */

    if (pelicula.genero) {

        campos.push(
            pelicula.genero
        );

    }


    /* -----------------------------------------------------
                    SUBGENERO
    ----------------------------------------------------- */

    if (pelicula.subgenero) {

        campos.push(
            pelicula.subgenero
        );

    }


    /* -----------------------------------------------------
                    GENEROS
    ----------------------------------------------------- */

    if (
        Array.isArray(
            pelicula.generos
        )
    ) {

        campos.push(
            ...pelicula.generos
        );

    }


    /* -----------------------------------------------------
                        TAGS
    ----------------------------------------------------- */

    if (
        Array.isArray(
            pelicula.tags
        )
    ) {

        campos.push(
            ...pelicula.tags
        );

    }


    return campos.some(
        valor => {

            const texto =
                normalizarTexto(
                    valor
                );


            return (
                texto === objetivo ||
                texto.includes(
                    objetivo
                ) ||
                objetivo.includes(
                    texto
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
            /[_-]/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
                    CAPITALIZAR
========================================================= */

function capitalizar(
    texto
) {

    return String(
        texto || ""
    )
        .split(" ")
        .map(
            palabra =>
                palabra.charAt(0)
                    .toUpperCase() +
                palabra.slice(1)
        )
        .join(" ");

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

    if (!pelicula) {

        return null;

    }


    let tarjeta = null;


    /* -----------------------------------------------------
                    USAR TEMPLATE
    ----------------------------------------------------- */

    if (movieCardTemplate) {

        const clon =
            movieCardTemplate.content
                .cloneNode(true);


        tarjeta =
            clon.querySelector(
                ".movieCard"
            );

    }


    /* -----------------------------------------------------
                CREAR TARJETA MANUAL
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
                    alt=""
                >

                <div class="movieOverlay">

                    <button
                        class="playMovie"
                        type="button">

                        <i class="fa-solid fa-play"></i>

                    </button>

                </div>

            </div>

            <div class="movieInfo">

                <h3 class="movieTitle">
                </h3>

                <div class="movieMeta">

                    <span class="movieYear">
                    </span>

                    <span class="movieRating">
                    </span>

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
                    ID PELÍCULA
    ----------------------------------------------------- */

    if (
        pelicula.id !== undefined &&
        pelicula.id !== null
    ) {

        tarjeta.dataset.id =
            pelicula.id;

    }


    tarjeta.style.cursor =
        "pointer";


    /* -----------------------------------------------------
                    BOTÓN PLAY
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
                    CLICK TARJETA
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


    window.location.href =
        `reproductor.html?id=${
            encodeURIComponent(
                pelicula.id
            )
        }`;

}


/* =========================================================
                    BOTONES VOLVER
========================================================= */

function configurarBotonesVolver() {

    /* -----------------------------------------------------
                    BOTÓN PRINCIPAL
    ----------------------------------------------------- */

    if (btnVolver) {

        btnVolver.addEventListener(
            "click",
            () => {

                volverInicio();

            }
        );

    }


    /* -----------------------------------------------------
                    BOTÓN EXTRA
    ----------------------------------------------------- */

    if (btnVolverInicio) {

        btnVolverInicio.addEventListener(
            "click",
            () => {

                volverInicio();

            }
        );

    }

}


/* =========================================================
                    VOLVER INICIO
========================================================= */

function volverInicio() {

    window.location.href =
        "index.html";

}


/* =========================================================
                CATEGORÍA VACÍA
========================================================= */

function mostrarCategoriaVacia(
    nombre
) {

    if (peliculasDestacadas) {

        peliculasDestacadas.innerHTML =
            "";

    }


    if (todasPeliculas) {

        todasPeliculas.innerHTML =
            "";

    }


    if (mensajeVacioTitulo) {

        mensajeVacioTitulo.textContent =
            "Aún no hay películas";

    }


    if (mensajeVacioTexto) {

        mensajeVacioTexto.textContent =
            `Todavía no hay películas de ${nombre}.`;

    }


    if (mensajeVacio) {

        mensajeVacio.style.display =
            "flex";

    }

}


/* =========================================================
                OCULTAR MENSAJE VACÍO
========================================================= */

function ocultarCategoriaVacia() {

    if (mensajeVacio) {

        mensajeVacio.style.display =
            "none";

    }

}


/* =========================================================
                    ERROR
========================================================= */

function mostrarError() {

    if (mensajeVacioTitulo) {

        mensajeVacioTitulo.textContent =
            "No se pudo cargar el catálogo";

    }


    if (mensajeVacioTexto) {

        mensajeVacioTexto.textContent =
            "Ocurrió un problema al cargar las películas. Intenta nuevamente.";

    }


    if (mensajeVacio) {

        mensajeVacio.style.display =
            "flex";

    }

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
        700
    );

}


/* =========================================================
                    INICIAR
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
    "🔥 categoria.js cargado correctamente"
);
