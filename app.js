"use strict";

/*=========================================================
                    CINEVERSE - APP.JS
=========================================================*/

let peliculas = [];
let peliculaActual = null;
let indiceHero = 0;

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


/*=========================================================
                    HERO SIGUIENTE
=========================================================*/

if (heroSiguiente) {

    heroSiguiente.addEventListener("click", () => {

        if (!peliculas.length) {
            return;
        }

        indiceHero++;

        if (indiceHero >= peliculas.length) {
            indiceHero = 0;
        }

        peliculaActual =
            peliculas[indiceHero];

        mostrarHero();

        iniciarHeroAutomatico();

    });

}
/*=========================================================
                    CATÁLOGOS
=========================================================*/

const tendencias =
    document.getElementById("tendencias");

const estrenos =
    document.getElementById("estrenos");

const miListaContenedor =
    document.getElementById("miLista");


/*=========================================================
                    TEMPLATE TARJETA
=========================================================*/

const movieCardTemplate =
    document.getElementById(
        "movieCardTemplate"
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

        const datos =
            await respuesta.json();

        if (!Array.isArray(datos)) {

            throw new Error(
                "peliculas.json no contiene un arreglo"
            );

        }

        peliculas = datos;

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
                        INICIAR
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.clear();

        console.log(
            "================================"
        );

        console.log(
            "Iniciando CINEVERSE..."
        );

        console.log(
            "================================"
        );


        await cargarPeliculas();


        if (!peliculas.length) {

            console.error(
                "❌ No hay películas"
            );

            ocultarPantallaCarga();

            return;

        }


        /*-------------------------------------------------
                    PELÍCULA PRINCIPAL
        -------------------------------------------------*/

        peliculaActual =
            peliculas[0];


        /*-------------------------------------------------
                            HERO
        -------------------------------------------------*/

        mostrarHero();

/*=========================================================
                CARRUSEL AUTOMÁTICO DEL HERO
=========================================================*/

function iniciarHeroAutomatico() {

    // Detener cualquier intervalo anterior
    if (intervaloHero) {
        clearInterval(intervaloHero);
    }

    intervaloHero = setInterval(() => {

        if (!peliculas.length) {
            return;
        }

        indiceHero++;

        if (indiceHero >= peliculas.length) {
            indiceHero = 0;
        }

        peliculaActual = peliculas[indiceHero];

        mostrarHero();

    }, 7000); // 7 segundos

}
        /*-------------------------------------------------
                        CATÁLOGO
        -------------------------------------------------*/

        renderizarCatalogo();


        /*-------------------------------------------------
                    BOTONES DEL HERO
        -------------------------------------------------*/

        configurarBotonesHero();


        /*-------------------------------------------------
                        BÚSQUEDA
        -------------------------------------------------*/

        configurarBusqueda();


        /*-------------------------------------------------
                        SLIDERS
        -------------------------------------------------*/

        configurarSliders();


        /*-------------------------------------------------
                    PANTALLA DE CARGA
        -------------------------------------------------*/

        iniciarHeroAutomatico();
        ocultarPantallaCarga();


        console.log(
            "================================"
        );

        console.log(
            "✅ CINEVERSE LISTO"
        );

        console.log(
            "================================"
        );

    }
);


/*=========================================================
                BOTÓN VER PELÍCULA
=========================================================*/

if (btnVer) {

    btnVer.addEventListener(
        "click",
        () => {

            if (!peliculaActual) {

                console.error(
                    "❌ No hay película seleccionada"
                );

                return;

            }

            abrirPelicula(
                peliculaActual
            );

        }
    );

}


/*=========================================================
                            HERO
=========================================================*/

