/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="Filter.d.ts" />
declare module App {
    class Source {
        private context;
        private gainNode;
        private source;
        private buffer;
        private audioFilter;
        private volume;
        constructor(context: AudioContext, url: string, volume: number, mute: boolean);
        play(): void;
        stop(): void;
        fadein(duration: number): void;
        fadeout(duration: number): void;
        filter(type: FilterType, frequency: number, quality?: number): void;
        private loadSource(url, source);
    }
}
