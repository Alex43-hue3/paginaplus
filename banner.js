
let posicionBanner=0;



function cambiarBanner(){



let pelicula =
peliculas[posicionBanner];



let banner =
document.getElementById("banner");



banner.style.backgroundImage=`

linear-gradient(
to right,
#09090d,
transparent
),

url(${pelicula.imagen})

`;





document.getElementById("titulo-banner")
.textContent =
pelicula.titulo;




document.getElementById("rating-banner")
.textContent =
"⭐ "+(pelicula.rating || "8.5");




document.getElementById("genero-banner")
.textContent =
"🎬 "+pelicula.genero;




document.getElementById("año-banner")
.textContent =
"📅 "+pelicula.año;




document.getElementById("descripcion-banner")
.textContent =
pelicula.descripcion;




document.getElementById("boton-banner")
.onclick=function(){


window.location.href =
"detalles.html?id="+posicionBanner;


};



posicionBanner++;



if(posicionBanner>=peliculas.length){


posicionBanner=0;


}



}





cambiarBanner();



setInterval(
cambiarBanner,
8000
);
