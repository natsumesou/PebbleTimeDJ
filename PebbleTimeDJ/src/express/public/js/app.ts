/// <reference path="./audio.ts" />

var app;

module App {
    app = new App.Audio([
        "/sound/Tarpey_Conglomerate.mp3",
        "/sound/DOCTOR_VOX_Heatstroke.mp3",
        "/sound/Jackie_Utsukushii.mp3",
        "/sound/OMFG_Hello.mp3",
        "/sound/Restless_Modern_Maybe_We_Could.mp3",
    ]);

    app.play();
}
