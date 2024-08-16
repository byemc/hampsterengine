
class AssetStore {
    constructor() {
        this.assets = {};
        this.loaded = 0;
        this.loadMessages = []
    }

    get size() {
        return Object.keys(this.assets).length
    }

    addElement(key, element) {
        this.assets[key] = element;
    }

    addAudio(key, url) {
        const audio = new Audio(url);
        this.addElement(key, audio);

        audio.oncanplay = () => {
            this.loaded++
            this.loadMessages.push({
                message: audio.src + ' loaded.'
            })
            console.debug(audio, 'loaded.', this.loaded, this.size)
        };
        audio.onerror = (e) => {
            console.error(e)
            this.loadMessages.push({
                message: audio.src + ' failed to load.',
                error: true
            })
        }

        return audio;
    }

    addSoundBoxAudio(key, song, sb) {
        // song: soundbox JS file.
        // sb: Soundbox function (not included. byosb)

        // Init song
        sb.init(song);
        const t0 = new Date();
        let done = false;

        const audio = new Audio();
        this.addElement(key, audio);

        const interval = setInterval(_=>{
            if (done) {
                clearInterval(interval);
                return;
            }

            done = sb.generate() >= 1;

            if (done) {
                const t1 = new Date();

                const wave = sb.createWave();
                audio.src = URL.createObjectURL(new Blob([wave], {type: 'audio/wav'}));
                this.loaded++;
                this.loadMessages.push({
                    message: `Generated ${key} in ${t1-t0} ms`
                });
            }
        });
    }

    addImage(key, url) {
        const image = new Image();
        image.src = url;
        this.addElement(key, image);
        image.onload = () => {
            this.loaded++
            this.loadMessages.push({
                message: key + ' loaded.'
            })
            console.debug(image, 'loaded.', this.loaded, this.size)
        };
        image.onerror = (e) => {
            console.error(e)
            this.loadMessages.push({
                message: key + ' failed to load.',
                error: true
            })
        }

        return image;
    }

    get(key) {
        // console.log(this.assets)
        return this.assets[key];
    }
}

export default AssetStore;
