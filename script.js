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

    let id = peliculas.indexOf(pelicula);

    window.location.href = "detalles.html?id=" + id;

});



        catalogo.appendChild(tarjeta);


    });


}



// Cargar películas al iniciar

mostrarPeliculas(peliculas);




// Filtro por categoría

function filtrar(categoria){


    if(categoria === "Todas"){

     crearSecciones();

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
function crearSecciones(){


const contenedor =
document.getElementById("secciones-cine");


contenedor.innerHTML="";



const categorias = [


{
nombre:"🔥 Más populares",
filtro:"Todas"
},


{
nombre:"🚀 Ciencia ficción",
filtro:"Ciencia ficción"
},


{
nombre:"👻 Terror",
filtro:"Terror"
},


{
nombre:"🎌 Anime",
filtro:"Anime"
},


{
nombre:"💥 Acción",
filtro:"Acción"
}


];





categorias.forEach(categoria=>{


let lista;



if(categoria.filtro==="Todas"){


lista = peliculas;


}else{


lista = peliculas.filter(

pelicula =>
pelicula.genero === categoria.filtro

);


}




if(lista.length > 0){



let bloque = document.createElement("div");


bloque.className="seccion-peliculas";



bloque.innerHTML=`


<h2>

${categoria.nombre}

</h2>


<div class="catalogo">


</div>


`;



let catalogoSeccion =
bloque.querySelector(".catalogo");





lista.forEach((pelicula)=>{


let tarjeta=document.createElement("div");


tarjeta.className="card";



tarjeta.innerHTML=`


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





tarjeta.querySelector("button")
.onclick=function(){


let id =
peliculas.indexOf(pelicula);



window.location.href =
"detalles.html?id="+id;


};



catalogoSeccion.appendChild(tarjeta);



});




contenedor.appendChild(bloque);



}



});



}
