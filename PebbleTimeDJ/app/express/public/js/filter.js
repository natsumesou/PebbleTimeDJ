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
        function Filter(context, analyser, source, gain, sampleRate) {
            this.nodes = [];
            this.context = context;
            this.analyser = analyser;
            this.source = source;
            this.gainNode = gain;
            this.sampleRate = sampleRate;
            for (var i = 0; i < FilterType.allpass; i++) {
                var node = context.createBiquadFilter();
                node.type = FilterType[i].toString();
                node.frequency.value = this.sampleRate / 2;
                this.nodes.push(node);
            }
            this.connect(this.nodes[FilterType.lowpass]);
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
        Filter.prototype.change = function (type, frequency, duration) {
            this.nodes[type].frequency.setTargetAtTime(this.rateToValue(frequency, this.sampleRate), this.context.currentTime, duration);
            this.connect(this.nodes[type]);
        };
        Filter.stringToFilterType = function (typeString) {
            switch (typeString) {
                case "low pass":
                    return FilterType.lowpass;
                case "high pass":
                    return FilterType.highpass;
                case "band pass":
                    return FilterType.bandpass;
                case "band pass":
                    return FilterType.bandpass;
                case "low shelf":
                    return FilterType.lowshelf;
                case "high shelf":
                    return FilterType.highshelf;
                case "peaking":
                    return FilterType.peaking;
                case "notch":
                    return FilterType.notch;
                case "all pass":
                    return FilterType.allpass;
            }
        };
        Filter.prototype.connect = function (node) {
            this.source.connect(node);
            node.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.context.destination);
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
