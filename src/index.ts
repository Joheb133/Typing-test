import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
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
camera.position.set(-40, -40, 40)
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.up.set(0, 0, 1)


//post processing
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene)

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.75,
    1,
    0
)
composer.addPass(bloomPass)


//orbit controls
const controls = new OrbitControls(camera, canvas);

//lighting
const light = new THREE.PointLight(0xffffff)
light.position.set(0, 0, 50)
scene.add(light)
//scene.background = new THREE.Color(0xf4f4f4)

//create player + enemy
const enemy = new EnemyHandler(scene)
const player = new Player(scene, cssRenderer, enemy);

//resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height)
    //resize camera
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    //resize cssrenderer
    cssRenderer.setSize(width, height);
    //player.resize();
    enemy.resize();
})

//animator
function animator() {
    requestAnimationFrame(animator)
    enemy.update()
    player.update()
    composer.render();
    cssRenderer.render(scene, camera)
}
animator();
