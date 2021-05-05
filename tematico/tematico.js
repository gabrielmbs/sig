const LatLong = [-7.133597693372753, -36.61743164062501];

var map = L.map("mapid", {
  center: LatLong,
  zoom: 8,
});

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
camadaSimples.addTo(map);

const getColor = (p) => {
  return p > 800000
    ? "#800026"
    : p > 400000
    ? "#BD0026"
    : p > 100000
    ? "#E31A1C"
    : p > 50000
    ? "#FC4E2A"
    : p > 20000
    ? "#FD8D3C"
    : p > 10000
    ? "#FEB24C"
    : p > 5000
    ? "#FED976"
    : "#FFEDA0";
};

function style(feature) {
  return {
    fillColor: getColor(feature.properties.populacao),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}

var cidadesLayer;
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  cidadesLayer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

var cidadesLayer = L.geoJSON(cidades, {
  style: style,
  onEachFeature: onEachFeature,
});

cidadesLayer.addTo(map);

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>População da Paraíba</h4>" +
    (props
      ? "<b>" +
        props.nome +
        "</b><br />" +
        props.populacao +
        " pessoas / m<sup>2</sup>"
      : "Passe o mouse sobre uma cidade");
};

info.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);
