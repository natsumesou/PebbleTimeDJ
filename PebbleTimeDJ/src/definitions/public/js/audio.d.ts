/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="source.d.ts" />
declare module App {
    class Audio {
        private context;
        private sources;
        private index;
        private volume;
        private duration;
        constructor(urls: string[]);
        play(): void;
        stop(): void;
        next(): void;
        filter(type: FilterType, frequency: number, quality?: number): void;
        private changeIndex(oldIndex, currentIndex);
    }
}
