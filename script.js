// Seleciona os elementos das imagens
const mainGraphic = document.querySelector("#main-graphic");
const nextGraphic = document.querySelector("#next-graphic");

// Array com os nomes dos arquivos de imagem
const imageFiles = [
  "grafico1.png",
  "grafico2.png",
  "grafico3.png",
  "grafico4.png",
  "grafico5.png",
  "grafico6.png",
  "grafico7.png",
  "grafico8.png",
  "grafico9.png",
];

// Função para atualizar a imagem com transição suave
function updateImage(index) {
  if (index >= 0 && index < imageFiles.length) {
    const inactiveGraphic = mainGraphic.classList.contains("active")
      ? nextGraphic
      : mainGraphic;
    const activeGraphic = mainGraphic.classList.contains("active")
      ? mainGraphic
      : nextGraphic;

    inactiveGraphic.src = `images/${imageFiles[index]}`;

    // Realiza a transição imediatamente
    requestAnimationFrame(() => {
      activeGraphic.classList.remove("active");
      inactiveGraphic.classList.add("active");
    });
  }
}

function updateStep(response) {
  updateImage(response.index);
  document.querySelector(".step.active")?.classList.remove("active");
  response.element.classList.add("active");

  if (isMobile() && response.index > 0) {
    response.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Função para verificar se é um dispositivo móvel
function isMobile() {
  return window.innerWidth <= 768;
}

// Inicializa scrollama
const scroller = scrollama();

// Modifique a configuração do scrollama
scroller
  .setup({
    step: ".step",
    offset: isMobile() ? 1 : 0.5, // Aumente o offset para mobile
    debug: false,
  })
  .onStepEnter(updateStep)
  .onStepExit((response) => {
    if (response.index === 0 && response.direction === "up") {
      updateImage(0);
      console.log("Voltando ao topo, restaurando a primeira imagem");
    }
  });

function handleResize() {
  scroller.resize();
  scroller.offset(isMobile() ? 1 : 0.5);
}

window.addEventListener("resize", handleResize);

window.addEventListener("load", () => {
  // Garante que apenas a primeira imagem seja exibida no carregamento inicial
  mainGraphic.src = `images/${imageFiles[0]}`;
  mainGraphic.classList.add("active");
  nextGraphic.classList.remove("active");
  console.log("Página carregada, imagem inicial definida");
});

// Função para inicializar o mapa
function initializeMap() {
  if (typeof L === "undefined" || !document.getElementById("map")) {
    console.error(
      "Leaflet não está carregado ou o container do mapa não foi encontrado."
    );
    return;
  }

  // Verifica se o container do mapa existe
  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    console.error(
      'Container do mapa não encontrado. Verifique se o elemento com id "map" existe no seu HTML.'
    );
    return;
  }

  // Inicializa o mapa
  const map = L.map("map").setView([-2.5, -59.0], 5.5);
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ).addTo(map);

  const locations = [
    {
      name: "Porto de Moz - PA",
      coords: [-1.751055, -52.236186],
      temp: "+0,5°C",
      temp1961_1990: 31.7,
      temp1991_2020: 32.2,
    },
    {
      name: "Monte Alegre - PA",
      coords: [-2.0, -54.076389],
      temp: "+0,4°C",
      temp1961_1990: 30.9,
      temp1991_2020: 31.3,
    },
    {
      name: "Belterra - PA",
      coords: [-2.642222, -54.943889],
      temp: "+0,9°C",
      temp1961_1990: 30.3,
      temp1991_2020: 31.2,
    },
    {
      name: "Itacoatiara - AM",
      coords: [-3.136944, -58.442778],
      temp: "+1,1°C",
      temp1961_1990: 26.2,
      temp1991_2020: 27.3,
    },
    {
      name: "Manaus - AM",
      coords: [-3.103333, -60.016389],
      temp: "+0,9°C",
      temp1961_1990: 31.4,
      temp1991_2020: 32.3,
    },
    {
      name: "Barcelos - AM",
      coords: [-0.974167, -62.928611],
      temp: "+0,8°C",
      temp1961_1990: 31.7,
      temp1991_2020: 32.5,
    },
    {
      name: "Fonte Boa - AM",
      coords: [-2.515833, -66.100833],
      temp: "+1,2°C",
      temp1961_1990: 30.8,
      temp1991_2020: 32.0,
    },
  ];

  locations.forEach((location) => {
    const icon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class='marker-pin'><div class='marker-text'>${location.temp}</div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    L.marker(location.coords, { icon }).addTo(map).bindPopup(`
      <b>${location.name}</b><br>
      Aumento de temperatura: ${location.temp}<br>
      Temperatura média 1961-1990: ${location.temp1961_1990.toFixed(1)}°C<br>
      Temperatura média 1991-2020: ${location.temp1991_2020.toFixed(1)}°C
    `);
  });
}

// Função para garantir que o mapa seja inicializado apenas quando o DOM estiver pronto
function ensureMapInitialization() {
  if (document.readyState === "complete") {
    initializeMap();
  } else {
    window.addEventListener("load", initializeMap);
  }
}

// Inicializa o mapa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  ensureMapInitialization();
});
