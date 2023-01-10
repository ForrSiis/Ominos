// Game Parameters
let mapW = 360;
let mapH = 480;
let gameTitle = "OMINOS";

let blockSize = 24;
let cellSize = 12;
let ominoShapes = ['t', 'i', 'l', 'j', 'o', 's', 'z'];
let ominoColors = ['red', 'cyan', 'yellow', 'magenta', 'green', 'white'];
let damageLevel = {
   low: 3,
   medium: 6,
   high: 9,
   veryhigh: 12,
};

let direction = {
   LEFT: 0,
   UP: 1,
   RIGHT: 2,
   DOWN: 3,
};

function choose(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

let playerStartLevel = 0;
let playerStartAngle = -90;
let playerAngleTurn = 22.5;
let playerStartShape = choose(ominoShapes);
let playerStartColor = choose(ominoColors);

let playlist = [
    "alone_against_enemy",
    "brave_pilots",
    "epic_end",
    "rain_of_lasers",
    "without_fear",
];

export {
   mapW,
   mapH,
   gameTitle,
   blockSize,
   cellSize,
   ominoShapes,
   ominoColors,
   damageLevel,
   direction,
   playerStartLevel,
   playerStartAngle,
   playerAngleTurn,
   playerStartShape,
   playerStartColor,
	playlist,
}
