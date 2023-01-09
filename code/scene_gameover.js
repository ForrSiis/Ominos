import * as Const from "./const.js"

function runScene(score) {
   add([
         text("GAME OVER", {
            size: 40,
            font: "sink"
         }),
         pos(Const.mapW / 2, Const.mapH / 3),
         origin("center"),
         layer("ui")
      ]);

   add([
         text(" SCORE:\n" + score, {
            size: 20,
            font: "sink"
         }),
         pos(Const.mapW / 2, Const.mapH / 2),
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

export {runScene}