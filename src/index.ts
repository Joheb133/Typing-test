import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import Player from './assets/player';
import EnemyHandler from './assets/EnemyHandler';

//setup
let width: number = window.innerWidth;
let height: number = window.innerHeight;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const scene = new THREE.Scene(); //create scene

//renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
});
renderer.setSize(width, height)

//css2drenderer
const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(width, height);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
camera.position.set(0, 40, 40) //default was -40, -40, 40
camera.lookAt(new THREE.Vector3(0, 0, 0));

//post processing


//lighting
const light = new THREE.PointLight(0xffffff, 1, 200)
light.position.set(0, 20, 0)
const ambientLight = new THREE.AmbientLight(0xffffff, 0)
scene.add(light, ambientLight)
scene.background = new THREE.Color(0x6a6a6a)

//create plane
const planeGeo = new THREE.BoxGeometry(20, 0.5, 20);
const plane = new Reflector( planeGeo, {
    clipBias: 0.005,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
});
plane.position.set(0, 0, 0)
scene.add(plane)

//create player + enemy
const enemy = new EnemyHandler(scene)
const player = new Player(scene, cssRenderer, enemy.list);

//resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height)
    cssRenderer.setSize(width, height);

    //resize camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    //player.resize();
    //enemy.resize();
})

//animator
function animator() {
    requestAnimationFrame(animator)
    enemy.update()
    player.update()
    renderer.render(scene, camera)
    cssRenderer.render(scene, camera)
}
animator();
