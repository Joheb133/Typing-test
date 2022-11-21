import { ctx } from "../index.js";
export default class Enemy {
    constructor(x, y, radian, word) {
        this.radius = innerWidth / 100;
        this.x = x;
        this.y = y;
        this.radian = radian;
        this.word = word;
    }
    draw() {
        this.drawText();
        this.drawCircle();
    }
    ;
    drawText() {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(this.word, this.x, this.y + this.radius + 16);
    }
    drawCircle() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }
    resize() {
        this.radius = innerWidth / 100;
    }
}
//# sourceMappingURL=enemy.js.map