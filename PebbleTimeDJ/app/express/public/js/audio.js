/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./source.ts" />
var App;
(function (App) {
    var Audio = (function () {
        function Audio(urls) {
            this.sources = [];
            this.index = 0;
            this.volume = 1;
            try {
                AudioContext = AudioContext || webkitAudioContext;
                this.context = new AudioContext();
            }
            catch (e) {
                console.error("web audio is not supported.");
                console.error(e);
            }
            for (var i = 0; i < urls.length; i++) {
                var mute = i != this.index;
                var delay = 3 * i * 1000;
                this.sources.push(new App.Source(this.context, urls[i], this.volume, mute, delay));
            }
        }
        Object.defineProperty(Audio.prototype, "duration", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Audio.prototype.play = function () {
            this.sources[this.index].play();
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
        Audio.prototype.filter = function (type, frequency, quality) {
            this.sources[this.index].filter(type, frequency, quality);
        };
        Audio.prototype.changeIndex = function (oldIndex, currentIndex) {
            this.sources[oldIndex].stop();
            this.index = currentIndex;
        };
        return Audio;
    })();
    App.Audio = Audio;
})(App || (App = {}));
