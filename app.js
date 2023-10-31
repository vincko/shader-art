let scene = new THREE.Scene();
let camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    -1, 1
);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let material = noiseMaterial;

let geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
let plane = new THREE.Mesh(geometry, material);
scene.add(plane);

function animate() {
    requestAnimationFrame(animate);

    material.uniforms.uTime.value = 0.5 * performance.now() * 0.001; // Update time for motion
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); // Set resolution

    renderer.render(scene, camera);
}

animate();
