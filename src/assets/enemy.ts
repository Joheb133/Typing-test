import * as THREE from 'three';

export default class Enemy {
    x: number;
    y: number;
    radius: number = innerWidth / 500;
    radian: number;
    word: string;
    scene: THREE.Scene;
    model: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    constructor(scene: THREE.Scene, x: number, y: number, radian: number, word: string) {
        this.scene = scene;
        this.x = x;
        this.y = y
        this.radian = radian;
        this.word = word;
        this.draw();
    }

    draw() {
        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const mesh = new THREE.MeshBasicMaterial({color: 0x34eb77});
        this.model = new THREE.Mesh(geometry, mesh);
        this.scene.add(this.model)
        this.model.position.set(this.x, this.y, 0)
    };

    resize() {
        this.radius = innerWidth / 500;
        const scaleFactor = this.radius / this.model.geometry.parameters.radius;
        this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }
}



