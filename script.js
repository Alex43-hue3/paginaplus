
const catalogo=document.getElementById("catalogo");


function mostrarPeliculas(lista){


catalogo.innerHTML="";


lista.forEach(p=>{


catalogo.innerHTML+=`

<div class="card">


<img src="${p.imagen}">


<h3>${p.titulo}</h3>


<p>
${p.genero} | ${p.año}
</p>


<p>
${p.descripcion}
</p>


</div>


`;


});


}



mostrarPeliculas(peliculas);





function filtrar(categoria){


if(categoria=="Todas"){

mostrarPeliculas(peliculas);

return;

}



let resultado=
peliculas.filter(
p=>p.genero==categoria
);


mostrarPeliculas(resultado);


}




document
.getElementById("buscar")
.addEventListener(
"input",
function(){


let texto=this.value.toLowerCase();


let resultado=
peliculas.filter(
p=>
p.titulo.toLowerCase()
.includes(texto)
);


mostrarPeliculas(resultado);


});
