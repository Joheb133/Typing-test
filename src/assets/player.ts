import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import distance from "../utils/distance";

export default class Player {
    health: number = 200;
    input: string = '';
    removedEnemies: number = 0;

    enemyList: THREE.Mesh [] = [];
    scene: THREE.Scene;
    model: THREE.Mesh;
    textObj: CSS2DObject;
    cssRenderer: CSS2DRenderer;

    constructor(scene: THREE.Scene, cssRenderer: CSS2DRenderer, enemyList: THREE.Mesh []) {
        this.scene = scene;
        this.cssRenderer = cssRenderer;
        this.enemyList = enemyList;
        this.initialize();
    }

    private async initialize() {
        //=>load model<=
        this.model = await this.laodPlayerModel();
        const rad = Math.PI / 180

        //model properties
        this.model.scale.set(2, 2, 2)
        this.model.geometry.center()
        this.model.position.set(0, 5, 0)
        this.model.rotation.set(0 * rad, rad * 180, rad * 0)
        //create text
        const span = document.createElement('span')
        this.textObj = new CSS2DObject(span);
        this.model.add(this.textObj);
        this.textObj.position.set(0, 0, -4);

        //add group to scene
        this.scene.add(this.model)

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
            for (const [index, element] of this.enemyList.entries()) {
                const textObj = element.getObjectByName('text') as CSS2DObject;
                if (this.input === textObj.element.innerText) { //if input = word run code then break out of loop. No need to check the whole loop if input = word
                    this.destroyEnemy(element);
                    this.enemyList.splice(index, 1);
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
        this.enemyList.forEach((element, index) => {
            if (distance(element.position.x, element.position.z, 0, 0) <= 5) {
                //destroy enemy on collision
                this.destroyEnemy(element)
                this.enemyList.splice(index, 1)  //remove enemy from enemy handlers list

                this.health--;
            }
        });
    };

    private destroyEnemy(element: THREE.Mesh) {
        this.scene.remove(element);
        element.children.forEach(child => {
            if(child.type == 'Mesh') {
                const mesh = child as THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>
                mesh.geometry.dispose();
                mesh.material.dispose();
            } else if (child.type == 'Object3D' && this.cssRenderer.domElement.children.length > 1) {
                const textObj = element.getObjectByName('text') as CSS2DObject;
                this.cssRenderer.domElement.removeChild(textObj.element)
            }
        });
    };

    private async laodPlayerModel() {
        const textureLoader = new THREE.TextureLoader();
        const lightMap = textureLoader.load('/assets/warship/lightMap.png') as any;
        const map = textureLoader.load('/assets/warship/Warship.png')

        const objLoader = new OBJLoader();

        const obj = await objLoader.loadAsync('/assets/warship/Warship.obj');
        const objMesh = obj.children[0] as THREE.Mesh
        const material = new THREE.MeshPhongMaterial({
            color: 0x818181,
            map: map, //object skin
            emissive: 0xffffff, emissiveMap: lightMap, emissiveIntensity: 1, //parts that glow
        })

        const mesh = new THREE.Mesh(objMesh.geometry, material)

        return mesh;
    };

    // public resize() {
    //     this.radius = innerWidth / 500;
    //     const scaleFactor = this.radius / this.model.geometry.parameters.radius;
    //     this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    // }

    public update() {
        this.collisionDetection();
    };
}