import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

import startsTexture from "/images/stars.jpg";
import earthTexture from "/images/earth.jpg";
import sunTexture from "/images/sun.jpg";
import jupiterTexture from "/images/jupiter.jpg";
import marsTexture from "/images/mars.jpg";
import mercuryTexture from "/images/mercury.jpg";
import venusTexture from "/images/venus.jpg";
import saturnTexture from "/images/saturn.jpg";
import neptuneTexture from "/images/neptune.jpg";
import uranusTexture from "/images/uranus.jpg";
import saturnRingTexture from "/images/saturn ring.png";
import uranusRingTexture from "/images/uranus ring.png";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
scene.add(hemisphereLight);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-90, 140, 140);
camera.lookAt(0, 0, 0);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y,
    };

    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position);

    spherical.theta -= deltaMove.x * 0.01;
    spherical.phi += deltaMove.y * 0.01;
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

    camera.position.setFromSpherical(spherical);
    camera.lookAt(0, 0, 0);

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

renderer.domElement.addEventListener("wheel", (e) => {
  const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
  const newDistance = Math.max(50, Math.min(300, distance + e.deltaY * 0.1));
  camera.position.multiplyScalar(newDistance / distance);
});

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.05;
orbit.minDistance = 50;
orbit.maxDistance = 300;
orbit.maxPolarAngle = Math.PI / 2;
orbit.update();

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  startsTexture,
  startsTexture,
  startsTexture,
  startsTexture,
  startsTexture,
  startsTexture,
]);

const textureLoader = new THREE.TextureLoader();

const sunMap = textureLoader.load(sunTexture);
sunMap.colorSpace = THREE.SRGBColorSpace;
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: sunMap,
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const planetData = {
  Mercury: {
    size: 3.2,
    position: 28,
    color: 0x8c7853,
    distance: "58 million km from Sun",
    description:
      "The smallest planet and closest to the Sun. Mercury has extreme temperature variations.",
    speed: 0.04,
    rotationSpeed: 0.004,
  },
  Venus: {
    size: 4.5,
    position: 44,
    color: 0xffc649,
    distance: "108 million km from Sun",
    description:
      "The hottest planet with a thick, toxic atmosphere. Often called Earth's twin due to similar size.",
    speed: 0.035,
    rotationSpeed: 0.002,
  },
  Earth: {
    size: 4,
    position: 62,
    color: 0x6b93d6,
    distance: "150 million km from Sun",
    description:
      "Our home planet. The only known planet with life, covered by 71% water.",
    speed: 0.03,
    rotationSpeed: 0.02,
  },
  Mars: {
    size: 3.5,
    position: 78,
    color: 0xc1440e,
    distance: "228 million km from Sun",
    description:
      "The Red Planet. Has the largest volcano in the solar system and evidence of ancient water.",
    speed: 0.025,
    rotationSpeed: 0.018,
  },
  Jupiter: {
    size: 11,
    position: 100,
    color: 0xd8ca9d,
    distance: "778 million km from Sun",
    description:
      "The largest planet. A gas giant with over 80 moons and a Great Red Spot storm.",
    speed: 0.02,
    rotationSpeed: 0.04,
  },
  Saturn: {
    size: 10,
    position: 138,
    color: 0xfad5a5,
    distance: "1.4 billion km from Sun",
    description:
      "Famous for its spectacular ring system. Has over 80 moons including Titan.",
    speed: 0.015,
    rotationSpeed: 0.038,
  },
  Uranus: {
    size: 7,
    position: 176,
    color: 0x4fd0e3,
    distance: "2.9 billion km from Sun",
    description:
      "An ice giant that rotates on its side. Has faint rings and 27 known moons.",
    speed: 0.01,
    rotationSpeed: 0.03,
  },
  Neptune: {
    size: 7,
    position: 200,
    color: 0x4b70dd,
    distance: "4.5 billion km from Sun",
    description:
      "The windiest planet with speeds up to 2,100 km/h. The farthest known planet from the Sun.",
    speed: 0.008,
    rotationSpeed: 0.032,
  },
};

