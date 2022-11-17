import { createJsxText } from "../../node_modules/typescript/lib/typescript.js";
import { ctx } from "../index.js";
export default class Enemy {
    x: number;
    y: number;
    radius: number = innerWidth / 100;
    radian: number;
    word: string;
    constructor(x: number, y: number, radian: number, word: string) {
        this.x = x;
        this.y = y
        this.radian = radian;
        this.word = word;
    }

    draw() {
        //circle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF'
        ctx.fill();
        //text
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center'
        ctx.fillText(this.word, this.x, this.y + this.radius + 16)
    };

    resize() {
        this.radius = innerWidth / 100;
    }
}



