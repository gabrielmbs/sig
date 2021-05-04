//Cria o mapa centralizado na UFCG
const mymap = L.map("map", {
  center: [-7.2153658, -35.9096925],
  zoom: 18,
});
//Link do mapbox, necessario colocar token
const myToken =
  "pk.eyJ1IjoiZ2FicmllbG1icyIsImEiOiJja280dTF4NHowZDY3Mm9tem5nMjQ5cW1nIn0.3g5SU3I9U6-BwkvN2aJRrQ";
const tileUrl = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${myToken}`;
const attribution =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

//Criar camada de fundo
const camadaSimples = L.tileLayer(tileUrl, {
  id: "mapbox/light-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: attribution,
});
const camadaDetalhada = L.tileLayer(tileUrl, {
  id: "mapbox/streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: attribution,
});
//setando camada inicial
camadaDetalhada.addTo(mymap);

// Criando lista de abrigos
function generateList() {
  const ul = document.querySelector(".list");
  abrigoList.forEach((abrigo) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");
    a.addEventListener("click", () => {
      irParaAbrigo(abrigo);
    });
    div.classList.add("abrigo-item");
    a.innerText = abrigo.properties.name;
    a.href = "#";
    p.innerText = abrigo.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}
generateList();

//Função ir até o abrigo no mapa, duration é o tempo da animação
function irParaAbrigo(abrigo) {
  const lat = abrigo.geometry.coordinates[0];
  const lng = abrigo.geometry.coordinates[1];
  mymap.flyTo([lng, lat], 18, {
    duration: 3,
  });
  setTimeout(() => {
    L.popup({ closeButton: false, offset: L.point(0, -18) })
      .setLatLng([lng, lat])
      .setContent(makePopupContent(abrigo))
      .openOn(mymap);
  }, 3000);
}

//Criando conteudo dos popup
function makePopupContent(abrigo) {
  return `
      <div>
          <h4>${abrigo.properties.name}</h4>
          <p>${abrigo.properties.address}</p>
          <div class="phone-number">
              <a href="tel:${abrigo.properties.phone}">${abrigo.properties.phone}</a>
          </div>
      </div>
    `;
}
//Criando o Popup para cada abrigo
function onEachFeature(feature, layer) {
  layer.bindPopup(makePopupContent(feature), {
    closeButton: false,
    offset: L.point(0, -8),
  });
}
//Criando o Icone personalizado
const myIcon = L.icon({
  iconUrl: "abrigo.svg",
  iconSize: [40, 50],
});
//Criando camada de abrigos com seus Popups a partir do array de geoJsons
const abrigosLayer = L.geoJSON(abrigoList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: myIcon });
  },
});
//Adiciono a camada ao mapa
abrigosLayer.addTo(mymap);

//Criando as opções de fundos para mapa, tipo radio só pode um
const baseMaps = {
  "<span style='color: gray'>Simples</span>": camadaSimples,
  Detalhado: camadaDetalhada,
};
//Criando as camadas que vão sobrepor a camada de fundo, checkbox pode varios
const overlayMaps = {
  Abrigos: abrigosLayer,
};
//Adiciono ao mapa o controle sobre as camadas, pode ser apenas um,
//  mas é necessario passar null no primeiro para ignorar
L.control.layers(baseMaps, overlayMaps).addTo(mymap);