function mostrarHero() {

    if (!peliculaActual) {

        return;

    }


    /*-----------------------------------------------------
                        TÍTULO
    -----------------------------------------------------*/

    if (heroTitulo) {

        heroTitulo.textContent =
            peliculaActual.titulo ||
            "Sin título";

    }


    /*-----------------------------------------------------
                      DESCRIPCIÓN
    -----------------------------------------------------*/

    if (heroDescripcion) {

        heroDescripcion.textContent =
            peliculaActual.descripcion ||
            "Sin descripción disponible.";

    }


    /*-----------------------------------------------------
                         RATING
    -----------------------------------------------------*/

    if (heroRating) {

        heroRating.textContent =
            peliculaActual.rating ||
            "0.0";

    }


    /*-----------------------------------------------------
                           AÑO
    -----------------------------------------------------*/

    if (heroAno) {

        heroAno.textContent =
            peliculaActual.anio ||
            "";

    }


    /*-----------------------------------------------------
                        DURACIÓN
    -----------------------------------------------------*/

    if (heroDuracion) {

        heroDuracion.textContent =
            peliculaActual.duracion ||
            "";

    }


    /*-----------------------------------------------------
                    IMAGEN DEL HERO
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                         TRAILER
    -----------------------------------------------------*/

    if (btnTrailer) {

        const trailer =
            peliculaActual.trailer ||
            "";

        btnTrailer.disabled =
            !trailer;

        btnTrailer.onclick = () => {

            if (!trailer) {

                return;

            }

            abrirEnlaceVideo(
                trailer
            );

        };

    }


    console.log(
        "✅ HERO ACTUALIZADO:",
        peliculaActual.titulo
    );

}


/*=========================================================
                    HERO - BOTONES
=========================================================*/

function configurarBotonesHero() {

    const destacadas =
        peliculas.filter(
            pelicula =>
                pelicula.destacada === true
        );


    const listaHero =
        destacadas.length
            ? destacadas
            : peliculas;


    /*-----------------------------------------------------
                        ANTERIOR
    -----------------------------------------------------*/

    if (heroAnterior) {

        heroAnterior.addEventListener(
            "click",
            () => {

                if (!listaHero.length) {

                    return;

                }

                indiceHero =
                    (
                        indiceHero -
                        1 +
                        listaHero.length
                    ) %
                    listaHero.length;


                peliculaActual =
                    listaHero[
                        indiceHero
                    ];


                mostrarHero();

                actualizarIndicadoresHero();

            }
        );

    }


    /*-----------------------------------------------------
                        SIGUIENTE
    -----------------------------------------------------*/

    if (heroSiguiente) {

        heroSiguiente.addEventListener(
            "click",
            () => {

                if (!listaHero.length) {

                    return;

                }

                indiceHero =
                    (
                        indiceHero +
                        1
                    ) %
                    listaHero.length;


                peliculaActual =
                    listaHero[
                        indiceHero
                    ];


                mostrarHero();

                actualizarIndicadoresHero();

            }
        );

    }


    crearIndicadoresHero(
        listaHero
    );

}


/*=========================================================
                    INDICADORES HERO
=========================================================*/

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
                "heroIndicador" +
                (
                    index === indiceHero
                        ? " activo"
                        : ""
                );


            indicador.setAttribute(
                "aria-label",
                `Ir a ${pelicula.titulo}`
            );


            indicador.addEventListener(
                "click",
                () => {

                    indiceHero =
                        index;

                    peliculaActual =
                        lista[index];

                    mostrarHero();

                    actualizarIndicadoresHero();

                }
            );


            heroIndicadores.appendChild(
                indicador
            );

        }
    );

}


/*=========================================================
                ACTUALIZAR INDICADORES
=========================================================*/

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


/*=========================================================
                    CATÁLOGO PRINCIPAL
=========================================================*/

