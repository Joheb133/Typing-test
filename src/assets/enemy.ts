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
        this.drawText();
        this.drawCircle();
    };
    drawText() {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center'
        ctx.fillText(this.word, this.x, this.y + this.radius + 16)
    }
    drawCircle() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF'
        ctx.fill();
    }

    resize() {
        this.radius = innerWidth / 100;
    }
}



