import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day11(p) {
  let host;
  let tiles = [];

  const COLS = 8;
  const ROWS = 6;

  const PALETTE = [
    "#2e4057", // indigo blue
    "#b04b3f", // rust
    "#d3b17a", // sand
    "#7a8b5a", // olive
    "#e8dcc8"  // light yarn
  ];

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(24);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    tiles = [];
    const marginX = p.width * 0.08;
    const marginY = p.height * 0.12;
    const tileW = (p.width - marginX * 2) / COLS;
    const tileH = (p.height - marginY * 2) / ROWS;

    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        tiles.push({
          x: marginX + gx * tileW,
          y: marginY + gy * tileH,
          w: tileW,
          h: tileH,
          rot: p.random([0, Math.PI]),
          warp: p.random(-2, 2),
          colorA: p.random(PALETTE),
          colorB: p.random(PALETTE),
          colorC: p.random(PALETTE)
        });
      }
    }
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawWeaveRect(x, y, w, h, c1, c2) {
    const bands = 8;
    const bh = h / bands;
    for (let i = 0; i < bands; i++) {
      p.noStroke();
      p.fill(i % 2 === 0 ? c1 : c2);
      p.rect(x, y + i * bh, w, bh + 1);
    }

    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    for (let i = 0; i <= bands; i++) {
      const yy = y + i * bh;
      p.line(x, yy, x + w, yy);
    }
  }

  function drawWovenStar(cx, cy, r, rot, cMain, cAlt) {
    const pts = starPoints(cx, cy, r, rot);

    p.stroke(cMain);
    p.strokeWeight(6);
    p.noFill();
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.stroke(cAlt);
    p.strokeWeight(2);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const mx = (a[0] + b[0]) * 0.5;
      const my = (a[1] + b[1]) * 0.5;

      p.noStroke();
      p.fill(cAlt);
      p.rect(mx - r * 0.08, my - r * 0.08, r * 0.16, r * 0.16);
    }
  }

  p.draw = () => {
    p.background("#efe5d2");

    for (const t of tiles) {
      drawWeaveRect(t.x, t.y, t.w, t.h, t.colorA, t.colorB);

      const cx = t.x + t.w * 0.5;
      const cy = t.y + t.h * 0.5 + t.warp;
      const r = Math.min(t.w, t.h) * 0.24;

      drawWovenStar(cx, cy, r, t.rot, t.colorC, "#f6f0e8");

      p.noFill();
      p.stroke(70, 45, 30, 40);
      p.strokeWeight(1);
      p.rect(t.x, t.y, t.w, t.h);
    }

    // subtle loom threads over the whole surface
    p.stroke(255, 255, 255, 18);
    p.strokeWeight(1);
    for (let x = 0; x < p.width; x += 6) p.line(x, 0, x, p.height);

    p.stroke(60, 40, 30, 10);
    for (let y = 0; y < p.height; y += 5) p.line(0, y, p.width, y);
  };

  p.windowResized = () => {
    resize();
    build();
  };
}