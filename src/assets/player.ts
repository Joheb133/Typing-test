import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { gsap } from 'gsap'

export default class Player {
    health: number = 200;
    input: string = '';
    removedEnemies: number = 0;

    enemyList: THREE.Mesh[] = [];
    scene: THREE.Scene;
    model: THREE.Mesh;
    dimensions: THREE.Vector3 = new THREE.Vector3(3.4, 0, 7.5);
    text: HTMLSpanElement
    cssRenderer: CSS2DRenderer;
    laser: THREE.Mesh;
    textAnimating: boolean = false;

    constructor(scene: THREE.Scene, cssRenderer: CSS2DRenderer, enemyList: THREE.Mesh[]) {
        this.scene = scene;
        this.cssRenderer = cssRenderer;
        this.enemyList = enemyList;
    }

    async initialize() {
        //=>load model<=
        this.model = await this.loadPlayerModel();
        const rad = Math.PI / 180

        //model properties
        this.model.scale.set(2, 2, 2)
        this.model.geometry.center()
        this.model.position.set(0, 5, 0)
        this.model.rotation.set(0 * rad, rad * 180, rad * 0)
        //create text
        const span = document.createElement('span')
        this.cssRenderer.domElement.appendChild(span)
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.top = '50%';
        span.style.left = '50%';
        span.style.transform = 'translate(-50%, 0)'
        this.text = span;

        //add group to scene
        this.scene.add(this.model);

        //Key inputs
        document.addEventListener('keydown', (e) => this.updatePhysics(e));

        //create laser
        this.laser = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1),
            new THREE.MeshStandardMaterial({
                color: 0xff0600,
                emissive: 0xff0600, envMapIntensity: 5
            }))
        this.laser.position.set(0, 0, 0);
        this.model.add(this.laser)
    }

    private async updatePhysics(e: KeyboardEvent) { //player input
        const textEl = this.text;

        //backspace input
        if (e.code === 'Backspace') {
            this.input = this.input.slice(0, this.input.length - 1);
            textEl.innerText = this.input;

            if (this.input.length == 0) textEl.style.visibility = 'hidden';
            return; //don't check other if statements
        };

        //read user input
        if (e.code === 'Space') {
            let splicedEnemy: boolean = false;

            //read each enemies word
            for (const [index, enemy] of this.enemyList.entries()) {
                const textObj = enemy.getObjectByName('text') as CSS2DObject;

                //if input = enemy word
                if (this.input === textObj.element.innerText) {
                    //laser animation
                    const angle = Math.atan2(enemy.position.x, enemy.position.z);
                    this.laser.rotation.set(0, angle, 0)
                    gsap.to(this.laser.position, {
                        x: -enemy.position.x,
                        z: -enemy.position.z,
                        duration: 0.1,
                        onComplete: () => {
                            //animation complete
                            this.laser.position.set(0, 0, 0)
                            this.destroyEnemy(enemy);
                        },
                        ease: 'linear'
                    })

                    this.enemyList.splice(index, 1);
                    splicedEnemy = true;
                    //score
                    this.removedEnemies++;
                    break
                }
            }

            //if user input wrong
            if (!splicedEnemy) {
                //text animation
                const tl = gsap.timeline({repeat: 2})
                tl.to(textEl, {translateX: 5, duration: 0.03})
                tl.to(textEl, {translateX: -5, duration: 0.03})
                tl.to(textEl, {translateX: 5, duration: 0.03})
                tl.to(textEl, {translateX: -5, duration: 0.03, onComplete: ()=>{
                    // reset input when animation complete
                    this.input = ''; 
                    textEl.innerHTML = this.input;
                    textEl.style.visibility = 'hidden';
                }})
            } else {
                this.input = ''; // reset input
                textEl.innerHTML = this.input;
                textEl.style.visibility = 'hidden';
            }
        };

        //input is not letter
        if (e.key.length > 2) return

        //input is letters a-z
        if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123) || e.key.charCodeAt(0) == 45) {
            this.input += e.key;
            textEl.innerHTML = this.input;
            if (textEl.style.visibility == 'hidden') textEl.style.visibility = 'visible'
        };
    }

    private collisionDetection() {
        //collision
        this.enemyList.forEach((enemy, index) => {
            if (Math.abs(enemy.position.x) - Math.abs(this.dimensions.x) <= 0 &&
                Math.abs(enemy.position.z) - Math.abs(this.dimensions.z) <= 0
            ) {
                this.destroyEnemy(enemy)
                this.enemyList.splice(index, 1)  //remove enemy from enemy handlers list

                this.health--;
            }
        });
    };

    private destroyEnemy(enemy: THREE.Mesh) {
        //remove from scene
        this.scene.remove(enemy);
        //dispose all children of enemy
        enemy.children.forEach(child => {
            if (child.type == 'Mesh') {
                const mesh = child as THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>
                mesh.geometry.dispose();
                mesh.material.dispose();
            } else if (child.type == 'Object3D' && this.cssRenderer.domElement.children.length > 1) {
                const textObj = enemy.getObjectByName('text') as CSS2DObject;
                this.cssRenderer.domElement.removeChild(textObj.element)
            }
        });
    };

    private async loadPlayerModel() {
        const textureLoader = new THREE.TextureLoader();
        const lightMap = textureLoader.load('/assets/warship/lightMap.png') as any;
        const map = textureLoader.load('/assets/warship/Warship.png')

        const objLoader = new OBJLoader();

        const obj = await objLoader.loadAsync('/assets/warship/Warship.obj');
        const objMesh = obj.children[0] as THREE.Mesh
        const material = new THREE.MeshStandardMaterial({
            color: 0x818181,
            map: map, //object skin
            emissive: 0xffffff, emissiveMap: lightMap, emissiveIntensity: 1, //parts that glow
        })

        const mesh = new THREE.Mesh(objMesh.geometry, material)

        const boundingBox = new THREE.Box3().setFromObject(mesh);
        this.dimensions = boundingBox.getSize(new THREE.Vector3()) as THREE.Vector3;

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