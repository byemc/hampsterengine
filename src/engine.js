
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
        this.loadDelay = 1000;
        this.running = true;

        this.frames = 0;

        this.rooms = [];
        this.roomTable = {};
        window.roomTable = this.roomTable;
        this.currentRoomIndex = 0;

        this.cursor = {
            state: 'disabled',
            scale: 1
        }

        this.mouseDown = false;
        this.mouseDownStart = new Date();
        this.mouseDownPos = {
            x: 0, y: 0
        }

        this.realMousePos = {
            x: 0, y: 0
        }

        this.lastClickPos = {
            x:0, y:0
        }

        // Update realMousePos so the game devs don't have to
        this.canvas.canvas.addEventListener('mousemove', e => {
            this.realMousePos.x = e.clientX;
            this.realMousePos.y = e.clientY;
        });

        this.canvas.canvas.addEventListener('mousedown', e => {
            // Only accept primary mouse button clicks
            // Otherwise middle, right, back and forward mouse buttons will be accepted too.
            if (e.button !== 0) return;

            const mouse = this.mouse;
            this.mouseDown = true;
            this.mouseDownPos.x = mouse.x;
            this.mouseDownPos.y = mouse.y;

            let hovered = this.hovered;
            if (hovered) hovered[0].mousedown();
        });

        this.canvas.canvas.addEventListener('mouseup', e => {
            if (e.button !== 0) return;

            const mouse = this.mouse;
            this.mouseDown = false;
            this.lastClickPos.x = mouse.x;
            this.lastClickPos.y = mouse.y;

            // Tell everything previously clicked about the mouseup event
            for (let thing of this.room.things) if (thing.clicked) thing.mouseupOffThing();

            // Tell whatever is being hovered over about it too
            let hovered = this.hovered;
            if (hovered) hovered[0].mouseup();
        })
    }

    get hovered() {
        // Get a list of things in the current room
        const things = this.room.things;
        if (!things) return [];

        let hovered = [];

        const mouse = this.mouse;

        // Loop through everything in the room.
        for (let thing of things) {
            // Check if the cursor is within the length and width of this thing
            if (
                mouse.x >= thing.x &&       // X more than the left edge,
                mouse.x <= thing.x + thing.width &&   // X less than the right edge,
                mouse.y >= thing.y &&       // Y more than top edge,
                mouse.y <= thing.y + thing.height     // Y less than bottom edge.
            ) {
                // Then we're colliding!
                hovered.unshift(thing);
            }
        }

        console.log(hovered);

        return hovered;
    }

    get room() {
        return this.rooms[this.currentRoomIndex];
    }

    set room(index) {
        this.currentRoomIndex = index;
        if (this.currentRoomIndex !== undefined) this.rooms[index].start();
        else {
            throw Error('Room doesn\'t exist');
        }
    }

    get overflow() {
        // Returns the overflow relative to the canvas (e.g.,
        // if the resolution of the canvas is 640x480, it'll be relative to that)

        const bounding = this.canvas.canvas.getBoundingClientRect();
        const ratio = this.canvas.width / this.canvas.height;
        const boundingRatio = bounding.width / bounding.height;

        // this.canvas.drawText(ratio, 0, canvas.height, {})
        // this.canvas.drawText(boundingRatio, 0, canvas.height-8, {})

        let w = 0;
        let h = 0;

        if (boundingRatio > ratio) {
            const hRatio = bounding.height / canvas.height;
            w = bounding.width - (canvas.width*hRatio);
        }

        return {
            w, h
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

    get mouse() {
        // Gets the mouse position in the game.
        // Must take into account pixel ratios, panning and zooming

        const bounding = this.canvas.canvas.getBoundingClientRect();

        const overflow = this.overflow;

        return {
            x: ((this.realMousePos.x - (overflow.w /2)) / (bounding.width - overflow.w)) * canvas.width,
            y: ((this.realMousePos.y - (overflow.h /2)) / (bounding.height - overflow.h)) * canvas.height
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
            image.width, image.height, 1);

        this.canvas.setFillColor('white');
        if (this.assetStore.loaded === this.assetStore.size) {
            // this.canvas.drawText('LOADED', 10, this.canvas.height - 10, {})
            setTimeout(_=>{
                this.loading = false;
            }, this.loadDelay)
        }

        if (this.assetStore.loadMessages.length >= 1) {
            this.canvas.setFillColor('white');
            for (let i = 0; i < this.assetStore.loadMessages.length; i++) {
                if (this.assetStore.loadMessages[i].error) this.canvas.setFillColor('red');
                this.canvas.drawText(this.assetStore.loadMessages[i].message, 0, (i*16), {
                    textBaseline: 'top'
                })
            }
        }
    }
}

export default Engine;
