
class Thing {
    // Base object class. Can't call it `object` because it conflicts with the `Object` class.

    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0; // Used for collision detection
        this.height = 0;
        this.spriteImage = new Image()
    }

    set sprite(image) {
        this.spriteImage = image;
        this.width = image.width;
        this.height = image.height;
    }

    step () {
    }

    draw() {
        canvas.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height, 1);
    }

}

class Room {
    constructor() {
        this.things = [];
    }

    start() {
    }

    end() {
    }

    step() {
        for (let thing of this.things) {
            thing.draw();
        }
    }

    draw() {
        for (let thing of this.things) {
            thing.draw();
        }
    }

    drawGui() {
    }
}

export {Room, Thing};
