/// <reference path="../../../definition/socket.io-client.d.ts" />
/// <reference path="./app.ts" />
var App;
(function (App) {
    var socket = io();
    socket.on("control", function (data) {
        console.log(data);
        if (!app.started) {
            app.play();
            return;
        }
        switch (data.type) {
            case "skip":
                app.next();
                break;
            case "filter":
                var filterType = App.Filter.stringToFilterType(data.filterType);
                app.filter(filterType, +data.value, +data.duration);
                break;
            case "speed":
                app.changeSpeed(+data.value, +data.duration);
                break;
        }
    });
})(App || (App = {}));
