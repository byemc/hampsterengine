import {abs} from "../../src/js/extras";

const round = Math.round;

class Entity {
    // Base object class. Can't call it `object` because it conflicts with the `Object` object.

    constructor() {
        this.x = 0;
        this.y = 0;

        this.vx = 0; //Velocity
        this.vy = 0;

        this.ax = 0; //Acceleration
        this.ay = 0;

        this.width = 0;
        this.height = 0;

        this.spriteImage = new Image();

        this.collide = true;
        this.collideRects = [{x:0, y:0, w: this.width, h: this.height}]
    }

    get halfWidth() {
        return this.width / 2;
    }

    get halfHeight() {
        return this.height / 2;
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

    get midX() {
        return this.x + (this.width / 2)
    }

    get midY() {
        return this.y + (this.height / 2);
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

    checkCollision(other) {
        // Checks if colliding with another entity. Returns true if colliding.

        return !(
            this.bottom < other.top ||
            this.top > other.bottom ||
            this.right < other.left ||
            this.left > other.right
        );
    }

    resolveCollision(other) {
        // Move self to no longer be colliding with other, move to the best edge
        const dx = (other.midX - this.midX) / other.halfWidth;
        const dy = (other.midY - this.midY) / other.halfHeight;

        // Calculate absolute change
        const absDX = abs(dx);
        const absDY = abs(dy);

        let side = 0;

        if (absDX > absDY || abs(absDX - absDY) < .1) {
            // Coming from the sides or corners
            if (dx < 0) {
                // Approaching from the right;
                this.x = other.right;
                side = 3;
            } else {
                // Approaching from the left
                this.x = other.left - this.width;
                side = 1;
            }

            // Set X velocity to 0
            this.vx = 0;
        } else {
            // Approaching from the top or bottom
            if (dy < 0) {
                // Approaching from the bottom
                this.y = other.bottom;
                if (this.vy < 0) this.vy = 0;
                side = 4;
            } else {
                // Approaching from the top
                this.y = other.top - this.height;
                this.vy = 0;
                side = 2;
            }

        }


        return side;
    }

}

class Room {
    constructor() {
        this.entities = [];
        this.entitiesTable = {};
        this.bgColor = 'white';
    }

    push(entity, id=Math.floor(Math.random()*2147000000).toString()) {
        if (this.get(id)) this.entities.splice(this.get(id), 1);
        const entityIndex = this.entities.push(entity) - 1;
        this.entitiesTable[id] = entityIndex
    }

    get(id) {
        return this.entities[this.entitiesTable[id]];
    }

    init() {
        // Use this for init code instead of the top level
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
        canvas.ctx.save();
        canvas.ctx.translate(-canvas.camera.x, -canvas.camera.y);
        for (let thing of this.entities) {
            thing.draw();
        }
        canvas.ctx.restore();
    }

    drawGui() {
    }
}

export {Room, Entity};
