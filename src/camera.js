
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
        this.y = y;
    }

    gotoX(x) {
        this.x = x;
    }

    goTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
