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
        private source;
        private maxQuality;
        private minValue;
        private duration;
        constructor(context: AudioContext, source: AudioBufferSourceNode, gain: GainNode, sampleRate: number);
        change(type: FilterType, frequency: number, quality?: number): void;
        private rateToValue(value, maxValue);
    }
}
