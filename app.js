/*==========================================================
                    CINEVERSE APP V1
==========================================================*/

"use strict";

/*==========================================================
                    VARIABLES
==========================================================*/

let peliculas = [];

let peliculaActual = 0;


/*==========================================================
                    ELEMENTOS HERO
==========================================================*/

const heroBackground =
document.querySelector(".heroBackground");

const heroTitulo =
document.getElementById("heroTitulo");

const heroDescripcion =
document.getElementById("heroDescripcion");

const heroRating =
document.getElementById("heroRating");

const heroYear =
document.getElementById("heroYear");

const heroDuracion =
document.getElementById("heroDuracion");

const btnVerPelicula =
document.getElementById("btnVerPelicula");

const btnTrailer =
document.getElementById("btnTrailer");

const btnDetalles =
document.getElementById("btnDetalles");


/*==========================================================
                    CONTINUAR VIENDO
==========================================================*/

const continuarPoster =
document.getElementById("continuarPoster");

const continuarTitulo =
document.getElementById("continuarTitulo");

const continuarDescripcion =
document.getElementById("continuarDescripcion");

const continuarTiempo =
document.getElementById("continuarTiempo");

const progressValue =
document.querySelector(".progressValue");


/*==========================================================
                    CONTENEDORES
==========================================================*/

const tendenciasContainer =
document.getElementById("tendenciasContainer");

const estrenosContainer =
document.getElementById("estrenosContainer");

const miListaContainer =
document.getElementById("miListaContainer");


/*==========================================================
                    BOTONES
==========================================================*/

const btnTop =
document.getElementById("btnTop");

const loader =
document.getElementById("loadingScreen");

const buscador =
document.getElementById("buscar");


/*==========================================================
                    MODAL
==========================================================*/

const modal =
document.getElementById("modal");

const modalBody =
document.getElementById("modalBody");

const cerrarModal =
document.getElementById("cerrarModal");


/*==========================================================
                    UTILIDADES
==========================================================*/

function obtenerPeliculaActual(){

return peliculas[peliculaActual];

}


function ocultarLoader(){

setTimeout(()=>{

loader.classList.add("hide");

},700);

}


function mostrarLoader(){

loader.classList.remove("hide");

}


/*==========================================================
                    MENSAJES
==========================================================*/

function mostrarError(mensaje){

console.error(mensaje);

heroTitulo.textContent =
"Error cargando películas";

heroDescripcion.textContent =
mensaje;

}


/*==========================================================
                    INICIO
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

cargarPeliculas();

}

);
/*==========================================================
                CARGAR PELÍCULAS
==========================================================*/

async function cargarPeliculas() {

    mostrarLoader();

    try {

        const respuesta = await fetch("peliculas.json");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar peliculas.json"
            );

        }

        peliculas = await respuesta.json();

        if (!Array.isArray(peliculas)) {

            throw new Error(
                "El archivo peliculas.json no contiene un arreglo."
            );

        }

        if (peliculas.length === 0) {

            throw new Error(
                "No existen películas registradas."
            );

        }

        peliculaActual = 0;

        /*==============================
            CARGAR INTERFAZ
        ==============================*/

        cargarHero();

        crearIndicadoresHero();

        crearCarruseles();

        cargarContinuarViendo();

        ocultarLoader();

    }

    catch(error){

        console.error(error);

        mostrarError(error.message);

        ocultarLoader();

    }

}


/*==========================================================
                OBTENER PELÍCULA
==========================================================*/

function obtenerPelicula(id){

    return peliculas.find(

        pelicula => pelicula.id == id

    );

}

function obtenerPeliculaActual(){

    return peliculas[peliculaActual];

}


/*==========================================================
                CAMBIAR HERO
==========================================================*/

function cambiarHero(indice){

    if(indice < 0){

        indice = peliculas.length - 1;

    }

    if(indice >= peliculas.length){

        indice = 0;

    }

    peliculaActual = indice;

    cargarHero();

}


/*==========================================================
                BOTONES HERO
==========================================================*/

document.addEventListener("click",(e)=>{

    if(e.target.closest("#heroAnterior")){

        cambiarHero(peliculaActual-1);

    }

    if(e.target.closest("#heroSiguiente")){

        cambiarHero(peliculaActual+1);

    }

});


/*==========================================================
                CAMBIO AUTOMÁTICO HERO
==========================================================*/

