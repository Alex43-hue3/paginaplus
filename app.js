//=====================================
// LUMEN PLAY 2.0
//=====================================

let videos = [];

const contenedor = document.getElementById("contenedorVideos");

const modal = document.getElementById("modal");
const reproductor = document.getElementById("reproductor");
const cerrar = document.getElementById("cerrar");

const tituloVideo = document.getElementById("tituloVideo");
const descripcionVideo = document.getElementById("descripcionVideo");

const bannerTitulo = document.getElementById("bannerTitulo");
const bannerDescripcion = document.getElementById("bannerDescripcion");

const buscar = document.getElementById("buscar");

//==============================
// CARGAR JSON
//==============================

async function iniciar(){

    try{

        const respuesta = await fetch("data/videos.json");

        videos = await respuesta.json();

        crearBanner();

        mostrarVideos(videos);

    }

    catch(error){

        console.error(error);

    }

}

iniciar();

//==============================
// BANNER
//==============================

function crearBanner(){

    const destacado = videos.find(v=>v.destacado);

    if(!destacado) return;

    bannerTitulo.innerText = destacado.titulo;

    bannerDescripcion.innerText = destacado.descripcion;

}

//==============================
// MOSTRAR TARJETAS
//==============================

function mostrarVideos(lista){

    contenedor.innerHTML="";

    lista.forEach(video=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`

            <img src="${video.miniatura}">

            <div class="cardInfo">

                <h3>${video.titulo}</h3>

                <p>${video.categoria}</p>

                <p>${video.año} • ${video.duracion}</p>

            </div>

        `;

        card.onclick=()=>abrirVideo(video);

        contenedor.appendChild(card);

    });

}

//==============================
// ABRIR VIDEO
//==============================

function abrirVideo(video){

    modal.style.display="flex";

    tituloVideo.innerText=video.titulo;

    descripcionVideo.innerText=video.descripcion;

    crearReproductor(video);

}

//==============================
// REPRODUCTOR
//==============================

function crearReproductor(video){

    reproductor.innerHTML="";

    switch(video.tipo){

        case "youtube":

            reproducirYoutube(video.url);

        break;

        case "local":

            reproducirLocal(video.url);

        break;

        case "facebook":

            reproducirFacebook(video.url);

        break;

    }

}

//==============================
// YOUTUBE
//==============================

function reproducirYoutube(url){

    let id="";

    if(url.includes("watch?v=")){

        id=url.split("watch?v=")[1].split("&")[0];

    }

    else if(url.includes("youtu.be/")){

        id=url.split("youtu.be/")[1];

    }

    reproductor.innerHTML=`

    <iframe

    src="https://www.youtube.com/embed/${id}?autoplay=1"

    allowfullscreen>

    </iframe>

    `;

}

//==============================
// MP4
//==============================

function reproducirLocal(url){

    reproductor.innerHTML=`

    <video controls autoplay>

        <source src="${url}" type="video/mp4">

    </video>

    `;

}

//==============================
// FACEBOOK
//==============================

function reproducirFacebook(url){

    const enlace=encodeURIComponent(url);

    reproductor.innerHTML=`

    <iframe

    src="https://www.facebook.com/plugins/video.php?href=${enlace}&show_text=false"

    allowfullscreen>

    </iframe>

    `;

}

//==============================
// BUSCADOR
//==============================

buscar.addEventListener("keyup",()=>{

    const texto=buscar.value.toLowerCase();

    const resultado=videos.filter(video=>

        video.titulo.toLowerCase().includes(texto) ||

        video.categoria.toLowerCase().includes(texto)

    );

    mostrarVideos(resultado);

});

//==============================
// CERRAR
//==============================

cerrar.onclick=()=>{

    modal.style.display="none";

    reproductor.innerHTML="";

}

window.onclick=(e)=>{

    if(e.target==modal){

        modal.style.display="none";

        reproductor.innerHTML="";

    }

}