/// <reference path="../../../definition/socket.io-client.d.ts" />
/// <reference path="./app.ts" />

module App {
    var socket = io();

    socket.on("control", function (data) {
        switch(data.type) {
            case "skip":
                app.next();
                break;
            case "filter":
                var filterType = App.Filter.stringToFilterType(data.filterType);
                app.filter(filterType, data.value);
                break;
            case "speed":
                app.changeSpeed(data.value);
                break;
        }
    });
}
