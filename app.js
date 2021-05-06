const latlng = [-7.2153658, -35.9096925];

const map = L.map("map", {
  center: latlng,
  zoom: 15,
});
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const layer = L.tileLayer(tileUrl, {
  attribution: attribution,
}).addTo(map);

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.name);
}

const myIcon = L.icon({
  iconUrl: "abrigo.svg",
  iconSize: [40, 50],
});

const abrigos = L.geoJSON(abrigoList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: myIcon });
  },
}).addTo(map);
map.fitBounds(abrigos.getBounds());

const baseMap = {
  OpenStreetMap: layer,
};

const overlay = {
  Abrigos: abrigos,
};

L.control.layers(baseMap, overlay).addTo(map);
