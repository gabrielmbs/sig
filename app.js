const latlngUFCG = [-7.2153658, -35.9096925];
const mymap = L.map("map", {
  center: latlngUFCG,
  zoom: 17,
});

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const openstreetmap = L.tileLayer(tileUrl, {
  attribution: attribution,
}).addTo(mymap);

function onEachFeature(feature, layer) {
  layer.bindPopup(`<h4>${feature.properties.name}</h4>`);
}

const myIcon = L.icon({
  iconUrl: "abrigo.svg",
  iconSize: [40, 50],
});
// //Criando camada de abrigos com seus Popups a partir do array de geoJsons
const abrigosLayer = L.geoJSON(abrigoList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: myIcon });
  },
});

abrigosLayer.addTo(mymap);

const baseMaps = {
  OpenStreetMap: openstreetmap,
};
const overlayMaps = {
  Abrigos: abrigosLayer,
};

L.control.layers(baseMaps, overlayMaps).addTo(mymap);
