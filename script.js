const secciones = document.getElementById("secciones-cine");



function crearTarjeta(pelicula){


    const tarjeta = document.createElement("div");

    tarjeta.className="card";


    tarjeta.innerHTML = `

    <img src="${pelicula.imagen}">


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



    tarjeta.querySelector("button").onclick=function(){


        let id = peliculas.indexOf(pelicula);


        window.location.href =
        "detalles.html?id="+id;


    };


    return tarjeta;


}




function crearSecciones(){


    secciones.innerHTML="";



    const categorias=[


        {
        titulo:"🔥 Más populares",
        genero:null
        },


        {
        titulo:"🚀 Ciencia ficción",
        genero:"Ciencia ficción"
        },


        {
        titulo:"💥 Acción",
        genero:"Acción"
        },


        {
        titulo:"👻 Terror",
        genero:"Terror"
        },


        {
        titulo:"🎌 Anime",
        genero:"Anime"
        }


    ];




    categorias.forEach(categoria=>{


        let peliculasFiltradas;



        if(categoria.genero==null){

            peliculasFiltradas=peliculas;

        }else{

            peliculasFiltradas =
            peliculas.filter(
                p=>p.genero===categoria.genero
            );

        }



        if(peliculasFiltradas.length>0){



            let bloque=document.createElement("div");


            bloque.className="seccion-peliculas";


            bloque.innerHTML=`

            <h2>
            ${categoria.titulo}
            </h2>


            <div class="catalogo">

            </div>

            `;



            let fila=bloque.querySelector(".catalogo");



            peliculasFiltradas.forEach(pelicula=>{

                fila.appendChild(
                    crearTarjeta(pelicula)
                );

            });



            secciones.appendChild(bloque);


        }



    });


}





crearSecciones();
