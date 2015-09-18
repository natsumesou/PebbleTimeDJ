/// <reference path="../../../definition/waa.d.ts" />

module App {
    export enum FilterType { lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass };

    export class Filter {
        private nodes: BiquadFilterNode[] = [];
        private sampleRate: number;
        private context: AudioContext;
        private source: AudioBufferSourceNode;

        private get maxQuality(): number {
            return 1000;
        }
        private get minValue(): number {
            return 0.0001;
        }
        private get duration(): number {
            return 3;
        }

        constructor(context: AudioContext, source: AudioBufferSourceNode, gain: GainNode, sampleRate: number) {
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

        public change(type: FilterType, frequency: number, quality?: number) {
            this.nodes[type].frequency.setTargetAtTime(this.rateToValue(frequency, this.sampleRate), this.context.currentTime, this.duration);
            if (quality != null) {
                this.nodes[type].Q.setTargetAtTime(this.rateToValue(quality, this.maxQuality), this.context.currentTime, this.duration);
            }
            this.nodes[type].connect(this.context.destination);
            this.source.connect(this.nodes[type]);
        }

        public static stringToFilterType(typeString: string): FilterType {
            switch(typeString) {
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
        }

        private rateToValue(value: number, maxValue: number): number {
            if (value < 0) {
                value = 0;
            }
            if (value > 1) {
                value = 1;
            }
            return value * (maxValue - this.minValue) + this.minValue;
        }
    }
}
