import * as THREE from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import Player from './assets/player';

//setup
let width: number = window.innerWidth;
let height: number = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-el') as HTMLCanvasElement });
renderer.setSize(width, height)
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
camera.position.set(0, 0, 50)
camera.lookAt(new THREE.Vector3(0, 0, 0))
const scene = new THREE.Scene();

const light = new THREE.AmbientLight(0x404040, 1)
scene.add(light)

//player
const player = new Player(scene);

//cube test
// const geometry = new THREE.SphereGeometry(1, 16, 16)
// const material = new THREE.MeshBasicMaterial({color: 0xff0000})
// const cube = new THREE.Mesh(geometry, material)

//resize renderer
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height)
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    player.resize();
})

//animator
function animator() {
    player.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animator)
}
animator();