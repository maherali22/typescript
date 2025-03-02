// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Airplane (using a simple cone geometry for this example)
let airplane = new THREE.Mesh(
  new THREE.ConeGeometry(1, 3, 8),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
airplane.rotation.x = Math.PI / 2; // Orient the cone to face forward
airplane.position.set(0, 10, 0);
scene.add(airplane);

// Alternatively, load a 3D model (uncomment and provide a model file)
// let airplane;
// const loader = new THREE.GLTFLoader();
// loader.load('airplane.glb', (gltf) => {
//     airplane = gltf.scene;
//     airplane.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
//     airplane.position.set(0, 10, 0);
//     scene.add(airplane);
// });

// Rings array
const rings = [];
for (let i = 0; i < 10; i++) {
  const geometry = new THREE.TorusGeometry(5, 0.5, 16, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const ring = new THREE.Mesh(geometry, material);
  ring.position.set(
    Math.random() * 100 - 50, // x: -50 to 50
    Math.random() * 50 + 10, // y: 10 to 60
    Math.random() * 100 - 50 // z: -50 to 50
  );
  ring.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  ring.active = true;
  ring.previousDot = null; // Will be set in first frame
  scene.add(ring);
  rings.push(ring);
}

// Keyboard controls
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
document.addEventListener("keydown", (event) => {
  if (event.key in keys) keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

// Game variables
let score = 0;
const rotationSpeed = 0.01;
const moveSpeed = 0.1;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (airplane) {
    // Update airplane rotation
    if (keys.ArrowLeft) airplane.rotation.z += rotationSpeed; // Roll left
    if (keys.ArrowRight) airplane.rotation.z -= rotationSpeed; // Roll right
    if (keys.ArrowUp) airplane.rotation.x += rotationSpeed; // Pitch down
    if (keys.ArrowDown) airplane.rotation.x -= rotationSpeed; // Pitch up

    // Move airplane forward
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      airplane.quaternion
    );
    airplane.position.add(forward.multiplyScalar(moveSpeed));

    // Update camera to follow airplane
    const offset = new THREE.Vector3(0, 5, 10).applyQuaternion(
      airplane.quaternion
    );
    camera.position.copy(airplane.position).add(offset);
    camera.lookAt(airplane.position);

    // Check for ring passes
    rings.forEach((ring) => {
      if (ring.active) {
        const vec = airplane.position.clone().sub(ring.position);
        const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(
          ring.quaternion
        );
        const currentDot = vec.dot(normal);

        // Set initial previousDot in first frame
        if (ring.previousDot === null) ring.previousDot = currentDot;

        // Detect plane crossing
        if (ring.previousDot > 0 && currentDot < 0) {
          const proj = airplane.position
            .clone()
            .sub(normal.clone().multiplyScalar(currentDot));
          const dist = proj.distanceTo(ring.position);
          if (dist < 5) {
            // Major radius of torus
            ring.active = false;
            score += 1;
            document.getElementById("score").textContent = `Score: ${score}`;
            ring.material.color.set(0x00ff00); // Change to green when passed
          }
        }
        ring.previousDot = currentDot;
      }
    });
  }

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
