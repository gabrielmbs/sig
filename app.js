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

// ####### USANDO geoJSON
// https://leafletjs.com/reference-1.7.1.html#geojson

const cidadesLayer = L.geoJSON(municipios, {
  // style: (feature) => {
  //   return {color: 'red'};
  // }
  style: style
}).bindPopup((layer) => {
  return `<div class="tooltip"> <b>${layer.feature.properties.nome}</b> <br /> População: ${layer.feature.properties.populacao}</div>`;
}).addTo(mymap)

function getColor (d) {
  return d > 800000   ? '#800026' :
         d > 300000   ? '#BD0026' :
         d > 100000    ? '#E31A1C' :
         d > 30000    ? '#FC4E2A' :
         d > 10000    ? '#FD8D3C' :
         d > 6000    ? '#FEB24C' :
         d > 3000     ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.populacao),
    color: 'white',
    fillOpacity: 0.7,
    weight: 2
  }
}

mymap.fitBounds(cidadesLayer.getBounds())

var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  var grades = [3000,6000,10000,30000,100000,300000,800000];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<span class="icon" style="background:' + getColor(grades[i] + 1) + '"></span> ' +
      grades[i] + (i + 1 < grades.length ? "&ndash;" + grades[i + 1] + "<br/>" : "+");
  }

  return div;
}

legend.addTo(mymap);

const baseMaps = {
  OpenStreetMap: openstreetmap,
};
const overlayMaps = {
  Abrigos: abrigosLayer,
  "Cidades geoJSON": cidadesLayer,
};

L.control.layers(baseMaps, overlayMaps).addTo(mymap);
