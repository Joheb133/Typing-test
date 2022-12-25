import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import EnemyHandler from "./EnemyHandler";
import Enemy from './enemy';
import distance from "../utils/distance";

export default class Player {
    x: number = innerWidth / 2;
    y: number = innerHeight / 2;
    radius: number = innerWidth / 500;
    health: number = 200;
    input: string = '';
    removedEnemies: number = 0;

    enemy: EnemyHandler;
    scene: THREE.Scene;
    model: THREE.Mesh;
    group: THREE.Group
    cssRenderer: CSS2DRenderer;
    textObj: CSS2DObject;

    constructor(scene: THREE.Scene, cssRenderer: CSS2DRenderer, enemy: EnemyHandler) {
        this.scene = scene;
        this.cssRenderer = cssRenderer;
        this.enemy = enemy;
        this.group = new THREE.Group();
        //this.enemy = enemy;
        this.initialize();
    }

    private async initialize() {
        //=>load model<=
        const rad = Math.PI / 180
        this.model = await this.laodPlayerModel();
        this.group.add(this.model)

        //model properties
        this.model.scale.set(2, 2, 2)
        this.model.geometry.center()
        this.model.rotation.set(90 * rad, rad * 180, 0)
        //create text
        const span = document.createElement('span')
        this.textObj = new CSS2DObject(span);
        this.group.add(this.textObj);
        this.textObj.position.set(0, 0, -4);

        //add group to scene
        this.scene.add(this.group)

        //Key inputs
        document.addEventListener('keydown', (e) => this.updatePhysics(e))
    }

    private updatePhysics(e: KeyboardEvent) { //player input
        if (e.code === 'Backspace') { //remove 1 character from user input
            this.input = this.input.slice(0, this.input.length - 1);
            this.textObj.element.innerHTML = this.input;
            return; //don't check other if statements
        };
        if (e.code === 'Space') { //read input
            let splicedEnemy: boolean = false;
            for (const [index, element] of this.enemy.list.entries()) {
                if (this.input === element.word) { //if input = word run code then break out of loop. No need to check the whole loop if input = word
                    this.destroyEnemy(element);
                    this.enemy.list.splice(index, 1);
                    splicedEnemy = true;
                    //score
                    this.removedEnemies++;
                    break
                }
            }
            // if (!splicedEnemy) { //if user input = wrong AKA no enemies were spliced/destroyed
            //     splicedEnemy = false;
            //     this.model.material.color.set(0xff3d3d)
            //     const timer = setTimeout(() => { //red indicator
            //         this.model.material.color.set(0x9BD8AA)
            //         clearTimeout(timer);
            //     }, 1000)
            // }
            this.input = ''; // reset input
            this.textObj.element.innerHTML = this.input;
        };
        if(e.key.length > 2) return
        if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123) || e.key.charCodeAt(0) == 45) {
            this.input += e.key; //add character input
            this.textObj.element.innerHTML = this.input;
        };
    }

    private collisionDetection() {
        //collision
        this.enemy.list.forEach((element, index) => {
            if (distance(element.model.position.x, element.model.position.y, 0, 0) <= this.radius + element.width) {
                //destroy enemy on collision
                this.destroyEnemy(element)
                this.enemy.list.splice(index, 1)  //remove enemy from enemy handlers list

                this.health--;
            }
        });
    };

    private destroyEnemy(element: Enemy) {
        this.scene.remove(element.model) //remove enemy model + text(text is attached so it gets removed)
        element.model.geometry.dispose(); //clean memory
        element.model.material.dispose();
        this.cssRenderer.domElement.removeChild(element.textObj.element) // remove text element
    }

    private async laodPlayerModel() {
        const textureLoader = new THREE.TextureLoader();
        const lightMap = textureLoader.load('/assets/warship/lightMap.png') as any;
        const map = textureLoader.load('/assets/warship/Warship.png')

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        const mtl = await mtlLoader.loadAsync('/assets/warship/Warship.mtl');
        mtl.preload();

        const obj = await objLoader.loadAsync('/assets/warship/Warship.obj');
        const objMesh = obj.children[0] as THREE.Mesh
        const material = new THREE.MeshPhongMaterial({map: map, emissive: 0xffffff, emissiveMap: lightMap, emissiveIntensity: 1.2})

        const mesh = new THREE.Mesh(objMesh.geometry, material)

        return mesh;
    }

    // public resize() {
    //     this.radius = innerWidth / 500;
    //     const scaleFactor = this.radius / this.model.geometry.parameters.radius;
    //     this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    // }

    public update() {
        this.collisionDetection();
    }
}