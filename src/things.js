const round = Math.round;

class Entity {
    // Base object class. Can't call it `object` because it conflicts with the `Object` object.

    constructor() {
        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.spriteImage = new Image();
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

    get top() {
        return this.y;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get bottom() {
        return this.y + this.height;
    }

    step () {
    }

    draw() {
        canvas.drawImage(this.sprite, round(this.x), round(this.y), this.sprite.width, this.sprite.height, 1);
    }

    mousedown() {}

    mouseup() {
        // Only called when the mouse is released
    }

    mouseupOffThing() {
        // ALWAYS called when the mouse is released
    }

}

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
