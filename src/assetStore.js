
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

    addImage(key, url) {
        const image = new Image();
        image.src = url;
        this.addElement(key, image);
        image.onload = () => {
            this.loaded++
            this.loadMessages.push({
                message: image.src + ' loaded.'
            })
            console.debug(image, 'loaded.', this.loaded, this.size)
        };
        image.onerror = (e) => {
            console.error(e)
            this.loadMessages.push({
                message: image.src + ' failed to load.',
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
