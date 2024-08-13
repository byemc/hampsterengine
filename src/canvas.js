export default class Canvas {
    constructor(canvas) {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pixelRatio = window.devicePixelRatio || 1;
    }

    get height() {
        return this.canvas.height / this.pixelRatio;
    }

    get width() {
        return this.canvas.width / this.pixelRatio;
    }

    get center() {
        return {
            x: this.width / 2,
            y: this.height / 2
        }
    }

    updateCanvasSize() {
        const bounds = this.canvas.getBoundingClientRect();
        const width = bounds.width * this.pixelRatio;
        const height = bounds.height * this.pixelRatio;

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
        this.ctx.imageSmoothingEnabled = false;
    }

    setFillColor(color=this.ctx.fillStyle) {
        this.ctx.fillStyle = color;
    }

    fill(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h)
    }

    drawLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawText(text, x, y, {maxWidth = 0, textAlign = "start", textBaseline = "alphabetic", font = "16px sans-serif"}) {
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.font = font;

        if (maxWidth===0) this.ctx.fillText(text, x, y);
        else this.ctx.fillText(text, x, y, maxWidth);
    }


    drawImage(image, x, y, w, h, scale=1) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.pixelRatio * scale, this.pixelRatio * scale);
        this.ctx.translate((x/scale), y/scale);
        this.ctx.drawImage(image, 0, 0, w, h);
        this.ctx.restore();
    }


    drawImageFromCenter(image, x, y, w, h, scale=1) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.pixelRatio * scale, this.pixelRatio * scale);
        this.ctx.translate((x/scale), y/scale);
        this.ctx.translate(-w/2, -h/2);
        this.ctx.drawImage(image, 0, 0, w, h);
        this.ctx.restore();
    }
}