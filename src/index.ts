import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import Player from './assets/player';
import EnemyHandler from './assets/EnemyHandler';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

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
cssRenderer.domElement.className = 'text-renderer'
document.body.appendChild(cssRenderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 500);
camera.position.set(-40, 40, 40) //default was -40, 40, 40 //testing is 0, 40, 40
camera.lookAt(new THREE.Vector3(0, 0, 0));

//post processing


//lighting
const spotLight = new THREE.SpotLight(0xffffff, 1.25, 30, Math.PI/3, 0, 1.25);
spotLight.position.set(5, 15, 0);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLight.add(spotLightHelper)

//ship lighting
RectAreaLightUniformsLib.init();
const shipBottomLights = new THREE.Group();

const rLight1 = new THREE.RectAreaLight(0xff0600, 10, 4, 3);
rLight1.position.set(0, 4, 6)

const rLight2 = new THREE.RectAreaLight(0x004cff, 40, 0.5, 3);
rLight2.position.set(-2, 4, 0);

const rLight3 = new THREE.RectAreaLight(0x004cff, 40, 0.5, 3);
rLight3.position.set(2, 4, 0);

const rLight4 = new THREE.RectAreaLight(0xffffff, 10, 2, 2);
rLight4.position.set(0, 4, -6);

shipBottomLights.add(rLight1, rLight2, rLight3, rLight4);
shipBottomLights.children.forEach((element) => { //look to ground
    const light = element as THREE.RectAreaLight;
    light.rotateX(Math.PI * -0.5);
    const lightHelper = new RectAreaLightHelper(light);
    light.add(lightHelper);
});
scene.add(shipBottomLights);

//create plane
function createPlane() {
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load('/textures/terrain-normal.jpg');
    const roughnessMap = textureLoader.load('/textures/terrain-roughness.jpg');

    function useEffect() {
        [normalMap, roughnessMap].forEach((t) =>{
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(6, 6); 
        });

        normalMap.encoding = THREE.LinearEncoding;
        roughnessMap.encoding = THREE.LinearEncoding;
    };

    useEffect()

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({
            color: 0x080808,
            normalMap: normalMap,
            roughnessMap: roughnessMap, roughness: 0.55,
            metalness: 1,
        })
    );
    plane.rotation.set(Math.PI * -0.5, 0, 0);

    return plane as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>
}
const plane = createPlane()
scene.add(plane)

//create player + enemy
const enemy = new EnemyHandler(scene)
const player = new Player(scene, cssRenderer, enemy.list);

//configure layers


//console.log(dLight.layers.mask, plane.layers.mask)

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
