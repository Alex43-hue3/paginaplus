
const parametros =
new URLSearchParams(
window.location.search
);



const id =
parametros.get("id");



const pelicula =
peliculas[id];




const video =
document.getElementById("video");




if(pelicula){



document.getElementById("titulo")
.textContent =
pelicula.titulo;




document.getElementById("info")
.textContent =
pelicula.genero +
" | " +
pelicula.año;





video.src =
pelicula.video;




document.getElementById("volver")
.onclick=function(){


window.location.href =
"detalles.html?id="+id;


};




}
else{


document.getElementById("titulo")
.textContent =
"Película no encontrada";


}
