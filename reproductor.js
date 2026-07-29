
const parametros = new URLSearchParams(
    window.location.search
);


const id = parametros.get("id");


const pelicula = peliculas[id];


const video = document.getElementById("video");



if (pelicula) {


    // Titulo

    document.getElementById("titulo").textContent =
    pelicula.titulo;



    // Informacion

    document.getElementById("info").textContent =
    pelicula.genero + " | " + pelicula.año +
    " | ⭐ " + pelicula.rating;



    // Fondo

    document.getElementById("fondo").style.backgroundImage =
    `url(${pelicula.imagen})`;



    // Video

    video.src = pelicula.video;

    video.load();



    // Volver

    document.getElementById("volver").onclick=function(){

        window.location.href =
        "detalles.html?id="+id;

    };



    // Boton detalles

    document.getElementById("detalle").onclick=function(){

        window.location.href =
        "detalles.html?id="+id;

    };



    // Siguiente pelicula

    document.getElementById("siguiente").onclick=function(){


        let siguiente = Number(id)+1;



        if(siguiente >= peliculas.length){

            siguiente = 0;

        }



        window.location.href =
        "reproductor.html?id="+siguiente;


    };


}
else{


    document.getElementById("titulo").textContent =
    "Película no encontrada";


}
