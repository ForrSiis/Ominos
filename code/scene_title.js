import Const from "./const.js"

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
			"o",
			{
				step: 12
			},
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
			"o",
			{
				step: 24,
			},
      ]);

   // S
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

function animateTitle(frame) {
	let obs = 0;
	let dy = (frame % 3) - 1; // [-1, 0, 1]
	every("o", (ob) => {
		ob.move(0, dy * ob.step);
		obs++;
	});
	every("s", (ob) => {
		ob.angle += 45;
		obs++;
	});

	if (obs) {
		setTimeout(animateTitle, 1000, ++frame);
	}
}

function runScene() {
   createTitle();
	setTimeout(animateTitle, 1000, 2);

   add([
         text(" Move:\n O     D\n I A   X V\nE     C", {
            size: 20,
            font: "sink"
         }),
         pos(Const.mapW / 2, Const.mapH * 6 / 12),
         origin("center"),
         layer("ui")
      ]);

   add([
         text(" Turn:\n<S T>  <, .>", {
            size: 20,
            font: "sink"
         }),
         pos(Const.mapW / 2, Const.mapH * 8 / 12),
         origin("center"),
         layer("ui")
      ]);

   add([
         text("Press ENTER to start", {
            size: 20,
            font: "sink"
         }),
         pos(Const.mapW / 2, Const.mapH * 10 / 12),
         origin("center"),
         layer("ui")
      ]);

   onKeyRelease("enter", () => {
      go("main");
   });
}

export {createTitle, animateTitle, runScene}