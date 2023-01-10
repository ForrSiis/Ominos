/*
TetraShmup

- shmup where player is tetrominos

hosted @ https://replit.com/@Amuseum/TetraShmup#code/main.js
played @ https://TetraShmup.amuseum.repl.co

Credits:
= Game Designer = AMuseum = Xay Voong
= Music BY OBLIDIVM http://oblidivmmusic.blogspot.com.es/
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
loadSound("explosion", "explosion.wav");
loadSound("score", "score.wav");

loadSound("alone_against_enemy", "alone_against_enemy.ogg");
loadSound("brave_pilots", "brave_pilots.ogg");
loadSound("epic_end", "epic_end.ogg");
loadSound("rain_of_lasers", "rain_of_lasers.ogg");
loadSound("without_fear", "without_fear.ogg");


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

// Start Game
go("title");
