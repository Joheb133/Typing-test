import Enemy from "./assets/enemy.js";
import Player from "./assets/player.js";
import { dictionary } from "./assets/dictionary.js";
import getRndInteger from "./utils/rng.js";
import distance from "./utils/distance.js";
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
export { ctx };
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    player.resize();
    enemyResize();
});
let enemyList = [];
function createEnemy(length) {
    const radius = 400;
    for (let i = 0; i < length; i++) {
        const radian = (Math.PI * 2) / 80;
        const offset = getRndInteger(1, 200);
        const word = dictionary[getRndInteger(0, dictionary.length - 1)];
        const x = (innerWidth / 2) + (Math.cos(radian * offset) * (radius + (offset)));
        const y = (innerHeight / 2) + (Math.sin(radian * offset) * (radius + (offset)));
        const enemy = new Enemy(x, y, radian * offset, word);
        enemyList.push(enemy);
    }
}
function updateEnemy() {
    enemyList.forEach((element, index) => {
        element.x -= Math.cos(element.radian) / 5;
        element.y -= Math.sin(element.radian) / 5;
        if (distance(element.x, element.y, player.x, player.y) - (element.radius + player.radius) < 0) {
            enemyList.splice(index, 1);
            player.health--;
        }
        element.drawCircle();
    });
    enemyList.forEach(element => {
        element.drawText();
    });
}
createEnemy(20);
const previousScreenSize = {
    width: innerWidth / 2,
    height: innerHeight / 2
};
function enemyResize() {
    const differnceX = previousScreenSize.width - (innerWidth / 2);
    const differnceY = previousScreenSize.height - (innerHeight / 2);
    previousScreenSize.width = innerWidth / 2;
    previousScreenSize.height = innerHeight / 2;
    enemyList.forEach(element => {
        element.resize();
        element.x -= differnceX;
        element.y -= differnceY;
    });
}
let removedEnemies = 0;
const player = new Player();
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter')
        return;
    if (e.code === 'Backspace') {
        const playerLength = player.input.length;
        player.input = player.input.slice(0, playerLength - 1);
        return;
    }
    ;
    if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123) || e.key.charCodeAt(0) == 45) {
        player.input += e.key;
    }
    ;
    if (e.code === 'Space') {
        let splicedEnemy = false;
        for (const [index, element] of enemyList.entries()) {
            if (player.input === element.word) {
                enemyList.splice(index, 1);
                splicedEnemy = true;
                removedEnemies++;
                break;
            }
        }
        if (!splicedEnemy) {
            splicedEnemy = false;
            player.color = '#ff3d3d';
            const timer = setTimeout(() => {
                player.color = '#9BD8AA';
                clearTimeout(timer);
            }, 1000);
        }
        player.input = '';
    }
    ;
});
let time = 1000;
const spawnTimer = function () {
    createEnemy(1);
    setTimeout(spawnTimer, time);
    if (time <= 500)
        return;
    if (time > 3000) {
        time -= 50;
    }
    else {
        time -= 25;
    }
};
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    updateEnemy();
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(time.toString(), innerWidth / 2, 20);
    ctx.fillText(removedEnemies.toString(), innerWidth / 2 + 100, 20);
}
animate();
//# sourceMappingURL=index.js.map