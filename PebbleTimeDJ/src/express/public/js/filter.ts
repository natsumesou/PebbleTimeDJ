/// <reference path="../../../definition/waa.d.ts" />

module App {
    export enum FilterType { lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass };

    export class Filter {
        private nodes: BiquadFilterNode[] = [];
        private sampleRate: number;
        private context: AudioContext;
        private analyser: AnalyserNode;
        private source: AudioBufferSourceNode;
        private gainNode: GainNode;

        private get maxQuality(): number {
            return 1000;
        }
        private get minValue(): number {
            return 0.0001;
        }

        constructor(context: AudioContext, analyser: AnalyserNode, source: AudioBufferSourceNode, gain: GainNode, sampleRate: number) {
            this.context = context;
            this.analyser = analyser;
            this.source = source;
            this.gainNode = gain;
            this.sampleRate = sampleRate;
            for (var i = 0; i < FilterType.allpass; i++) {
                var node = context.createBiquadFilter();
                node.type = FilterType[i].toString();
                if (i == FilterType.lowpass || i == FilterType.lowshelf) {
                    node.frequency.value = this.sampleRate;
                } else if (i == FilterType.highpass || i == FilterType.highshelf) {
                    node.frequency.value = 0;
                } else {
                    node.frequency.value = this.sampleRate / 2;
                }
                this.nodes.push(node);
            }
            this.connect(this.nodes[FilterType.lowpass]);
        }

        public change(type: FilterType, frequency: number, duration: number) {
            var calcFrequency;
            if (frequency > 0) {
                calcFrequency = this.nodes[type].frequency.value * 3;
            } else {
                calcFrequency = this.nodes[type].frequency.value / 3;
            }
            if (calcFrequency < this.minValue) {
                calcFrequency = this.minValue;
            }
            if (calcFrequency > this.sampleRate) {
                calcFrequency = this.sampleRate;
            }
            this.nodes[type].frequency.setTargetAtTime(calcFrequency, this.context.currentTime, duration);
            this.connect(this.nodes[type]);
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

        private connect(node: BiquadFilterNode) {
            this.source.connect(node);
            node.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.context.destination);
        }
    }
}