function createPlanet(size, texture, position, ring) {
  const map = textureLoader.load(texture);
  map.colorSpace = THREE.SRGBColorSpace;

  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: map,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
    const ringMap = textureLoader.load(ring.texture);
    ringMap.colorSpace = THREE.SRGBColorSpace;

    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringMap,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

const planetLabels = {};
Object.entries(planetData).forEach(([name, data]) => {
  const planet = createPlanet(
    data.size,
    eval(name.toLowerCase() + "Texture"),
    data.position,
    name === "Saturn"
      ? { innerRadius: 10, outerRadius: 20, texture: saturnRingTexture }
      : name === "Uranus"
      ? { innerRadius: 7, outerRadius: 12, texture: uranusRingTexture }
      : undefined
  );

  planet.obj.userData = {
    name,
    info: data,
  };

  planetLabels[name] = planet;
});

const planets = Object.entries(planetLabels).map(([name, planetObj]) => ({
  name,
  obj: planetObj.obj,
  mesh: planetObj.mesh,
  defaultSpeed: planetData[name].speed,
  rotationSpeed: planetData[name].rotationSpeed,
}));

const tooltip = document.getElementById("tooltip");
const tooltipName = document.getElementById("tooltip-name");
const tooltipDistance = document.getElementById("tooltip-distance");
const tooltipDescription = document.getElementById("tooltip-description");

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPlanet = null;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check all planet objects
  const planetObjects = Object.values(planetLabels).map((p) => p.mesh);
  const intersects = raycaster.intersectObjects(planetObjects, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object.parent;
    const planetInfo = intersectedObject.userData;

    if (planetInfo && planetInfo.name) {
      hoveredPlanet = planetInfo.name;
      showTooltip(planetInfo, event.clientX, event.clientY);
    }

    Object.values(planetLabelsUI).forEach(({ label, planet }) => {
      if (planet.name === planetInfo.name) {
        label.style.display = "block";

        const vector = new THREE.Vector3();
        planet.obj.getWorldPosition(vector);
        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        label.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
      } else {
        label.style.display = "none";
      }
    });
  } else {
    // Hide all labels when not hovering
    Object.values(planetLabelsUI).forEach(({ label }) => {
      label.style.display = "none";
    });
    hoveredPlanet = null;
    hideTooltip();
  }
}

function showTooltip(planetInfo, x, y) {
  tooltipName.textContent = planetInfo.name;
  tooltipDistance.textContent = planetInfo.info.distance;
  tooltipDescription.textContent = planetInfo.info.description;

  tooltip.style.display = "block";
  updateTooltipPosition(x, y);
}

function updateTooltipPosition(x, y) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const padding = 10;

  let tooltipX = x + padding;
  let tooltipY = y + padding;

  if (tooltipX + tooltipRect.width > window.innerWidth) {
    tooltipX = x - tooltipRect.width - padding;
  }
  if (tooltipY + tooltipRect.height > window.innerHeight) {
    tooltipY = y - tooltipRect.height - padding;
  }

  tooltip.style.left = tooltipX + "px";
  tooltip.style.top = tooltipY + "px";
}

function hideTooltip() {
  tooltip.style.display = "none";
}

window.addEventListener("mousemove", onMouseMove);

function createOrbit(radius) {
  const orbitGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = -0.5 * Math.PI;
  scene.add(orbit);
}

createOrbit(28); // Mercury
createOrbit(44); // Venus
createOrbit(62); // Earth
createOrbit(78); // Mars
createOrbit(100); // Jupiter
createOrbit(138); // Saturn
createOrbit(176); // Uranus
createOrbit(200); // Neptune

planets.forEach((planet) => {
  gsap.to(planet.obj.rotation, {
    y: Math.PI * 2,
    duration: 1 / planet.speed,
    ease: "none",
    repeat: -1,
  });
});

