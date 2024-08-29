export default class Canvas {
    constructor(canvas) {
        if (typeof (canvas) === 'object') this.canvas = canvas;
        else this.canvas = document.getElementById(canvas);
        this.ctx = this.canvas.getContext`2d`;
        this.pixelRatio = window.devicePixelRatio || 1;
        this.scale = 1;
    }

    get height() {
        return this.canvas.height / this.pixelRatio;
    }
    
    set height(h) {
        this.canvas.height = h;
    }

    get width() {
        return this.canvas.width / this.pixelRatio;
    }
    
    set width(w) {
        this.canvas.width = w;
    }

    get center() {
        return {
            x: this.width / 2,
            y: this.height / 2
        }
    }

    get compositeOperation() {
        return this.ctx.globalCompositeOperation;
    }

    set compositeOperation(op) {
        this.ctx.globalCompositeOperation = op;
    }

    get filter() {
        return this.ctx.filter;
    }

    set filter(fi) {
        this.ctx.filter = fi;
    }

    tempFilter(callback=function(){}, filter="") {
        const oldFilter = this.filter;
        this.filter = filter
        callback();
        this.filter = oldFilter;
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

    setScale(scale=1) {
        this.scale = scale;
        this.ctx.setTransform(
            this.pixelRatio * scale, 0, 0,
            this.pixelRatio * scale, 0, 0
        )
    }

    setFillColor(color=this.ctx.fillStyle) {
        this.ctx.fillStyle = color;
    }

    setStrokeColor(color=this.ctx.strokeStyle) {
        this.ctx.strokeStyle = color;
    }

    fill(color=this.ctx.fillStyle) {
        const oldColour = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = oldColour;
    }

    fillRect(x, y, w, h) {
        this.ctx.fillRect(x, y, w, h)
    }

    strokeRect(x, y, w, h) {
        this.ctx.strokeRect(x, y, w, h);
    }

    drawLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    drawText(text, x, y, {maxWidth = 0, textAlign = "start", textBaseline = "alphabetic", size=8, font = "sans-serif"}) {
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.font = `${size}px ${font}`;

        let lines = []
        // Split the text into lines
        try {
            lines = text.split(/\n/);
        } catch (e) {
            lines = [text];
        }

        for (let i = 0; i < lines.length; i++) {
            if (maxWidth===0) this.ctx.fillText(text, x, y+(i*size));
            else this.ctx.fillText(lines[i], x, y+(i*size), maxWidth);
        }
    }


    drawImage(image, x, y, w, h) {
        this.ctx.drawImage(image, x, y, w, h);
    }

    tileImage(image, x, y, w, h, sourceW, sourceH) {
        for (let i = 0; i < Math.floor(w/sourceW); i++) {
            this.drawImage(image, x + sourceW * i, y, sourceW, sourceH);
        }
    }

    sliceImage(image, x, y, w, h, sx, sy, sw, sh) {
        // Image, X, Y, Width, Height, Source X, Source y, Source Width, Source Height
        this.ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
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