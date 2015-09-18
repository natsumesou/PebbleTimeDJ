/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./source.ts" />
var App;
(function (App) {
    var Audio = (function () {
        function Audio(urls) {
            this.sources = [];
            this.index = 0;
            this.volume = 1;
            this._started = false;
            try {
                AudioContext = AudioContext || webkitAudioContext;
                this.context = new AudioContext();
            }
            catch (e) {
                console.error("web audio is not supported.");
                console.error(e);
            }
            this._analyser = this.context.createAnalyser();
            for (var i = 0; i < urls.length; i++) {
                var mute = i != this.index;
                var delay = 6 * i * 1000;
                var source = new App.Source(this.context, this._analyser, urls[i], this.volume, mute, delay);
                this.sources.push(source);
            }
        }
        Object.defineProperty(Audio.prototype, "started", {
            get: function () {
                return this._started;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Audio.prototype, "analyser", {
            get: function () {
                return this._analyser;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Audio.prototype, "duration", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Audio.prototype.play = function () {
            this.sources[this.index].play();
            this._started = true;
        };
        Audio.prototype.stop = function () {
            this.sources[this.index].stop();
        };
        Audio.prototype.next = function () {
            var _this = this;
            var nextIndex = this.index + 1;
            if (nextIndex >= this.sources.length) {
                nextIndex = 0;
            }
            this.sources[nextIndex].play();
            this.sources[this.index].fadeout(this.duration);
            this.sources[nextIndex].fadein(this.duration);
            setTimeout(function () { return _this.changeIndex(_this.index, nextIndex); }, this.duration * 1000);
        };
        Audio.prototype.changeSpeed = function (speed, duration) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].changeSpeed(speed, duration);
        };
        Audio.prototype.changeVolume = function (volume, duration) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].changeVolume(volume, duration);
        };
        Audio.prototype.filter = function (type, frequency, duration) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].filter(type, frequency, duration);
        };
        Audio.prototype.changeIndex = function (oldIndex, currentIndex) {
            this.sources[oldIndex].stop();
            this.index = currentIndex;
        };
        return Audio;
    })();
    App.Audio = Audio;
})(App || (App = {}));
