
const peliculaBanner = peliculas[0];


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




document.getElementById("boton-banner")
.onclick=function(){


let id = peliculas.indexOf(peliculaBanner);


window.location.href =
"detalles.html?id="+id;


};
