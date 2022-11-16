import { ctx } from "../index.js";
export default class Enemy {
    x: number;
    y: number;
    radius: number = innerWidth / 100;
    radian: number;
    constructor(x: number, y: number, radian: number) {
        this.x = x;
        this.y = y
        this.radian = radian;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF'
        ctx.fill();
    };

    resize() {
        this.radius = innerWidth / 100;
    }
}