/// <reference path="../../../definition/socket.io-client.d.ts" />

module App {
    var socket = io();

    socket.on("filter", function (msg) {
        console.log(msg);
    });
}