// import * as THREE from 'three';
// import { ArToolkitSource, ArToolkitContext, ArMarkerControls } from 'threex';
// import { OBJLoader } from "./OBJLoader.js";
// import { MTLLoader } from "./MTLLoader.js";

// ArToolkitContext.baseURL = './';

// // init renderer
// var renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     alpha: true
// });
// renderer.setClearColor(new THREE.Color('lightgrey'), 0)
// renderer.setSize(640, 480);
// renderer.domElement.style.position = 'absolute'
// renderer.domElement.style.top = '0px'
// renderer.domElement.style.left = '0px'
// document.body.appendChild(renderer.domElement);

// // array of functions for the rendering loop
// var onRenderFcts = [];
// var arToolkitContext, arMarkerControls;

// // init scene and camera
// var scene = new THREE.Scene();

// // Create a camera
// var camera = new THREE.Camera();
// scene.add(camera);

// var arToolkitSource = new ArToolkitSource({
//     // to read from the webcam
//     sourceType: 'webcam',

//     sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
//     sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
// })

// arToolkitSource.init(function onReady() {
//     arToolkitSource.domElement.addEventListener('canplay', () => {
//         console.log(
//             'canplay',
//             'actual source dimensions',
//             arToolkitSource.domElement.videoWidth,
//             arToolkitSource.domElement.videoHeight
//         );

//         initARContext();
//     });
//     window.arToolkitSource = arToolkitSource;
//     setTimeout(() => {
//         onResize()
//     }, 2000);
// })

// // handle resize
// window.addEventListener('resize', function () {
//     onResize()
// })

// function onResize() {
//     arToolkitSource.onResizeElement()
//     arToolkitSource.copyElementSizeTo(renderer.domElement)
//     if (window.arToolkitContext.arController !== null) {
//         arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas)
//     }
// }

// function initARContext() { // create atToolkitContext
//     arToolkitContext = new ArToolkitContext({
//         cameraParametersUrl: ArToolkitContext.baseURL + 'camera_para.dat',
//         detectionMode: 'mono'
//     })
//     // initialize it
//     arToolkitContext.init(() => { // copy projection matrix to camera
//         camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

//         arToolkitContext.arController.orientation = getSourceOrientation();
//         arToolkitContext.arController.options.orientation = getSourceOrientation();

//         console.log('arToolkitContext', arToolkitContext);
//         window.arToolkitContext = arToolkitContext;
//     })

//     // MARKER
//     arMarkerControls = new ArMarkerControls(arToolkitContext, camera, {
//         type: 'pattern',
//         patternUrl: ArToolkitContext.baseURL + 'exposit1.patt',
//         changeMatrixMode: 'cameraTransformMatrix'
//     })

//     scene.visible = false

//     console.log('ArMarkerControls', arMarkerControls);
//     window.arMarkerControls = arMarkerControls;
// }


// function getSourceOrientation() {
//     if (!arToolkitSource) {
//         return null;
//     }

//     console.log(
//         'actual source dimensions',
//         arToolkitSource.domElement.videoWidth,
//         arToolkitSource.domElement.videoHeight
//     );

//     if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) {
//         console.log('source orientation', 'landscape');
//         return 'landscape';
//     } else {
//         console.log('source orientation', 'portrait');
//         return 'portrait';
//     }
// }

// // update artoolkit on every frame
// onRenderFcts.push(function () {
//     if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
//         return;
//     }

//     arToolkitContext.update(arToolkitSource.domElement)

//     // update scene.visible if the marker is seen
//     scene.visible = camera.visible
// })

// //////////////////////////////////////////////////////////////////////////////////
// //		add an object in the scene
// //////////////////////////////////////////////////////////////////////////////////

// objectLoader();
// function objectLoader() {

//     const mtlLoader = new MTLLoader();
//     mtlLoader.load('Unity.mtl', function (materials) {
//         materials.preload();


//     const loader = new OBJLoader();
//     loader.load('Unity.obj', function (obj) {

//         console.log('Unity.obj');
//         scene.add(obj);
//         obj.traverse(mesh => {
//             if (mesh.isMesh)
//                 mesh.material = new THREE.MeshNormalMaterial();
//         })

//     });
//     });
// }

// // render the scene
// onRenderFcts.push(function () {
//     renderer.render(scene, camera);
// })