setInterval(()=>{

    if(peliculas.length===0) return;

    cambiarHero(

        peliculaActual+1

    );

},9000);
/*==========================================================
                    HERO PRINCIPAL
==========================================================*/

function cargarHero(){

    const pelicula = obtenerPeliculaActual();

    if(!pelicula) return;

    /*==============================
        FONDO
    ==============================*/

    if(heroBackground){

        heroBackground.style.backgroundImage =

        `linear-gradient(
            rgba(6,8,15,.35),
            rgba(6,8,15,.92)
        ),
        url('${pelicula.banner}')`;

    }

    /*==============================
        INFORMACIÓN
    ==============================*/

    heroTitulo.textContent =
    pelicula.titulo;

    heroDescripcion.textContent =
    pelicula.descripcion;

    heroRating.textContent =
    pelicula.rating;

    heroYear.textContent =
    pelicula.anio;

    heroDuracion.textContent =
    pelicula.duracion;

    /*==============================
        ANIMACIÓN
    ==============================*/

    heroTitulo.classList.remove("fade");

    heroDescripcion.classList.remove("fade");

    void heroTitulo.offsetWidth;

    heroTitulo.classList.add("fade");

    heroDescripcion.classList.add("fade");

    actualizarIndicadores();

    actualizarBotonesHero(pelicula);

}
/*==========================================================
            BOTONES HERO
==========================================================*/

function actualizarBotonesHero(pelicula){

    btnVerPelicula.onclick=()=>{

        localStorage.setItem(

            "peliculaSeleccionada",

            pelicula.id

        );

        window.location.href=

        "reproductor.html";

    };


    btnTrailer.onclick=()=>{

        if(!pelicula.trailer) return;

        window.open(

            pelicula.trailer,

            "_blank"

        );

    };


    btnDetalles.onclick=()=>{

        localStorage.setItem(

            "peliculaSeleccionada",

            pelicula.id

        );

        window.location.href=

        "detalles.html";

    };

}
/*==========================================================
        INDICADORES HERO
==========================================================*/

function crearIndicadoresHero(){

    const contenedor =

    document.getElementById(

        "heroIndicadores"

    );

    if(!contenedor) return;

    contenedor.innerHTML="";

    peliculas.forEach((pelicula,index)=>{

        const punto=

        document.createElement("button");

        punto.className="heroDot";

        if(index===peliculaActual){

            punto.classList.add("activo");

        }

        punto.onclick=()=>{

            peliculaActual=index;

            cargarHero();

        };

        contenedor.appendChild(punto);

    });

}
/*==========================================================
        ACTUALIZAR INDICADORES
==========================================================*/

function actualizarIndicadores(){

    const dots=

    document.querySelectorAll(

        ".heroDot"

    );

    dots.forEach((dot,index)=>{

        dot.classList.toggle(

            "activo",

            index===peliculaActual

        );

    });

}
/*==========================================================
                CREAR CARRUSELES
==========================================================*/

