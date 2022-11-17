import Enemy from "./assets/enemy.js";
import Player from "./assets/player.js";
const canvas = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;

export {ctx}

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

window.addEventListener('click', () => {
    //clearInterval(timerParticle)
});


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

//Create player & enemy
const dictionary: string[] = ['bob','trunk','part','produce','name','observation','offender','calf','ferry','coffin','agreement','regular','smart','harm','final'];
const player = new Player();
let enemyList: Enemy[] = []; 
function generateParticles(length: number) {
    const radius = 400;
    for(let i = 0; i < length; i++){
        const radian = (Math.PI * 2) / 90; // divide circle by fixed amount. There are problems when adding new enemies when using length
        const offset = getRndInteger(1, 400);
        const word = dictionary[getRndInteger(0, dictionary.length - 1)];
        // (radian * i) allows access to each incision of the circle. This is like saying radian * 1 ... radian * 2 etc.
        // because the circle(Math.PI * 2) is divided by length, we can access each division by multiplying radian by a number
        // in this case Max number would be length, at which the loop ends
        const x = (innerWidth / 2) + (Math.cos(radian * offset) * (radius + (offset))); // cos(radian * i) set xPos //cos is used to access x-axis // multiply by radius because cos and sin gives numbers from 0-1. This gives the radius circles will spawn around + offset
        const y = (innerHeight / 2) + (Math.sin(radian * offset) * (radius + (offset))); // sin(radian * i) set yPos //sin is used access y-axiss
        const enemy = new Enemy(x, y, radian * offset, word);
        enemyList.push(enemy);
    }
}

generateParticles(50)

function animate() {
    //requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    enemyList.forEach((element, index) => {
        element.x -= Math.cos(element.radian) / 2
        element.y -= Math.sin(element.radian) / 2
        //collision
        if(distance(element.x, element.y, player.x, player.y) - (element.radius + player.radius) < 0) {
            enemyList.splice(index, 1) //destroy enemy on collision
            player.health--;
        }
        element.draw();
    });
}
animate();

//Distance formula = (x1, y1, x2, y2) - (radius1, radius2) < 0
//