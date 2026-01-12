export default {
  meta: { day: 31, prompt: "Pixel sorting", svg: false },

  setup() {
    // keep pixel array small + predictable
    pixelDensity(1);
    this.done = false;
  },

  draw({ DX, DY, t }) {
    if (this.done) return;

    // --- 1) make a source image (fast to draw, good for sorting) ---
    background(12, 14, 20);
    noStroke();

    // soft vertical gradient
    for (let y = 0; y < height; y++) {
      const u = y / (height - 1);
      fill(20 + 60 * u, 18 + 40 * u, 28 + 90 * u, 255);
      rect(0, y, width, 1);
    }

    // diagonal translucent bars
    push();
    translate(width * 0.5, height * 0.5);
    rotate(-0.45);
    for (let i = -18; i <= 18; i++) {
      const a = 35 + 18 * ((i + 18) / 36);
      fill(255, 180, 90, a);
      rect(-width, i * 18, width * 2, 10);
      fill(90, 210, 255, a);
      rect(-width, i * 18 + 6, width * 2, 3);
    }
    pop();

    // a few blobs to create bright regions
    for (let i = 0; i < 9; i++) {
      const x = 80 + (i * 47) % (width - 160);
      const y = 70 + (i * 83) % (height - 140);
      fill(240, 120 + (i * 11) % 80, 200, 90);
      circle(x, y, 140);
    }

    // --- 2) pixel sort (one pass, then stop) ---
    loadPixels();
    const w = width, h = height;
    const pix = pixels;

    const lumAt = (x, y) => {
      const i = 4 * (x + y * w);
      const r = pix[i], g = pix[i + 1], b = pix[i + 2];
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const swapRunRow = (y, x0, x1) => {
      const run = [];
      for (let x = x0; x < x1; x++) {
        const i = 4 * (x + y * w);
        const r = pix[i], g = pix[i + 1], b = pix[i + 2], a = pix[i + 3];
        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        run.push([L, r, g, b, a]);
      }
      run.sort((A, B) => A[0] - B[0]);
      for (let x = x0; x < x1; x++) {
        const i = 4 * (x + y * w);
        const p = run[x - x0];
        pix[i] = p[1]; pix[i + 1] = p[2]; pix[i + 2] = p[3]; pix[i + 3] = p[4];
      }
    };

    const swapRunCol = (x, y0, y1) => {
      const run = [];
      for (let y = y0; y < y1; y++) {
        const i = 4 * (x + y * w);
        const r = pix[i], g = pix[i + 1], b = pix[i + 2], a = pix[i + 3];
        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        run.push([L, r, g, b, a]);
      }
      run.sort((A, B) => A[0] - B[0]);
      for (let y = y0; y < y1; y++) {
        const i = 4 * (x + y * w);
        const p = run[y - y0];
        pix[i] = p[1]; pix[i + 1] = p[2]; pix[i + 2] = p[3]; pix[i + 3] = p[4];
      }
    };

    // sort only mid-tones (keeps dark + highlights intact → nicer look)
    const LMIN = 55;
    const LMAX = 215;

    // Row sorting
    for (let y = 0; y < h; y++) {
      let x = 0;
      while (x < w) {
        while (x < w && (lumAt(x, y) < LMIN || lumAt(x, y) > LMAX)) x++;
        const x0 = x;
        while (x < w && (lumAt(x, y) >= LMIN && lumAt(x, y) <= LMAX)) x++;
        const x1 = x;
        if (x1 - x0 > 10) swapRunRow(y, x0, x1);
      }
    }

    // Light column sorting on a few columns (adds “tearing”)
    for (let x = 0; x < w; x += 12) {
      let y = 0;
      while (y < h) {
        while (y < h && (lumAt(x, y) < LMIN || lumAt(x, y) > LMAX)) y++;
        const y0 = y;
        while (y < h && (lumAt(x, y) >= LMIN && lumAt(x, y) <= LMAX)) y++;
        const y1 = y;
        if (y1 - y0 > 12) swapRunCol(x, y0, y1);
      }
    }

    updatePixels();

    // tiny caption
    push();
    fill(255, 220);
    noStroke();
    textFont("monospace");
    textSize(11);
    text("pixel sorting / mid-tone runs", 12, height - 14);
    pop();

    this.done = true;
    if (typeof noLoop === "function") noLoop();
  },
};
