import Enemy from "./assets/enemy.js";
import Player from "./assets/player.js";
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
window.addEventListener('click', () => {
});
function distance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const player = new Player();
let enemyList = [];
function generateParticles(length) {
    const radius = 400;
    for (let i = 0; i < length; i++) {
        const radian = (Math.PI * 2) / 90;
        const offset = getRndInteger(1, 400);
        const x = (innerWidth / 2) + (Math.cos(radian * offset) * (radius + (offset)));
        const y = (innerHeight / 2) + (Math.sin(radian * offset) * (radius + (offset)));
        const enemy = new Enemy(x, y, radian * offset);
        enemyList.push(enemy);
    }
}
const timerParticle = setInterval(function () { generateParticles(1); }, 2000);
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    player.draw();
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
animate();
//# sourceMappingURL=index.js.map