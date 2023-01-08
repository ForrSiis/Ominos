/*
TetraShmup

- shmup where player is tetrominos

hosted @ https://replit.com/@Amuseum/TetraShmup#code/main.js
played @ https://TetraShmup.amuseum.repl.co
//*/

import kaboom from "kaboom"
import Omino from "./omino.js"

Math.d2r = function(degrees) {
    return degrees * Math.PI / 180;
}

Math.r2d = function(radians) {
    return radians * 180 / Math.PI;
}

Math.midpoint = function(a, b) {
    // find midpoint between self and point
    let spot = vec2((a.x + b.x) / 2, (a.y + b.y) / 2);
    return spot;
}

var log = console.log;

// Game Parameters
var GAME_TITLE = "OMINOS";
var BLOCK_SIZE = 24;
var CELL_SIZE = 12;
var MAP_WIDTH = 360;
var MAP_HEIGHT = 480;
var OMINO_SHAPES = ['t', 'i', 'l', 'j', 'o', 's', 'z'];
var OMINO_COLORS = ['red', 'cyan', 'yellow', 'magenta', 'green', 'white'];
var DAMAGE_LEVEL = {
    low: 3,
    medium: 6,
    high: 9,
    veryhigh: 12,
};

var direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
};

// initialize context
kaboom({
    background: [0, 0, 0],
    width: 360,
    height: 480,
    scale: 1.5
});

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

function gotHurt(ob, damage) {
    damage = DAMAGE_LEVEL[damage] || damage;
    ob.hurt(damage);
}

function loadOminos() {
    OMINO_SHAPES.forEach((shape) => {
        OMINO_COLORS.forEach((color) => {
            loadSprite(`omino_${shape}_${color}`, `omino_${shape}_${color}.png`);
        });
    });
}

function createTitle() {
    // spell out title using ominos
    // start with base (x, y)
    // move them relatively for each omino
    let x = 36;
    let y = 84;

    // O
    add([
        sprite("omino_o_red"),
        pos(x, y),
    ]);

    // M
    x += 36;
    y -= 12;
    add([
        sprite("omino_i_yellow"),
        pos(x, y),
    ]);

    x += 48;
    add([
        sprite("omino_t_magenta"),
        pos(x, y),
        rotate(90),
    ]);

    add([
        sprite("omino_i_green"),
        pos(x, y),
    ]);

    // I
    x += 60;
    add([
        sprite("omino_t_white"),
        pos(x, y),
        rotate(90),
    ]);

    x -= 36;
    y += 48;
    add([
        sprite("omino_t_red"),
        pos(x, y),
        rotate(-90),
    ]);

    // N
    x += 72;
    y -= 12;
    add([
        sprite("omino_j_cyan"),
        pos(x, y),
        rotate(180),
    ]);

    x += 24;
    add([
        sprite("omino_l_yellow"),
        pos(x, y),
        rotate(180),
    ]);

    // O
    x += 12;
    y -= 24;
    add([
        sprite("omino_o_magenta"),
        pos(x, y),
    ]);

    // S
    x += 50;
    y += 12;
    add([
        sprite("omino_s_green"),
        pos(x, y),
        rotate(-45),
        origin("center"),
    ]);
}

