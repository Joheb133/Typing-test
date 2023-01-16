import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import Player from './assets/player';
import EnemyHandler from './assets/EnemyHandler';
import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect } from "postprocessing";
import { gsap } from 'gsap'

// setup //
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const startOverlay = document.querySelector('.start-screen') as HTMLDivElement;

//check user screen size
function screenSizeCheck() {
    const screenEl = document.querySelector(".screen-size") as HTMLDivElement
    if(innerWidth < 800 || innerHeight < 500) {
        screenEl.style.display = "block";
        canvas.style.display = "none";
    } else {
        screenEl.style.display = "none";
        canvas.style.display = "block";
    }
}

screenSizeCheck();

//loading screen
const loadingEl = document.querySelector('.loading-screen') as HTMLDivElement;
const progressEl = document.querySelector('.progress') as HTMLDivElement; //loading bar
let progress = 0;

function updateProgress(amount: number) {
    progress += amount;
    gsap.to(progressEl, {
        width: `${progress}%`,
        duration: 0.5,
        onComplete: ()=>{
            if (progress >= 100) {
                const top = loadingEl.offsetHeight;
                gsap.to(loadingEl, {
                    delay: 0.5,
                    y: -top,
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        loadingEl.style.display = "none";
                        startOverlay.style.display = "block";
                    }
                })
            }
        }
    })
}

// create main scene //
const scene = new THREE.Scene();

// enemy scene
const scene2 = new THREE.Scene();

//renderer
const renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    canvas: canvas
});
renderer.setSize(innerWidth, innerHeight)

//css2drenderer
const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(innerWidth, innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.className = 'text-renderer'
document.body.appendChild(cssRenderer.domElement);

//camera
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 500);
camera.position.set(-40, 40, 40) //default was -40, 40, 40 //testing is 0, 40, 40
camera.lookAt(new THREE.Vector3(0, 0, 0));

//main scene lighting
const spotLight = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 3, 0, 1.25);
spotLight.position.set(5, 15, 0);
scene.add(spotLight);

//enemy scene lighting
const dLight = new THREE.DirectionalLight(0xffffff, 1);
dLight.position.set(5, 50, 20);
scene2.add(dLight);

//ship lighting
RectAreaLightUniformsLib.init();
const shipBottomLights = new THREE.Group();

const rLight1 = new THREE.RectAreaLight(0xff0600, 30, 5, 4);
rLight1.position.set(0, 4, 6)

const rLight2 = new THREE.RectAreaLight(0x004cff, 40, 0.5, 3);
rLight2.position.set(-2, 3, 0);

const rLight3 = new THREE.RectAreaLight(0x004cff, 40, 0.5, 3);
rLight3.position.set(2, 3, 0);

const rLight4 = new THREE.RectAreaLight(0xffffff, 15, 1, 1);
rLight4.position.set(0, 3, -6);

shipBottomLights.add(rLight1, rLight2, rLight3, rLight4);
shipBottomLights.children.forEach((element) => { //look to ground
    const light = element as THREE.RectAreaLight;
    light.rotateX(Math.PI * -0.5);
});
scene.add(shipBottomLights);

//create plane
function createPlane() {
    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load('/textures/terrain-normal-min.jpg');
    const roughnessMap = textureLoader.load('/textures/terrain-roughness-min.jpg');

    function useEffect() {
        [normalMap, roughnessMap].forEach((t) => {
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(6, 6);
        });

        normalMap.encoding = THREE.LinearEncoding;
        roughnessMap.encoding = THREE.LinearEncoding;
    };

    useEffect()

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({
            color: 0x080808,
            normalMap: normalMap,
            roughnessMap: roughnessMap, roughness: 0.55,
            metalness: 1,
        })
    );
    plane.rotation.set(Math.PI * -0.5, 0, 0);

    const plane2 = plane.clone()
    plane2.position.set(0, 0, plane.geometry.parameters.height / 2)

    const group = new THREE.Group()
    group.add(plane, plane2)
    return group
}
const planes = createPlane()
scene.add(planes)

function movePlane() {
    planes.children.forEach((plane) => {
        plane.position.z += 0.01;
        if (plane.position.z >= 25) plane.position.z = -25
    })
}

//post processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

//create player + enemy
const enemy = new EnemyHandler(scene2, cssRenderer)
const player = new Player(scene, scene2, cssRenderer, enemy.list);

async function loadPlayerEnemy() {
    await enemy.initialize();
    updateProgress(50)
    await player.initialize();

    const bloomEffect = new SelectiveBloomEffect(scene, camera, {
        intensity: 1.25,
        luminanceThreshold: 0.2
    });
    bloomEffect.selection.add(player.model);
    bloomEffect.selection.add(player.laser)
    composer.addPass(new EffectPass(camera, bloomEffect));
    composer.addPass(new EffectPass(camera, new SMAAEffect({
        preset: 3
    })))
    updateProgress(50)
}

loadPlayerEnemy()

//resize
window.addEventListener('resize', () => {
    composer.setSize(innerWidth, innerHeight)
    cssRenderer.setSize(innerWidth, innerHeight);

    //resize camera
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    //check screen size
    screenSizeCheck();
})

//animator
let animationFrameID: number;
function animator() {
    animationFrameID = requestAnimationFrame(animator)
    enemy.update();
    player.update();
    movePlane();
    gameState();
    composer.render();
    cssRenderer.render(scene2, camera)
    renderer.render(scene2, camera)
}

//play game
const btnEl = document.querySelector("#start-game") as HTMLButtonElement;
const guiEl = document.querySelector(".gui") as HTMLDivElement;
const waveEl = document.querySelector(".gui .score span") as HTMLSpanElement;
let playing = true as boolean;
let wave = 1 as number;

function startGame() {
    gsap.to(startOverlay, {
        opacity: 0,
        duration: 0.25,
        onComplete: ()=>{
            startOverlay.style.display = "none";
            guiEl.style.visibility = "visible";
        }
    })
    player.addKeyboard();
    animator();
    canvas.style.display = "block";
}

btnEl.addEventListener("click", startGame);

//check gamestate
const gameOverEl = document.querySelector(".game-over-screen") as HTMLDivElement;
const restartBtnEl = document.querySelector(".game-over-screen button") as HTMLButtonElement
function gameState() {
    //if player dead
    if(player.health <= 0) {//stop game
        playing = false;
        cancelAnimationFrame(animationFrameID);
        guiEl.style.visibility = "hidden";
        gameOverEl.style.display = "block";
        restartBtnEl.addEventListener("click", ()=>{
            enemy.reset();
            player.reset();
            player.enemyList = enemy.list;

            guiEl.style.visibility = "visible";
            gameOverEl.style.display = "none";
            animator();
            playing = true;
            wave = 1;
            waveEl.innerText = `Wave: ${wave}`
        })
    }

    //wave handler
    if(enemy.list.length <= 0 && playing) {//no enemies
        //give player health if damaged
        if(player.health+5 <= 20) player.health += 5;

        //increase new enemy speed
        enemy.speed += 0.0005;
        enemy.createEnemy(5+(wave * 2))
        if(wave > 5) {
            enemy.speed += 0.0005;
            setTimeout(() => {
                enemy.createEnemy(wave * 2)
            }, 5000);
        }

        wave++;
        waveEl.innerText = `Wave: ${wave}`
    }
}

