import Enemy from "./src/assets/enemy.js";
import Player from "./src/assets/player.js";
import { dictionary } from "./src/assets/dictionary.js";
import getRndInteger from "./src/utils/rng.js";
import distance from "./src/utils/distance.js";
import * as THREE from 'three';
/* const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!; */

//export { ctx }
/* 
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    player.resize();
    enemyResize();
})

// ---enemy--- 
let enemyList: Enemy[] = [];
function createEnemy(length: number) {
    const radius = 400;
    for (let i = 0; i < length; i++) {
        const radian = (Math.PI * 2) / 80; // divide circle by fixed amount. There are problems when adding new enemies when using length
        const offset = getRndInteger(1, 200);
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

//enemy physics
function updateEnemy() {
    //seperate draw-text() & draw-circle() so text is always above circle
    //*not sure how expensive that is but it solves the problem for now
    enemyList.forEach((element, index) => {
        element.x -= Math.cos(element.radian) / 5
        element.y -= Math.sin(element.radian) / 5
        //collision
        if (distance(element.x, element.y, player.x, player.y) - (element.radius + player.radius) < 0) {
            enemyList.splice(index, 1) //destroy enemy on collision
            player.health--;
        }
        element.drawCircle()
    });
    enemyList.forEach(element => {
        element.drawText()
    })
}
createEnemy(20)

//enemy responsiveness
const previousScreenSize = {
    width: innerWidth / 2,
    height: innerHeight / 2
}
function enemyResize() {
    //find difference between previous screen size vs new screen size
    const differnceX = previousScreenSize.width - (innerWidth / 2);
    const differnceY = previousScreenSize.height - (innerHeight / 2);
    //update screen size
    previousScreenSize.width = innerWidth / 2;
    previousScreenSize.height = innerHeight / 2;
    enemyList.forEach(element => {
        element.resize(); //change radius
        //add offset(difference)
        element.x -= differnceX;
        element.y -= differnceY;
    })
}

//player physics
let removedEnemies: number = 0;
const player = new Player();
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') return;
    if (e.code === 'Backspace') { //remove 1 character from user input
        const playerLength = player.input.length;
        player.input = player.input.slice(0, playerLength - 1);
        return; //don't check other if statements
    };
    if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123) || e.key.charCodeAt(0) == 45) {
        player.input += e.key; //add character input
    };
    if (e.code === 'Space') { //read input
        let splicedEnemy: boolean = false;
        for (const [index, element] of enemyList.entries()) {
            if (player.input === element.word) { //if input = word run code then break out of loop. No need to check the whole loop if input = word
                enemyList.splice(index, 1);
                splicedEnemy = true;
                //score
                removedEnemies++;
                break
            }
        }
        if (!splicedEnemy) { //if user input = wrong AKA no enemies were spliced/destroyed
            splicedEnemy = false;
            player.color = '#ff3d3d';
            const timer = setTimeout(() => { //red indicator
                player.color = '#9BD8AA';
                clearTimeout(timer);
            }, 1000)
        }
        player.input = ''; // reset input
    };
});

//timer
let time: number = 1000;

const spawnTimer = function () {
    createEnemy(1)
    setTimeout(spawnTimer, time);
    if (time <= 500) return
    if (time > 3000) {
        time -= 50;
    } else {
        time -= 25;
    }
}
//setTimeout(spawnTimer, time)


//animator
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    updateEnemy();
    //stats
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'
    ctx.fillText(time.toString(), innerWidth / 2, 20)//enemy spawn rate
    ctx.fillText(removedEnemies.toString(), innerWidth / 2 + 100, 20)//enemies killed
}
*/
//animate();

//cube test
let width: number = window.innerWidth;
let height: number = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-el') as HTMLCanvasElement });
renderer.setSize(width, height)
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffad00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.z = -5;
cube.position.y = 1;

scene.add(cube)

const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(0, 4, 2)

scene.add(light)

renderer.render(scene, camera)