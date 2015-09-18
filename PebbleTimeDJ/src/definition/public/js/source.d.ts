/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="filter.d.ts" />
declare module App {
    class Source {
        private context;
        private analyser;
        private gainNode;
        private source;
        private buffer;
        private audioFilter;
        private volume;
        constructor(context: AudioContext, analyser: AnalyserNode, url: string, volume: number, mute: boolean, loadDelay: number);
        play(): void;
        stop(): void;
        fadein(duration: number): void;
        fadeout(duration: number): void;
        changeSpeed(speed: number, duration: number): void;
        changeVolume(volume: number, duration: number): void;
        filter(type: FilterType, frequency: number, duration: number): void;
        private loadSource(url, source);
    }
}
