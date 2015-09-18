/// <reference path="../../../definition/waa.d.ts" />
var App;
(function (App) {
    (function (FilterType) {
        FilterType[FilterType["lowpass"] = 0] = "lowpass";
        FilterType[FilterType["highpass"] = 1] = "highpass";
        FilterType[FilterType["bandpass"] = 2] = "bandpass";
        FilterType[FilterType["lowshelf"] = 3] = "lowshelf";
        FilterType[FilterType["highshelf"] = 4] = "highshelf";
        FilterType[FilterType["peaking"] = 5] = "peaking";
        FilterType[FilterType["notch"] = 6] = "notch";
        FilterType[FilterType["allpass"] = 7] = "allpass";
    })(App.FilterType || (App.FilterType = {}));
    var FilterType = App.FilterType;
    ;
    var Filter = (function () {
        function Filter(context, source, gain, sampleRate) {
            this.nodes = [];
            this.context = context;
            this.source = source;
            this.sampleRate = sampleRate;
            for (var i = 0; i < FilterType.allpass; i++) {
                var node = context.createBiquadFilter();
                node.type = FilterType[i].toString();
                node.frequency.value = this.sampleRate / 2;
                gain.connect(node);
                this.source.connect(gain);
                this.nodes.push(node);
            }
            this.nodes[FilterType.lowpass].connect(this.context.destination);
        }
        Object.defineProperty(Filter.prototype, "maxQuality", {
            get: function () {
                return 1000;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Filter.prototype, "minValue", {
            get: function () {
                return 0.0001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Filter.prototype, "duration", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Filter.prototype.change = function (type, frequency, quality) {
            this.nodes[type].frequency.setTargetAtTime(this.rateToValue(frequency, this.sampleRate), this.context.currentTime, this.duration);
            if (quality != null) {
                this.nodes[type].Q.setTargetAtTime(this.rateToValue(quality, this.maxQuality), this.context.currentTime, this.duration);
            }
            this.nodes[type].connect(this.context.destination);
            this.source.connect(this.nodes[type]);
        };
        Filter.prototype.rateToValue = function (value, maxValue) {
            if (value < 0) {
                value = 0;
            }
            if (value > 1) {
                value = 1;
            }
            return value * (maxValue - this.minValue) + this.minValue;
        };
        return Filter;
    })();
    App.Filter = Filter;
})(App || (App = {}));
