const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Resize renderer and AR source on window resize or orientation change
window.addEventListener('resize', () => onResize());
window.addEventListener('orientationchange', () => onResize());

const ArToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
    sourceWidth: window.innerWidth,
    sourceHeight: window.innerHeight,
    displayWidth: window.innerWidth,
    displayHeight: window.innerHeight,
});

ArToolkitSource.init(() => {
    setTimeout(() => {
        onResize();
    }, 2000);
});

function onResize() {
    ArToolkitSource.onResizeElement();
    ArToolkitSource.copyElementSizeTo(renderer.domElement);
    if (ArToolkitContext.arController) {
        ArToolkitSource.copyElementSizeTo(ArToolkitContext.arController.canvas);
    }
}

const ArToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'camera_para.dat',
    detectionMode: 'color_and_matrix',
});
ArToolkitContext.init(() => {
    camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
});

const ArMarkerControls = new THREEx.ArMarkerControls(ArToolkitContext, camera, {
    type: 'pattern',
    patternUrl: 'exposit.patt',
    changeMatrixMode: 'cameraTransformMatrix'
});
scene.visible = false;

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = geometry.parameters.height / 2;
scene.add(cube);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (ArToolkitSource.ready) {
        ArToolkitContext.update(ArToolkitSource.domElement);
        scene.visible = camera.visible;
    }
    renderer.render(scene, camera);
}

animate();
