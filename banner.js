
let posicionBanner = 0;


function cambiarBanner(){


    const peliculaBanner = peliculas[posicionBanner];


    const banner = document.getElementById("banner");


    banner.style.backgroundImage = `

    linear-gradient(
        to right,
        #09090d,
        transparent
    ),

    url(${peliculaBanner.imagen})

    `;



    document.getElementById("titulo-banner").textContent =
    peliculaBanner.titulo;



    document.getElementById("rating-banner").textContent =
    "⭐ " + (peliculaBanner.rating || "8.5");



    document.getElementById("genero-banner").textContent =
    "🎬 " + peliculaBanner.genero;



    document.getElementById("año-banner").textContent =
    "📅 " + peliculaBanner.año;



    document.getElementById("descripcion-banner").textContent =
    peliculaBanner.descripcion;



    document.getElementById("boton-banner").onclick=function(){


        window.location.href =
        "detalles.html?id=" + posicionBanner;


    };


    posicionBanner++;


    if(posicionBanner >= peliculas.length){

        posicionBanner = 0;

    }


}



// Cargar primer banner

cambiarBanner();



// Cambiar cada 8 segundos

setInterval(cambiarBanner,8000);
