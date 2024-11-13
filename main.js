import * as THREE from 'three';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create player
const playerGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

player.position.y = 1; // Start above the ground

// Function to create platforms
function createPlatform(x, y, z) {
  const platformGeometry = new THREE.BoxGeometry(15, 0.1, 10);
  const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.set(x, y, z);
  scene.add(platform);
  return platform;
}

// Function to create walls
function createWalls(x, y, z) {
  const wallGeo = new THREE.BoxGeometry(0.1, 10, 10);
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
  const wall = new THREE.Mesh(wallGeo, wallMaterial);
  const wall2 = new THREE.Mesh(wallGeo, wallMaterial);
  wall.position.set(x - 7.5, y + 5, z);
  wall2.position.set(x + 7.5, y + 5, z);
  scene.add(wall);
  scene.add(wall2);
  return [wall, wall2];
}

// Generate platforms and walls
const platforms = [];
const walls = [];
for (let i = 0; i < 100; i++) {
  platforms.push(createPlatform(0, 0, -i * 2));
  walls.push(...createWalls(0, 0, -i * 2));
}

// Raycaster for detecting platforms below player
const raycaster = new THREE.Raycaster();
const downVector = new THREE.Vector3(0, -1, 0); // Downward direction

// Player movement variables
let velocityY = 10;
const gravity = -0.02;
const jumpStrength = 0.5;
let isJumping = false;
let forwardSpeed = 0.2;
const endPositionZ = -200; // Define end position where player stops

// Track if the game has started
let gameStarted = false;

// Check if there's a platform below the player
function checkPlatformBelow() {
  raycaster.set(player.position, downVector);
  const intersects = raycaster.intersectObjects(platforms);

  // Return true if a platform is detected close below the player
  return intersects.length > 0 && intersects[0].distance <= 1;
}

function collisions(){
  // if()
  // if(player.position.y )
}

// Player controls and gravity //&& player.position.z > endPositionZ
function updatePlayer() {
  if (gameStarted ) {
    player.position.z -= forwardSpeed; // Constant forward movement
  }

  // Check if the player should be falling
  if (!checkPlatformBelow()) {
    velocityY += gravity;
  } else if (!isJumping) {
    velocityY = 0; // Reset vertical velocity when landing on a platform
  }

  // Apply vertical movement (falling or jumping)
  player.position.y += velocityY;

  // Stop the player from falling through the ground
  if (player.position.y <= 1 && checkPlatformBelow()) {
    player.position.y = 1;
    velocityY = 0;
    isJumping = false;
  }

  if (keys.ArrowLeft) {
    player.position.x -= 0.1; // Move left
  }
  if (keys.ArrowRight) {
    player.position.x += 0.1; // Move right
  }
}

// Track which keys are being held down
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  Space: false,
};
// Track the current rotation angle around the player (in degrees)
let cameraAngle = 0;
// Event listeners to track key states
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === ' ') {
    keys[event.key] = true;
  }
  if (event.key === ' ' && !isJumping) { // Jump only if not already jumping
    velocityY = jumpStrength;
    isJumping = true;

    // Start the game if space is pressed
    if (!gameStarted) {
      gameStarted = true;
    }
  }
  if (event.key === 'c') {
    // Rotate camera 90 degrees to the right
    cameraAngle -= 90;
  } else if (event.key === 'v') {
    // Rotate camera 90 degrees to the left
    cameraAngle += 90;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === ' ') {
    keys[event.key] = false;
  }
});

// Camera follows player
function updateCamera() {
  const radians = THREE.MathUtils.degToRad(cameraAngle);

  // Calculate the new camera position based on the Y-axis rotation
  const radius = 5; // Distance from the player
  camera.position.x = player.position.x + radius * Math.sin(radians);
  camera.position.z = player.position.z + radius * Math.cos(radians);
  camera.position.y = player.position.y + 2; // Keep camera slightly above the player


  camera.lookAt(player.position);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);

  updatePlayer();
  updateCamera();

  renderer.render(scene, camera);
}

animate();
