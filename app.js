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

let material = new THREE.ShaderMaterial({
    fragmentShader: `
        precision mediump float;

        uniform float uTime; // Passed from JavaScript to control motion
        uniform vec2 uResolution; // Screen resolution

        // Simple hash function to generate random values
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float smoothNoise(vec2 uv) {
            vec2 grid = floor(uv);
            vec2 frac = fract(uv);
        
            // Four corners of the grid square
            float tl = hash(grid);                   // top-left
            float tr = hash(vec2(grid.x + 1.0, grid.y));      // top-right
            float bl = hash(vec2(grid.x, grid.y + 1.0));      // bottom-left
            float br = hash(vec2(grid.x + 1.0, grid.y + 1.0));  // bottom-right
        
            // Smooth interpolation (using a smoothstep function)
            vec2 sm = smoothstep(0.0, 1.0, frac);
            return mix(mix(tl, tr, sm.x), mix(bl, br, sm.x), sm.y);
        }

        void main() {
            vec2 st = gl_FragCoord.xy / uResolution.xy;

            float xNoise = smoothNoise(vec2(0.5 + st.x * 10.0 * sin(uTime) + sin(3.14 / 2.0 + 2.0 * uTime), st.y * 5.0 * sin(2.0 * uTime) + sin(3.14 / 2.0 + 2.0 * uTime)));
            float noise = xNoise;
            
            // Simple moving sinusoidal pattern
            float colorValueRed = 0.5 + 0.4 * sin(3.14 / 2.0 + st.x * 10.0 + uTime + noise) * sin(st.y * 10.0 + uTime) + 0.1 * sin(3.14 / 2.0 + st.x + uTime + noise) * sin(st.y * 2.0 + uTime);
            float colorValueBlue = 0.5 + 0.2 * sin(st.x * 10.0 + 2.0 * uTime + noise) * sin(st.y * 10.0 + uTime) + 0.3 * sin(3.14 / 2.0 + st.x + uTime + noise) * sin(st.y * 2.0 + uTime);;
            float colorValueGreen = 0.5 + 0.3 * sin(3.14 / 4.0 + st.x * 10.0 + uTime + noise) * sin(st.y * 10.0 + 3.0 * uTime) + 0.2 * sin(3.14 / 2.0 + st.x + uTime + noise) * sin(st.y * 2.0 + uTime);;
            
            gl_FragColor = vec4(colorValueRed, colorValueBlue, colorValueGreen, 1.0);
        }
    `,
    uniforms: {
        uTime: { value: 1.0 },
        uResolution: { value: new THREE.Vector2() }
    }
});

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