function renderizarCatalogo() {

    console.log(
        "🎬 Renderizando catálogo:",
        peliculas.length,
        "películas"
    );


    /*-----------------------------------------------------
                        TENDENCIAS
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                          ESTRENOS
    -----------------------------------------------------*/

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


    /*-----------------------------------------------------
                         MI LISTA
    -----------------------------------------------------*/

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


/*=========================================================
                    RENDERIZAR SECCIÓN
=========================================================*/

function renderizarSeccion(
    contenedor,
    lista,
    nombre
) {

    if (!contenedor) {

        console.warn(
            `⚠️ No existe el contenedor: ${nombre}`
        );

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
        lista.length,
        "películas"
    );

}


/*=========================================================
                    CREAR TARJETA
=========================================================*/

function crearTarjetaPelicula(
    pelicula
) {

    if (!pelicula) {

        return null;

    }


    let tarjeta;


    /*-----------------------------------------------------
                UTILIZAR TEMPLATE DEL HTML
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


        if (!tarjeta) {

            console.error(
                "❌ movieCard no encontrado"
            );

            return null;

        }

    }


    /*-----------------------------------------------------
                    RESPALDO SIN TEMPLATE
    -----------------------------------------------------*/

    else {

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
                    class="movieTitle"
                ></h3>

                <div class="movieMeta">

                    <span
                        class="movieYear"
                    ></span>

                    <span
                        class="movieRating"
                    ></span>

                </div>

            </div>

        `;

    }


    /*-----------------------------------------------------
                            POSTER
    -----------------------------------------------------*/
const poster =
    tarjeta.querySelector(".poster");

if (poster) {

    const imagen =
        pelicula.poster ||
        pelicula.banner ||
        "";

    console.log(
        "🖼️ Cargando imagen:",
        pelicula.titulo,
        "→",
        imagen
    );

    // Si es una imagen local, convertir correctamente
    // espacios y caracteres especiales de la ruta
    let rutaImagen = imagen;

    if (
        rutaImagen &&
        !rutaImagen.startsWith("http://") &&
        !rutaImagen.startsWith("https://")
    ) {
        rutaImagen = encodeURI(rutaImagen);
    }

    poster.src = rutaImagen;

    poster.alt =
        pelicula.titulo ||
        "Película";

    poster.onerror = () => {

        console.error(
            "❌ No se pudo cargar:",
            rutaImagen
        );

        // Intentar el banner como respaldo
        if (
            pelicula.banner &&
            pelicula.banner !== pelicula.poster
        ) {

            let rutaBanner =
                pelicula.banner;

            if (
                !rutaBanner.startsWith("http://") &&
                !rutaBanner.startsWith("https://")
            ) {
                rutaBanner =
                    encodeURI(rutaBanner);
            }

            poster.onerror = null;

            poster.src =
                rutaBanner;
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
            `⭐ ${
                pelicula.rating ||
                "0.0"
            }`;

    }


    /*-----------------------------------------------------
                    IDENTIFICACIÓN
    -----------------------------------------------------*/

    tarjeta.dataset.id =
        pelicula.id;


    tarjeta.style.cursor =
        "pointer";


    /*-----------------------------------------------------
                         BOTÓN PLAY
    -----------------------------------------------------*/

    const play =
        tarjeta.querySelector(
            ".playMovie"
        );


    if (play) {

        play.type =
            "button";


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


    /*-----------------------------------------------------
                    TODA LA TARJETA
    -----------------------------------------------------*/

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


/*=========================================================
                    ABRIR PELÍCULA
=========================================================*/

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
        pelicula.titulo,
        "ID:",
        pelicula.id
    );


    window.location.href =
        `reproductor.html?id=${
            encodeURIComponent(
                pelicula.id
            )
        }`;

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
                    .trim()
                    .toLowerCase();


            /*---------------------------------------------
                    RESTAURAR CATÁLOGO
            ---------------------------------------------*/

            if (!texto) {

                renderizarCatalogo();

                return;

            }


            /*---------------------------------------------
                        BUSCAR
            ---------------------------------------------*/

            const resultados =
                peliculas.filter(
                    pelicula => {

                        const titulo =
                            String(
                                pelicula.titulo ||
                                ""
                            ).toLowerCase();


                        const genero =
                            String(
                                pelicula.genero ||
                                ""
                            ).toLowerCase();


                        const subgenero =
                            String(
                                pelicula.subgenero ||
                                ""
                            ).toLowerCase();


                        const tags =
                            Array.isArray(
                                pelicula.tags
                            )
                                ? pelicula.tags
                                    .join(" ")
                                    .toLowerCase()
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
                            tags.includes(
                                texto
                            )
                        );

                    }
                );


            /*---------------------------------------------
                    MOSTRAR RESULTADOS
            ---------------------------------------------*/

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


/*=========================================================
                    SLIDERS
=========================================================*/

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


/*=========================================================
                CONTROL DEL CARRUSEL
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
                    OBTENER PELÍCULAS
=========================================================*/

function obtenerPeliculasPorId(
    ids
) {

    if (!Array.isArray(ids)) {

        return [];

    }


    return ids
        .map(
            id =>

                peliculas.find(
                    pelicula =>

                        String(
                            pelicula.id
                        ) ===
                        String(id)

                )

        )
        .filter(Boolean);

}


/*=========================================================
                    ABRIR TRAILER
=========================================================*/

function abrirEnlaceVideo(
    enlace
) {

    if (!enlace) {

        return;

    }


    let url =
        String(enlace);


    /*-----------------------------------------------------
                EXTRAER URL DE MARKDOWN
    -----------------------------------------------------*/

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
                        DEBUG
=========================================================*/

console.log(
    "🔥 APP.JS CINEVERSE V3 CARGADO"
);
