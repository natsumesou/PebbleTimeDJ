/// <reference path="../../../definition/waa.d.ts" />
var App;
(function (App) {
    var _context;
    var _bufferLoader;
    var _gainNode;
    var _source;
    var _filter;
    window.addEventListener("load", function () {
        try {
            AudioContext = AudioContext || webkitAudioContext;
            _context = new AudioContext();
            _gainNode = _context.createGain();
            _filter = _context.createBiquadFilter();
            _gainNode.connect(_filter);
            _filter.connect(_context.destination);
            _filter.type = 'highpass';
            _filter.frequency.value = 24000;
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
            _context.decodeAudioData(request.response, function (buffer) {
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
        _source = _context.createBufferSource();
        _source.buffer = buffer;
        _source.connect(_gainNode);
        _gainNode.connect(_context.destination);
        _gainNode.gain.value = 0.1;
        _source.start(0);
        _source.loop = true;
    };
    function filter(value) {
        var minValue = 40;
        var maxValue = _context.sampleRate / 2;
        var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
        var multiplier = Math.pow(2, numberOfOctaves * (value - 1.0));
        console.log(maxValue * multiplier);
        _filter.frequency.value = maxValue * multiplier;
    }
    App.filter = filter;
    function quality(value) {
        _filter.Q.value = value * 30;
    }
    App.quality = quality;
    ;
})(App || (App = {}));
