import EnemyHandler from "./EnemyHandler.js";
import distance from "../utils/distance.js";
import { Context } from "vm";

export default class Player {
    x: number = innerWidth / 2;
    y: number = innerHeight / 2;
    radius: number = innerWidth / 50;
    health: number = 200;
    input: string = '';
    color: string = '#9BD8AA';
    removedEnemies: number = 0;
    enemy: EnemyHandler;
    ctx: Context;

    constructor(ctx: Context, enemy: EnemyHandler) {
        this.ctx = ctx;
        this.enemy = enemy;
        this.initialize();
    }

    public initialize() {
        //=>load model<=
        document.addEventListener('keydown', (e) => this.updatePhysics(e))
    }

    private updatePhysics(e: KeyboardEvent) {
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
    }

    private draw() {
        const ctx = this.ctx;
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

    public resize() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
    }

    private collisionDetection() {
        //collision
        this.enemy.list.forEach((element, index) => {
            if (distance(element.x, element.y, this.x, this.y) - (element.radius + this.radius) < 0) {
                this.enemy.list.splice(index, 1) //destroy enemy on collision
                this.health--;
            }
        });
    };

    public update() {
        this.collisionDetection();
        this.draw();
    }
}