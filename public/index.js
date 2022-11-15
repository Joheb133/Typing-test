"use strict";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    player.resize();
    enemyList.forEach(element => {
        element.resize();
    });
});
function distance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
window.addEventListener('click', () => {
    enemyList.forEach(element => {
        element.x = getRndInteger(innerWidth / 2, innerWidth);
        element.y = getRndInteger(innerHeight / 2, innerHeight);
    });
});
class Enemy {
    constructor(x, y) {
        this.radius = innerWidth / 100;
        this.x = x;
        this.y = y;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
    }
    ;
    resize() {
        this.radius = innerWidth / 50;
    }
}
class Player {
    constructor() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 4;
        this.health = 500;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#9BD8AA';
        ctx.fill();
    }
    resize() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
    }
}
const player = new Player();
let enemyList = [];
function generateParticles(length) {
    const radius = 400;
    for (let i = 0; i < length; i++) {
        const radian = (Math.PI * 2) / length;
        const x = (innerWidth / 2) + (Math.cos(radian * i) * getRndInteger(radius, radius + 400));
        const y = (innerHeight / 2) + (Math.sin(radian * i) * getRndInteger(radius, radius + 400));
        const enemy = new Enemy(x, y);
        enemyList.push(enemy);
    }
}
generateParticles(50);
console.log(enemyList);
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    enemyList.forEach(element => {
        element.draw();
    });
}
animate();
//# sourceMappingURL=index.js.map