function createControlPanel() {
  const controlPanel = document.createElement("div");
  controlPanel.style.position = "fixed";
  controlPanel.style.top = "20px";
  controlPanel.style.right = "20px";
  controlPanel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  controlPanel.style.padding = "20px";
  controlPanel.style.borderRadius = "10px";
  controlPanel.style.color = "white";
  controlPanel.style.fontFamily = "Arial, sans-serif";
  controlPanel.style.zIndex = "1000";

  const title = document.createElement("h3");
  title.textContent = "Planet Speed Controls";
  title.style.marginBottom = "15px";
  controlPanel.appendChild(title);

  const planets = Object.entries(planetLabels).map(([name, planetObj]) => ({
    name,
    obj: planetObj.obj,
    mesh: planetObj.mesh,
    defaultSpeed: planetData[name].speed,
    rotationSpeed: planetData[name].rotationSpeed,
  }));

  const activeAnimations = {};

  planets.forEach((planet) => {
    const container = document.createElement("div");
    container.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.textContent = planet.name;
    label.style.display = "block";
    label.style.marginBottom = "5px";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "4";
    slider.step = "0.01";
    slider.value = "1";
    slider.style.width = "100%";

    const speedDisplay = document.createElement("span");
    speedDisplay.style.marginLeft = "10px";
    speedDisplay.textContent = "1x";

    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(speedDisplay);
    controlPanel.appendChild(container);

    const animation = gsap.to(planet.obj.rotation, {
      y: "+=" + Math.PI * 2,
      duration: 1 / planet.defaultSpeed,
      ease: "none",
      repeat: -1,
    });
    activeAnimations[planet.name] = animation;

    slider.addEventListener("input", (e) => {
      const speedMultiplier = parseFloat(e.target.value);
      speedDisplay.textContent = `${speedMultiplier.toFixed(2)}x`;

      if (activeAnimations[planet.name]) {
        activeAnimations[planet.name].timeScale(speedMultiplier);
      }
    });
  });

  document.body.appendChild(controlPanel);
}

createControlPanel();

function animate() {
  sun.rotateY(0.004);

  planetLabels["Mercury"].mesh.rotateY(0.004);
  planetLabels["Venus"].mesh.rotateY(0.002);
  planetLabels["Earth"].mesh.rotateY(0.02);
  planetLabels["Mars"].mesh.rotateY(0.018);
  planetLabels["Jupiter"].mesh.rotateY(0.04);
  planetLabels["Saturn"].mesh.rotateY(0.038);
  planetLabels["Uranus"].mesh.rotateY(0.03);
  planetLabels["Neptune"].mesh.rotateY(0.032);

  orbit.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createStarField() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

function createUI() {
  const uiContainer = document.createElement("div");
  uiContainer.style.position = "fixed";
  uiContainer.style.top = "20px";
  uiContainer.style.left = "20px";
  uiContainer.style.zIndex = "1000";
  uiContainer.style.display = "flex";
  uiContainer.style.gap = "10px";

  const pauseButton = document.createElement("button");
  pauseButton.textContent = "⏸️ Pause";
  pauseButton.style.padding = "10px 20px";
  pauseButton.style.borderRadius = "5px";
  pauseButton.style.border = "none";
  pauseButton.style.cursor = "pointer";
  pauseButton.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  pauseButton.style.color = "white";

  const themeToggle = document.createElement("button");
  themeToggle.textContent = "🌙 Dark Mode";
  themeToggle.style.padding = "10px 20px";
  themeToggle.style.borderRadius = "5px";
  themeToggle.style.border = "none";
  themeToggle.style.cursor = "pointer";
  themeToggle.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  themeToggle.style.color = "white";

  uiContainer.appendChild(pauseButton);
  uiContainer.appendChild(themeToggle);
  document.body.appendChild(uiContainer);

  let isPaused = false;
  let isDarkMode = true;

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";

    if (isPaused) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });

  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    themeToggle.textContent = isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode";

    const backgroundColor = isDarkMode ? 0x000000 : 0x87ceeb;
    scene.background = new THREE.Color(backgroundColor);

    const textColor = isDarkMode ? "white" : "black";
    const bgColor = isDarkMode
      ? "rgba(0, 0, 0, 0.7)"
      : "rgba(255, 255, 255, 0.7)";

    document
      .querySelectorAll('button, div[style*="background-color"]')
      .forEach((el) => {
        el.style.backgroundColor = bgColor;
        el.style.color = textColor;
      });
  });
}

const planetLabelsUI = {};

function createPlanetLabels() {
  planets.forEach((planet) => {
    const label = document.createElement("div");
    label.textContent = planet.name;
    label.style.position = "absolute";
    label.style.color = "white";
    label.style.padding = "5px 10px";
    label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    label.style.borderRadius = "5px";
    label.style.display = "none";
    label.style.pointerEvents = "none";
    document.body.appendChild(label);

    planetLabelsUI[planet.name] = { label, planet };
  });
}

createStarField();
createUI();
createPlanetLabels();
