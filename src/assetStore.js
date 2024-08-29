import Canvas from "./canvas";

class AssetStore {
    constructor() {
        this.assets = {};
        this.loaded = 0;
        this.loadMessages = [];
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

    addMiniSprite(key, spriteString, size=8) {
        // Strongly adapted from https://xem.github.io/miniPixelArt/

        let pixels = [];
        spriteString.replace(/./g,
            character => {
                var characterCode = character.charCodeAt();
                    pixels.push(characterCode&7); // Gets the last three bits
                    pixels.push((characterCode>>3)&7) // Gets the first three bits
            });

        this.assets[key] = {
            spriteString, size, pixels
        };

        this.loadMessages.push({
            message: key + ' saved.'
        });
        this.loaded++;
    }

    renderMiniSprite(key, palette=['#000']) {
        // Strongly adapted from https://xem.github.io/miniPixelArt/
        this.loaded--;

        const asset = this.assets[key]
        const size = asset.size;

        // Create a new canvas
        const a = document.createElement`canvas`;
        a.width = size;
        a.height = size;
        const c = a.getContext`2d`;
        const pixels = asset.pixels;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // if (pixels[y * size * x]) {
                    c.fillStyle = palette[pixels[y * size + x] - 1];
                    c.fillRect(x, y, 1, 1);
                // }
            }
        }

        this.assets[key].sprite = new Image();
        this.assets[key].sprite.src = a.toDataURL();

        this.loadMessages.push({
            message: key + ' rendered.'
        });
        this.loaded++;
    }

    addCanvasAsImage(key, canvas) {

    }

    get(key) {
        // console.log(this.assets)
        return this.assets[key];
    }
}

export default AssetStore;
