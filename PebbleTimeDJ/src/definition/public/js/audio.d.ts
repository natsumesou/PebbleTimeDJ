/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="source.d.ts" />
declare module App {
    class Audio {
        private context;
        private _analyser;
        private sources;
        private index;
        private volume;
        private _started;
        started: boolean;
        analyser: AnalyserNode;
        private duration;
        constructor(urls: string[]);
        play(): void;
        stop(): void;
        next(): void;
        changeSpeed(speed: number, duration?: number): void;
        changeVolume(volume: number, duration?: number): void;
        filter(type: FilterType, frequency: number, duration?: number): void;
        private changeIndex(oldIndex, currentIndex);
    }
}
