// TODO : map buttons from different controller models

// I own MS SideWinder Game Pad Pro, 6+2 buttons

let log = console.log;

let Gamepad = {
   keysRegistered: [
      "up", "down", "left", "right", ",", ".", "o", "e", "i", "a", "d", "c", "x", "v",
   ],
   pollGamepads: () => {
      var gamepads = navigator.getGamepads
          ? navigator.getGamepads()
          : navigator.webkitGetGamepads
          ? navigator.webkitGetGamepads()
          : [];
      for (var i = 0; i < gamepads.length; i++) {
         if (gamepads[i] != undefined) {
            var gamepad = gamepads[i];

            if (Gamepad.calX == null || Gamepad.calY == null) {
               Gamepad.calibrate(gamepad.axes[0], gamepad.axes[1]);
            }

            // Left analog stick.
            var x = gamepad.axes[0] - Gamepad.calX;
            var y = gamepad.axes[1] - Gamepad.calY;
            //log(x, y);

            // TODO: Verify Left D-pad
            var up = gamepad.buttons[12] && gamepad.buttons[12].pressed;
            var down = gamepad.buttons[13] && gamepad.buttons[13].pressed;
            var left = gamepad.buttons[10] && gamepad.buttons[10].pressed;
            var right = gamepad.buttons[11] && gamepad.buttons[11].pressed;

            // button A
            if (gamepad.buttons[0].pressed) {
               var event = new Event('keydown');
               event.key = ","; // comma
               canvas.dispatchEvent(event);
            } else {
               Gamepad.releaseKey(",");
            }
            // button B
            if (gamepad.buttons[1].pressed) {
               var event = new Event('keydown');
               event.key = "."; // period
               canvas.dispatchEvent(event);
            } else {
               Gamepad.releaseKey(".");
            }
            // button Start
            if (gamepad.buttons[8].pressed) {
               var event = new Event('keydown');
               event.key = "enter";
               canvas.dispatchEvent(event);
            }
            // directions
            if (left || x < 0.0) {
               var event = new Event('keydown');
               event.key = "left";
               canvas.dispatchEvent(event);
               Gamepad.releaseKey("right");
            } else if (right || x > 0.0) {
               var event = new Event('keydown');
               event.key = "right";
               canvas.dispatchEvent(event);
               Gamepad.releaseKey("left");
            } else {
               Gamepad.releaseKey("left");
               Gamepad.releaseKey("right");
            }
            if (up || y < 0.0) {
               var event = new Event('keydown');
               event.key = "up";
               canvas.dispatchEvent(event);
               Gamepad.releaseKey("down");
            } else if (down || y > 0.0) {
               var event = new Event('keydown');
               event.key = "down";
               canvas.dispatchEvent(event);
               Gamepad.releaseKey("up");
            } else {
               Gamepad.releaseKey("up");
               Gamepad.releaseKey("down");
            }
         }
      }
      window.requestAnimationFrame(Gamepad.pollGamepads);
   },
   calibrate: (x, y) => {
      Gamepad.calX = x;
      Gamepad.calY = y;
   },
   releaseKey: (key) => {
      let event = new Event("keyup");
      event.key = key;
      canvas.dispatchEvent(event);
   },
}

export default Gamepad
