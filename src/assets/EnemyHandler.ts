import * as THREE from 'three'
import Enemy from "./enemy";
import { dictionary } from "./dictionary";
import getRndFloat from "../utils/rng";

export default class EnemyHandler {
    list: Enemy[] = [];
    previousWidth: number = window.innerWidth / 2;
    previousHeight: number = window.innerHeight / 2;
    scene: THREE.Scene;
    speed: number;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.speed = 1/20;
        this.initialize();
    }

    initialize() {
        //=>load model<=
        this.createEnemy(20);
    }

    private createEnemy(length: number) {
        const radius = 5; //enemy creation radius
        for (let i = 0; i < length; i++) {
            const radian = (Math.PI * 2) / 20; // divide circle by fixed amount. There are problems when adding new enemies when using length
            const offset = getRndFloat(60, 400, 5); // 60, 400 is a nice sweet spot
            const word = dictionary[getRndFloat(0, dictionary.length - 1, 0)];
            // (radian * i) allows access to each incision of the circle. This is like saying radian * 1 ... radian * 2 etc.
            // because the circle(Math.PI * 2) is divided by length, we can access each division by multiplying radian by a number
            // in this case Max number would be length, at which the loop ends
            const x = (Math.cos(radian * offset) * (radius + (offset))); // cos(radian * i) set xPos //cos is used to access x-axis // multiply by radius because cos and sin gives numbers from 0-1. This gives the radius circles will spawn around + offset
            const y = (Math.sin(radian * offset) * (radius + (offset))); // sin(radian * i) set yPos //sin is used access y-axiss
            const enemy = new Enemy(this.scene, x, y, radian * offset, word);
            this.list.push(enemy);
        }
    }

    update() {
        //enemy physics
        this.list.forEach(element => {
            //update enemy x, y
            element.x -= Math.cos(element.radian) * this.speed;
            element.y -= Math.sin(element.radian) * this.speed;
            //update model position
            element.model.position.x = element.x;
            element.model.position.y = element.y;
        });
        // this.list.forEach(element => {
        //     element.drawText()
        // })
    }

    resize() {
        this.list.forEach(element => {
            element.resize(); //change radius
        })
    }
}