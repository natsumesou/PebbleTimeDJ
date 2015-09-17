/// <reference path="../../../definition/waa.d.ts" />
/// <reference path="./source.ts" />

module App {

    export class Audio {
        private context: AudioContext;
        private sources: Source[] = [];
        private index: number = 0;

        private volume: number = 0.5;

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

            for (var i = 0; i < urls.length; i++) {
                var mute = i != this.index;
                this.sources.push(new Source(this.context, urls[i], this.volume, mute));
            }
        }

        public play() {
            this.sources[this.index].play();
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

        public filter(type: FilterType, frequency: number, quality?: number) {
            this.sources[this.index].filter(type, frequency, quality);
        }

        private changeIndex(oldIndex: number, currentIndex: number) {
            this.sources[oldIndex].stop();
            this.index = currentIndex;
        }
    }
}