import { ctx } from "../index.js";
export default class Player {
    x: number = innerWidth / 2;
    y: number = innerHeight / 2;
    radius: number = innerWidth / 50;
    health: number = 200;
    input: string = '';
    color: string = '#9BD8AA';

    draw() {
        //circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        //health
        ctx.beginPath();
        ctx.rect(0, 0, 200, 20);
        ctx.fillStyle = '#ff3d3d';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(0, 0, this.health, 20);
        ctx.fillStyle = '#9BD8AA';
        ctx.fill();
        //text
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center'
        ctx.fillText(this.input, this.x, this.y + this.radius + 16)
    }

    resize() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
    }
}
