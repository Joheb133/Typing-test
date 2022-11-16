const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    player.resize();
    enemyList.forEach(element => {
        element.resize();
    })
})

//distance function
function distance(x1: number, y1: number, x2: number, y2: number) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

//random function
function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

window.addEventListener('click', () => {
    enemyList.forEach(element => {
        element.x = getRndInteger(innerWidth / 2, innerWidth);
        element.y = getRndInteger(innerHeight / 2, innerHeight)
    })
});

//enemy
class Enemy {
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

//player
class Player {
    x: number = innerWidth / 2;
    y: number = innerHeight / 2;
    radius: number = innerWidth / 50;
    health: number = 500;

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#9BD8AA'
        ctx.fill();
    }

    resize() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
        this.radius = innerWidth / 50;
    }
}

const player = new Player();

let enemyList: Enemy[] = []; 

function generateParticles(length: number) {
    const radius = 400;
    for(let i = 0; i < length; i++){
        const radian = (Math.PI * 2) / length; // divide circle by length amount
        const offset = getRndInteger(1, 400)
        // (radian * i) allows access to each incision of the circle. This is like saying radian * 1 ... radian * 2 etc.
        // because the circle(Math.PI * 2) is divided by length, we can access each division by multiplying radian by a number
        // in this case Max number would be length, at which the loop ends
        const x = (innerWidth / 2) + (Math.cos(radian * i) * (radius + (offset))); // cos(radian * i) set xPos //cos is used to access x-axis // multiply by radius because cos and sin gives numbers from 0-1. This gives the radius circles will spawn around + offset
        const y = (innerHeight / 2) + (Math.sin(radian * i) * (radius + (offset))); // sin(radian * i) set yPos //sin is used access y-axiss
        const enemy = new Enemy(x, y, radian*i);
        enemyList.push(enemy);
    }
}

generateParticles(50)


console.log(enemyList)

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    enemyList.forEach(element => {
        element.x -= Math.cos(element.radian) / 5
        element.y -= Math.sin(element.radian) / 5
        element.draw();
    });
}
animate();

//Distance formula = (x1, y1, x2, y2) - (radius1, radius2) < 0
//