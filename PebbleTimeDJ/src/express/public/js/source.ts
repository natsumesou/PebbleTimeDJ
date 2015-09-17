/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./filter.ts" />

module App {

    export class Source {
        private context: AudioContext;
        private gainNode: GainNode;
        private source: AudioBufferSourceNode;
        private buffer: AudioBuffer;
        private audioFilter: Filter;
        private volume: number;

        constructor(context: AudioContext, url: string, volume: number, mute: boolean) {
            this.context = context;
            this.volume = volume;
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = mute ? 0 : this.volume;

            this.source = this.context.createBufferSource();
            this.audioFilter = new Filter(this.context, this.source, this.gainNode, this.context.sampleRate);

            this.loadSource(url, this.source);
        }

        public play() {
            this.source.start(0);
            this.source.loop = true;
        }

        public stop() {
            this.source.stop();

            // regenerate BufferSource because it can't start twice.
            this.source = this.context.createBufferSource();
            this.audioFilter = new Filter(this.context, this.source, this.gainNode, this.context.sampleRate);

            this.gainNode.gain.value = 0;
            this.source.buffer = this.buffer;
        }

        public fadein(duration: number) {
            this.gainNode.gain.setTargetAtTime(this.volume, this.context.currentTime, duration);
        }

        public fadeout(duration: number) {
            this.gainNode.gain.setTargetAtTime(0, this.context.currentTime, duration);
        }

        public filter(type: FilterType, frequency: number, quality?: number) {
            this.audioFilter.change(type, frequency, quality);
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