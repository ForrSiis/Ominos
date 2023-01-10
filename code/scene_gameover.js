import * as Const from "./const.js"
import * as scene_title from "./scene_title.js"

function runScene(score) {
    scene_title.createTitle();
    setTimeout(scene_title.animateTitle, 1000, 2);

    add([
        text("GAME OVER", {
            size: 40,
            font: "sink"
        }),
        pos(Const.mapW / 2, Const.mapH * 5 / 12),
        origin("center"),
        layer("ui")
    ]);

    add([
        text(" SCORE:\n" + score, {
            size: 20,
            font: "sink"
        }),
        pos(Const.mapW / 2, Const.mapH * 7 / 12),
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

export { runScene }