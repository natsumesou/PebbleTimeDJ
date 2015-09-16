/// <reference path="../definition/express.d.ts" />
/// <reference path="../definition/socket.io.d.ts" />
var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var app = express();
var http = require("http");
var socket = require("socket.io");
var server = http.createServer(app);
var io = socket.listen(server);
var PebbleTimeDJ;
(function (PebbleTimeDJ) {
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.get("/", function (req, res) {
        res.render("index");
    });
    app.post("/filter", function (req, res) {
        console.log(req.body);
        io.emit("filter", req.body);
        res.send(req.body);
    });
    io.on("connection", function (socket) {
        console.log("connection");
    });
    server.listen(80);
})(PebbleTimeDJ || (PebbleTimeDJ = {}));
