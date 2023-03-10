import Const from "./const.js"
import math from "./math.js"
import Gamepad from "./gamepad.js"
import Omino from "./omino.js"

let log = console.log;

function runScene() {
   Gamepad.pollGamepads();

   function hideCursor() {
      for (const c of document.getElementsByTagName('canvas')) {
         c.style.cursor = "none";
      }
   }

   function showCursor() {
      for (const c of document.getElementsByTagName('canvas')) {
         c.style.cursor = "default";
      }
   }

   hideCursor();

   // play bg music
   const music = play(choose(Const.playlist), {
         volume: 0.125,
         loop: true,
      });

   layers([
         "bg",
         "obj",
         "ui",
      ], "obj");

   let nBackgrounds = 2;
   for (let i = 0; i < nBackgrounds; i++) {
      add([
            sprite("stars", {
               width: Const.mapW,
               height: Const.mapH
            }),
            pos(0, -i * Const.mapH),
            layer("bg"),
            move(90, Const.mapH / 12),
            "bg", {},
         ]);
   }

   onUpdate("bg", (bg) => {
      if (bg.pos.y >= Const.mapH) {
         bg.pos.y = -Const.mapH;
      }
   });

   function gotHurt(ob, damage) {
      damage = Const.damageLevel[damage] || damage;
      ob.hurt(damage);
   }

   function changePlayerOmino(newColor) {
      player.shape = choose(Const.ominoShapes);
      player.ominocolor = newColor;
      loadPlayerOmino();
   }

   function getOminoSprite(shape, color) {
      return `omino_${shape}_${color}`;
   }

   function getPlayerCells(player) {
      player.cells = Omino.getCellPos(player.omino, player.angle, Const.cellSize);
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
            sprite(getOminoSprite(Const.playerStartShape, Const.playerStartColor)),
            pos(Const.mapW / 2, Const.mapH / 2),
            z(99),
            area(),
            solid(),
            rotate(Const.playerStartAngle),
            origin("center"),
            health(Const.playerMaxLife),
            "player", {
               level: Const.playerStartLevel || 0,
               score: Const.playerStartScore || 0,
               shootDelay: 0.8,
               shootTimer: 0,
               speed: Const.playerStartSpeed,
               gems: 0,
               gemsLimit: 10,
               shape: Const.playerStartShape,
               ominocolor: Const.playerStartColor,
               touchDamage: 'veryhigh',
               turnDelay: 1 / 12, // N spins / sec
               turnTimer: 0,
            }
         ]);
   //console.log(player);
   player.shootDelay *= Math.pow(Const.playerShootLevelMultiplier, player.level);

   loadPlayerOmino();

   function playerMoveLeft() {
      // move left
      player.move(Math.min(-player.speed / 2, Math.cos(math.d2r(player.angle)) * player.speed), 0);
      if (player.pos.x < 0) {
         player.pos.x = 0;
      }
   }

   function playerMoveRight() {
      // move right
      player.move(Math.max(player.speed / 2, Math.cos(math.d2r(-player.angle)) * player.speed), 0);
      if (player.pos.x > Const.mapW) {
         player.pos.x = Const.mapW;
      }
   }

   function playerMoveUp() {
      player.move(0, Math.min(-player.speed / 2, Math.sin(math.d2r(player.angle)) * player.speed));
      if (player.pos.y < 0) {
         player.pos.y = 0;
      }
   }

   function playerMoveDown() {
      player.move(0, Math.max(player.speed / 2, Math.sin(math.d2r(-player.angle - 180)) * player.speed));
      if (player.pos.y > Const.mapH) {
         player.pos.y = Const.mapH;
      }
   }

   function playerTurnLeft() {
      if (player.turnDelay <= player.turnTimer) {
         player.angle -= Const.playerAngleTurn;
         getPlayerCells(player);
         player.turnTimer = 0;
      }
   };

   function playerTurnRight() {
      if (player.turnDelay <= player.turnTimer) {
         player.angle += Const.playerAngleTurn;
         getPlayerCells(player);
         player.turnTimer = 0;
      }
   };

   // BEAKL
   onKeyDown("i", playerMoveLeft);

   onKeyDown("a", playerMoveRight);

   onKeyDown("o", playerMoveUp);

   onKeyDown("e", playerMoveDown);

   onKeyDown("s", playerTurnLeft);

   onKeyDown("t", playerTurnRight);

   onKeyPress("s", playerTurnLeft);

   onKeyPress("t", playerTurnRight);

   // SHOLES
   onKeyDown("x", playerMoveLeft);

   onKeyDown("v", playerMoveRight);

   onKeyDown("d", playerMoveUp);

   onKeyDown("c", playerMoveDown);

   onKeyDown(",", playerTurnLeft);

   onKeyDown(".", playerTurnRight);

   onKeyPress(",", playerTurnLeft);

   onKeyPress(".", playerTurnRight);

   // ARROWS
   onKeyDown("left", playerMoveLeft);

   onKeyDown("right", playerMoveRight);

   onKeyDown("up", playerMoveUp);

   onKeyDown("down", playerMoveDown);

   const BULLET_SPEED = Const.blockSize * 5;
   const LASER_SPEED = Const.blockSize * 8;
   const MISSILE_SPEED = Const.blockSize * 6;
   const SEEKER_SPEED = Const.blockSize * 8;
   const FALLING_SPEED = Const.blockSize * 10;
   const EXHAUST_SPEED = Const.blockSize;
   const LASER_H = 2;

   function spawnPlayerExhaust(cells) {
      // particles behind player, to denote movement direction
      // moves in opposite direction of player
      let angle = player.angle + 180;

      cells.forEach((cell) => {
         let x = player.pos.x + cell.x + Math.cos(math.d2r(angle)) * 12 * player.omino.cols / 2;
         let y = player.pos.y + cell.y + Math.sin(math.d2r(angle)) * 12 * player.omino.rows / 2;
         const ob = add([
                  pos(x, y),
                  rect(1, 1),
                  scale(3),
                  color(0, 255, 255),
                  rotate(angle),
                  opacity(1),
                  lifespan(0.25),
                  move(angle, rand(EXHAUST_SPEED)),
                  "exhaust", {}
               ]);
      });
   }

   player.onUpdate(() => {
      let deltaTime = dt();
      player.turnTimer += deltaTime;
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
      // fade out
      ob.use(opacity(ob.opacity * 0.9));
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

      case 'blue':
         playerShootsSeekers(cells);
         break;

      case 'black':
         playerShootsStickys(cells);
         break;

      case 'red':
      default:
         playerShootsBullets(cells);
         break;
      }
   }

   function playerShootsBullets(cells) {
      let angles = [-45, 45];
      cells.forEach((cell, i) => {
         let x = player.pos.x + cell.x;
         let y = player.pos.y + cell.y;
         let spot = vec2(x, y);
         spawnBullet(spot, 0);
      });
      for (let i = 0; i < 2; i++) {
         let x = player.pos.x;
         let y = player.pos.y;
         let spot = vec2(x, y);
         spawnBullet(spot, angles[i]);
      }
   }

   function spawnBullet(spot, angle) {
      let radius = 2 + player.level;
      let diameter = 2 * radius;
      add([
            pos(spot),
            circle(radius),
            origin("center"),
            color(255, 0, 255),
            area({
               width: diameter,
               height: diameter,
            }),
            z(-3),
            cleanup(),
            move(player.angle + angle, BULLET_SPEED * Math.pow(1.1, player.level)),
            "playerattack",
            "bullet", {
               damage: 'low',
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   function playerShootsLasers(cells) {
      // one laser from center, always
      // extra lasers per player level
      let getSpot = (cell, dy) => {
         let x = player.pos.x + cell.x;
         let y = player.pos.y + cell.y;
         dy = dy || 0;
         let spot = math.rotatePoint({
               x: x,
               y: y
            }, player.angle, {
               x: x - Const.blockSize, // distance away from player
               y: y + dy, // offset from first lasers
            });
         spawnLaser(spot, 0);
         spawnLaser(spot, 180);
      }
      getSpot({
         x: 0,
         y: 0
      });
      let levelGap = 2; // gain 1 laser per levelGap
      let nLasers = Math.ceil((player.level + 1) / levelGap);
      for (let i = 0; i < nLasers; i++) {
         let cell = cells[i % cells.length];
         let dy = Math.floor(i / cells.length) * (i % 2 ? 1 : -1) * LASER_H;
         getSpot(cell, dy);
      }

      //cells.forEach((cell) => getSpot(cell));
   }

   function spawnLaser(spot, angle) {
      let laser = add([
               pos(spot.x, spot.y),
               rect(Const.blockSize * 2 + player.level, LASER_H),
               rotate(player.angle),
               color(0, 255, 255),
               area(),
               z(-3),
               cleanup(),
               move(player.angle + angle, LASER_SPEED),
               "playerattack",
               "laser", {
                  damage: 'low',
               }
            ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

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
            z(-3),
            cleanup(),
            move(player.angle, MISSILE_SPEED),
            "playerattack",
            "missile", {
               damage: 'medium',
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   function spawnBomb(spot) {
      let radius = Const.blockSize + 2 * player.level;
      let diameter = 2 * radius;
      add([
            pos(spot),
            circle(radius),
            origin("center"),
            area({
               width: diameter,
               height: diameter,
            }),
            color(Color.YELLOW),
            z(-3),
            cleanup(),
            lifespan(0.5 * Math.pow(1.1, player.level)),
            "playerattack",
            "bomb", {
               damage: 'veryhigh',
            }
         ]);
   }

   function explodeMissile(ob) {
      destroy(ob);
      spawnBomb(ob.pos);
   }

   function explodeAllMissiles() {
      every("missile", (ob) => {
         explodeMissile(ob);
      });
   }

   function playerShootsField(cells) {
      cells.forEach((cell) => {
         let x = player.pos.x + cell.x;
         let y = player.pos.y + cell.y;
         let spot = vec2(x, y);
         spawnField(spot);
      });
   }

   function spawnField(spot) {
      let radius = Const.blockSize * 1.5 + 3 * (player.level);
      let diameter = 2 * radius;
      add([
            pos(spot),
            circle(radius),
            origin("center"),
            color(255, 0, 0),
            area({
               width: diameter,
               height: diameter,
            }),
            z(-3),
            cleanup(),
            lifespan(0.1),
            "playerattack",
            "field", {
               damage: 'veryhigh',
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

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
            circle(Const.blockSize / 8),
            origin("center"),
            color(Color.GREEN),
            area({
               width: Const.blockSize / 2,
               height: Const.blockSize / 2,
            }),
            z(-3),
            cleanup(),
            lifespan(3 * Math.pow(1.1, player.level)),
            "playerattack",
            "bouncer", {
               speedX: Math.cos(math.d2r(player.angle)) * BULLET_SPEED,
               speedY: Math.sin(math.d2r(player.angle)) * BULLET_SPEED,
               damage: 'low',
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   onUpdate("bouncer", (bouncer) => {
      bouncer.move(bouncer.speedX, bouncer.speedY);
      if (bouncer.pos.x < 0) {
         bouncer.pos.x = -bouncer.pos.x * 2;
         bouncer.speedX *= -1;
      }
      if (bouncer.pos.x > Const.mapW) {
         bouncer.pos.x -= (bouncer.pos.x - Const.mapW) * 2;
         bouncer.speedX *= -1;
      }
      if (bouncer.pos.y < 0) {
         bouncer.pos.y = -bouncer.pos.y * 2;
         bouncer.speedY *= -1;
      }
      if (bouncer.pos.y > Const.mapH) {
         bouncer.pos.y -= (bouncer.pos.y - Const.mapH) * 2;
         bouncer.speedY *= -1;
      }
   });

   function playerShootsFalling() {
      // pieces appear from all sides of screen at player pos
      let nDirs = Const.nDirs;
      let levelGap = 5;
      let linesPerSide = 1 + Math.floor(player.level / levelGap);
      let damage = 'veryhigh';
      if (player.level >= levelGap * 3) {
         damage = 'low';
      } else if (player.level >= levelGap * 2) {
         damage = 'medium';
      } else if (player.level >= levelGap * 1) {
         damage = 'high';
      }

      for (let line = 0; line < linesPerSide; line++) {
         for (let i = 0; i < nDirs; i++) {
            let dir = (i + 1) % nDirs;
            let x = player.pos.x;
            let y = player.pos.y;
            let delta = Math.ceil((line) / 2) * (line % 2 ? 1 : -1) * Const.blockSize;
            if (0 == dir % 2) {
               // left or right
               x = 0 == dir ? 0 : Const.mapW;
               y += delta;
            } else {
               // up or down
               y = 1 == dir ? 0 : Const.mapH;
               x += delta;
            }
            let spot = vec2(x, y);
            spawnFalling(spot, dir, damage);
         }
      }
   }

   function spawnFalling(spot, dir, damageLevel) {
      let angle = 0;
      let duration = 2;
      if (0 == dir % 2) {
         // move left or right
         angle += (0 == dir ? 0 : 180);
         duration = Const.mapW / FALLING_SPEED / 2;
      }
      if (1 == dir % 2) {
         // move up or down
         angle += (1 == dir ? 90 : -90);
         duration = Const.mapH / FALLING_SPEED / 2;
      }
      add([
            pos(spot),
            sprite(getOminoSprite(player.shape, choose(Const.ominoColors))),
            origin("center"),
            rotate(player.angle),
            opacity(0.5),
            scale(0.5),
            area(),
            z(-3),
            cleanup(),
            lifespan(duration),
            move(angle, FALLING_SPEED),
            "playerattack",
            "falling", {
               damage: damageLevel,
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   function playerShootsSeekers(cells) {
      // two default seekers: ahead and behind player
      // extra seeker for each levelGap shot from cells
      let levelGap = 3;
      let spot = player.pos;
      let x = player.pos.x;
      let y = player.pos.y;
      let distance = Const.blockSize * 2;

      // ahead
      spot = math.rotatePoint({
            x: x,
            y: y
         }, player.angle, {
            x: x + distance,
            y: y,
         });
      spawnSeeker(spot);

      // behind
      spot = math.rotatePoint({
            x: x,
            y: y
         }, player.angle, {
            x: x - distance,
            y: y,
         });
      spawnSeeker(spot);

      let nSeekers = Math.floor((player.level + 1) / levelGap) + 1;
      let ahead = [0, 3];
      for (let i = 0; i < nSeekers; i++) {
         let cell = cells[i % cells.length];
         x = player.pos.x + cell.x;
         y = player.pos.y + cell.y;
         let dx = ahead.includes(i) ? distance : -distance;
         dx *= i >= cells.length ? -1 : 1;
         spot = math.rotatePoint({
               x: x,
               y: y
            }, player.angle, {
               x: x + dx,
               y: y,
            });
         spawnSeeker(spot);
      }
   }

   function spawnSeeker(spot) {
      add([
            pos(spot.x, spot.y),
            sprite("omino_seeker"),
            origin("center"),
            rotate(player.angle),
            scale(0.125),
            area(),
            z(-3),
            cleanup(),
            lifespan(3),
            "playerattack",
            "seeker", {
               damage: 'low',
               nextTarget: null,
               speed: SEEKER_SPEED * (1 + player.level / 100),
            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   onUpdate("seeker", (ob) => {
      if (ob.nextTarget == null || !ob.nextTarget.exists()) {
         seekerFindTarget(ob);
      }
      if (ob.nextTarget != null) {
         ob.angle = ob.pos.angle(ob.nextTarget.pos) - 90;
         ob.moveTo(ob.nextTarget.pos, ob.speed);
      }
   });

   function seekerFindTarget(seeker) {
      // find nearest alien
      let enemies = get("alien").map((alien) => {
            return {
               dist: alien.pos.dist(seeker.pos),
               target: alien
            };
         });
      enemies.sort((a, b) => {
         return a.dist - b.dist;
      });
      seeker.nextTarget = enemies[0] ? enemies[0].target : null;
   }

   function playerShootsStickys(cells) {
      // shoot one from center
      // shoot extra from cells for each levelGap
      let spot = player.pos;
      spawnSticky(spot, 0);

      const maxSticky = 4;
      const angles = [22.5, -22.5, 45, -45];
      const levelGap = 4;
      const firstLevel = 2;
      let nSticky = Math.min(maxSticky, Math.floor((player.level + firstLevel) / levelGap));
      for (let i = 0; i < nSticky; i++) {
         const cell = cells[(i + 1) % cells.length];
         let angle = angles[i];
         let x = player.pos.x + cell.x;
         let y = player.pos.y + cell.y;
         let dx = Const.blockSize;
         spot = math.rotatePoint({
               x: x,
               y: y
            }, player.angle, {
               x: x + dx,
               y: y,
            });
         spawnSticky(spot, angle);
      }
   }

   function spawnSticky(spot, angle) {
      add([
            pos(spot.x, spot.y),
            sprite(getOminoSprite(player.shape, player.ominocolor)),
            origin("center"),
            rotate(player.angle),
            scale(0.5),
            area(),
            z(1),
            cleanup(),
            move(player.angle + angle, BULLET_SPEED),
            "playerattack",
            "sticky", {
               damage: 'low',
               duration: 3,
               target: null,
               dx: 0,
               dy: 0,
               collideDelay: 1 * Math.pow(0.98, player.level),
               collideTimer: 0,

            }
         ]);

      play("shoot", {
         volume: 0.0125,
         detune: rand(-1200, 1200),
      });
   }

   function stickTarget(ob, target) {
      if (ob.target == null) {
         ob.target = target;
         ob.unuse("move");
         let midpoint = math.midpoint(ob.pos, target.pos);
         ob.dx = midpoint.x - target.pos.x;
         ob.dy = midpoint.y - target.pos.y;
         ob.use(lifespan(ob.duration));
      }
   }

   onUpdate("sticky", (ob) => {
      ob.angle += 22.5;
      if (ob.target != null) {
         ob.moveTo(ob.target.pos.x + ob.dx, ob.target.pos.y + ob.dy);
         ob.collideTimer += dt();
         if (ob.collideDelay <= ob.collideTimer) {
            gotHurt(ob.target, ob.damage);
            makeExplosion(ob.pos, 3, 3, 3, Color.WHITE);
            ob.collideTimer = 0;
         }
         if (!ob.target.exists()) {
            destroy(ob);
         }
      }
   });

   function spawnAlienBullet(spot) {
      const alien = add([
               pos(spot),
               circle(4),
               origin("center"),
               color(255, 128, 0),
               area({
                  width: 8,
                  height: 8
               }),
               z(-1),
               cleanup(),
               "alienbullet", {
                  damage: 'medium',
               }
            ]);
      alien.use(move(player.pos.angle(alien.pos), BULLET_SPEED));
   }

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
      let ob = add([
               pos(spot),
               rect(Const.blockSize * 2, 1),
               rotate(math.r2d(angle)),
               origin("center"),
               color(255, 128, 0),
               area(),
               z(-1),
               cleanup(),
               "alienlaser", {
                  damage: 'low',
               }
            ]);
      ob.use(move(player.pos.angle(ob.pos), LASER_SPEED));
   }

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
      let alienDirection = choose([Const.direction.LEFT, Const.direction.RIGHT]);
      let xpos = (alienDirection == Const.direction.LEFT ? 0 : Const.mapW - 22);
      const alienSpeed = ALIEN_BASE_SPEED * Math.pow(1.1, player.level);
      const newAlienInterval = 2.0 * Math.pow(0.9, player.level);
      let angle = alienDirection == Const.direction.LEFT ? rand(45, -45) : rand(-135, -225);

      add([
            sprite("spider"),
            pos(xpos, rand(0, Const.mapH - 30)),
            area(),
            origin("center"),
            rotate(angle + 90),
            cleanup(),
            health(8),
            move(angle, alienSpeed),
            "spider",
            "alien", {
               shootChance: 0.001 + (0.0001 * player.level),
               touchDamage: 'high',
               bulletDamage: 'medium',
               points: 10,
            },
         ]);

      wait(newAlienInterval, spawnAlienSpider);
   }

   spawnAlienSpider();

   function spawnAlienWasp() {
      // wasp chance to appear at all corners at once
      let spawnChance = 0.6;
      for (let i = 4; i; i--) {
         if (!chance(spawnChance)) {
            continue;
         }
         let xpos = 0 == i % 2 ? 0 : Const.mapW;
         let ypos = 2 >= i ? 0 : Const.mapH;
         let angle = xpos == Const.mapW ? 135 : 45;
         angle *= ypos == Const.mapH ? -1 : 1;
         add([
               sprite("wasp"),
               pos(xpos, ypos),
               area(),
               origin("center"),
               rotate(angle),
               cleanup(),
               health(24),
               "wasp",
               "alien", {
                  shootChance: 0.005 + (0.001 * player.level),
                  touchDamage: 'veryhigh',
                  bulletDamage: 'high',
                  points: 20,
                  speed: ALIEN_BASE_SPEED, // wavelength
                  amplitude: 18, // delta pixels
                  frequency: 6, // times / seconds
                  timer: 0,
               },
            ]);
      }

      wait(rand(12, 18), spawnAlienWasp);
   }

   wait(rand(6, 12), spawnAlienWasp);

   onUpdate("wasp", (wasp) => {
      // move like sine wave
      wasp.timer += dt();
      let cos = Math.cos(math.d2r(wasp.angle));
      let sin = Math.sin(math.d2r(wasp.angle));
      let wobble = wasp.amplitude * Math.cos(wasp.frequency * wasp.timer) * wasp.frequency;
      let dx = cos * wasp.speed - sin * wobble;
      let dy = sin * wasp.speed + cos * wobble;
      wasp.move(dx, dy);
   });

   const CHANCE_SPAWN_ALIENSHOOTER = 0.001 * Math.pow(1.1, player.level);

   function spawnAlienShooters() {
      // create 3 enemies from left or right edges
      // V formation, shooting lasers
      let alienDirection = choose([Const.direction.LEFT, Const.direction.RIGHT]);
      let spriteSize = 40;
      let xpos = [
         (alienDirection == Const.direction.LEFT ? -spriteSize * 5 / 12 : Const.mapW + spriteSize * 5 / 12),
         (alienDirection == Const.direction.LEFT ? 0 : Const.mapW),
         (alienDirection == Const.direction.LEFT ? -spriteSize * 5 / 12 : Const.mapW + spriteSize * 5 / 12),
      ];
      let ypos = rand(spriteSize, Const.mapH - spriteSize * 3);

      let angle = alienDirection == Const.direction.LEFT ? 0 : 180;

      for (let i = 0; i < 3; i++) {
         add([
               sprite("spaceship"),
               pos(xpos[i], ypos + i * spriteSize),
               area(),
               origin("center"),
               rotate(angle),
               cleanup(),
               health(24),
               move(angle, spriteSize),
               "alienshooter",
               "alien", {
                  shootChance: 0.0025 + (0.0005 * player.level),
                  touchDamage: 'veryhigh',
                  laserDamage: 'low',
                  points: 30,
               },
            ]);
      }
   }

   const CHANCE_ELITE_SPAWN_UP = 0.5;

   function spawnAlienElite() {
      let bUp = chance(CHANCE_ELITE_SPAWN_UP);
      let theSprite = sprite("gaia");
      let w = 67;
      let h = 74;
      let y = bUp ? 0 : Const.mapH;
      let x = rand(w, Const.mapW - w);
      let angle = bUp ? 90 : -90;
      add([
            theSprite,
            pos(x, y),
            area(),
            origin("center"),
            cleanup(),
            health(120 * Math.pow(1.1, player.level)),
            move(angle, Const.blockSize / 2),
            "elite",
            "alien", {
               shootChance: 0.0125 + (0.005 * player.level),
               touchDamage: 'extreme',
               bulletDamage: 'medium',
               points: 240,
            },
         ]);
   }

   let nFlatShips = 4;
   function spawnAlienFlatships() {
      // spawn 4 flat ships at each edge of screen
      let spriteWide = "oval_ship_wide";
      let spriteTall = "oval_ship_tall";
      let dw = 30;
      let xy = [
         [dw, (Const.mapH) / 2],
         [(Const.mapW) / 2, dw],
         [Const.mapW - dw, (Const.mapH) / 2],
         [(Const.mapW) / 2, Const.mapH - dw],
      ];
      nFlatShips = 4;
      for (let i = 0; i < nFlatShips; i++) {
         let x = xy[i][0];
         let y = xy[i][1];
         let isWide = i % 2;
         let theSprite = isWide ? spriteWide : spriteTall;
         let isFlipX = i == 2;
         let isFlipY = i == 1;
         add([
               sprite(theSprite, {
                  flipX: isFlipX,
                  flipY: isFlipY
               }),
               pos(x, y),
               area(),
               origin("center"),
               health(60 * Math.pow(1.1, player.level)),
               "flatship",
               "alien", {
                  shootChance: 0.0044 + (0.0003 * player.level),
                  touchDamage: 'extreme',
                  laserDamage: 'low',
                  points: 200,
               },
            ]);
      }
   }

   on("destroy", "flatship", (alien) => {
      if (!(--nFlatShips)) {
         wait(rand(12, 24), spawnBoss);
      }
   });

   const CHANCE_SPAWN_FLATSHIP = 4 / 12;
   function spawnBoss() {
      let minTime = 12;
      let maxTime = 24;
      if (chance(CHANCE_SPAWN_FLATSHIP)) {
         wait(rand(minTime, maxTime), spawnAlienFlatships);
      } else {
         wait(rand(minTime, maxTime), spawnAlienElite);
      }
   }

   wait(rand(10, 16), spawnBoss);

   onUpdate("alien", (alien) => {
      if (chance(alien.shootChance)) {
         if (alien.bulletDamage) {
            spawnAlienBullet(alien.pos);
         }
         if (alien.laserDamage) {
            spawnAlienLaser(alien.pos);
         }
      }
   });

   onCollide("alien", "playerattack", (alien, attack) => {
      makeExplosion(math.midpoint(alien.pos, attack.pos), 3, 3, 3, Color.GREEN);
      play("explosion", {
         volume: 0.0375,
         detune: rand(0, 1200),
      });
      gotHurt(alien, attack.damage);
      if (attack.is('missile')) {
         explodeAllMissiles();
      }
      if (attack.is('bullet') || attack.is('falling') || attack.is('seeker')) {
         destroy(attack);
      }
      if (attack.is('sticky')) {
         stickTarget(attack, alien);
      }
   });

   on("hurt", "alien", (alien) => {
      if (alien.hp() <= 0) {
         updateScore(alien.points);
         destroy(alien);
      }
   });

   on("destroy", "elite", (alien) => {
      spawnBoss();
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

   function updatePlayerLevel() {
      if (20 >= Const.playerMaxLevel && player.level < Math.floor(player.score / 1000)) {
         player.level++;
         player.shootDelay *= Const.playerShootLevelMultiplier;
      }
   }

   function updateScore(points) {
      player.score += points;
      scoreText.text = player.score.toString().padStart(6, 0);
      play("score", {
         volume: 0.05,
         detune: rand(-1200, 1000),
      });

      updatePlayerLevel();
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
      player.setHP(Math.min(player.hp(), Const.playerMaxLife));

      healthBar.width = 50 * (player.hp() / Const.playerMaxLife);

      if (player.hp() <= 0.25 * Const.playerMaxLife) {
         healthBar.color = rgb(255, 0, 0);
      } else if (player.hp() <= 0.50 * Const.playerMaxLife) {
         healthBar.color = rgb(255, 127, 0);
      } else if (player.hp() < Const.playerMaxLife) {
         healthBar.color = rgb(255, 255, 0);
      } else {
         healthBar.color = rgb(0, 255, 0);
      }

      if (player.hp() <= 0) {
         destroy(player);
         for (let i = 0; i < 500; i++) {
            wait(0.01 * i, () => {
               makeExplosion(vec2(rand(0, Const.mapW), rand(0, Const.mapH)), 5, 5, 5, Color.RED);
               play("explosion", {
                  volume: 0.125,
                  detune: rand(-1200, 1200)
               });
            });
         }
         wait(2, gotoEndGame);
      }
   }

   function gotoEndGame() {
      showCursor();
      music.stop();
      go("endGame", player.score);
   }

   player.onHurt(() => {
      shake(7);
      updatePlayerHealth();
   });
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
      let xpos = rand(Const.blockSize, Const.mapW - Const.blockSize);
      let newColor = choose(Const.ominoColors);
      add([
            sprite(`omino_plus_${newColor}`),
            pos(rand(Const.blockSize, Const.mapW - Const.blockSize), rand(Const.blockSize, Const.mapH - Const.blockSize)),
            area(),
            scale(0.25),
            rotate(0),
            origin("center"),
            opacity(1),
            lifespan(10),
            "gem", {
               spawnDelay: () => {
                  return rand(2, 6);
               },
               points: 100,
               lifeGain: 'medium',
               newColor: newColor,
            },
         ]);
   }

   wait(rand(2, 6), spawnGem);
   wait(rand(2, 6), spawnGem);

   onUpdate("gem", (gem) => {
      gem.angle += 2;
      // fade in and out?
      gem.use(opacity(Math.sin((gem.angle / 45) % Math.PI) + 0.38));
   });

   player.onCollide("gem", (gem) => {
      let newColor = gem.newColor;
      destroy(gem);
      updateScore(gem.points);
      player.heal(Const.damageLevel[gem.lifeGain]);
      playerGemsBoost();
      changePlayerOmino(newColor);
   });

   function playerGemsBoost() {
      player.gems++;
      if (player.gems >= player.gemsLimit && Const.playerMaxSpeed >= player.speed) {
         player.speed += ALIEN_SPEED_INC;
         player.gems = 0;
      }
   }

   on("destroy", "gem", (gem) => {
      wait(gem.spawnDelay(), spawnGem);
   });

   // random obstacles, of random size and speed
   const CHANCE_SPAWN_OBSTACLES = 0.0005 * Math.pow(1.05, player.level);
   const MAX_OBSTACLES_W = 5;
   const MAX_OBSTACLES_H = 3;

   function spawnObstacles() {
      let x = rand(Const.mapW - Const.blockSize * MAX_OBSTACLES_W);
      for (let i = MAX_OBSTACLES_W; i; i--) {
         for (let j = MAX_OBSTACLES_H; j; j--) {
            if (!chance(0.33)) {
               continue;
            }
            add([
                  sprite("asteroid"),
                  pos(x + i * Const.blockSize, -j * Const.blockSize),
                  origin("center"),
                  area(),
                  health(24),
                  move(90, rand(Const.blockSize / 2, Const.blockSize)),
                  "obstacle", {
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
      if (!get("alienshooter").length && chance(CHANCE_SPAWN_ALIENSHOOTER)) {
         spawnAlienShooters();
      }
   });

   onUpdate("obstacle", (ob) => {
      if (ob.pos.y > Const.mapH) {
         destroy(ob);
      }
   });

   player.onCollide("obstacle", (ob) => {
      gotHurt(player, ob.touchDamage);
      gotHurt(ob, ob.touchDamage);
      makeExplosion(math.midpoint(ob.pos, player.pos), 4, 4, 4, Color.RED);
      play("explosion", {
         detune: -1200,
         volume: 0.0375,
      });
   });

   onCollide("obstacle", "playerattack", (ob, attack) => {
      gotHurt(ob, attack.damage);
      makeExplosion(math.midpoint(ob.pos, attack.pos), 3, 3, 3, Color.WHITE);
      if (attack.is('missile')) {
         explodeAllMissiles();
      }
      if (attack.is('bullet')) {
         destroy(attack);
      }
      if (attack.is('sticky')) {
         stickTarget(attack, ob);
      }
   });

   on("hurt", "obstacle", (ob) => {
      if (0 >= ob.hp()) {
         destroy(ob);
         updateScore(ob.points);
      }
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
}

export {
   runScene
}
