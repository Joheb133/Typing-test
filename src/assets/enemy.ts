import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

export default class Enemy {
    x: number;
    y: number;
    radius: number = innerWidth / 500;
    radian: number;
    word: string;
    scene: THREE.Scene;
    model: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    textObj: CSS2DObject;
    constructor(scene: THREE.Scene, x: number, y: number, radian: number, word: string) {
        this.scene = scene;
        this.x = x;
        this.y = y
        this.radian = radian;
        this.word = word;
        this.draw();
    }

    private draw() {
        //draw model
        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const mesh = new THREE.MeshBasicMaterial({ color: 0x34eb77 });
        this.model = new THREE.Mesh(geometry, mesh);
        this.scene.add(this.model)
        this.model.position.set(this.x, this.y, 0)

        //draw text
        const span = document.createElement('span')
        this.textObj = new CSS2DObject(span);
        this.textObj.element.innerHTML = this.word;
        this.model.add(this.textObj);
        this.textObj.position.set(0, -this.radius, 0);
    };

    resize() {
        this.radius = innerWidth / 500;
        const scaleFactor = this.radius / this.model.geometry.parameters.radius;
        this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }
}



