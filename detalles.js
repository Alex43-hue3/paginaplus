
const parametros =
new URLSearchParams(
window.location.search
);



const id =
parametros.get("id");



const pelicula =
peliculas[id];



if(pelicula){



document.getElementById("titulo")
.textContent =
pelicula.titulo;




document.getElementById("poster")
.src =
pelicula.imagen;




document.getElementById("fondo")
.style.backgroundImage =
`url(${pelicula.imagen})`;





document.getElementById("rating")
.textContent =
"⭐ " + pelicula.rating;




document.getElementById("genero")
.textContent =
"🎬 " + pelicula.genero;




document.getElementById("año")
.textContent =
"📅 " + pelicula.año;




document.getElementById("descripcion")
.textContent =
pelicula.descripcion;







document.getElementById("trailer")
.onclick=function(){


window.open(
pelicula.trailer,
"_blank"
);


};







document.getElementById("pelicula")
.onclick=function(){


window.location.href =
"reproductor.html?id="+id;


};




}
