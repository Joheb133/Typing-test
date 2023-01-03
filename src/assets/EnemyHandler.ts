import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { dictionary } from "./dictionary";
import getRndFloat from "../utils/rng";

export default class EnemyHandler {
    list: THREE.Mesh[] = [];
    // previousWidth: number = window.innerWidth / 2;
    // previousHeight: number = window.innerHeight / 2;
    scene: THREE.Scene;
    speed: number;
    model: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    textObj: CSS2DObject;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.speed = 1 / 50;
        this.model = this.createModel()
    }

    async initialize() {
        this.createEnemy(0);
    }

    private createEnemy(length: number) {
        const buffer = 20; //20 is default
        for (let i = 0; i < length; i++) {
            const word = dictionary[getRndFloat(0, dictionary.length - 1, 0)];
            const mesh = this.model.clone();

            //position
            mesh.position.x = getRndFloat(-100, 100, 1); //defaullt -100, 100
            mesh.position.y = 5;
            mesh.position.z = getRndFloat(-100, 100, 1);

            //add buffer if needed
            const x = mesh.position.x;
            const z = mesh.position.z;

            if (Math.abs(x) < buffer && Math.abs(z) < buffer) {
                //Important that buffer is negative when negative position and vice versa
                (x / Math.abs(x) == 1) ? mesh.position.x += buffer : mesh.position.x -= buffer;
                (z / Math.abs(z) == 1) ? mesh.position.z += buffer : mesh.position.z -= buffer;
            }

            //draw text
            const span = document.createElement('span')
            const text = new CSS2DObject(span);
            text.name = 'text';
            span.innerText = word;
            text.position.set(0, -2, 0);
            mesh.add(text);
            this.list.push(mesh);
            this.scene.add(mesh);
        }
    }

    update() {
        //enemy physics
        this.list.forEach(element => {
            //update enemy x, y
            const x = element.position.x;
            const z = element.position.z;
            const angle = Math.atan2(-z, -x);
            element.position.x += Math.cos(angle) * this.speed;
            element.position.z += Math.sin(angle) * this.speed;
        });
    }

    // resize() {
    //     this.list.forEach(element => {
    //         element.resize(); //change radius
    //     })
    // }

    private createModel() {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x822828 })
        )
        const subMesh1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 1.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x815C28 })
        )
        const subMesh2 = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x815C28 })
        )
        const subMesh3 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x815C28 })
        )

        mesh.add(subMesh1, subMesh2, subMesh3)
        return mesh
    }
}