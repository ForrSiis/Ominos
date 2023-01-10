
function choose(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

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
		low: 3,
		medium: 6,
		high: 9,
		veryhigh: 12,
	},
	"direction": {
		LEFT: 0,
		UP: 1,
		RIGHT: 2,
		DOWN: 3,
	},
	"playerStartLevel": 0,
	"playerMaxLife": 144,
	"playerStartAngle": -90,
	"playerAngleTurn": 22.5,
	"playlist": [
		 "alone_against_enemy",
		 "brave_pilots",
		 "epic_end",
		 "rain_of_lasers",
		 "without_fear",
	],
};

Const.playerStartShape = choose(Const.ominoShapes);
Const.playerStartColor = choose(Const.ominoColors);

export default Const