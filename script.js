const contenedor = document.getElementById("secciones-cine");



function crearTarjeta(pelicula){


    let tarjeta = document.createElement("div");

    tarjeta.className = "card";



    tarjeta.innerHTML = `

        <img src="${pelicula.imagen}" alt="${pelicula.titulo}">


        <h3>
            ${pelicula.titulo}
        </h3>


        <p>
            ${pelicula.genero} | ${pelicula.año}
        </p>


        <button>
            Ver detalles
        </button>

    `;



    tarjeta.querySelector("button").onclick = function(){


        let id = peliculas.indexOf(pelicula);


        window.location.href =
        "detalles.html?id=" + id;


    };



    return tarjeta;

}






function crearSecciones(){


    contenedor.innerHTML = "";



    const categorias = [


        {
            nombre:"🔥 Más populares",
            genero:null
        },


        {
            nombre:"🚀 Ciencia ficción",
            genero:"Ciencia ficción"
        },


        {
            nombre:"💥 Acción",
            genero:"Acción"
        },


        {
            nombre:"👻 Terror",
            genero:"Terror"
        },


        {
            nombre:"🎌 Anime",
            genero:"Anime"
        }


    ];





    categorias.forEach(categoria=>{


        let lista;



        if(categoria.genero === null){


            lista = peliculas;


        }else{


            lista = peliculas.filter(

                pelicula => 
                pelicula.genero === categoria.genero

            );


        }




        if(lista.length > 0){



            let bloque = document.createElement("div");


            bloque.className = "seccion-peliculas";




            bloque.innerHTML = `


            <div class="titulo-seccion">


                <h2>

                ${categoria.nombre}

                </h2>



                <div class="controles">


                    <button class="izquierda">

                    ‹

                    </button>



                    <button class="derecha">

                    ›

                    </button>


                </div>


            </div>



            <div class="catalogo">


            </div>


            `;




            let fila = 
            bloque.querySelector(".catalogo");



            let izquierda =
            bloque.querySelector(".izquierda");



            let derecha =
            bloque.querySelector(".derecha");






            derecha.onclick=function(){


                fila.scrollLeft += 500;


            };



            izquierda.onclick=function(){


                fila.scrollLeft -= 500;


            };







            lista.forEach(pelicula=>{


                fila.appendChild(

                    crearTarjeta(pelicula)

                );


            });





            contenedor.appendChild(bloque);



        }



    });



}





crearSecciones();
