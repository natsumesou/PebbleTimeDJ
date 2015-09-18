/// <reference path="./audio.ts" />
var app;
var App;
(function (App) {
    app = new App.Audio([
        "/sound/Tarpey_Conglomerate.mp3",
        "/sound/DOCTOR_VOX_Heatstroke.mp3",
        "/sound/Jackie_Utsukushii.mp3",
        "/sound/OMFG_Hello.mp3",
        "/sound/Restless_Modern_Maybe_We_Could.mp3",
    ]);
    var canvas = document.getElementById("visualizer");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var visualizer = new App.Visualizer(app.analyser, canvas);
    visualizer.draw();
})(App || (App = {}));
