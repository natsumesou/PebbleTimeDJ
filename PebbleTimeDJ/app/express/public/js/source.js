/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./filter.ts" />
var App;
(function (App) {
    var Source = (function () {
        function Source(context, analyser, url, volume, mute, loadDelay) {
            var _this = this;
            this.context = context;
            this.analyser = analyser;
            this.volume = volume;
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = mute ? 0 : this.volume;
            this.source = this.context.createBufferSource();
            setTimeout(function () { return _this.loadSource(url, _this.source); }, loadDelay);
        }
        Source.prototype.play = function () {
            this.source.start(0);
            this.source.loop = true;
        };
        Source.prototype.stop = function () {
            this.source.stop();
            this.source = this.context.createBufferSource();
            this.audioFilter = new App.Filter(this.context, this.analyser, this.source, this.gainNode, this.context.sampleRate);
            this.gainNode.gain.value = 0;
            this.source.buffer = this.buffer;
        };
        Source.prototype.fadein = function (duration) {
            this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, duration);
        };
        Source.prototype.fadeout = function (duration) {
            this.gainNode.gain.setTargetAtTime(0, this.context.currentTime, duration);
        };
        Source.prototype.changeSpeed = function (speed, duration) {
            var calcSpeed = this.source.playbackRate.value + speed;
            if (calcSpeed < 0.2) {
                calcSpeed = 0.2;
            }
            if (calcSpeed > 3) {
                calcSpeed = 3;
            }
            this.source.playbackRate.setTargetAtTime(calcSpeed, this.context.currentTime, duration);
        };
        Source.prototype.changeVolume = function (volume, duration) {
            var calcVolume = this.gainNode.gain.value + volume;
            if (calcVolume < 0.2) {
                calcVolume = 0.2;
            }
            if (calcVolume > 1) {
                calcVolume = 1;
            }
            this.gainNode.gain.setTargetAtTime(calcVolume, this.context.currentTime, duration);
        };
        Source.prototype.filter = function (type, frequency, duration) {
            this.audioFilter.change(type, frequency, duration);
        };
        Source.prototype.loadSource = function (url, source) {
            var _this = this;
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = function () {
                _this.context.decodeAudioData(request.response, function (buffer) {
                    if (!buffer) {
                        console.error("error decoding file:" + url);
                    }
                    source.buffer = buffer;
                    _this.buffer = buffer;
                    _this.audioFilter = new App.Filter(_this.context, _this.analyser, _this.source, _this.gainNode, _this.context.sampleRate);
                }, function () {
                    console.error("decode audio data error");
                });
            };
            request.onerror = function (e) {
                console.error("xhr error", e);
            };
            request.send();
        };
        return Source;
    })();
    App.Source = Source;
})(App || (App = {}));
