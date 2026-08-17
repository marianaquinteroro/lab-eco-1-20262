const BASE_URL = "https://api.jikan.moe/v4/";
const animeGrid = document.getElementById("anime-list-section");
const animeDetailSection = document.getElementById("anime-detail-section");

let animeDetail = {};

const getAnimeList = async () => {
  animeGrid.innerHTML = `
    <p>Loading anime list...</p>
    `;

  try {
    const res = await fetch(`${BASE_URL}anime`);
    const data = await res.json();
    console.log(data.data);
    if (res.ok) {
      animeGrid.innerHTML = "";
      animeList = data.data;
      animeList.forEach((anime) => {
        const animeContainer = document.createElement("div");
        animeContainer.className = "anime-container";
        const detailBtn = document.createElement("button");
        detailBtn.innerText = "See detail";
        detailBtn.addEventListener("click", () => goToDetailPage(anime.mal_id));
        animeContainer.innerHTML = `
            <img src="${anime.images.jpg.large_image_url}"/>
            <div>
              <h3>${anime.title}</h3>
              <h3>${anime.title_japanese}</h3>
              <p>${anime.synopsis}</p>
            </div>
            `;
        animeContainer.appendChild(detailBtn);
        animeGrid.appendChild(animeContainer);
      });
    }
  } catch (error) {
    console.error(error);
    const errorContainer = document.createElement("div");
    errorContainer.innerHTML = `
    <p>Sorry we can't get the anime list</p>
    <p>Please try again later</p>   
    `;
    animeGrid.appendChild(errorContainer);
  }
};

getAnimeList();

const goToDetailPage = (animeId) => {
  window.location.href = `detail.html?id=${animeId}`;
};

const getAnimeById = async () => {
  const params = new URLSearchParams(window.location.search);
  const animeId = params.get("id");

  console.log(animeId);

  try {
    const res = await fetch(`${BASE_URL}anime/${animeId}`);
    const data = await res.json();
    animeDetail = data.data;
    console.log(data.data);

    if (res.ok) {
      const animeDetailContiainer = document.createElement("div");
      animeDetailContiainer.innerHTML = `
          <h3>${animeDetail.title}</h3>
          <h3>${animeDetail.title_japanese}</h3>
          <img src="${animeDetail.images.jpg.large_image_url}"/>
          <p>${animeDetail.synopsis}</p>
          <p>Start Date : ${animeDetail.aired.from}</p>
          <p>End Date : ${animeDetail.aired.to || "No End date"}</p>
          

          `;
      animeDetailSection.appendChild(animeDetailContiainer);
    }

    if (!animeDetail) {
      const errorContainer = document.createElement("div");
      errorContainer.innerHTML = `
        <p>Sorry we can't get the anime</p>
        <p>Please try again later</p>   
        `;
      animeDetailSection.appendChild(errorContainer);
    }
  } catch (error) {
    console.error(error);
    const errorContainer = document.createElement("div");
    errorContainer.innerHTML = `
    <p>Sorry we can't get the anime</p>
    <p>Please try again later</p>   
    `;
    animeDetailSection.appendChild(errorContainer);
  }
};

if (location.pathname === "/detail.html") {
  getAnimeById();
}
