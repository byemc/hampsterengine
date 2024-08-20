
export default class Mouse {
    constructor(engine) {
        this.engine = engine;
        this.canvas = engine.canvas;

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
            for (let thing of this.engine.room.entities) if (thing.clicked) thing.mouseupOffThing();

            // Tell whatever is being hovered over about it too
            let hovered = this.engine.hovered;
            if (hovered) hovered[0].mouseup();
        })
    }

    get mouse() {
        // Gets the mouse position in the game.
        // Must take into account pixel ratios, panning and zooming

        const bounding = this.canvas.canvas.getBoundingClientRect();

        const overflow = engine.overflow;

        return {
            x: ((this.realMousePos.x - (overflow.w /2)) / (bounding.width - overflow.w)) * canvas.width,
            y: ((this.realMousePos.y - (overflow.h /2)) / (bounding.height - overflow.h)) * canvas.height
        }
    }

    get hovered() {
        // Get a list of things in the current room
        const things = this.engine.room.entities;
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
}