scene("title", () => {
    /*
    add([
    text(GAME_TITLE, {
    size: 40,
    font: "sink"
    }),
    pos(MAP_WIDTH / 2, MAP_HEIGHT * 2 / 12),
    origin("center"),
    layer("ui")
    ]);
    //*/
    createTitle();

    add([
        text(" Move:\n O     D\n I A   X V\nE     C", {
            size: 20,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT * 6 / 12),
        origin("center"),
        layer("ui")
    ]);

    add([
        text(" Turn:\n<S N>  <J L>", {
            size: 20,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT * 8 / 12),
        origin("center"),
        layer("ui")
    ]);

    add([
        text("Press ENTER to start", {
            size: 20,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT * 10 / 12),
        origin("center"),
        layer("ui")
    ]);

    onKeyRelease("enter", () => {
        go("main");
    });
});

go("title");

scene("main", () => {
    layers([
        "bg",
        "obj",
        "ui",
    ], "obj");

    let nBackgrounds = 2;
    for (let i = 0; i < nBackgrounds; i++) {
        add([
            sprite("stars", {
                width: MAP_WIDTH,
                height: MAP_HEIGHT
            }),
            pos(0, -i * MAP_HEIGHT),
            layer("bg"),
            "bg", {
                scrollDelay: 1,
                scrollX: 0,
                scrollY: 100,
                timer: 0,
            },
        ]);
    }

    onUpdate("bg", (bg) => {
        bg.timer += dt();
        if (bg.timer >= bg.scrollDelay) {
            bg.move(bg.scrollX, bg.scrollY);
        }
        if (bg.pos.y >= MAP_HEIGHT) {
            bg.pos.y = -MAP_HEIGHT;
        }
    });

    const PLAYER_ANGLE_START = -90;
    const PLAYER_ANGLE_TURN = 22.5;
    const PLAYER_START_SHAPE = choose(OMINO_SHAPES);
    const PLAYER_START_COLOR = choose(OMINO_COLORS);

    function randomizePlayerOmino() {
        player.shape = choose(OMINO_SHAPES);
        player.ominocolor = choose(OMINO_COLORS);
        loadPlayerOmino();
    }

    function getOminoSprite(shape, color) {
        return `omino_${shape}_${color}`;
    }

    function getPlayerCells(player) {
        player.cells = Omino.getCellPos(player.omino, player.angle, CELL_SIZE);
    }

    function updatePlayerSprite(spriteName) {
        player.use(sprite(spriteName));
        player.use(area());
    }

    function loadPlayerOmino() {
        let shape = player.shape;
        let color = player.ominocolor;
        let spriteName = getOminoSprite(shape, color);

        updatePlayerSprite(spriteName);
        player.omino = Omino.Shapes[shape];
        getPlayerCells(player);
    }

    const player = add([
        sprite(getOminoSprite(PLAYER_START_SHAPE, PLAYER_START_COLOR)),
        pos(MAP_WIDTH / 2, MAP_HEIGHT / 2),
        z(99),
        area(),
        solid(),
        rotate(PLAYER_ANGLE_START),
        origin("center"),
        health(100),
        "player", {
            score: 0,
            shootDelay: 0.5,
            shootTimer: 0,
            speed: 200,
            gems: 0,
            gemsLimit: 10,
            shape: PLAYER_START_SHAPE,
            ominocolor: PLAYER_START_COLOR,
            touchDamage: 'veryhigh',
        }
    ]);

    loadPlayerOmino();

    function playerMoveLeft() {
        // move left
        player.move(Math.min(-player.speed / 2, Math.cos(Math.d2r(player.angle)) * player.speed), 0);
        if (player.pos.x < 0) {
            player.pos.x = 0;
        }
    }

    function playerMoveRight() {
        // move right
        player.move(Math.max(player.speed / 2, Math.cos(Math.d2r(-player.angle)) * player.speed), 0);
        if (player.pos.x > MAP_WIDTH) {
            player.pos.x = MAP_WIDTH;
        }
    }

    function playerMoveUp() {
        player.move(0, Math.min(-player.speed / 2, Math.sin(Math.d2r(player.angle)) * player.speed));
        if (player.pos.y < 0) {
            player.pos.y = 0;
        }
    }

    function playerMoveDown() {
        player.move(0, Math.max(player.speed / 2, Math.sin(Math.d2r(-player.angle - 180)) * player.speed));
        if (player.pos.y > MAP_HEIGHT) {
            player.pos.y = MAP_HEIGHT;
        }
    }

    function playerTurnLeft() {
        player.angle -= PLAYER_ANGLE_TURN;
        getPlayerCells(player);
    };

    function playerTurnRight() {
        player.angle += PLAYER_ANGLE_TURN;
        getPlayerCells(player);
    };

    // BEAKL
    onKeyDown("i", playerMoveLeft);

    onKeyDown("a", playerMoveRight);

    onKeyDown("o", playerMoveUp);

    onKeyDown("e", playerMoveDown);

    onKeyPress("s", playerTurnLeft);

    onKeyPress("n", playerTurnRight);

    // SHITTY
    onKeyDown("x", playerMoveLeft);

    onKeyDown("v", playerMoveRight);

    onKeyDown("d", playerMoveUp);

    onKeyDown("c", playerMoveDown);

    onKeyPress("j", playerTurnLeft);

    onKeyPress("l", playerTurnRight);

    const BULLET_SPEED = BLOCK_SIZE * 5;
    const LASER_SPEED = BLOCK_SIZE * 8;
    const FALLING_SPEED = BLOCK_SIZE * 4;
    const EXHAUST_SPEED = BLOCK_SIZE;

    function spawnPlayerExhaust(cells) {
        // particles behind player, to denote movement direction
        // moves in opposite direction of player
        let angle = player.angle + 180;

        cells.forEach((cell) => {
            let x = player.pos.x + cell.x + Math.cos(Math.d2r(angle)) * 12 * player.omino.cols / 2;
            let y = player.pos.y + cell.y + Math.sin(Math.d2r(angle)) * 12 * player.omino.rows / 2;
            add([
                pos(x, y),
                rect(1, 1),
                scale(3),
                color(0, 255, 255),
                rotate(angle),
                opacity(1),
                "exhaust", {
                    speedX: rand(Math.cos(Math.d2r(angle)) * EXHAUST_SPEED),
                    speedY: rand(Math.sin(Math.d2r(angle)) * EXHAUST_SPEED),
                    destroyDelay: 0.25,
                    destroyTimer: 0,
                }
            ]);
        });
    }

    player.onUpdate(() => {
        let deltaTime = dt();
        player.shootTimer += deltaTime;
        player.shapeChangeTimer += deltaTime;
        if (player.shootTimer >= player.shootDelay) {
            if (player.cells) {
                playerShootsLogic(player.cells);
            }

            player.shootTimer = 0;
        }

        spawnPlayerExhaust(player.cells);
    });

    onUpdate("exhaust", (ob) => {
        ob.use(opacity(ob.opacity - 0.075));
        //if (chance(0.75)) {
        ob.move(ob.speedX, ob.speedY);
        //}
        ob.destroyTimer += dt();
        if (ob.destroyTimer >= ob.destroyDelay) {
            destroy(ob);
        }
    });

    function playerShootsLogic(cells) {
        switch (player.ominocolor) {
            case 'cyan':
                playerShootsLasers(cells);
                break;

            case 'yellow':
                playerShootsMissiles();
                break;

            case 'magenta':
                playerShootsField(cells);
                break;

            case 'green':
                playerShootsBouncer(cells);
                break;

            case 'white':
                playerShootsFalling();
                break;

            case 'red':
            default:
                playerShootsBullets(cells);
                break;
        }
    }

    function playerShootsBullets(cells) {
        cells.forEach((cell) => {
            let x = player.pos.x + cell.x;
            let y = player.pos.y + cell.y;
            let spot = vec2(x, y);
            spawnBullet(spot);
        });
    }

    function spawnBullet(spot) {
        add([
            pos(spot),
            circle(4),
            origin("center"),
            color(255, 0, 0),
            area({
                width: 8,
                height: 8
            }),
            cleanup(),
            "playerattack",
            "bullet", {
                speedX: Math.cos(Math.d2r(player.angle)) * BULLET_SPEED,
                speedY: Math.sin(Math.d2r(player.angle)) * BULLET_SPEED,
                damage: 'low',
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("bullet", (b) => {
        b.move(b.speedX, b.speedY);
    });

    function playerShootsLasers(cells) {
        cells.forEach((cell) => {
            let x = player.pos.x + cell.x;
            let y = player.pos.y + cell.y;
            let spot = vec2(x, y);
            spawnLaser(spot);
        });
    }

    function spawnLaser(spot) {
        add([
            pos(spot),
            rect(BLOCK_SIZE * 2, 1),
            rotate(player.angle),
            origin("center"),
            color(0, 255, 255),
            area(),
            cleanup(),
            "playerattack",
            "laser", {
                speedX: Math.cos(Math.d2r(player.angle)) * LASER_SPEED,
                speedY: Math.sin(Math.d2r(player.angle)) * LASER_SPEED,
                damage: 'low',
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("laser", (b) => {
        b.move(b.speedX, b.speedY);
    });

    function playerShootsMissiles() {
        let x = player.pos.x;
        let y = player.pos.y;
        let pos = vec2(x, y);
        spawnMissile(pos);
    }

    function spawnMissile(spot) {
        add([
            pos(spot),
            sprite(getOminoSprite(player.shape, player.ominocolor)),
            origin("center"),
            rotate(player.angle),
            scale(0.5),
            area(),
            cleanup(),
            "playerattack",
            "missile", {
                speedX: Math.cos(Math.d2r(player.angle)) * BULLET_SPEED,
                speedY: Math.sin(Math.d2r(player.angle)) * BULLET_SPEED,
                damage: 'medium',
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("missile", (b) => {
        b.move(b.speedX, b.speedY);
    });

    function spawnBomb(spot) {
        add([
            pos(spot),
            circle(BLOCK_SIZE),
            origin("center"),
            area({
                width: BLOCK_SIZE * 2,
                height: BLOCK_SIZE * 2
            }),
            color(Color.YELLOW),
            cleanup(),
            "playerattack",
            "bomb", {
                damage: 'veryhigh',
                destroyDelay: 0.5,
                destroyTimer: 0,
            }
        ]);
    }

    onUpdate("bomb", (bomb) => {
        bomb.destroyTimer += dt();
        if (bomb.destroyTimer >= bomb.destroyDelay) {
            destroy(bomb);
        }
    });

    function playerShootsField(cells) {
        cells.forEach((cell) => {
            let x = player.pos.x + cell.x;
            let y = player.pos.y + cell.y;
            let spot = vec2(x, y);
            spawnField(spot);
        });
    }

    function spawnField(spot) {
        add([
            pos(spot),
            circle(BLOCK_SIZE * 1.5),
            origin("center"),
            color(255, 0, 0),
            area({
                width: BLOCK_SIZE * 3,
                height: BLOCK_SIZE * 3,
            }),
            cleanup(),
            "playerattack",
            "field", {
                damage: 'veryhigh',
                destroyDelay: 0.1,
                destroyTimer: 0,
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("field", (field) => {
        field.destroyTimer += dt();
        if (field.destroyTimer >= field.destroyDelay) {
            destroy(field);
        }
    });

    function playerShootsBouncer(cells) {
        cells.forEach((cell) => {
            let x = player.pos.x + cell.x;
            let y = player.pos.y + cell.y;
            let spot = vec2(x, y);
            spawnBouncer(spot);
        });
    }

    function spawnBouncer(spot) {
        add([
            pos(spot),
            circle(BLOCK_SIZE / 4),
            origin("center"),
            color(Color.GREEN),
            area({
                width: BLOCK_SIZE / 2,
                height: BLOCK_SIZE / 2,
            }),
            cleanup(),
            "playerattack",
            "bouncer", {
                speedX: Math.cos(Math.d2r(player.angle)) * BULLET_SPEED,
                speedY: Math.sin(Math.d2r(player.angle)) * BULLET_SPEED,
                damage: 'low',
                destroyDelay: 5,
                destroyTimer: 0,
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("bouncer", (bouncer) => {
        bouncer.destroyTimer += dt();
        if (bouncer.destroyTimer >= bouncer.destroyDelay) {
            destroy(bouncer);
            return;
        }
        bouncer.move(bouncer.speedX, bouncer.speedY);
        if (bouncer.pos.x < 0) {
            bouncer.pos.x = -bouncer.pos.x * 2;
            bouncer.speedX *= -1;
        }
        if (bouncer.pos.x > MAP_WIDTH) {
            bouncer.pos.x -= (bouncer.pos.x - MAP_WIDTH) * 2;
            bouncer.speedX *= -1;
        }
        if (bouncer.pos.y < 0) {
            bouncer.pos.y = -bouncer.pos.y * 2;
            bouncer.speedY *= -1;
        }
        if (bouncer.pos.y > MAP_HEIGHT) {
            bouncer.pos.y -= (bouncer.pos.y - MAP_HEIGHT) * 2;
            bouncer.speedY *= -1;
        }
    });

    function playerShootsFalling() {
        let x = player.pos.x;
        let y = BLOCK_SIZE;
        let pos = vec2(x, y);
        spawnFalling(pos);
    }

    function spawnFalling(spot) {
        add([
            pos(spot),
            sprite(getOminoSprite(player.shape, choose(OMINO_COLORS))),
            origin("center"),
            rotate(player.angle),
            scale(0.5),
            area(),
            cleanup(),
            "playerattack",
            "falling", {
                speedX: 0,
                speedY: FALLING_SPEED,
                damage: 'high',
            }
        ]);

        play("shoot", {
            volume: 0.0125,
            detune: rand(-1200, 1200),
        });
    }

    onUpdate("falling", (b) => {
        b.move(b.speedX, b.speedY);
    });

    function spawnAlienBullet(spot) {
        add([
            pos(spot),
            circle(4),
            origin("center"),
            color(255, 128, 0),
            area({
                width: 8,
                height: 8
            }),
            cleanup(),
            "alienbullet", {
                speedX: Math.cos(Math.atan2(player.pos.y - spot.y, player.pos.x - spot.x)) * BULLET_SPEED,
                speedY: Math.sin(Math.atan2(player.pos.y - spot.y, player.pos.x - spot.x)) * BULLET_SPEED,
                damage: 'medium',
            }
        ]);
    }

    onUpdate("alienbullet", (attack) => {
        attack.move(attack.speedX, attack.speedY);
    });

    player.onCollide("alienbullet", (attack) => {
        gotHurt(player, attack.damage);
        destroy(attack);
        makeExplosion(player.pos, 3, 3, 3, Color.YELLOW);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    function spawnAlienLaser(spot) {
        let angle = Math.atan2(player.pos.y - spot.y, player.pos.x - spot.x);
        add([
            pos(spot),
            rect(BLOCK_SIZE * 2, 1),
            rotate(Math.r2d(angle)),
            origin("center"),
            color(255, 128, 0),
            area(),
            cleanup(),
            "alienlaser", {
                speedX: Math.cos(angle) * LASER_SPEED,
                speedY: Math.sin(angle) * LASER_SPEED,
                damage: 'low',
            }
        ]);
    }

    onUpdate("alienlaser", (attack) => {
        attack.move(attack.speedX, attack.speedY);
    });

    player.onCollide("alienlaser", (attack) => {
        gotHurt(player, attack.damage);
        makeExplosion(player.pos, 3, 3, 3, Color.YELLOW);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    const ALIEN_BASE_SPEED = 100;
    const ALIEN_SPEED_INC = 20;
    const POINTS_ALIEN_STRONGER = 1000;

    function spawnAlienSpider() {
        let alienDirection = choose([direction.LEFT, direction.RIGHT]);
        let xpos = (alienDirection == direction.LEFT ? 0 : MAP_WIDTH - 22);

        const points_speed_up = Math.floor(player.score / POINTS_ALIEN_STRONGER);
        const alienSpeed = ALIEN_BASE_SPEED + (points_speed_up * ALIEN_SPEED_INC);
        const newAlienInterval = 1.0 - (points_speed_up / 20);
        let angle = alienDirection == direction.LEFT ? rand(45, -45) : rand(-135, -225);

        add([
            sprite("alien"),
            pos(xpos, rand(0, MAP_HEIGHT - 30)),
            area(),
            origin("center"),
            rotate(angle + 90),
            cleanup(),
            health(9),
            "alien", {
                speedX: Math.cos(Math.d2r(angle)) * alienSpeed,
                speedY: Math.sin(Math.d2r(angle)) * alienSpeed,
                shootChance: 0.005,
                touchDamage: 'veryhigh',
                bulletDamage: 'high',
                points: 10,
            },
        ]);

        wait(newAlienInterval, spawnAlienSpider);
    }

    spawnAlienSpider();

    function spawnAlienWasp() {
        let xpos = choose([0, MAP_WIDTH]);
        let ypos = choose([0, MAP_HEIGHT]);
        let angle = xpos == MAP_WIDTH ? 135 : 45;
        angle *= ypos == MAP_HEIGHT ? -1 : 1;
        add([
            sprite("wasp"),
            pos(xpos, ypos),
            area(),
            origin("center"),
            rotate(angle),
            cleanup(),
            health(18),
            "wasp",
            "alien", {
                shootChance: 0.1,
                bulletDamage: 'high',
                touchDamage: 'veryhigh',
                points: 20,
                speed: ALIEN_BASE_SPEED, // wavelength
                amplitude: 3, // delta pixels
                frequency: 45, // times / seconds
                timer: 0,
            },
        ]);
    }

    wait(0, spawnAlienWasp);

    onUpdate("wasp", (wasp) => {
        // move like sine wave
        wasp.timer += dt();
        let cos = Math.cos(Math.d2r(wasp.angle));
        let sin = Math.sin(Math.d2r(wasp.angle));
        let wobble = wasp.amplitude * Math.cos(wasp.frequency * wasp.timer) * wasp.frequency;
        let dx = cos * wasp.speed - sin * wobble;
        let dy = sin * wasp.speed + cos * wobble;
        wasp.move(dx, dy);
    });

    const CHANCE_SPAWN_ALIENSHOOTER = 0.0025;

    function spawnAlienShooters() {
        // create 3 enemies from left or right edges
        // V formation, shooting lasers
        let alienDirection = choose([direction.LEFT, direction.RIGHT]);
        let spriteSize = 40;
        let xpos = [
            (alienDirection == direction.LEFT ? -spriteSize / 2 : MAP_WIDTH + spriteSize / 2),
            (alienDirection == direction.LEFT ? 0 : MAP_WIDTH),
            (alienDirection == direction.LEFT ? -spriteSize / 2 : MAP_WIDTH + spriteSize / 2),
        ];
        let ypos = rand(spriteSize, MAP_HEIGHT - spriteSize * 3);

        let angle = alienDirection == direction.LEFT ? 0 : 180;

        for (let i = 0; i < 3; i++) {
            add([
                sprite("spaceship"),
                pos(xpos[i], ypos + i * spriteSize),
                area(),
                origin("center"),
                rotate(angle),
                cleanup(),
                health(18),
                "alienshooter",
                "alien", {
                    speedX: (alienDirection == direction.LEFT ? spriteSize : -spriteSize) / 2,
                    speedY: 0,
                    shootChance: 0.02,
                    touchDamage: 'veryhigh',
                    points: 30,
                    destroyX: alienDirection == direction.LEFT ? MAP_WIDTH : 0,
                },
            ]);
        }
    }

    onUpdate("alienshooter", (alien) => {
        alien.move(alien.speedX, alien.speedY);
        if (alien.destroyX) {
            if (alien.destroyX <= alien.pos.x) {
                destroy(alien);
            }
        } else if (0 >= alien.pos.x) {
            destroy(alien);
        }
        if (chance(alien.shootChance)) {
            spawnAlienLaser(alien.pos);
        }
    });

    const CHANCE_ELITE_SPAWN_UP = 0.5;

    function spawnAlienElite() {
        let bUp = chance(CHANCE_ELITE_SPAWN_UP);
        let y = bUp ? 0 : MAP_HEIGHT;
        let moveDirection = bUp ? direction.DOWN : direction.UP;
        let speedY = (BLOCK_SIZE / 2) * (moveDirection - 2);
        add([
            sprite("alien"),
            pos(rand(BLOCK_SIZE * 2, MAP_WIDTH - BLOCK_SIZE * 2), y),
            scale(4),
            area(),
            origin("center"),
            cleanup(),
            health(90),
            "elite",
            "alien", {
                speedX: 0,
                speedY: speedY,
                shootChance: 0.0625,
                touchDamage: 'veryhigh',
                bulletDamage: 'high',
                points: 240,
            },
        ]);
    }

    spawnAlienElite();

    onUpdate("alien", (alien) => {
        alien.move(alien.speedX, alien.speedY);
        if (alien.bulletDamage && chance(alien.shootChance)) {
            spawnAlienBullet(alien.pos);
        }
    });

    onCollide("alien", "bullet", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
        gotHurt(alien, attacker.damage);
        destroy(attacker);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "laser", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
        gotHurt(alien, attacker.damage);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "missile", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
        gotHurt(alien, attacker.damage);
        spawnBomb(attacker.pos);
        destroy(attacker);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "bomb", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.YELLOW);
        gotHurt(alien, attacker.damage);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "field", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
        gotHurt(alien, attacker.damage);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "bouncer", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.CYAN);
        gotHurt(alien, attacker.damage);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    onCollide("alien", "falling", (alien, attacker) => {
        makeExplosion(Math.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
        gotHurt(alien, attacker.damage);
        play("explosion", {
            volume: 0.0375,
            detune: rand(0, 1200),
        });
    });

    on("hurt", "alien", (alien) => {
        if (alien.hp() <= 0) {
            updateScore(alien.points);
            destroy(alien);
        }
    });

    on("destroy", "elite", (alien) => {
        wait(rand(12, 24), spawnAlienElite);
    });

    on("destroy", "wasp", (alien) => {
        wait(rand(1), spawnAlienWasp);
    });

    add([
        text("SCORE: ", {
            size: 8,
            font: "sink"
        }),
        pos(24, 10),
        layer("ui"),
    ]);

    const scoreText = add([
        text("000000", {
            size: 8,
            font: "sink"
        }),
        pos(72, 10),
        layer("ui"),
    ]);

    function updateScore(points) {
        player.score += points;
        scoreText.text = player.score.toString().padStart(6, 0);
        play("score", {
            volume: 0.05,
            detune: rand(-1200, 1000),
        });
    }

    add([
        text("SHIELD", {
            size: 8,
            font: "sink"
        }),
        pos(174, 10),
        layer("ui"),
    ]);

    // health bar border
    add([
        rect(54, 14),
        pos(214, 6),
        color(100, 100, 100),
        layer("ui"),
    ]);

    // health bar background
    add([
        rect(50, 10),
        pos(216, 8),
        color(0, 0, 0),
        layer("ui"),
    ]);

    // health bar filling
    const healthBar = add([
        rect(50, 10),
        pos(216, 8),
        color(0, 255, 0),
        layer("ui"),
    ]);

    function updatePlayerHealth() {
        player.setHP(Math.max(player.hp(), 0));
        player.setHP(Math.min(player.hp(), 100));

        healthBar.width = 50 * (player.hp() / 100);

        if (player.hp() <= 25) {
            healthBar.color = rgb(255, 0, 0);
        } else if (player.hp() <= 50) {
            healthBar.color = rgb(255, 127, 0);
        } else if (player.hp() < 100) {
            healthBar.color = rgb(255, 255, 0);
        } else {
            healthBar.color = rgb(0, 255, 0);
        }

        if (player.hp() <= 0) {
            destroy(player);
            for (let i = 0; i < 500; i++) {
                wait(0.01 * i, () => {
                    makeExplosion(vec2(rand(0, MAP_WIDTH), rand(0, MAP_HEIGHT)), 5, 5, 5, Color.RED);
                    play("explosion", {
                        volume: 0.125,
                        detune: rand(-1200, 1200)
                    });
                });
            }
            wait(2, () => {
                go("endGame", player.score);
            });
        }
    }

    player.onHurt(updatePlayerHealth);
    player.onHeal(updatePlayerHealth);

    player.onCollide("alien", (alien) => {
        shake(5);
        makeExplosion(alien.pos, 4, 4, 4, Color.RED);
        play("explosion", {
            detune: -1200,
            volume: 0.0375,
        });
        gotHurt(player, alien.touchDamage);
        gotHurt(alien, player.touchDamage);
    });

    function spawnGem() {
        let xpos = rand(BLOCK_SIZE, MAP_WIDTH - BLOCK_SIZE);
        add([
            sprite("gem"),
            pos(rand(BLOCK_SIZE, MAP_WIDTH - BLOCK_SIZE), rand(BLOCK_SIZE, MAP_HEIGHT - BLOCK_SIZE)),
            area(),
            "gem", {
                spawnDelay: rand(2, 6),
                points: 100,
                life: 'medium',
            },
        ]);
    }

    wait(rand(2, 6), spawnGem);
    wait(rand(2, 6), spawnGem);

    player.onCollide("gem", (gem) => {
        destroy(gem);
        updateScore(gem.points);
        player.heal(DAMAGE_LEVEL[gem.life]);
        wait(gem.spawnDelay, spawnGem);
        playerGemsBoost();
        randomizePlayerOmino();
    });

    function playerGemsBoost() {
        player.gems++;
        if (player.gems >= player.gemsLimit) {
            player.speed += ALIEN_SPEED_INC;
            player.gems = 0;
        }
    }

    // random obstacles, of random size and speed
    const CHANCE_SPAWN_OBSTACLES = 0.001;
    const MAX_OBSTACLES_W = 5;
    const MAX_OBSTACLES_H = 3;

    function spawnObstacles() {
        let bUp = chance(0.5);
        let y = bUp ? 0 : MAP_HEIGHT;
        let moveDirection = bUp ? direction.DOWN : direction.UP;
        let speedY = (BLOCK_SIZE) * (moveDirection - 2);
        let x = rand(MAP_WIDTH - BLOCK_SIZE * MAX_OBSTACLES_W);
        for (let i = MAX_OBSTACLES_W; i; i--) {
            for (let j = MAX_OBSTACLES_H; j; j--) {
                if (!chance(0.33)) {
                    continue;
                }
                add([
                    sprite("asteroid"),
                    pos(x + i * BLOCK_SIZE, -j * BLOCK_SIZE),
                    origin("center"),
                    area(),
                    solid(),
                    health(24),
                    "obstacle", {
                        speedX: 0,
                        speedY: BLOCK_SIZE / 2,
                        touchDamage: 'medium',
                        points: 2,
                    }
                ]);
            }
        }
    }
    onUpdate(() => {
        if (chance(CHANCE_SPAWN_OBSTACLES)) {
            spawnObstacles();
        }
        if (chance(CHANCE_SPAWN_ALIENSHOOTER)) {
            spawnAlienShooters();
        }
    });

    onUpdate("obstacle", (ob) => {
        ob.move(ob.speedX, ob.speedY);
        if (ob.pos.y > MAP_HEIGHT) {
            destroy(ob);
        }
    });

    player.onCollide("obstacle", (ob) => {
        gotHurt(player, ob.touchDamage);
        gotHurt(ob, ob.touchDamage);
        makeExplosion(Math.midpoint(ob.pos, player.pos), 4, 4, 4, Color.RED);
        play("explosion", {
            detune: -1200,
            volume: 0.0375,
        });
    });

    onCollide("obstacle", "playerattack", (ob, attack) => {
        gotHurt(ob, attack.damage);
        if (attack.is('missile')) {
            destroy(attack);
            spawnBomb(Math.midpoint(attack.pos, ob.pos));
        }
        if (attack.is('bomb') || attack.is('bullet')) {
            destroy(attack);
        }
    });

    on("hurt", "obstacle", (ob) => {
        if (0 >= ob.hp()) {
            destroy(ob);
            updateScore(ob.points);
        }
    });
});

function makeExplosion(p, n, rad, size, colour = Color.YELLOW) {
    for (let i = 0; i < n; i++) {
        wait(rand(n * 0.1), () => {
            for (let i = 0; i < 2; i++) {
                add([
                    pos(p.add(rand(vec2(-rad), vec2(rad)))),
                    circle(1, 1),
                    color(colour),
                    outline({
                        width: size / 2,
                        color: Color.BLACK
                    }),
                    origin("center"),
                    scale(1, 1),
                    grow(rand(48, 72) * size),
                    lifespan(0.1),
                ]);
            }
        });
    }
}

function grow(rate) {
    return {
        update() {
            const n = rate * dt();
            this.scale.x += n;
            this.scale.y += n;
        },
    };
}

scene("endGame", (score) => {
    add([
        text("GAME OVER", {
            size: 40,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT / 3),
        origin("center"),
        layer("ui")
    ]);

    add([
        text(" SCORE:\n" + score, {
            size: 20,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT / 2),
        origin("center"),
        layer("ui")
    ]);

    add([
        text("Press ENTER to start", {
            size: 20,
            font: "sink"
        }),
        pos(MAP_WIDTH / 2, MAP_HEIGHT * 10 / 12),
        origin("center"),
        layer("ui")
    ]);

    onKeyRelease("enter", () => {
        go("main");
    });
});

const music = play("music", {
    volume: 0.125,
    loop: true,
});
