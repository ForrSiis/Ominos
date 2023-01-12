/*
TetraShmup

- shmup where player is tetrominos

hosted @ https://replit.com/@Amuseum/TetraShmup#code/main.js
played @ https://TetraShmup.amuseum.repl.co

Credits:
= Game Designer = AMuseum = Xay Voong
= Music BY OBLIDIVM http://oblidivmmusic.blogspot.com.es/
= Elite art by antifarea
= Arts and music found at opengameart.org, replit.com
//*/

import kaboom from "kaboom"
import Const from "./const.js"
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
const LOAD_SPRITES = [
	"stars",
	"gem",
	"spider",
	"wasp",
	"spaceship",
	"gaia",
	"asteroid",
];

const LOAD_WAVS = [
	"shoot",
	"explosion",
	"score",
];

const LOAD_OGGS = [
	"alone_against_enemy",
	"brave_pilots",
	"epic_end",
	"rain_of_lasers",
	"without_fear",
];

const LOAD_MP3S = [
];

function loadOminos() {
   Const.ominoShapes.forEach((shape) => {
      Const.ominoColors.forEach((color) => {
         loadSprite(`omino_${shape}_${color}`, `omino_${shape}_${color}.png`);
      });
   });
}

function loadSprites() {
	for (const ob of LOAD_SPRITES) {
		loadSprite(ob, `${ob}.png`);
	}
}

function loadWavs() {
	for (const ob of LOAD_WAVS) {
		loadSound(ob, `${ob}.wav`);
	}
}

function loadOggs() {
	for (const ob of LOAD_OGGS) {
		loadSound(ob, `${ob}.ogg`);
	}
}

function loadMp3s() {
	for (const ob of LOAD_MP3S) {
		loadSound(ob, `${ob}.mp3`);
	}
}

function loadSounds() {
	loadWavs();
	loadOggs();
	loadMp3s();
}

loadRoot("sprites/");
loadSprites();
loadOminos();

loadRoot("sounds/");
loadSounds();

// define scenes
scene("main", scene_main.runScene);
scene("title", scene_title.runScene);
scene("endGame", scene_gameover.runScene);

// Start Game
go("title");
