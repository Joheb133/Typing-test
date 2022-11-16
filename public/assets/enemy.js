import { ctx } from "../index.js";
export default class Enemy {
    constructor(x, y, radian) {
        this.radius = innerWidth / 100;
        this.x = x;
        this.y = y;
        this.radian = radian;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }
    ;
    resize() {
        this.radius = innerWidth / 100;
    }
}
//# sourceMappingURL=enemy.js.map