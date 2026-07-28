const catalogo = document.getElementById("catalogo");

console.log("Script cargado");
console.log(peliculas);


function mostrarPeliculas(lista){

    catalogo.innerHTML = "";

    lista.forEach(function(p){

        let tarjeta = document.createElement("div");

        tarjeta.className = "card";


        tarjeta.innerHTML = `

        <img src="${p.imagen}">

        <h3>${p.titulo}</h3>

        <p>${p.genero} | ${p.año}</p>

        <p>${p.descripcion}</p>

        `;


        catalogo.appendChild(tarjeta);


    });

}



mostrarPeliculas(peliculas);




function filtrar(categoria){


    if(categoria === "Todas"){

        mostrarPeliculas(peliculas);
        return;

    }


    let resultado = peliculas.filter(
        pelicula => pelicula.genero === categoria
    );


    mostrarPeliculas(resultado);

}




document
.getElementById("buscar")
.addEventListener("input", function(){


    let texto = this.value.toLowerCase();


    let resultado = peliculas.filter(

        pelicula => 
        pelicula.titulo.toLowerCase()
        .includes(texto)

    );


    mostrarPeliculas(resultado);


});
