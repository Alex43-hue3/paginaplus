
document.getElementById("fondo").style.backgroundImage =
`url(${pelicula.imagen})`;



document.getElementById("detalle").onclick=function(){

window.location.href =
"detalles.html?id="+id;

};



document.getElementById("siguiente").onclick=function(){


let siguiente =
Number(id)+1;


if(siguiente >= peliculas.length){

siguiente=0;

}



window.location.href =
"reproductor.html?id="+siguiente;



};
