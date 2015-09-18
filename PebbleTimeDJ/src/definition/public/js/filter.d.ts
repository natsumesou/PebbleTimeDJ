/// <reference path="../../../definition/waa.d.ts" />
declare module App {
    enum FilterType {
        lowpass = 0,
        highpass = 1,
        bandpass = 2,
        lowshelf = 3,
        highshelf = 4,
        peaking = 5,
        notch = 6,
        allpass = 7,
    }
    class Filter {
        private nodes;
        private sampleRate;
        private context;
        private analyser;
        private source;
        private gainNode;
        private maxQuality;
        private minValue;
        constructor(context: AudioContext, analyser: AnalyserNode, source: AudioBufferSourceNode, gain: GainNode, sampleRate: number);
        change(type: FilterType, frequency: number, duration: number): void;
        static stringToFilterType(typeString: string): FilterType;
        private connect(node);
    }
}
