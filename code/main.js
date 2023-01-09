/*
TetraShmup

- shmup where player is tetrominos

hosted @ https://replit.com/@Amuseum/TetraShmup#code/main.js
played @ https://TetraShmup.amuseum.repl.co
//*/

import kaboom from "kaboom"
import * as Const from "./const.js"
import Omino from "./omino.js"
import * as scene_title from "./scene_title.js"
import * as scene_main from "./scene_main.js"
import * as scene_gameover from "./scene_gameover.js"

// initialize context
kaboom({
    background: [0, 0, 0],
    width: 360,
    height: 480,
    scale: 1.5,
});

// load resources
loadRoot("sprites/");
loadSprite("stars", "stars.png");
loadSprite("gem", "gem.png");
loadSprite("spaceship", "spaceship.png");
loadSprite("alien", "alien.png");
loadSprite("wasp", "wasp.png");
loadSprite("asteroid", "asteroid.png");
loadOminos();

loadRoot("sounds/");
loadSound("shoot", "shoot.wav");
loadSound("score", "score.wav");
loadSound("music", "music.mp3");
loadSound("pandora", "pandora.mp3");
loadSound("explosion", "explosion.wav");

function loadOminos() {
    Const.ominoShapes.forEach((shape) => {
        Const.ominoColors.forEach((color) => {
            loadSprite(`omino_${shape}_${color}`, `omino_${shape}_${color}.png`);
        });
    });
}

// define scenes
scene("main", scene_main.runScene);
scene("title", scene_title.runScene);
scene("endGame", scene_gameover.runScene);

// play bg music
const music = play("pandora", {
    volume: 0.125,
    loop: true,
});

// Start Game
go("title");
