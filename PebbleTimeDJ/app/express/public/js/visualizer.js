/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./source.ts" />
var App;
(function (App) {
    var Visualizer = (function () {
        function Visualizer(analyser, canvas) {
            this.analyser = analyser;
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.context = this.canvas.getContext('2d');
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.context.clearRect(0, 0, this.width, this.height);
        }
        Visualizer.prototype.draw = function () {
            requestAnimationFrame(this.draw.bind(this));
            this.analyser.getByteFrequencyData(this.dataArray);
            this.context.fillStyle = 'rgb(0, 0, 0)';
            this.context.fillRect(0, 0, this.width, this.height);
            var barWidth = (this.width / this.bufferLength) * 2;
            var barHeight;
            var x = 0;
            for (var i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i] * 2;
                this.context.fillStyle = 'rgb(' + (barHeight + 100) + ',' + (255 - barHeight) + ',50)';
                this.context.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        return Visualizer;
    })();
    App.Visualizer = Visualizer;
})(App || (App = {}));
