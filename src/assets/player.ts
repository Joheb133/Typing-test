import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { gsap } from 'gsap'
import { Howl, Howler } from 'howler';

export default class Player {
    model: THREE.Mesh;
    laser: THREE.Mesh;
    enemyList: THREE.Mesh[] = [];
    health: number = 20;

    private input: string = '';
    private scene: THREE.Scene;
    private dimensions: THREE.Vector3 = new THREE.Vector3(3.4, 0, 7.5);

    private text: HTMLSpanElement
    private cssRenderer: CSS2DRenderer;

    private healthGui = document.querySelector(".gui .health .bar") as HTMLDivElement;
    private healthFraction = this.healthGui.offsetWidth / this.health as number;

    private sfx = {
        pew: new Howl({
            src: [
                "/sound-effects/mixkit-short-laser-gun-shot.webm",
                "/sound-effects/mixkit-short-laser-gun-shot.mp3"
            ]
        }) as Howl
    }

    constructor(scene: THREE.Scene, cssRenderer: CSS2DRenderer, enemyList: THREE.Mesh[]) {
        this.scene = scene;
        this.cssRenderer = cssRenderer;
        this.enemyList = enemyList;
    }

    addKeyboard() {
        //Key inputs
        document.addEventListener('keydown', (e) => this.updatePhysics(e));
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
                    this.laser.rotation.set(0, angle, 0);
                    this.sfx.pew.play();
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
                    break
                }
            }

            //if user input wrong
            if (!splicedEnemy) {
                //text animation
                const tl = gsap.timeline({
                    repeat: 2, onComplete: () => {
                        // reset input when animation complete
                        this.input = '';
                        textEl.innerHTML = this.input;
                        textEl.style.visibility = 'hidden';
                    }
                })
                tl.to(textEl, { translateX: 5, duration: 0.03 })
                tl.to(textEl, { translateX: -5, duration: 0.03 })
                tl.to(textEl, { translateX: 5, duration: 0.03 })
                tl.to(textEl, { translateX: -5, duration: 0.03 })
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

                //update player health
                this.health -= 1;
                this.healthGui.style.width = `${this.healthGui.offsetWidth - this.healthFraction}px`
                console.log(this.health);
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
            } else if ((child as CSS2DObject).name == 'text' && this.cssRenderer.domElement.contains((child as CSS2DObject).element)) {
                const textObj = enemy.getObjectByName('text') as CSS2DObject;
                this.cssRenderer.domElement.removeChild(textObj.element)
            }
        });
    };

    private async loadPlayerModel() {
        const textureLoader = new THREE.TextureLoader();
        const lightMap = textureLoader.load('/3d-assets/warship/lightMap.png') as any;
        const map = textureLoader.load('/3d-assets/warship/Warship.png')

        const objLoader = new OBJLoader();

        const obj = await objLoader.loadAsync('/3d-assets/warship/Warship.obj');
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

    reset() {
        this.health = 20;
        this.healthFraction = this.healthGui.offsetWidth / this.health as number;
        this.healthGui.style.width = "100%";

        this.input = ''; // reset input
        this.text.innerHTML = this.input;
        this.text.style.visibility = 'hidden';
    }

    public update() {
        this.collisionDetection();
    };
}