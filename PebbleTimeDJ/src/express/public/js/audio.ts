/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./source.ts" />

module App {

    export class Audio {
        private context: AudioContext;
        private _analyser: AnalyserNode;
        private sources: Source[] = [];
        private index: number = 0;

        private volume: number = 1;

        private _started: boolean = false;

        public get started(): boolean {
            return this._started;
        }

        public get analyser(): AnalyserNode {
            return this._analyser;
        }

        private get duration(): number {
            return 3;
        }

        constructor(urls: string[]) {
            try {
                AudioContext = AudioContext || webkitAudioContext;
                this.context = new AudioContext();
            } catch (e) {
                console.error("web audio is not supported.");
                console.error(e);
            }

            this._analyser = this.context.createAnalyser();

            for (var i = 0; i < urls.length; i++) {
                var mute = i != this.index;
                var delay = 3 * i * 1000;
                var source = new Source(this.context, this._analyser, urls[i], this.volume, mute, delay);
                this.sources.push(source);
            }
        }

        public play() {
            this.sources[this.index].play();
            this._started = true;
        }

        public stop() {
            this.sources[this.index].stop();
        }

        public next() {
            var nextIndex = this.index + 1;
            if (nextIndex >= this.sources.length) {
                nextIndex = 0;
            }

            this.sources[nextIndex].play();
            this.sources[this.index].fadeout(this.duration);
            this.sources[nextIndex].fadein(this.duration);
            setTimeout(() => this.changeIndex(this.index, nextIndex), this.duration * 1000);
        }

        public changeSpeed(speed: number, duration?: number) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].changeSpeed(speed, duration);
        }

        public changeVolume(volume: number, duration?: number) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].changeVolume(volume, duration);
        }

        public filter(type: FilterType, frequency: number, duration?: number) {
            if (duration == null) {
                duration = this.duration;
            }
            this.sources[this.index].filter(type, frequency, duration);
        }

        private changeIndex(oldIndex: number, currentIndex: number) {
            this.sources[oldIndex].stop();
            this.index = currentIndex;
        }
    }
}