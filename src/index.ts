import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import Player from './assets/player';
import EnemyHandler from './assets/EnemyHandler';

//setup
let width: number = window.innerWidth;
let height: number = window.innerHeight;
//renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    canvas: document.getElementById('canvas-el') as HTMLCanvasElement 
});
renderer.setSize(width, height)
//css2drenderer
const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(width, height);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);
//camera
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const scene = new THREE.Scene(); //create scene

const light = new THREE.AmbientLight(0x404040, 1)
scene.add(light)
scene.background = new THREE.Color(0xf5f5f5)

//create player + enemy
const enemy = new EnemyHandler(scene)
const player = new Player(scene, cssRenderer, enemy);

//resize renderer
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height)
    //resize camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    //resize cssrenderer
    cssRenderer.setSize(width, height);
    player.resize();
    enemy.resize();
})

//animator
function animator() {
    enemy.update()
    player.update()
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera)
    requestAnimationFrame(animator)
}
animator();