function crearCarruseles(){

    if(tendenciasContainer){

        tendenciasContainer.innerHTML="";

    }

    if(estrenosContainer){

        estrenosContainer.innerHTML="";

    }

    if(miListaContainer){

        miListaContainer.innerHTML="";

    }

    peliculas.forEach(pelicula=>{

        const tarjeta = crearTarjeta(pelicula);

        if(tendenciasContainer){

            tendenciasContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

        if(pelicula.estreno){

            estrenosContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

        if(pelicula.miLista){

            miListaContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

    });

    activarEventosTarjetas();

}
/*==========================================================
                CREAR TARJETA
==========================================================*/

function crearTarjeta(pelicula){

    const card=document.createElement("article");

    card.className="movieCard";

    card.dataset.id=pelicula.id;

    card.innerHTML=`

        <div class="moviePoster">

            <img
            src="${pelicula.poster}"
            alt="${pelicula.titulo}">

            <div class="movieOverlay">

                <div class="playMovie">

                    <i class="fa-solid fa-play"></i>

                </div>

            </div>

            <div class="favoriteMovie">

                <i class="fa-solid fa-heart"></i>

            </div>

        </div>

        <div class="movieInfo">

            <h3 class="movieTitle">

                ${pelicula.titulo}

            </h3>

            <div class="movieMeta">

                <span>

                    ⭐ ${pelicula.rating}

                </span>

                <span>

                    ${pelicula.anio}

                </span>

            </div>

            <div class="movieGenres">

                <span>

                    ${pelicula.genero}

                </span>

            </div>

        </div>

    `;

    return card;

}
/*==========================================================
            EVENTOS TARJETAS
==========================================================*/

function activarEventosTarjetas(){

    const cards=

    document.querySelectorAll(

        ".movieCard"

    );

    cards.forEach(card=>{

        card.addEventListener(

            "click",

            ()=>{

                const id=

                Number(card.dataset.id);

                abrirPelicula(id);

            }

        );

    });

}
/*==========================================================
            ABRIR PELÍCULA
==========================================================*/

function abrirPelicula(id){

    localStorage.setItem(

        "peliculaSeleccionada",

        id

    );

    window.location.href=

    "reproductor.html";

}
/*==========================================================
                FLECHAS CARRUSELES
==========================================================*/

function iniciarSliders(){

    document.querySelectorAll(".sliderWrapper").forEach(wrapper=>{

        const slider=wrapper.querySelector(".movieSlider");

        const left=wrapper.querySelector(".sliderArrow.left");

        const right=wrapper.querySelector(".sliderArrow.right");

        if(!slider) return;

        const mover=320;

        if(left){

            left.onclick=()=>{

                slider.scrollBy({

                    left:-mover,

                    behavior:"smooth"

                });

            };

        }

        if(right){

            right.onclick=()=>{

                slider.scrollBy({

                    left:mover,

                    behavior:"smooth"

                });

            };

        }

    });

}
/*==========================================================
                FAVORITOS
==========================================================*/

let favoritos=

JSON.parse(

localStorage.getItem("favoritos")

)||[];


function guardarFavoritos(){

    localStorage.setItem(

        "favoritos",

        JSON.stringify(favoritos)

    );

}


function esFavorita(id){

    return favoritos.includes(id);

}


function alternarFavorito(id){

    if(esFavorita(id)){

        favoritos=

        favoritos.filter(

            item=>item!==id

        );

    }else{

        favoritos.push(id);

    }

    guardarFavoritos();

    actualizarFavoritos();

}
/*==========================================================
            ACTUALIZAR FAVORITOS
==========================================================*/

function actualizarFavoritos(){

    document

    .querySelectorAll(".movieCard")

    .forEach(card=>{

        const id=

        Number(card.dataset.id);

        const icono=

        card.querySelector(

            ".favoriteMovie"

        );

        if(!icono) return;

        if(esFavorita(id)){

            icono.classList.add(

                "activo"

            );

        }else{

            icono.classList.remove(

                "activo"

            );

        }

    });

}
/*==========================================================
            EVENTOS FAVORITOS
==========================================================*/

document.addEventListener(

"click",

(event)=>{

const favorito=

event.target.closest(

".favoriteMovie"

);

if(!favorito) return;

event.preventDefault();

event.stopPropagation();

const card=

favorito.closest(

".movieCard"

);

if(!card) return;

alternarFavorito(

Number(card.dataset.id)

);

});
/*==========================================================
            EFECTO PLAY
==========================================================*/

document.addEventListener(

"mouseover",

(event)=>{

const card=

event.target.closest(

".movieCard"

);

if(!card) return;

card.classList.add(

"hover"

);

});

document.addEventListener(

"mouseout",

(event)=>{

const card=

event.target.closest(

".movieCard"

);

if(!card) return;

card.classList.remove(

"hover"

);

});
/*==========================================================
                CREAR CARRUSELES
==========================================================*/

function crearCarruseles(){

    /*==============================
        LIMPIAR CONTENEDORES
    ==============================*/

    if(tendenciasContainer){

        tendenciasContainer.innerHTML="";

    }

    if(estrenosContainer){

        estrenosContainer.innerHTML="";

    }

    if(miListaContainer){

        miListaContainer.innerHTML="";

    }


    /*==============================
        GENERAR TARJETAS
    ==============================*/

    peliculas.forEach(pelicula=>{

        const tarjeta=crearTarjeta(pelicula);

        if(tendenciasContainer){

            tendenciasContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

        if(

            pelicula.estreno===true &&

            estrenosContainer

        ){

            estrenosContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

        if(

            pelicula.miLista===true &&

            miListaContainer

        ){

            miListaContainer.appendChild(

                tarjeta.cloneNode(true)

            );

        }

    });


    /*==============================
        ACTIVAR FUNCIONES
    ==============================*/

    activarEventosTarjetas();

    actualizarFavoritos();

    iniciarSliders();

}