// // run the rendering loop
// var lastTimeMsec = null
// requestAnimationFrame(function animate(nowMsec) {
//     // keep looping
//     requestAnimationFrame(animate);
//     // measure time
//     lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
//     var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
//     lastTimeMsec = nowMsec
//     // call each update function
//     onRenderFcts.forEach(function (onRenderFct) {
//         onRenderFct(deltaMsec / 1000, nowMsec / 1000)
//     })
// });





import * as THREE from 'three';
import { ArToolkitSource, ArToolkitContext, ArMarkerControls } from 'threex';
import { OBJLoader } from "./OBJLoader.js";
import { MTLLoader } from "./MTLLoader.js";

ArToolkitContext.baseURL = './';

// init renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts = [];
var arToolkitContext, arMarkerControls;

// init scene and camera
var scene = new THREE.Scene();

// Add lights for better visualization
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Strong directional light
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);

var arToolkitSource = new ArToolkitSource({
    // to read from the webcam
    sourceType: 'webcam',
    sourceWidth: window.innerWidth > window.innerHeight ? 640 : 480,
    sourceHeight: window.innerWidth > window.innerHeight ? 480 : 640,
});

arToolkitSource.init(function onReady() {
    arToolkitSource.domElement.addEventListener('canplay', () => {
        console.log(
            'canplay',
            'actual source dimensions',
            arToolkitSource.domElement.videoWidth,
            arToolkitSource.domElement.videoHeight
        );
        initARContext();
    });
    window.arToolkitSource = arToolkitSource;
    setTimeout(() => {
        onResize();
    }, 2000);
});

// handle resize
window.addEventListener('resize', function () {
    onResize();
});

function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (window.arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas);
    }
}

function initARContext() {
    arToolkitContext = new ArToolkitContext({
        cameraParametersUrl: ArToolkitContext.baseURL + 'camera_para.dat',
        detectionMode: 'mono'
    });

    // initialize it
    arToolkitContext.init(() => {
        // copy projection matrix to camera
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());

        arToolkitContext.arController.orientation = getSourceOrientation();
        arToolkitContext.arController.options.orientation = getSourceOrientation();

        console.log('arToolkitContext', arToolkitContext);
        window.arToolkitContext = arToolkitContext;
    });

    // MARKER
    arMarkerControls = new ArMarkerControls(arToolkitContext, camera, {
        type: 'pattern',
        patternUrl: ArToolkitContext.baseURL + 'exposit1.patt',
        changeMatrixMode: 'cameraTransformMatrix'
    });

    scene.visible = false;
    console.log('ArMarkerControls', arMarkerControls);
    window.arMarkerControls = arMarkerControls;
}

function getSourceOrientation() {
    if (!arToolkitSource) {
        return null;
    }

    console.log(
        'actual source dimensions',
        arToolkitSource.domElement.videoWidth,
        arToolkitSource.domElement.videoHeight
    );

    if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) {
        console.log('source orientation', 'landscape');
        return 'landscape';
    } else {
        console.log('source orientation', 'portrait');
        return 'portrait';
    }
}

// update artoolkit on every frame
onRenderFcts.push(function () {
    if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
        return;
    }

    arToolkitContext.update(arToolkitSource.domElement);

    // update scene.visible if the marker is seen
    scene.visible = camera.visible;
});

//////////////////////////////////////////////////////////////////////////////////
//		Load and add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

objectLoader();
function objectLoader() {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('Unity.mtl', function (materials) {
        materials.preload(); // Preload materials

        const loader = new OBJLoader();
        loader.setMaterials(materials); // Apply materials
        loader.load('Unity.obj', function (obj) {
            console.log('Unity.obj loaded with materials');
            scene.add(obj);

            obj.traverse(mesh => {
                if (mesh.isMesh) {
                    // Optional: Override materials for testing
                    mesh.material = materials.getMaterialByName(mesh.material.name) || new THREE.MeshStandardMaterial({
                        color: 0xffffff,
                        metalness: 0.5,
                        roughness: 0.5
                    });
                }
            });
        }, undefined, function (error) {
            console.error('An error occurred while loading the OBJ:', error);
        });
    }, undefined, function (error) {
        console.error('An error occurred while loading the MTL:', error);
    });
}

// render the scene
onRenderFcts.push(function () {
    renderer.render(scene, camera);
});

// run the rendering loop
var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // call each update function
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
    });
});
      