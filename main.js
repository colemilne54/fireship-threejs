import './style.css';
import spaceUrl from './assets/space.jpg';
import coleUrl from './assets/cole.jpg';
import normalUrl from './assets/normal.jpg';
import moonUrl from './assets/moon.jpg';
// import gloveUrl from './assets/glove/scene.gltf';

import * as THREE from 'three';
// need scene, camera, and renderer

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize (window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );

const gltfLoader = new GLTFLoader();

// 3 steps to object: geometry (set of vectors), material (geometry wrapping paper, can use webgl for custom shaders), mesh (geometry + material)
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial ( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const coleTexture = new THREE.TextureLoader().load(coleUrl);

const cole = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: coleTexture } )
);

scene.add(cole);

const moonTexture = new THREE.TextureLoader().load(moonUrl);
const normalTexture = new THREE.TextureLoader().load(normalUrl);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap: normalTexture
  } )
);

// preference on how to set position
moon.position.z = 30;
moon.position.setX(-10);

scene.add(moon);

let gloveModel;

gltfLoader.load('./assets/glove/scene.gltf', (glove) => {
  gloveModel = glove;
  glove.scene.position.x = 5;
  glove.scene.position.y = 0;
  glove.scene.position.z = 55;
  glove.scene.rotation.x = 5;
  glove.scene.rotation.y = 10;
  glove.scene.rotation.z = 5;
  glove.scene.scale.set(10, 10, 10);
  scene.add(glove.scene);
});

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cole.rotation.y += 0.01;
  cole.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

  // if (gloveModel) {
  //   gloveModel.scene.rotation.x += 0.05;
  //   gloveModel.scene.rotation.y += 0.075;
  //   gloveModel.scene.rotation.z += 0.05;
  //   console.log("x " + gloveModel.scene.rotation.x) // 10
  //   console.log("y " + gloveModel.scene.rotation.y) // 15
  //   console.log("z " + gloveModel.scene.rotation.z) // 10
  // }
}
document.body.onscroll = moveCamera;


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff });
  const star = new THREE.Mesh ( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(spaceUrl);
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
};

animate();