// Game Parameters
let Const = {
	"mapW": 360,
	"mapH": 480,
	"gameTitle": "OMINOS",

	"blockSize": 24,
	"cellSize": 12,
	"ominoShapes": ['t', 'i', 'l', 'j', 'o', 's', 'z'],
	"ominoColors": ['red', 'cyan', 'yellow', 'magenta', 'green', 'white'],
	"damageLevel": {
		low: 4,
		medium: 8,
		high: 12,
		veryhigh: 16,
		extreme: 24,
	},
	"direction": {
		LEFT: 0,
		UP: 1,
		RIGHT: 2,
		DOWN: 3,
	},
	"playlist": [
		 "alone_against_enemy",
		 "brave_pilots",
		 "epic_end",
		 "rain_of_lasers",
		 "without_fear",
	],
	"playerMaxLife": 144,
	"playerMaxLevel": 20,
	"playerStartScore": 0,
	"playerStartAngle": -90,
	"playerAngleTurn": 22.5,
	"playerShootLevelMultiplier": 0.95,
	"playerStartLevel": 0,
};

Const.playerStartShape = choose(Const.ominoShapes);
Const.playerStartColor = choose(Const.ominoColors);
Const.nDirs = Object.keys(Const.direction).length;

function choose(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

export default Const