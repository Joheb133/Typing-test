import * as THREE from 'three';
import EnemyHandler from "./EnemyHandler.js";
import distance from "../utils/distance.js";

export default class Player{
    x: number = innerWidth / 2;
    y: number = innerHeight / 2;
    radius: number = innerWidth / 500;
    health: number = 200;
    input: string = '';
    color: string = '#9BD8AA';
    removedEnemies: number = 0;
    enemy: EnemyHandler;
    scene: THREE.Scene;
    model: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

    constructor(scene: THREE.Scene, enemy: EnemyHandler) {
        this.scene = scene;
        this.enemy = enemy;
        //this.enemy = enemy;
        this.initialize();
    }

    private async initialize() {
        //=>load model<=
        const sphereGeometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.model = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.model);

        //Key inputs
        //document.addEventListener('keydown', (e) => this.updatePhysics(e))
    }

/*     private updatePhysics(e: KeyboardEvent) {
        if (e.code === 'Enter') return;
        if (e.code === 'Backspace') { //remove 1 character from user input
            this.input = this.input.slice(0, this.input.length - 1);
            return; //don't check other if statements
        };
        if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123) || e.key.charCodeAt(0) == 45) {
            this.input += e.key; //add character input
        };
        if (e.code === 'Space') { //read input
            let splicedEnemy: boolean = false;
            for (const [index, element] of this.enemy.list.entries()) {
                if (this.input === element.word) { //if input = word run code then break out of loop. No need to check the whole loop if input = word
                    this.enemy.list.splice(index, 1);
                    splicedEnemy = true;
                    //score
                    this.removedEnemies++;
                    break
                }
            }
            if (!splicedEnemy) { //if user input = wrong AKA no enemies were spliced/destroyed
                splicedEnemy = false;
                this.color = '#ff3d3d';
                const timer = setTimeout(() => { //red indicator
                    this.color = '#9BD8AA';
                    clearTimeout(timer);
                }, 1000)
            }
            this.input = ''; // reset input
        };
    } */

    public resize() {
        this.radius = innerWidth / 500;
        const scaleFactor = this.radius / this.model.geometry.parameters.radius;
        this.model.scale.set(scaleFactor, scaleFactor, scaleFactor)
    }

    private collisionDetection() {
        //collision
        this.enemy.list.forEach((element, index) => {
            if (distance(element.model.position.x, element.model.position.y, 0, 0) <= this.radius+element.radius) {
                //destroy enemy on collision
                this.scene.remove(element.model) //remove enemy model
                element.model.geometry.dispose(); //clean memory
                element.model.material.dispose();
                this.enemy.list.splice(index, 1)  //remove enemy from enemy handlers list

                this.health--;
            }
        });
    };

    public update() {
        this.collisionDetection();
    }
}