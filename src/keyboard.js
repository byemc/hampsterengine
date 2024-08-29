
export default class Keyboard {
    constructor() {
        this.keys = [];
        this.keysThisFrame = [];
        this.keysUpThisFrame = [];

        window.keyboard = this; // register self to window

        addEventListener('keydown', ev => {
            if (!this.keys.includes(ev.key)) this.keys.push(ev.key);
            this.keysThisFrame.push(ev.key);
        });

        addEventListener('keyup', ev => {
            this.keys.splice(this.keys.indexOf(ev.key),1);
            this.keysUpThisFrame.push(ev.key);
        })
    }
}
