import Enemy from "./assets/enemy.js";
import Player from "./assets/player.js";
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
    enemyList.forEach(element => {
        element.resize();
    });
});
const dictionary = ['bob', 'trunk', 'part', 'produce', 'name', 'observation', 'offender', 'calf', 'ferry', 'coffin', 'agreement', 'regular', 'smart', 'harm', 'final'];
let enemyList = [];
function createEnemy(length) {
    const radius = 400;
    for (let i = 0; i < length; i++) {
        const radian = (Math.PI * 2) / 80;
        const offset = getRndInteger(1, 400);
        const word = dictionary[getRndInteger(0, dictionary.length - 1)];
        const x = (innerWidth / 2) + (Math.cos(radian * offset) * (radius + (offset)));
        const y = (innerHeight / 2) + (Math.sin(radian * offset) * (radius + (offset)));
        const enemy = new Enemy(x, y, radian * offset, word);
        enemyList.push(enemy);
    }
}
function updateEnemy() {
    enemyList.forEach((element, index) => {
        element.x -= Math.cos(element.radian) / 2;
        element.y -= Math.sin(element.radian) / 2;
        if (distance(element.x, element.y, player.x, player.y) - (element.radius + player.radius) < 0) {
            enemyList.splice(index, 1);
            player.health--;
        }
        element.draw();
    });
}
createEnemy(2);
const player = new Player();
document.addEventListener('keydown', (e) => {
    if (e.code === 'Backspace') {
        const playerLength = player.input.length;
        player.input = player.input.slice(0, playerLength - 1);
        return;
    }
    if ((e.key.charCodeAt(0) > 64 && e.key.charCodeAt(0) < 91) || (e.key.charCodeAt(0) > 96 && e.key.charCodeAt(0) < 123)) {
        player.input += e.key;
    }
    ;
    if (e.code === 'Space') {
        enemyList.forEach((element, index) => {
            if (player.input === element.word) {
                enemyList.splice(index, 1);
            }
            else {
                player.color = '#ff3d3d';
                const timer = setTimeout(() => {
                    player.color = '#9BD8AA';
                    clearTimeout(timer);
                }, 1000);
            }
            ;
        });
        player.input = '';
    }
    ;
});
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
    updateEnemy();
}
animate();
//# sourceMappingURL=index.js.map