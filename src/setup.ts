import * as THREE from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

//cube test
let width: number = window.innerWidth;
let height: number = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-el') as HTMLCanvasElement });
renderer.setSize(width, height)
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 4, 2)
scene.add(light)

renderer.render(scene, camera)