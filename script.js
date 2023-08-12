//INSTANCIA FUNCIONAL DE AXIOS LISTA PARA USAR
const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  timeout: 1000,
  headers: {'X-API-KEY': 'live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP'}
});

const RANDOM_URL =
  "https://api.thecatapi.com/v1/images/search?limit=3&api_key=live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP";
const FAVORITES_URL =
  "https://api.thecatapi.com/v1/favourites?order=DESC&limit=6";
const DELETE_URL = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const UPLOAD_URL = "https://api.thecatapi.com/v1/images/upload";

const spanError = document.getElementById("error");

async function loadRandomCats() {
  const res = await fetch(RANDOM_URL);
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const btnSave = document.getElementById("btnSave");
    img1.src = data[0].url;
    btnSave.onclick = () => saveFavorite(data[0].id);
  }
}

async function loadFavoriteCats() {
  try {
    const res = await fetch(FAVORITES_URL, {
      method: "GET",
      headers: {
        "X-API-KEY":
          "live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP",
      },
    });

    const data = await res.json();
    const div = document.getElementById("favorites");
    data.forEach((cat) => {
      const col = document.createElement("div");
      col.id = "imagenesFavoritas";
      const img = document.createElement("img");
      const btn = document.createElement("button");
      btn.id = "btnUnsave";
      btn.innerHTML += `<i class="bi bi-arrow-through-heart"></i>`;

      img.src = cat.image.url;
      col.appendChild(img);
      col.appendChild(btn);
      div.appendChild(col);
      btn.onclick = () => deleteFavorite(cat.id);
    });
  } catch (error) {
    (error) => (spanError.innerHTML = "Hubo un error");
  }
}

async function saveFavorite(id) {
  const {data,status} = await api.post('/favourites',{
    image_id: id,
  });

  if(status != 200){
    spanError.innerHTML = "Hubo un error "+ status + data.message;
  }else{
    location.reload();
  }
  
  /* try {
    const res = await fetch(FAVORITES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY":
          "live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP",
      },
      body: JSON.stringify({
        image_id: id,
      }),
    });
    const data = await res.json();
    location.reload();
  } catch (error) {
    (error) => (spanError.innerHTML = "Hubo un error");
  } */
}

async function deleteFavorite(id) {
  try {
    const res = await fetch(DELETE_URL(id), {
      method: "DELETE",
      headers: {
        "X-API-KEY":
          "live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP",
      },
    });
    const data = await res.json();
    console.log(data);
    location.reload();
  } catch (error) {
    (error) => (spanError.innerHTML = "Hubo un error");
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById("uploadCatForm");
  const formData = new FormData(form);
  console.log(formData.get("file"));

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      //'Content-Type':'multipart/form-data',
      "X-API-KEY":
        "live_LBXij45vU8Jj6JZYDiYT13UX3du7PIzDa1vNOducD62ciFh3ZPAZM50RoghltRaP",
    },
    body: formData,
  });
  const data = await res.json();

  if (res.status !== 201) {    
    spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`;
  } else {
    console.log("Foto de michi cargada :)");
    console.log({ data });
    console.log(data.url);
    saveFavorite(data.id); //para agregar el michi cargado a favoritos.
  }
}

loadRandomCats();
loadFavoriteCats();

/*Uno de los headers que determinaremos al enviar datos es el Content Type, es decir, 
que tipo de dato será lo que enviaremos, para que el backend pueda decir: Ah! Me están
 enviando un tipo de dato X, entonces debo leer el body de esta manera.*/
