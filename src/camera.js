import {abs, easeOutCubic, easeOutSine} from "../../src/js/extras";

export default class Camera {
    constructor(canvas) {
        this.c = canvas;

        this.x = 0;
        this.y = 0;

        this.goingToX = 0;
        this.goingToY = 0;
        this.startX = 0;
        this.startY = 0;
        this.duration = 0; // ms
        this.moveStart =0; // Start of move in ms
        this.moveEnd = 0;
    }

    get height() {
        return this.c.height - this.y;
    }

    goTo(x, y, t=0) {
        // console.log("Going to", x, y, t)
        this.goingToX = x;
        this.goingToY = y;
        this.startX = this.x;
        this.startY = this.y;
        this.moveStart = performance.now();
        this.moveEnd = performance.now() + t;
    }

    step() {
        let distX = this.goingToX - this.startX;
        let distY = this.goingToY - this.startY;

        const elapsed = Math.min(performance.now() - this.moveStart, this.moveEnd - this.moveStart);
        const end = this.moveEnd - this.moveStart;
        const pos = easeOutSine(elapsed / end || 1);

        this.x = Math.min(
            this.goingToX,
            this.startX + (distX * pos)
            );
        this.y = Math.min(
            this.goingToY,
            this.startY + (distY * pos)
        );
        // console.log(this.moveStart, this.moveEnd, elapsed, end, pos, distX, distY)
    }
}
