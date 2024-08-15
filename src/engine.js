
import AssetStore from "./assetStore.js";
import splash from "../img/splash_hampster.webp";

class Engine {
    constructor(canvas, registerCanvasToWindow=true) {
        this.canvas = canvas;
        if (registerCanvasToWindow) {
            window.engine = this;
            window.canvas = canvas
        }
        this.assetStore = new AssetStore();
        this.setSplash(splash);
        this.loading = true;
        this.running = true;

        this.rooms = [];
        this.roomTable = {};
        window.roomTable = this.roomTable;
        this.currentRoomIndex = 0;

        this.cursor = {
            state: 'disabled',
            scale: 1
        }

        this.realMousePos = {
            x: 0, y: 0
        }

        // Update realMousePos so the game devs don't have to
        document.addEventListener('mousemove', e => {
            this.realMousePos.x = e.clientX;
            this.realMousePos.y = e.clientY;
        })
    }

    get room() {
        return this.rooms[this.currentRoomIndex];
    }

    set room(index) {
        this.currentRoomIndex = index;
        if (this.currentRoomIndex) this.rooms[index].start();
        else {
            throw Error('Room doesn\'t exist');
        }
    }

    registerRoom(room, name) {
        // Takes a Room object
        // if name already exists, it WILL be overwritten
        const roomIndex = this.rooms.push(room) - 1
        this.roomTable[name] = roomIndex;
        return roomIndex;
    }

    getRoomIndex(roomName) {
        const rm = this.roomTable[roomName];
        console.log(roomName, this.rooms, this.roomTable, rm)
        if (rm !== undefined) return rm;

        throw Error('That room doesn\'t exist');
    }

    get hoveringOver() {
        // The first object will be the one at the front of the screen.
        const things = this.room.things;
        const hovered_things = [];

        for (let thing of things) {
            // if the mouse position is more than x, less than (x + width),
            //                      more than y, or less than (y + height)
            if (
                this.mouse.x >= thing.x &&
                this.mouse.x <= thing.x + thing.width &&
                this.mouse.y >= thing.y &&
                this.mouse.y <= thing.y + thing.height
            ) {
                // Then:
                hovered_things.unshift(thing);
            }
        }

        return hovered_things;
    }

    click() {
        this.hoveringOver[0].click();
    }

    get mouse() {
        // Gets the mouse position in the game.
        // Must take into account pixel ratios, panning and zooming

        const bounding = this.canvas.canvas.getBoundingClientRect();

        return {
            x: (this.realMousePos.x - bounding.left),
            y: (this.realMousePos.y - bounding.top)
        }
    }

    step() {
        this.room.step();
    }

    draw() {
        this.room.draw();
    }

    drawGui() {
        this.room.drawGui();
    }

    drawCursor(x=undefined, y=undefined) {
        x = x ?? this.mouse.x;
        y = y ?? this.mouse.y;

        const canvas = this.canvas.canvas;
        // Draws the current cursor as defined in this.cursor
        if (this.cursor.state === 'disabled') {
            // Show the system cursor
            canvas.style.cursor = 'auto';
            return;
        }

        canvas.style.cursor = 'none';

        if (this.canvas.state === 'hidden') {
            // Exit here. Not drawing anything
            return;
        }
        
        // Loads the asset 'cursor_${state}
        const cursor = this.assetStore.get('cursor_' + this.cursor.state);
        this.canvas.drawImage(cursor, x, y, cursor.width, cursor.height, this.cursor.scale || 1);
    }

    setSplash(url) {
        this.assetStore.addImage('splash', url);
    }

    loadLoop() {
        // this.canvas.updateCanvasSize();

        this.canvas.fill("#222034");

        const image = this.assetStore.get('splash');
        // this.canvas.drawImage(image,
        //     this.canvas.center.x - (image.width/2), this.canvas.center.y - (image.height/2),
        //     image.width, image.height, 5);
        if (image) this.canvas.drawImageFromCenter(image,
            this.canvas.center.x, this.canvas.center.y,
            image.width, image.height, 5);

        this.canvas.setFillColor('white');
        if (this.assetStore.loaded === this.assetStore.size) {
            // this.canvas.drawText('LOADED', 10, this.canvas.height - 10, {})
            setTimeout(_=>{
                this.loading = false;
            }, 500)
        }

        if (this.assetStore.loadMessages.length >= 1) {
            this.canvas.setFillColor('white');
            for (let i = 0; i < this.assetStore.loadMessages.length; i++) {
                if (this.assetStore.loadMessages[i].error) this.canvas.setFillColor('red');
                this.canvas.drawText(this.assetStore.loadMessages[i].message, 10, (this.canvas.height - 10) - (i*16), {})
            }
        }
    }
}

export default Engine;
