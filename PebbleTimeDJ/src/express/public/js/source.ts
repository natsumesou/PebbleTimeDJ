/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./filter.ts" />

module App {

    export class Source {
        private context: AudioContext;
        private analyser: AnalyserNode;
        private gainNode: GainNode;
        private source: AudioBufferSourceNode;
        private buffer: AudioBuffer;
        private audioFilter: Filter;
        private volume: number;

        constructor(context: AudioContext, analyser: AnalyserNode, url: string, volume: number, mute: boolean, loadDelay: number) {
            this.context = context;
            this.analyser = analyser;
            this.volume = volume;
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = mute ? 0 : this.volume;

            this.source = this.context.createBufferSource();
            setTimeout(() => this.loadSource(url, this.source), loadDelay);
        }

        public play() {
            this.source.start(0);
            this.source.loop = true;
        }

        public stop() {
            this.source.stop();

            // regenerate BufferSource because it can't start twice.
            this.source = this.context.createBufferSource();
            this.audioFilter = new Filter(this.context, this.analyser, this.source, this.gainNode, this.context.sampleRate);

            this.gainNode.gain.value = 0;
            this.source.buffer = this.buffer;
        }

        public fadein(duration: number) {
            this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, duration);
        }

        public fadeout(duration: number) {
            this.gainNode.gain.setTargetAtTime(0, this.context.currentTime, duration);
        }

        public changeSpeed(speed: number, duration: number) {
            var calcSpeed = this.source.playbackRate.value + speed;
            if (calcSpeed < 0.2) {
                calcSpeed = 0.2;
            }
            if (calcSpeed > 3) {
                calcSpeed = 3;
            }
            console.log(calcSpeed);
            this.source.playbackRate.setTargetAtTime(calcSpeed, this.context.currentTime, duration);
        }

        public changeVolume(volume: number, duration: number) {
            var calcVolume = this.gainNode.gain.value + volume;
            if (calcVolume < 0.2) {
                calcVolume = 0.2;
            }
            if (calcVolume > 1) {
                calcVolume = 1;
            }
            console.log(calcVolume);
            this.gainNode.gain.setTargetAtTime(calcVolume, this.context.currentTime, duration);
        }

        public filter(type: FilterType, frequency: number, duration: number) {
            this.audioFilter.change(type, frequency, duration);
        }

        private loadSource(url: string, source: AudioBufferSourceNode) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            request.onload = () => {
                this.context.decodeAudioData(
                    request.response,
                    (buffer: AudioBuffer) => {
                        if (!buffer) {
                            console.error("error decoding file:" + url);
                        }
                        source.buffer = buffer;
                        this.buffer = buffer;
                        this.audioFilter = new Filter(this.context, this.analyser, this.source, this.gainNode, this.context.sampleRate);
                    },
                    () => {
                        console.error("decode audio data error");
                    });
            }
            request.onerror = function (e) {
                console.error("xhr error", e);
            }
            request.send();
        }
    }
}