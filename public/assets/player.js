import { ctx } from "../index.js";
export default class Player {
    constructor() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
        this.health = 200;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#9BD8AA';
        ctx.fill();
        ctx.beginPath();
        ctx.rect(0, 0, 200, 20);
        ctx.fillStyle = '#ff3d3d';
        ctx.fill();
        ctx.beginPath();
        ctx.rect(0, 0, this.health, 20);
        ctx.fillStyle = '#9BD8AA';
        ctx.fill();
    }
    resize() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
    }
}
//# sourceMappingURL=player.js.map