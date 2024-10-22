import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

// Create a new scene
const scene = new THREE.Scene();

// Set up a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

// Add OrbitControls for easy navigation
const controls = new OrbitControls(camera, renderer.domElement);

// Create a plane to visualize light patterns and shadows
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Create a sphere to see reflections and light effects
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, 0);
sphere.castShadow = true;
scene.add(sphere);

// Add different types of lights

// Ambient Light (soft global light)
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Directional Light (like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Point Light (light that spreads in all directions from a point)
const pointLight = new THREE.PointLight(0xffffff, 1, 50);
pointLight.position.set(5, 10, 5);
pointLight.castShadow = true;
scene.add(pointLight);

// Spot Light (focused light, like a flashlight)
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 6;
spotLight.castShadow = true;
scene.add(spotLight);

// Hemisphere Light (simulates sky and ground lighting)
const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.5);
hemisphereLight.position.set(0, 10, 0);
scene.add(hemisphereLight);

// Render loop
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
})

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Set up dat.GUI
const gui = new GUI();
const lightOptions = {
  lightType: "All",
};

// Add light selection dropdown
const lightFolder = gui.addFolder("Light Controls");
lightFolder
  .add(lightOptions, "lightType", ["All", "Ambient", "Directional", "Point", "Spot", "Hemisphere"])
  .name("Select Light")
  .onChange((value) => {
    // Set all lights to invisible initially
    ambientLight.visible = false;
    directionalLight.visible = false;
    pointLight.visible = false;
    spotLight.visible = false;
    hemisphereLight.visible = false;

    // Remove any previous light controls
    if (lightFolder.__controllers.length > 1) {
      lightFolder.__controllers.slice(1).forEach((controller) => lightFolder.remove(controller));
    }

    // Show the selected light and add relevant controls
    switch (value) {
      case "All":
        ambientLight.visible = true;
        directionalLight.visible = true;
        pointLight.visible = true;
        spotLight.visible = true;
        hemisphereLight.visible = true;
        break;
      case "Ambient":
        ambientLight.visible = true;
        lightFolder.add(ambientLight, "intensity", 0, 2).name("Intensity");
        break;
      case "Directional":
        directionalLight.visible = true;
        lightFolder.add(directionalLight, "intensity", 0, 2).name("Intensity");
        lightFolder.add(directionalLight.position, "x", -20, 20).name("Position X");
        lightFolder.add(directionalLight.position, "y", -20, 20).name("Position Y");
        lightFolder.add(directionalLight.position, "z", -20, 20).name("Position Z");
        break;
      case "Point":
        pointLight.visible = true;
        lightFolder.add(pointLight, "intensity", 0, 2).name("Intensity");
        lightFolder.add(pointLight.position, "x", -20, 20).name("Position X");
        lightFolder.add(pointLight.position, "y", -20, 20).name("Position Y");
        lightFolder.add(pointLight.position, "z", -20, 20).name("Position Z");
        lightFolder.add(pointLight, "distance", 0, 100).name("Distance");
        lightFolder.add(pointLight, "decay", 0, 10).name("Decay");
        break;
      case "Spot":
        spotLight.visible = true;
        lightFolder.add(spotLight, "intensity", 0, 2).name("Intensity");
        lightFolder.add(spotLight.position, "x", -20, 20).name("Position X");
        lightFolder.add(spotLight.position, "y", -20, 20).name("Position Y");
        lightFolder.add(spotLight.position, "z", -20, 20).name("Position Z");
        lightFolder.add(spotLight, "angle", 0, Math.PI / 2).name("Angle");
        lightFolder.add(spotLight, "penumbra", 0, 1).name("Penumbra");
        lightFolder.add(spotLight, "distance", 0, 100).name("Distance");
        lightFolder.add(spotLight, "decay", 0, 10).name("Decay");
        break;
      case "Hemisphere":
        hemisphereLight.visible = true;
        lightFolder.add(hemisphereLight, "intensity", 0, 2).name("Intensity");
        lightFolder.addColor({ color: "#ffffff" }, "color").onChange((value) => {
          hemisphereLight.color.set(value);
        });
        lightFolder.addColor({ groundColor: "#ffffff" }, "groundColor").onChange((value) => {
          hemisphereLight.groundColor.set(value);
        })
        break;
    }
  });
lightFolder.open();
