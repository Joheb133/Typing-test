import Enemy from "./enemy";
import { dictionary } from "./dictionary";
import getRndInteger from "../utils/rng";
import { Context } from "vm";

export default class EnemyHandler {
    list: Enemy[] = [];
    previousWidth: number = window.innerWidth / 2;
    previousHeight: number = window.innerHeight / 2;
    ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
        this.initialize();
    }

    initialize() {
        //=>load model<=
        this.createEnemy(10);
    }

    private createEnemy(length: number) {
        const radius = 400;
        for (let i = 0; i < length; i++) {
            const radian = (Math.PI * 2) / 80; // divide circle by fixed amount. There are problems when adding new enemies when using length
            const offset = getRndInteger(1, 200);
            const word = dictionary[getRndInteger(0, dictionary.length - 1)];
            // (radian * i) allows access to each incision of the circle. This is like saying radian * 1 ... radian * 2 etc.
            // because the circle(Math.PI * 2) is divided by length, we can access each division by multiplying radian by a number
            // in this case Max number would be length, at which the loop ends
            const x = (innerWidth / 2) + (Math.cos(radian * offset) * (radius + (offset))); // cos(radian * i) set xPos //cos is used to access x-axis // multiply by radius because cos and sin gives numbers from 0-1. This gives the radius circles will spawn around + offset
            const y = (innerHeight / 2) + (Math.sin(radian * offset) * (radius + (offset))); // sin(radian * i) set yPos //sin is used access y-axiss
            const enemy = new Enemy(this.ctx, x, y, radian * offset, word);
            this.list.push(enemy);
        }
    }

    update() {
        //enemy physics
        this.list.forEach(element => {
            element.x -= Math.cos(element.radian) / 5
            element.y -= Math.sin(element.radian) / 5
            element.drawCircle()
        });
        this.list.forEach(element => {
            element.drawText()
        })
    }

    resize() {
        //find difference between previous screen size vs new screen size
        const differnceX = this.previousWidth - (window.innerWidth / 2);
        const differnceY = this.previousHeight - (window.innerHeight / 2);
        //update screen size
        this.previousWidth = window.innerWidth / 2;
        this.previousHeight = window.innerHeight / 2;
        this.list.forEach(element => {
            element.resize(); //change radius
            //add offset(difference)
            element.x -= differnceX;
            element.y -= differnceY;
        })
    }
}