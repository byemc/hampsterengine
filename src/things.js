
var Collision = {
    elastic: function (resitution) {
        this.resitution = resitution || .2;
    },

    displace: function () {
        this.resitution = 0;
    }
};

const abs = Math.abs;

class Entity {
    // Base object class. Can't call it `object` because it conflicts with the `Object` object.

    constructor() {
        this.x = 0;
        this.y = 0;

        this.width = 0;
        this.height = 0;

        this.spriteImage = new Image();
    }

    updateBounds() {
        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;
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

    get midX () {
        return this.halfWidth + this.x;
    }

    get midY () {
        return this.halfHeight + this.y;
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
        canvas.drawImage(this.sprite, this.x, this.y, this.sprite.width, this.sprite.height, 1);
    }

    mousedown() {}

    mouseup() {
        // Only called when the mouse is released
    }

    mouseupOffThing() {
        // ALWAYS called when the mouse is released
    }

}

class PhysicsEntity extends Entity {
    constructor(collisionName = PhysicsEntity.ELASTIC, type = PhysicsEntity.DYNAMIC) {
        super();

        this.vx = 0; // Horizontal velocity
        this.vy = 0; // Vertical velocity

        this.ax = 0; // Acceleration
        this.ay = 0;

        this.halfWidth = this.width * .5;
        this.halfHeight = this.height * .5;

        this.type = type || PhysicsEntity.DYNAMIC;
        this.collision = collisionName || PhysicsEntity.ELASTIC;

        var collision = Collision[this.collision];
        collision.call(this);
    }

    draw() {
        super.draw();
        canvas.setStrokeColor('black');
        canvas.strokeRect(this.x, this.y, this.width, this.height);
    }

    physicsTick() {
    }
}

// Physics constants
PhysicsEntity.KINEMATIC = 'kinematic';
PhysicsEntity.DYNAMIC = 'dynamic';

// Solver Constants
PhysicsEntity.DISPLACE = 'displace';
PhysicsEntity.ELASTIC = 'elastic';


function collideRect(collider, collidee) {
    // Edges for both parties

    const left1 = collider.left;
    const top1 = collider.top;
    const right1 = collider.right;
    const bottom1 = collider.bottom;

    const left2 = collidee.left;
    const top2 = collidee.top;
    const right2 = collidee.right;
    const bottom2 = collidee.bottom;

    // the ibm people are too smart so i'm copying most of this from them
    // https://developer.ibm.com/tutorials/wa-build2dphysicsengine/#collision-detector18
    return !(bottom1 > top2 ||
        top1 > bottom2 ||
        right1 > left2 ||
        left1 > right2);
}

const STICKY_THRESHOLD = .0004

function resolveElastic(player, entity) {
    // I dont understand any of this :sob:
    // Thank you IBM

    const pMidX = player.midX;
    const pMidY = player.midY;
    const aMidX = entity.midX;
    const aMidY = entity.midY;

    // find the side of entry
    const dx = (aMidX - pMidX) / entity.halfWidth;
    const dy = (aMidY - pMidY) / entity.halfHeight;

    // Absolute change
    const absDX = abs(dx);
    const absDY = abs(dy);

    // if the position between the normalised x and y is less than .1
    // then it's approaching a corner
    if (abs(absDX - absDY) < .1) {
        // if approaching from positive x
        if (dx < 0) player.x = entity.right; // set them to the right side
        else player.x = entity.left - player.width // otherwise set to the left side

        if (dy < 0) player.y = entity.bottom;
        else player.y = entity.top - player.height;

        // randomly select an x/y direction to reflect velocity on
        if (Math.random() < .5) {
            player.vx = -player.vx * entity.restitution;

            // if the velocity is near zero, set it to zero
            if (abs(player.vx) < STICKY_THRESHOLD) {
                player.vx = 0;
            }
        } else {
            player.vy = -player.vy * entity.restitution;
            if (abs(player.vy) < STICKY_THRESHOLD) {
                player.vy = 0;
            }
        }
    } else if (absDX > absDY) {
        // The object is approaching the sides
        if (dx < 0) player.x = entity.right;
        else player.x = entity.left - player.width;

        player.vx = -player.vx * entity.restitution;

        if (abs(player.vx) < STICKY_THRESHOLD) player.vx = 0;
    } else {
        // Coming from the top or bottom

        if (dy < 0) player.y = entity.bottom;
        else player.y = entity.top - player.height;

        player.vy = -player.vy * entity.restitution;
        if (abs(player.vy) < STICKY_THRESHOLD) {
            player.vy = 0;
        }
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

export {Room, Entity, PhysicsEntity, Collision, collideRect, resolveElastic};
