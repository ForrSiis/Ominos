(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // code/const.js
  var Const = {
    "mapW": 360,
    "mapH": 480,
    "gameTitle": "OMINOS",
    "blockSize": 24,
    "cellSize": 12,
    "ominoShapes": ["t", "i", "l", "j", "o", "s", "z"],
    "ominoColors": ["red", "cyan", "yellow", "magenta", "green", "white", "blue", "black"],
    "damageLevel": {
      low: 4,
      medium: 8,
      high: 12,
      veryhigh: 16,
      extreme: 24
    },
    "direction": {
      LEFT: 0,
      UP: 1,
      RIGHT: 2,
      DOWN: 3
    },
    "playlist": [
      "alone_against_enemy",
      "brave_pilots",
      "epic_end",
      "rain_of_lasers",
      "without_fear"
    ],
    "playerMaxLife": 144,
    "playerMaxLevel": 20,
    "playerMaxSpeed": 600,
    "playerStartScore": 0,
    "playerStartAngle": -90,
    "playerAngleTurn": 22.5,
    "playerShootLevelMultiplier": 0.95,
    "playerStartSpeed": 200,
    "playerStartLevel": 0
  };
  Const.playerStartShape = choose2(Const.ominoShapes);
  Const.playerStartColor = choose2(Const.ominoColors);
  if (window.bOminosDebug) {
    Const.playerStartColor = "black";
    Const.playerStartLevel = 0;
  }
  Const.nDirs = Object.keys(Const.direction).length;
  function choose2(arr) {
    return arr[Math.floor(arr.length * Math.random())];
  }
  __name(choose2, "choose");
  var const_default = Const;

  // code/math.js
  var math = {};
  math.d2r = function(degrees) {
    return degrees * Math.PI / 180;
  };
  math.r2d = function(radians) {
    return radians * 180 / Math.PI;
  };
  math.midpoint = function(a, b) {
    let spot = vec2((a.x + b.x) / 2, (a.y + b.y) / 2);
    return spot;
  };
  math.rotatePoint = function(center, angle, point) {
    let newPoint = {};
    let sin = Math.sin(math.d2r(angle));
    let cos = Math.cos(math.d2r(angle));
    newPoint.x = point.x - center.x;
    newPoint.y = point.y - center.y;
    let newX = newPoint.x * cos - newPoint.y * sin;
    let newY = newPoint.x * sin + newPoint.y * cos;
    newPoint.x = newX + center.x;
    newPoint.y = newY + center.y;
    return newPoint;
  };
  var math_default = math;

  // code/omino.js
  var Omino = class {
  };
  __name(Omino, "Omino");
  __publicField(Omino, "Shapes", {
    "i": {
      rows: 4,
      cols: 1,
      grid: "1111"
    },
    "s": {
      rows: 2,
      cols: 3,
      grid: "011110"
    },
    "z": {
      rows: 2,
      cols: 3,
      grid: "110011"
    },
    "l": {
      rows: 3,
      cols: 2,
      grid: "101011"
    },
    "j": {
      rows: 3,
      cols: 2,
      grid: "010111"
    },
    "t": {
      rows: 3,
      cols: 2,
      grid: "101110"
    },
    "o": {
      rows: 2,
      cols: 2,
      grid: "1111"
    }
  });
  __publicField(Omino, "getCellPos", /* @__PURE__ */ __name(function(shape, angle, radius) {
    let cells = [];
    let grid = shape.grid;
    let rows = shape.rows;
    let cols = shape.cols;
    let midpoint = {
      x: radius * cols / 2,
      y: radius * rows / 2
    };
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let on2 = grid.substring(id, id + 1);
        if (on2 == "1") {
          let point = math_default.rotatePoint({
            x: 0,
            y: 0
          }, angle, {
            x: radius * (c + 0.5) - midpoint.x,
            y: radius * (r + 0.5) - midpoint.y
          });
          cells.push(point);
        }
        id++;
      }
    }
    return cells;
  }, "getCellPos"));

  // code/scene_title.js
  function createTitle() {
    let x = 36;
    let y = 84;
    add([
      sprite("omino_o_red"),
      pos(x, y),
      "o",
      {
        step: 12
      }
    ]);
    x += 36;
    y -= 12;
    add([
      sprite("omino_i_yellow"),
      pos(x, y)
    ]);
    x += 48;
    add([
      sprite("omino_t_magenta"),
      pos(x, y),
      rotate(90)
    ]);
    add([
      sprite("omino_i_green"),
      pos(x, y)
    ]);
    x += 60;
    add([
      sprite("omino_t_white"),
      pos(x, y),
      rotate(90)
    ]);
    x -= 36;
    y += 48;
    add([
      sprite("omino_t_red"),
      pos(x, y),
      rotate(-90)
    ]);
    x += 72;
    y -= 12;
    add([
      sprite("omino_j_cyan"),
      pos(x, y),
      rotate(180)
    ]);
    x += 24;
    add([
      sprite("omino_l_yellow"),
      pos(x, y),
      rotate(180)
    ]);
    x += 12;
    y -= 24;
    add([
      sprite("omino_o_magenta"),
      pos(x, y),
      "o",
      {
        step: 24
      }
    ]);
    x += 50;
    y += 12;
    add([
      sprite("omino_s_green"),
      pos(x, y),
      rotate(-45),
      origin("center"),
      "s"
    ]);
  }
  __name(createTitle, "createTitle");
  function animateTitle(frame) {
    let obs = 0;
    let dy = frame % 3 - 1;
    every("o", (ob) => {
      ob.move(0, dy * ob.step);
      obs++;
    });
    every("s", (ob) => {
      ob.angle += 45;
      obs++;
    });
    if (obs) {
      setTimeout(animateTitle, 1e3, ++frame);
    }
  }
  __name(animateTitle, "animateTitle");
  function runScene() {
    createTitle();
    setTimeout(animateTitle, 1e3, 2);
    add([
      text(" Move:\n O     D\n I A   X V\nE     C", {
        size: 20,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 6 / 12),
      origin("center"),
      layer("ui")
    ]);
    add([
      text(" Turn:\n<S T>  <, .>", {
        size: 20,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 8 / 12),
      origin("center"),
      layer("ui")
    ]);
    add([
      text("Press ENTER to start", {
        size: 20,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 10 / 12),
      origin("center"),
      layer("ui")
    ]);
    onKeyRelease("enter", () => {
      go("main");
    });
  }
  __name(runScene, "runScene");

  // code/scene_main.js
  var log = console.log;
  function runScene2() {
    const music = play(choose(const_default.playlist), {
      volume: 0.125,
      loop: true
    });
    layers([
      "bg",
      "obj",
      "ui"
    ], "obj");
    let nBackgrounds = 2;
    for (let i = 0; i < nBackgrounds; i++) {
      add([
        sprite("stars", {
          width: const_default.mapW,
          height: const_default.mapH
        }),
        pos(0, -i * const_default.mapH),
        layer("bg"),
        move(90, const_default.mapH / 12),
        "bg",
        {}
      ]);
    }
    onUpdate("bg", (bg) => {
      if (bg.pos.y >= const_default.mapH) {
        bg.pos.y = -const_default.mapH;
      }
    });
    function gotHurt(ob, damage) {
      damage = const_default.damageLevel[damage] || damage;
      ob.hurt(damage);
    }
    __name(gotHurt, "gotHurt");
    function changePlayerOmino(newColor) {
      player.shape = choose(const_default.ominoShapes);
      player.ominocolor = newColor;
      loadPlayerOmino();
    }
    __name(changePlayerOmino, "changePlayerOmino");
    function getOminoSprite(shape, color2) {
      return `omino_${shape}_${color2}`;
    }
    __name(getOminoSprite, "getOminoSprite");
    function getPlayerCells(player2) {
      player2.cells = Omino.getCellPos(player2.omino, player2.angle, const_default.cellSize);
    }
    __name(getPlayerCells, "getPlayerCells");
    function updatePlayerSprite(spriteName) {
      player.use(sprite(spriteName));
      player.use(area());
    }
    __name(updatePlayerSprite, "updatePlayerSprite");
    function loadPlayerOmino() {
      let shape = player.shape;
      let color2 = player.ominocolor;
      let spriteName = getOminoSprite(shape, color2);
      updatePlayerSprite(spriteName);
      player.omino = Omino.Shapes[shape];
      getPlayerCells(player);
    }
    __name(loadPlayerOmino, "loadPlayerOmino");
    const player = add([
      sprite(getOminoSprite(const_default.playerStartShape, const_default.playerStartColor)),
      pos(const_default.mapW / 2, const_default.mapH / 2),
      z(99),
      area(),
      solid(),
      rotate(const_default.playerStartAngle),
      origin("center"),
      health(const_default.playerMaxLife),
      "player",
      {
        level: const_default.playerStartLevel || 0,
        score: const_default.playerStartScore || 0,
        shootDelay: 0.8,
        shootTimer: 0,
        speed: const_default.playerStartSpeed,
        gems: 0,
        gemsLimit: 10,
        shape: const_default.playerStartShape,
        ominocolor: const_default.playerStartColor,
        touchDamage: "veryhigh"
      }
    ]);
    console.log(player);
    player.shootDelay *= Math.pow(const_default.playerShootLevelMultiplier, player.level);
    loadPlayerOmino();
    function playerMoveLeft() {
      player.move(Math.min(-player.speed / 2, Math.cos(math_default.d2r(player.angle)) * player.speed), 0);
      if (player.pos.x < 0) {
        player.pos.x = 0;
      }
    }
    __name(playerMoveLeft, "playerMoveLeft");
    function playerMoveRight() {
      player.move(Math.max(player.speed / 2, Math.cos(math_default.d2r(-player.angle)) * player.speed), 0);
      if (player.pos.x > const_default.mapW) {
        player.pos.x = const_default.mapW;
      }
    }
    __name(playerMoveRight, "playerMoveRight");
    function playerMoveUp() {
      player.move(0, Math.min(-player.speed / 2, Math.sin(math_default.d2r(player.angle)) * player.speed));
      if (player.pos.y < 0) {
        player.pos.y = 0;
      }
    }
    __name(playerMoveUp, "playerMoveUp");
    function playerMoveDown() {
      player.move(0, Math.max(player.speed / 2, Math.sin(math_default.d2r(-player.angle - 180)) * player.speed));
      if (player.pos.y > const_default.mapH) {
        player.pos.y = const_default.mapH;
      }
    }
    __name(playerMoveDown, "playerMoveDown");
    function playerTurnLeft() {
      player.angle -= const_default.playerAngleTurn;
      getPlayerCells(player);
    }
    __name(playerTurnLeft, "playerTurnLeft");
    ;
    function playerTurnRight() {
      player.angle += const_default.playerAngleTurn;
      getPlayerCells(player);
    }
    __name(playerTurnRight, "playerTurnRight");
    ;
    onKeyDown("i", playerMoveLeft);
    onKeyDown("a", playerMoveRight);
    onKeyDown("o", playerMoveUp);
    onKeyDown("e", playerMoveDown);
    onKeyPress("s", playerTurnLeft);
    onKeyPress("t", playerTurnRight);
    onKeyDown("x", playerMoveLeft);
    onKeyDown("v", playerMoveRight);
    onKeyDown("d", playerMoveUp);
    onKeyDown("c", playerMoveDown);
    onKeyPress(",", playerTurnLeft);
    onKeyPress(".", playerTurnRight);
    const BULLET_SPEED = const_default.blockSize * 5;
    const LASER_SPEED = const_default.blockSize * 8;
    const MISSILE_SPEED = const_default.blockSize * 6;
    const SEEKER_SPEED = const_default.blockSize * 8;
    const FALLING_SPEED = const_default.blockSize * 10;
    const EXHAUST_SPEED = const_default.blockSize;
    const LASER_H = 2;
    function spawnPlayerExhaust(cells) {
      let angle = player.angle + 180;
      cells.forEach((cell) => {
        let x = player.pos.x + cell.x + Math.cos(math_default.d2r(angle)) * 12 * player.omino.cols / 2;
        let y = player.pos.y + cell.y + Math.sin(math_default.d2r(angle)) * 12 * player.omino.rows / 2;
        const ob = add([
          pos(x, y),
          rect(1, 1),
          scale(3),
          color(0, 255, 255),
          rotate(angle),
          opacity(1),
          lifespan(0.25),
          move(angle, rand(EXHAUST_SPEED)),
          "exhaust",
          {}
        ]);
      });
    }
    __name(spawnPlayerExhaust, "spawnPlayerExhaust");
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
      ob.use(opacity(ob.opacity * 0.9));
    });
    function playerShootsLogic(cells) {
      switch (player.ominocolor) {
        case "cyan":
          playerShootsLasers(cells);
          break;
        case "yellow":
          playerShootsMissiles();
          break;
        case "magenta":
          playerShootsField(cells);
          break;
        case "green":
          playerShootsBouncer(cells);
          break;
        case "white":
          playerShootsFalling();
          break;
        case "blue":
          playerShootsSeekers(cells);
          break;
        case "red":
        default:
          playerShootsBullets(cells);
          break;
      }
    }
    __name(playerShootsLogic, "playerShootsLogic");
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
    __name(playerShootsBullets, "playerShootsBullets");
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
          height: diameter
        }),
        z(-3),
        cleanup(),
        move(player.angle + angle, BULLET_SPEED * Math.pow(1.1, player.level)),
        "playerattack",
        "bullet",
        {
          damage: "low"
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnBullet, "spawnBullet");
    function playerShootsLasers(cells) {
      let getSpot = /* @__PURE__ */ __name((cell, dy) => {
        let x = player.pos.x + cell.x;
        let y = player.pos.y + cell.y;
        dy = dy || 0;
        let spot = math_default.rotatePoint({
          x,
          y
        }, player.angle, {
          x: x - const_default.blockSize,
          y: y + dy
        });
        spawnLaser(spot, 0);
        spawnLaser(spot, 180);
      }, "getSpot");
      getSpot({
        x: 0,
        y: 0
      });
      let levelGap = 2;
      let nLasers = Math.ceil((player.level + 1) / levelGap);
      for (let i = 0; i < nLasers; i++) {
        let cell = cells[i % cells.length];
        let dy = Math.floor(i / cells.length) * (i % 2 ? 1 : -1) * LASER_H;
        getSpot(cell, dy);
      }
    }
    __name(playerShootsLasers, "playerShootsLasers");
    function spawnLaser(spot, angle) {
      let laser = add([
        pos(spot.x, spot.y),
        rect(const_default.blockSize * 2 + player.level, LASER_H),
        rotate(player.angle),
        color(0, 255, 255),
        area(),
        z(-3),
        cleanup(),
        move(player.angle + angle, LASER_SPEED),
        "playerattack",
        "laser",
        {
          damage: "low"
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnLaser, "spawnLaser");
    function playerShootsMissiles() {
      let x = player.pos.x;
      let y = player.pos.y;
      let pos2 = vec2(x, y);
      spawnMissile(pos2);
    }
    __name(playerShootsMissiles, "playerShootsMissiles");
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
        "missile",
        {
          damage: "medium"
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnMissile, "spawnMissile");
    function spawnBomb(spot) {
      let radius = const_default.blockSize + 2 * player.level;
      let diameter = 2 * radius;
      add([
        pos(spot),
        circle(radius),
        origin("center"),
        area({
          width: diameter,
          height: diameter
        }),
        color(Color.YELLOW),
        z(-3),
        cleanup(),
        lifespan(0.5 * Math.pow(1.1, player.level)),
        "playerattack",
        "bomb",
        {
          damage: "veryhigh"
        }
      ]);
    }
    __name(spawnBomb, "spawnBomb");
    function explodeMissile(ob) {
      destroy(ob);
      spawnBomb(ob.pos);
    }
    __name(explodeMissile, "explodeMissile");
    function explodeAllMissiles() {
      every("missile", (ob) => {
        explodeMissile(ob);
      });
    }
    __name(explodeAllMissiles, "explodeAllMissiles");
    function playerShootsField(cells) {
      cells.forEach((cell) => {
        let x = player.pos.x + cell.x;
        let y = player.pos.y + cell.y;
        let spot = vec2(x, y);
        spawnField(spot);
      });
    }
    __name(playerShootsField, "playerShootsField");
    function spawnField(spot) {
      let radius = const_default.blockSize * 1.5 + 3 * player.level;
      let diameter = 2 * radius;
      add([
        pos(spot),
        circle(radius),
        origin("center"),
        color(255, 0, 0),
        area({
          width: diameter,
          height: diameter
        }),
        z(-3),
        cleanup(),
        lifespan(0.1),
        "playerattack",
        "field",
        {
          damage: "veryhigh"
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnField, "spawnField");
    function playerShootsBouncer(cells) {
      cells.forEach((cell) => {
        let x = player.pos.x + cell.x;
        let y = player.pos.y + cell.y;
        let spot = vec2(x, y);
        spawnBouncer(spot);
      });
    }
    __name(playerShootsBouncer, "playerShootsBouncer");
    function spawnBouncer(spot) {
      add([
        pos(spot),
        circle(const_default.blockSize / 8),
        origin("center"),
        color(Color.GREEN),
        area({
          width: const_default.blockSize / 2,
          height: const_default.blockSize / 2
        }),
        z(-3),
        cleanup(),
        lifespan(3 * Math.pow(1.1, player.level)),
        "playerattack",
        "bouncer",
        {
          speedX: Math.cos(math_default.d2r(player.angle)) * BULLET_SPEED,
          speedY: Math.sin(math_default.d2r(player.angle)) * BULLET_SPEED,
          damage: "low"
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnBouncer, "spawnBouncer");
    onUpdate("bouncer", (bouncer) => {
      bouncer.move(bouncer.speedX, bouncer.speedY);
      if (bouncer.pos.x < 0) {
        bouncer.pos.x = -bouncer.pos.x * 2;
        bouncer.speedX *= -1;
      }
      if (bouncer.pos.x > const_default.mapW) {
        bouncer.pos.x -= (bouncer.pos.x - const_default.mapW) * 2;
        bouncer.speedX *= -1;
      }
      if (bouncer.pos.y < 0) {
        bouncer.pos.y = -bouncer.pos.y * 2;
        bouncer.speedY *= -1;
      }
      if (bouncer.pos.y > const_default.mapH) {
        bouncer.pos.y -= (bouncer.pos.y - const_default.mapH) * 2;
        bouncer.speedY *= -1;
      }
    });
    function playerShootsFalling() {
      let nDirs = const_default.nDirs;
      let levelGap = 5;
      let linesPerSide = 1 + Math.floor(player.level / levelGap);
      let damage = "veryhigh";
      if (player.level >= levelGap * 3) {
        damage = "low";
      } else if (player.level >= levelGap * 2) {
        damage = "medium";
      } else if (player.level >= levelGap * 1) {
        damage = "high";
      }
      for (let line = 0; line < linesPerSide; line++) {
        for (let i = 0; i < nDirs; i++) {
          let dir = (i + 1) % nDirs;
          let x = player.pos.x;
          let y = player.pos.y;
          let delta = Math.ceil(line / 2) * (line % 2 ? 1 : -1) * const_default.blockSize;
          if (0 == dir % 2) {
            x = 0 == dir ? 0 : const_default.mapW;
            y += delta;
          } else {
            y = 1 == dir ? 0 : const_default.mapH;
            x += delta;
          }
          let spot = vec2(x, y);
          spawnFalling(spot, dir, damage);
        }
      }
    }
    __name(playerShootsFalling, "playerShootsFalling");
    function spawnFalling(spot, dir, damageLevel) {
      let angle = 0;
      let duration = 2;
      if (0 == dir % 2) {
        angle += 0 == dir ? 0 : 180;
        duration = const_default.mapW / FALLING_SPEED / 2;
      }
      if (1 == dir % 2) {
        angle += 1 == dir ? 90 : -90;
        duration = const_default.mapH / FALLING_SPEED / 2;
      }
      add([
        pos(spot),
        sprite(getOminoSprite(player.shape, choose(const_default.ominoColors))),
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
        "falling",
        {
          damage: damageLevel
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnFalling, "spawnFalling");
    function playerShootsSeekers(cells) {
      let levelGap = 3;
      let spot = player.pos;
      let x = player.pos.x;
      let y = player.pos.y;
      let distance = const_default.blockSize * 2;
      spot = math_default.rotatePoint({
        x,
        y
      }, player.angle, {
        x: x + distance,
        y
      });
      spawnSeeker(spot);
      spot = math_default.rotatePoint({
        x,
        y
      }, player.angle, {
        x: x - distance,
        y
      });
      spawnSeeker(spot);
      let nSeekers = Math.floor((player.level + 1) / levelGap) + 1;
      log(nSeekers);
      let ahead = [0, 3];
      for (let i = 0; i < nSeekers; i++) {
        let cell = cells[i % cells.length];
        x = player.pos.x + cell.x;
        y = player.pos.y + cell.y;
        let dx = ahead.includes(i) ? distance : -distance;
        dx *= i >= cells.length ? -1 : 1;
        spot = math_default.rotatePoint({
          x,
          y
        }, player.angle, {
          x: x + dx,
          y
        });
        spawnSeeker(spot);
      }
    }
    __name(playerShootsSeekers, "playerShootsSeekers");
    function spawnSeeker(spot) {
      let seeker = add([
        pos(spot.x, spot.y),
        sprite("omino_seeker"),
        origin("center"),
        color(Color.BLUE),
        rotate(player.angle),
        scale(0.125),
        area(),
        z(-3),
        cleanup(),
        lifespan(3),
        "playerattack",
        "seeker",
        {
          damage: "low",
          nextTarget: null,
          speed: SEEKER_SPEED * (1 + player.level / 100)
        }
      ]);
      play("shoot", {
        volume: 0.0125,
        detune: rand(-1200, 1200)
      });
    }
    __name(spawnSeeker, "spawnSeeker");
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
      let enemies = get("alien").map((alien) => {
        return { dist: alien.pos.dist(seeker.pos), target: alien };
      });
      enemies.sort((a, b) => {
        return a.dist - b.dist;
      });
      seeker.nextTarget = enemies[0] ? enemies[0].target : null;
    }
    __name(seekerFindTarget, "seekerFindTarget");
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
        "alienbullet",
        {
          damage: "medium"
        }
      ]);
      alien.use(move(player.pos.angle(alien.pos), BULLET_SPEED));
    }
    __name(spawnAlienBullet, "spawnAlienBullet");
    player.onCollide("alienbullet", (attack) => {
      gotHurt(player, attack.damage);
      destroy(attack);
      makeExplosion(player.pos, 3, 3, 3, Color.YELLOW);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    function spawnAlienLaser(spot) {
      let angle = Math.atan2(player.pos.y - spot.y, player.pos.x - spot.x);
      let ob = add([
        pos(spot),
        rect(const_default.blockSize * 2, 1),
        rotate(math_default.r2d(angle)),
        origin("center"),
        color(255, 128, 0),
        area(),
        z(-1),
        cleanup(),
        "alienlaser",
        {
          damage: "low"
        }
      ]);
      ob.use(move(player.pos.angle(ob.pos), LASER_SPEED));
    }
    __name(spawnAlienLaser, "spawnAlienLaser");
    player.onCollide("alienlaser", (attack) => {
      gotHurt(player, attack.damage);
      makeExplosion(player.pos, 3, 3, 3, Color.YELLOW);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    const ALIEN_BASE_SPEED = 100;
    const ALIEN_SPEED_INC = 20;
    const POINTS_ALIEN_STRONGER = 1e3;
    function spawnAlienSpider() {
      let alienDirection = choose([const_default.direction.LEFT, const_default.direction.RIGHT]);
      let xpos = alienDirection == const_default.direction.LEFT ? 0 : const_default.mapW - 22;
      const alienSpeed = ALIEN_BASE_SPEED * Math.pow(1.1, player.level);
      const newAlienInterval = 2 * Math.pow(0.9, player.level);
      let angle = alienDirection == const_default.direction.LEFT ? rand(45, -45) : rand(-135, -225);
      add([
        sprite("spider"),
        pos(xpos, rand(0, const_default.mapH - 30)),
        area(),
        origin("center"),
        rotate(angle + 90),
        cleanup(),
        health(8),
        move(angle, alienSpeed),
        "spider",
        "alien",
        {
          shootChance: 1e-3 + 1e-4 * player.level,
          touchDamage: "high",
          bulletDamage: "medium",
          points: 10
        }
      ]);
      wait(newAlienInterval, spawnAlienSpider);
    }
    __name(spawnAlienSpider, "spawnAlienSpider");
    spawnAlienSpider();
    function spawnAlienWasp() {
      let spawnChance = 0.6;
      for (let i = 4; i; i--) {
        if (!chance(spawnChance)) {
          continue;
        }
        let xpos = 0 == i % 2 ? 0 : const_default.mapW;
        let ypos = 2 >= i ? 0 : const_default.mapH;
        let angle = xpos == const_default.mapW ? 135 : 45;
        angle *= ypos == const_default.mapH ? -1 : 1;
        add([
          sprite("wasp"),
          pos(xpos, ypos),
          area(),
          origin("center"),
          rotate(angle),
          cleanup(),
          health(24),
          "wasp",
          "alien",
          {
            shootChance: 5e-3 + 1e-3 * player.level,
            touchDamage: "veryhigh",
            bulletDamage: "high",
            points: 20,
            speed: ALIEN_BASE_SPEED,
            amplitude: 3,
            frequency: 45,
            timer: 0
          }
        ]);
      }
      wait(rand(12, 18), spawnAlienWasp);
    }
    __name(spawnAlienWasp, "spawnAlienWasp");
    wait(rand(6, 12), spawnAlienWasp);
    onUpdate("wasp", (wasp) => {
      wasp.timer += dt();
      let cos = Math.cos(math_default.d2r(wasp.angle));
      let sin = Math.sin(math_default.d2r(wasp.angle));
      let wobble = wasp.amplitude * Math.cos(wasp.frequency * wasp.timer) * wasp.frequency;
      let dx = cos * wasp.speed - sin * wobble;
      let dy = sin * wasp.speed + cos * wobble;
      wasp.move(dx, dy);
    });
    const CHANCE_SPAWN_ALIENSHOOTER = 1e-3 * Math.pow(1.1, player.level);
    function spawnAlienShooters() {
      let alienDirection = choose([const_default.direction.LEFT, const_default.direction.RIGHT]);
      let spriteSize = 40;
      let xpos = [
        alienDirection == const_default.direction.LEFT ? -spriteSize / 2 : const_default.mapW + spriteSize / 2,
        alienDirection == const_default.direction.LEFT ? 0 : const_default.mapW,
        alienDirection == const_default.direction.LEFT ? -spriteSize / 2 : const_default.mapW + spriteSize / 2
      ];
      let ypos = rand(spriteSize, const_default.mapH - spriteSize * 3);
      let angle = alienDirection == const_default.direction.LEFT ? 0 : 180;
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
          "alien",
          {
            shootChance: 5e-3 + 5e-4 * player.level,
            touchDamage: "veryhigh",
            points: 30
          }
        ]);
      }
    }
    __name(spawnAlienShooters, "spawnAlienShooters");
    onUpdate("alienshooter", (alien) => {
      if (chance(alien.shootChance)) {
        spawnAlienLaser(alien.pos);
      }
    });
    const CHANCE_ELITE_SPAWN_UP = 0.5;
    function spawnAlienElite() {
      let bUp = chance(CHANCE_ELITE_SPAWN_UP);
      let theSprite = sprite("gaia");
      let w = theSprite.width;
      let h = theSprite.height;
      let y = bUp ? 0 : const_default.mapH;
      let x = rand(w / 2, const_default.mapW - w / 2);
      let angle = bUp ? 90 : -90;
      add([
        theSprite,
        pos(x, y),
        area(),
        origin("center"),
        cleanup(),
        health(120 * Math.pow(1.1, player.level)),
        move(angle, const_default.blockSize / 2),
        "elite",
        "alien",
        {
          shootChance: 0.0125 + 5e-3 * player.level,
          touchDamage: "extreme",
          bulletDamage: "medium",
          points: 240
        }
      ]);
    }
    __name(spawnAlienElite, "spawnAlienElite");
    wait(rand(10, 16), spawnAlienElite);
    onUpdate("alien", (alien) => {
      if (alien.bulletDamage && chance(alien.shootChance)) {
        spawnAlienBullet(alien.pos);
      }
    });
    onCollide("alien", "bullet", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      destroy(attacker);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "laser", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "missile", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      explodeAllMissiles();
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "bomb", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.YELLOW);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "field", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "bouncer", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.CYAN);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
    });
    onCollide("alien", "falling", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
      destroy(attacker);
    });
    onCollide("alien", "seeker", (alien, attacker) => {
      makeExplosion(math_default.midpoint(alien.pos, attacker.pos), 3, 3, 3, Color.GREEN);
      gotHurt(alien, attacker.damage);
      play("explosion", {
        volume: 0.0375,
        detune: rand(0, 1200)
      });
      destroy(attacker);
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
    add([
      text("SCORE: ", {
        size: 8,
        font: "sink"
      }),
      pos(24, 10),
      layer("ui")
    ]);
    const scoreText = add([
      text("000000", {
        size: 8,
        font: "sink"
      }),
      pos(72, 10),
      layer("ui")
    ]);
    function updatePlayerLevel() {
      if (20 >= const_default.playerMaxLevel && player.level < Math.floor(player.score / 1e3)) {
        player.level++;
        player.shootDelay *= const_default.playerShootLevelMultiplier;
      }
    }
    __name(updatePlayerLevel, "updatePlayerLevel");
    function updateScore(points) {
      player.score += points;
      scoreText.text = player.score.toString().padStart(6, 0);
      play("score", {
        volume: 0.05,
        detune: rand(-1200, 1e3)
      });
      updatePlayerLevel();
    }
    __name(updateScore, "updateScore");
    add([
      text("SHIELD", {
        size: 8,
        font: "sink"
      }),
      pos(174, 10),
      layer("ui")
    ]);
    add([
      rect(54, 14),
      pos(214, 6),
      color(100, 100, 100),
      layer("ui")
    ]);
    add([
      rect(50, 10),
      pos(216, 8),
      color(0, 0, 0),
      layer("ui")
    ]);
    const healthBar = add([
      rect(50, 10),
      pos(216, 8),
      color(0, 255, 0),
      layer("ui")
    ]);
    function updatePlayerHealth() {
      player.setHP(Math.max(player.hp(), 0));
      player.setHP(Math.min(player.hp(), const_default.playerMaxLife));
      healthBar.width = 50 * (player.hp() / const_default.playerMaxLife);
      if (player.hp() <= 0.25 * const_default.playerMaxLife) {
        healthBar.color = rgb(255, 0, 0);
      } else if (player.hp() <= 0.5 * const_default.playerMaxLife) {
        healthBar.color = rgb(255, 127, 0);
      } else if (player.hp() < const_default.playerMaxLife) {
        healthBar.color = rgb(255, 255, 0);
      } else {
        healthBar.color = rgb(0, 255, 0);
      }
      if (player.hp() <= 0) {
        destroy(player);
        for (let i = 0; i < 500; i++) {
          wait(0.01 * i, () => {
            makeExplosion(vec2(rand(0, const_default.mapW), rand(0, const_default.mapH)), 5, 5, 5, Color.RED);
            play("explosion", {
              volume: 0.125,
              detune: rand(-1200, 1200)
            });
          });
        }
        wait(2, () => {
          music.stop();
          go("endGame", player.score);
        });
      }
    }
    __name(updatePlayerHealth, "updatePlayerHealth");
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
        volume: 0.0375
      });
      gotHurt(player, alien.touchDamage);
      gotHurt(alien, player.touchDamage);
    });
    function spawnGem() {
      let xpos = rand(const_default.blockSize, const_default.mapW - const_default.blockSize);
      let newColor = choose(const_default.ominoColors);
      add([
        sprite("omino_plus"),
        pos(rand(const_default.blockSize, const_default.mapW - const_default.blockSize), rand(const_default.blockSize, const_default.mapH - const_default.blockSize)),
        area(),
        scale(0.25),
        rotate(0),
        origin("center"),
        opacity(1),
        color(Color[newColor.toUpperCase()]),
        "gem",
        {
          spawnDelay: () => {
            return rand(2, 6);
          },
          points: 100,
          lifeGain: "medium",
          newColor
        }
      ]);
    }
    __name(spawnGem, "spawnGem");
    wait(rand(2, 6), spawnGem);
    wait(rand(2, 6), spawnGem);
    onUpdate("gem", (gem) => {
      gem.angle += 2;
      gem.use(opacity(Math.sin(gem.angle / 45 % Math.PI) + 0.38));
    });
    player.onCollide("gem", (gem) => {
      let newColor = gem.newColor;
      destroy(gem);
      updateScore(gem.points);
      player.heal(const_default.damageLevel[gem.lifeGain]);
      wait(gem.spawnDelay(), spawnGem);
      playerGemsBoost();
      changePlayerOmino(newColor);
    });
    function playerGemsBoost() {
      player.gems++;
      if (player.gems >= player.gemsLimit && const_default.playerMaxSpeed >= player.speed) {
        player.speed += ALIEN_SPEED_INC;
        player.gems = 0;
      }
    }
    __name(playerGemsBoost, "playerGemsBoost");
    const CHANCE_SPAWN_OBSTACLES = 5e-4 * Math.pow(1.05, player.level);
    const MAX_OBSTACLES_W = 5;
    const MAX_OBSTACLES_H = 3;
    function spawnObstacles() {
      let x = rand(const_default.mapW - const_default.blockSize * MAX_OBSTACLES_W);
      for (let i = MAX_OBSTACLES_W; i; i--) {
        for (let j = MAX_OBSTACLES_H; j; j--) {
          if (!chance(0.33)) {
            continue;
          }
          add([
            sprite("asteroid"),
            pos(x + i * const_default.blockSize, -j * const_default.blockSize),
            origin("center"),
            area(),
            health(24),
            move(90, const_default.blockSize / 2),
            "obstacle",
            {
              touchDamage: "medium",
              points: 2
            }
          ]);
        }
      }
    }
    __name(spawnObstacles, "spawnObstacles");
    onUpdate(() => {
      if (chance(CHANCE_SPAWN_OBSTACLES)) {
        spawnObstacles();
      }
      if (!get("alienshooter").length && chance(CHANCE_SPAWN_ALIENSHOOTER)) {
        spawnAlienShooters();
      }
    });
    onUpdate("obstacle", (ob) => {
      if (ob.pos.y > const_default.mapH) {
        destroy(ob);
      }
    });
    player.onCollide("obstacle", (ob) => {
      gotHurt(player, ob.touchDamage);
      gotHurt(ob, ob.touchDamage);
      makeExplosion(math_default.midpoint(ob.pos, player.pos), 4, 4, 4, Color.RED);
      play("explosion", {
        detune: -1200,
        volume: 0.0375
      });
    });
    onCollide("obstacle", "playerattack", (ob, attack) => {
      gotHurt(ob, attack.damage);
      if (attack.is("missile")) {
        explodeAllMissiles();
      }
      if (attack.is("bullet")) {
        destroy(attack);
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
          for (let i2 = 0; i2 < 2; i2++) {
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
              lifespan(0.1)
            ]);
          }
        });
      }
    }
    __name(makeExplosion, "makeExplosion");
    function grow(rate) {
      return {
        update() {
          const n = rate * dt();
          this.scale.x += n;
          this.scale.y += n;
        }
      };
    }
    __name(grow, "grow");
  }
  __name(runScene2, "runScene");

  // code/scene_gameover.js
  function runScene3(score) {
    createTitle();
    setTimeout(animateTitle, 1e3, 2);
    add([
      text("GAME OVER", {
        size: 40,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 5 / 12),
      origin("center"),
      layer("ui")
    ]);
    add([
      text(" SCORE:\n" + score, {
        size: 20,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 7 / 12),
      origin("center"),
      layer("ui")
    ]);
    add([
      text("Press ENTER to start", {
        size: 20,
        font: "sink"
      }),
      pos(const_default.mapW / 2, const_default.mapH * 10 / 12),
      origin("center"),
      layer("ui")
    ]);
    onKeyRelease("enter", () => {
      go("main");
    });
  }
  __name(runScene3, "runScene");

  // code/main.js
  kaboom({
    background: [0, 0, 0],
    width: 360,
    height: 480,
    scale: 1.5
  });
  for (const c of document.getElementsByTagName("canvas")) {
    c.style.cursor = "none";
  }
  var LOAD_SPRITES = [
    "stars",
    "gem",
    "spider",
    "wasp",
    "spaceship",
    "gaia",
    "asteroid",
    "omino_plus",
    "omino_seeker"
  ];
  var LOAD_WAVS = [
    "shoot",
    "explosion",
    "score"
  ];
  var LOAD_OGGS = [
    "alone_against_enemy",
    "brave_pilots",
    "epic_end",
    "rain_of_lasers",
    "without_fear"
  ];
  var LOAD_MP3S = [];
  function loadOminos() {
    const_default.ominoShapes.forEach((shape) => {
      const_default.ominoColors.forEach((color2) => {
        loadSprite(`omino_${shape}_${color2}`, `omino_${shape}_${color2}.png`);
      });
    });
  }
  __name(loadOminos, "loadOminos");
  function loadSprites() {
    for (const ob of LOAD_SPRITES) {
      loadSprite(ob, `${ob}.png`);
    }
  }
  __name(loadSprites, "loadSprites");
  function loadWavs() {
    for (const ob of LOAD_WAVS) {
      loadSound(ob, `${ob}.wav`);
    }
  }
  __name(loadWavs, "loadWavs");
  function loadOggs() {
    for (const ob of LOAD_OGGS) {
      loadSound(ob, `${ob}.ogg`);
    }
  }
  __name(loadOggs, "loadOggs");
  function loadMp3s() {
    for (const ob of LOAD_MP3S) {
      loadSound(ob, `${ob}.mp3`);
    }
  }
  __name(loadMp3s, "loadMp3s");
  function loadSounds() {
    loadWavs();
    loadOggs();
    loadMp3s();
  }
  __name(loadSounds, "loadSounds");
  loadRoot("sprites/");
  loadSprites();
  loadOminos();
  loadRoot("sounds/");
  loadSounds();
  scene("main", runScene2);
  scene("title", runScene);
  scene("endGame", runScene3);
  go("title");
})();
//# sourceMappingURL=game.js.map
