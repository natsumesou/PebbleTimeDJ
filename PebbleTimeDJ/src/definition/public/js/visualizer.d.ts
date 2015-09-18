/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="source.d.ts" />
declare module App {
    class Visualizer {
        private analyser;
        private canvas;
        private context;
        private bufferLength;
        private dataArray;
        private width;
        private height;
        constructor(analyser: AnalyserNode, canvas: HTMLCanvasElement);
        draw(): void;
    }
}
