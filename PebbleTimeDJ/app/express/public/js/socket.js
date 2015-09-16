/// <reference path="../../../definition/socket.io-client.d.ts" />
var App;
(function (App) {
    var socket = io();
    socket.on("filter", function (msg) {
        console.log(msg);
    });
})(App || (App = {}));
