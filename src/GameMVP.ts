
// import EnemyHandler from './assets/EnemyHandler';
// import Player from './assets/player';
// import { Context } from 'vm';

// const canvas = document.querySelector('canvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d') as Context;

// const enemy = new EnemyHandler(ctx);
// const player = new Player(ctx, enemy);

// canvas.width = innerWidth;
// canvas.height = innerHeight;
// window.addEventListener('resize', () => {
//     canvas.width = innerWidth;
//     canvas.height = innerHeight;

//     player.resize();
//     enemy.resize();
// })

// //timer
// /* let time: number = 1000;
// const spawnTimer = function () {
//     createEnemy(1)
//     setTimeout(spawnTimer, time);
//     if (time <= 500) return
//     if (time > 3000) {
//         time -= 50;
//     } else {
//         time -= 25;
//     }
// } */
// //setTimeout(spawnTimer, time)


// //animator
// function animate() {
//     requestAnimationFrame(animate);
//     ctx.clearRect(0, 0, innerWidth, innerHeight);
//     player.update();
//     enemy.update();
//     //stats
//     ctx.font = '16px Arial';
//     ctx.fillStyle = 'black';
//     ctx.textAlign = 'center'
//     //ctx.fillText(time.toString(), innerWidth / 2, 20)//enemy spawn rate
//     ctx.fillText(player.removedEnemies.toString(), innerWidth / 2 + 100, 20)//enemies killed
// }

// animate();
