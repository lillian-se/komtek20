
// import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
// import {GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import {loadGLTF, loadAudio} from "./libs/loader.js";



const THREE = window.MINDAR.IMAGE.THREE;


  
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./assets/textures/10.png')



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Particles
 */
// Geometry
// const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()
const count = 2000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    // color: '#ff88cc',
    size: 0.1,
    sizeAttenuation: true
})

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial) 
scene.add(particles)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


document.addEventListener('DOMContentLoaded', () => {
  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}
    const start = async() => {
      await delay(10)
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
   
      imageTargetSrc: './assets/targets/komtek.mind',
    });
  
    const {renderer, scene, camera} = mindarThree;
 
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const cake = await loadGLTF('./assets/models/cake/cake.gltf');
     


    console.log(cake)
    cake.scene.scale.set(1, 1, 1);
    cake.scene.position.set(0, 0, 0);
   
    

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(cake.scene);
 

    const audioClip = await loadAudio('./assets/sounds/Happy_Birthday.mp3');

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.PositionalAudio(listener);
    anchor.group.add(audio);

    audio.setBuffer(audioClip);
    audio.setVolume(70);
    audio.setRefDistance(100);
    audio.setLoop(true);

    anchor.onTargetFound = () => {
      audio.play();
    }
    anchor.onTargetLost = () => {
      audio.pause();
    }

    
    await mindarThree.start();

    renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    });
  }
  start();
///////////////////////////////////////////////////////////////


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

});


