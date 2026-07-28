const catalogo = document.getElementById("catalogo");


// Mostrar películas

function mostrarPeliculas(lista) {

    catalogo.innerHTML = "";


    lista.forEach((pelicula, index) => {


        const tarjeta = document.createElement("div");

        tarjeta.className = "card";


        tarjeta.innerHTML = `

            <img src="${pelicula.imagen}" alt="${pelicula.titulo}">


            <h3>
                ${pelicula.titulo}
            </h3>


            <p>
                ${pelicula.genero} | ${pelicula.año}
            </p>


            <p>
                ${pelicula.descripcion}
            </p>


            <button class="btn-detalle">
                Ver detalles
            </button>

        `;



        // Botón detalles

        const boton = tarjeta.querySelector(".btn-detalle");


        boton.addEventListener("click", function(){


            console.log("Abriendo:", pelicula.titulo);


            localStorage.setItem(
                "pelicula",
                peliculas.indexOf(pelicula)
            );


            window.location.href = "detalles.html";


        });



        catalogo.appendChild(tarjeta);


    });


}



// Cargar películas al iniciar

mostrarPeliculas(peliculas);




// Filtro por categoría

function filtrar(categoria){


    if(categoria === "Todas"){

        mostrarPeliculas(peliculas);

        return;

    }



    const resultado = peliculas.filter(

        pelicula => pelicula.genero === categoria

    );


    mostrarPeliculas(resultado);


}




// Buscador

const buscador = document.getElementById("buscar");


if(buscador){


    buscador.addEventListener("input", function(){


        const texto = this.value.toLowerCase();



        const resultado = peliculas.filter(

            pelicula =>

            pelicula.titulo
            .toLowerCase()
            .includes(texto)

        );



        mostrarPeliculas(resultado);



    });


}
