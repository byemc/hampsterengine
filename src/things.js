
class Entity {
    // Base object class. Can't call it `object` because it conflicts with the `Object` class.

    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0; // Used for collision detection
        this.height = 0;
        this.spriteImage = new Image()
    }

    set sprite(image) {
        if (typeof image === "string") {
            let img = new Image();
            img.src = image;
            image = img;
        }

        this.spriteImage = image;
        this.width = image.width;
        this.height = image.height;
    }

    get sprite() {
        return this.spriteImage;
    }

    step () {
    }

    draw() {
        canvas.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height, 1);
    }

    physicsTick() {
    }

    mousedown() {}

    mouseup() {
        // Only called when the mouse is released
    }

    mouseupOffThing() {
        // ALWAYS called when the mouse is released
    }

}

// Physics constants
Entity.KINEMATIC = 'kinematic';
Entity.DYNAMIC = 'dynamic';

class Room {
    constructor() {
        this.entities = [];
        this.bgColor = 'white';
    }

    start() {
    }

    stop() {
    }

    step() {
        for (let thing of this.entities) {
            thing.draw();
        }
    }

    draw() {
        for (let thing of this.entities) {
            thing.draw();
        }
    }

    drawGui() {
    }
}

export {Room, Entity};
