/// <reference path="../../../definition/waa.d.ts" />
var App;
(function (App) {
    var context;
    var bufferLoader;
    var gainNode;
    var source;
    window.addEventListener("load", function () {
        try {
            AudioContext = AudioContext || webkitAudioContext;
            context = new AudioContext();
            gainNode = context.createGain();
            loadSource("/sound/Tarpey_Conglomerate.mp3", play);
        }
        catch (e) {
            console.error("web audio is not supported.");
            console.error(e);
        }
    }, false);
    var loadSource = function (url, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                if (!buffer) {
                    console.error("error decoding file:" + url);
                }
                callback(buffer);
            }, function (e) {
                console.error("decode audio data error", e);
            });
        };
        request.onerror = function (e) {
            console.error("xhr error", e);
        };
        request.send();
    };
    var play = function (buffer) {
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.value = 0.1;
        source.start(0);
    };
    function filter(value) {
        var filter = context.createBiquadFilter();
        gainNode.connect(filter);
        filter.connect(context.destination);
        filter.type = 'lowpass';
        filter.frequency.value = value;
    }
    App.filter = filter;
})(App || (App = {}));
