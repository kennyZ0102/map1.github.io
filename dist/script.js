// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoiemNrMDAwMTAyIiwiYSI6ImNscjZkdm1sdTF1NmQya215ZXd0aWlnZnUifQ.P720ZG24ZTqUmRmxuihmgA";
const style_0010 = "mapbox://styles/zck000102/cls08465n00w601pegsaof2k2";
const style_1020 = "mapbox://styles/zck000102/cls088nz400ce01qqfu5lb4xq";

const map = new mapboxgl.Map({
  container: "map",
  style: style_0010,
  center: [108, 37], // change to your centre
  zoom: 3
});

const layerList = document.getElementById("menu");
const inputs = layerList.getElementsByTagName("input");

//On click the radio button, toggle the style of the map.
for (const input of inputs) {
  input.onclick = (layer) => {
    if (layer.target.id == "style_0010") {
      map.setStyle(style_0010);
      
    }
    if (layer.target.id == "style_1020") {
      map.setStyle(style_1020);
    }
  };
}

map.on("load", () => {
  const layers = [
    "-20%~-10%",
    "-10%~0%",
    "0%~10%",
    "10%~20%",
    "20%~30%",
    ">30%",
  ];
  const colors = [
    "#bfbfbf",
    "#3288bd",
    "#ffffbf",
    "#fee08b",
    "#fc8d59",
    "#d53e4f",
  ];
  // create legend
  const legend = document.getElementById("legend");

  layers.forEach((layer, i) => {
    const color = colors[i];
    const key = document.createElement("div");
    //place holder
    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.innerHTML = `${layer}`;

    legend.appendChild(key);
    key.style.color = "rgba(40, 40, 40, 0.8)";
  });
});

map.on("style.load", () => {
  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "dz-hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": 4
    }
  });
});

map.on("mousemove", (event) => {
  const activeLayer = map.getStyle().layers[0].id;
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: [activeLayer]
  });

  document.getElementById("pd").innerHTML = dzone.length
    ? `<h3>${dzone[0].properties.name}</h3>
       <p>Growth Number: <strong>${activeLayer === "pop-change-0010" ? dzone[0].properties.Num_0010 * 10000 : dzone[0].properties.Num_1020 * 10000}</strong></p>
       <p>Growth Rate: <strong>${(activeLayer === "pop-change-0010" ? (dzone[0].properties.Per_0010 * 100).toFixed(2) : (dzone[0].properties.Per_1020 * 100).toFixed(2))}%</strong></p>
`
    : `<p>Hover over a province!</p>`;

  // 更新 "dz-hover" 图层的数据源
  map.getSource("hover").setData({
    type: "FeatureCollection",
    features: dzone.map(function (f) {
      return { type: "Feature", geometry: f.geometry };
    })
  });
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-left");