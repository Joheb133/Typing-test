import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export default class Enemy {
    x: number;
    y: number;
    width: number = innerWidth / 500;
    radian: number;
    word: string;
    scene: THREE.Scene;
    model: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
    textObj: CSS2DObject;
    constructor(scene: THREE.Scene, x: number, y: number, radian: number, word: string) {
        this.scene = scene;
        this.x = x;
        this.y = y
        this.radian = radian;
        this.word = word;
        this.init();
    }

    private init() {
        //draw model
        const w = this.width;
        const geometry = new THREE.BoxGeometry(w, w, w);
        const material = new THREE.MeshBasicMaterial({ color: 0x6a6a6a, lightMapIntensity: 1});
        this.model = new THREE.Mesh(geometry, material);
        this.scene.add(this.model)
        this.model.position.set(this.x, this.y, 0)

        //draw text
        const span = document.createElement('span')
        this.textObj = new CSS2DObject(span);
        this.textObj.element.innerHTML = this.word;
        this.model.add(this.textObj);
        this.textObj.position.set(0, -this.width, 0);
    };

    resize() {
        this.width = innerWidth / 500;
        const scaleFactor = this.width / this.model.geometry.parameters.width;
        this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }
}



