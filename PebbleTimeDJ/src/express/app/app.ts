/// <reference path="../../definition/express.d.ts" />
/// <reference path="../../definition/socket.io.d.ts" />

import express = require("express");
var bodyParser = require('body-parser');
import path = require("path");
var app = express();
import http = require("http");
import socket = require("socket.io");
var server = http.createServer(app);
var io = socket.listen(server);

module PebbleTimeDJ {
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, '/../views'));
    app.use(express.static(path.join(__dirname, '/../public')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.post("/control", function (req, res) {
        io.emit("control", req.body);
        res.send("ok");
    });

    io.on("connection", function (socket) {
        console.log("connection");
    });

    server.listen(3002);
}
