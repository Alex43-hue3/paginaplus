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

<button class="detalle-btn">
Ver detalles
</button>

`;

        catalogo.appendChild(tarjeta);

tarjeta.querySelector(".detalle-btn")
.addEventListener("click",()=>{

let id = peliculas.indexOf(p);

localStorage.setItem("pelicula", id);

window.location.href="detalles.html";

});
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


   const catalogo = document.getElementById("catalogo");


function mostrarPeliculas(lista){

    catalogo.innerHTML = "";


    lista.forEach((p, index)=>{


        let tarjeta = document.createElement("div");

        tarjeta.className = "card";


        tarjeta.innerHTML = `

        <img src="${p.imagen}">

        <h3>${p.titulo}</h3>

        <p>${p.genero} | ${p.año}</p>

        <button>
        Ver detalles
        </button>

        `;


        let boton = tarjeta.querySelector("button");


        boton.onclick = function(){

            console.log("Click en:", p.titulo);


            localStorage.setItem(
                "pelicula",
                index
            );


            window.location.href="detalles.html";

        };


        catalogo.appendChild(tarjeta);


    });


}


mostrarPeliculas(peliculas);


window.location.href="detalles.html";


}
});
