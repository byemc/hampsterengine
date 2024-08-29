
export default class Camera {
    constructor(canvas) {
        this.c = canvas;

        this.x = 0;
        this.y = 0;
    }

    get height() {
        return this.c.height - this.y;
    }

    gotoY(y) {
        this.c.setScale();
        this.y = y;
        this.c.ctx.translate(-this.x, -this.y);
    }

    gotoX(x) {
        this.c.setScale();
        this.x = x;
        this.c.ctx.translate(-this.x, -this.y);
    }

    goTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
