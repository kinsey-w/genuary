import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day20(p) {
  let host, pg, stars = [];

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(30);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
    pg = p.createGraphics(p.width, p.height);
    pg.pixelDensity(1);
  }

  function build() {
    stars = [];
    const n = 18;
    for (let i = 0; i < n; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(24, 90),
        rot: p.random(p.TAU),
        phase: p.random(p.TAU),
        tint: p.random([
          [120, 180, 255],
          [255, 210, 130],
          [255, 130, 190]
        ])
      });
    }
  }

  function starPoints(cx, cy, r, rot = -p.HALF_PI) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (p.TAU * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawScene() {
    pg.background("#050814");

    for (let i = 0; i < 6; i++) {
      pg.noFill();
      pg.stroke(20, 50, 90, 18);
      pg.circle(
        pg.width * 0.5,
        pg.height * 0.5,
        Math.min(pg.width, pg.height) * (0.35 + i * 0.16)
      );
    }

    for (const s of stars) {
      const pulse = 1 + 0.12 * Math.sin(p.frameCount * 0.03 + s.phase);
      const pts = starPoints(s.x, s.y, s.r * pulse, s.rot + p.frameCount * 0.003);

      pg.noStroke();
      pg.fill(s.tint[0], s.tint[1], s.tint[2], 22);
      for (let i = 0; i < 3; i++) pg.circle(s.x, s.y, s.r * (2.3 + i * 0.4));

      pg.noFill();
      pg.stroke(s.tint[0], s.tint[1], s.tint[2], 210);
      pg.strokeWeight(1.2);
      pg.beginShape();
      for (const pt of pts) pg.vertex(pt[0], pt[1]);
      pg.endShape(p.CLOSE);
    }
  }

  function brightnessAt(arr, idx) {
    return arr[idx] * 0.299 + arr[idx + 1] * 0.587 + arr[idx + 2] * 0.114;
  }

  function sortRowRange(arr, startPx, endPx, y, w, descending) {
    const pixels = [];
    for (let x = startPx; x < endPx; x++) {
      const idx = 4 * (y * w + x);
      pixels.push([
        arr[idx],
        arr[idx + 1],
        arr[idx + 2],
        arr[idx + 3]
      ]);
    }

    pixels.sort((a, b) => {
      const ba = a[0] * 0.299 + a[1] * 0.587 + a[2] * 0.114;
      const bb = b[0] * 0.299 + b[1] * 0.587 + b[2] * 0.114;
      return descending ? bb - ba : ba - bb;
    });

    for (let x = startPx; x < endPx; x++) {
      const idx = 4 * (y * w + x);
      const px = pixels[x - startPx];
      arr[idx] = px[0];
      arr[idx + 1] = px[1];
      arr[idx + 2] = px[2];
      arr[idx + 3] = px[3];
    }
  }

  function pixelSortGraphic(g) {
    g.loadPixels();
    const arr = g.pixels;
    const w = g.width;
    const h = g.height;
    const threshold = p.map(p.mouseX, 0, p.width, 30, 180);
    const descending = p.mouseY < p.height * 0.5;

    for (let y = 0; y < h; y += 2) {
      let x = 0;
      while (x < w) {
        let idx = 4 * (y * w + x);
        while (x < w && brightnessAt(arr, idx) < threshold) {
          x++;
          idx = 4 * (y * w + x);
        }

        const start = x;

        while (x < w) {
          idx = 4 * (y * w + x);
          if (brightnessAt(arr, idx) < threshold) break;
          x++;
        }

        const end = x;
        if (end - start > 4) sortRowRange(arr, start, end, y, w, descending);
      }
    }

    g.updatePixels();
  }

  p.draw = () => {
    drawScene();
    pixelSortGraphic(pg);
    p.image(pg, 0, 0, p.width, p.height);

    p.noStroke();
    p.fill(255, 235, 180, 170);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("mouse x = threshold, mouse y = sort direction", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}