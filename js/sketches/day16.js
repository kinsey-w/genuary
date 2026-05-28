import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day16(p) {
  let host;
  let cells = [];

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
    cells = [];
    subdivide(0, 0, p.width, p.height, 0);
  }

  function subdivide(x, y, w, h, depth) {
    const minSize = Math.min(p.width, p.height) * 0.12;
    const maxDepth = 5;

    const shouldSplit =
      depth < maxDepth &&
      w > minSize &&
      h > minSize &&
      p.random() < (0.88 - depth * 0.12);

    if (!shouldSplit) {
      cells.push({ x, y, w, h, depth });
      return;
    }

    const splitCols = p.random() < 0.5 ? 2 : 3;
    const splitRows = p.random() < 0.5 ? 2 : 3;

    const cw = w / splitCols;
    const ch = h / splitRows;

    for (let gy = 0; gy < splitRows; gy++) {
      for (let gx = 0; gx < splitCols; gx++) {
        subdivide(x + gx * cw, y + gy * ch, cw, ch, depth + 1);
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

  function drawStar(cx, cy, r, rot, alpha) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(120, 180, 255, alpha);
    p.strokeWeight(1);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  p.draw = () => {
    p.background("#07101a");

    for (const c of cells) {
      const pad = Math.min(c.w, c.h) * 0.08;
      const cx = c.x + c.w * 0.5;
      const cy = c.y + c.h * 0.5;
      const r = Math.max(4, Math.min(c.w, c.h) * 0.24 - pad);
      const rot = -Math.PI / 2 + c.depth * 0.18 + Math.sin(p.frameCount * 0.01 + cx * 0.01) * 0.08;

      p.noFill();
      p.stroke(255, 255, 255, 24);
      p.strokeWeight(1);
      p.rect(c.x, c.y, c.w, c.h);

      if (Math.min(c.w, c.h) > 18) {
        drawStar(cx, cy, r, rot, 70 + c.depth * 30);
      }

      if (c.depth >= 3 && p.random() < 0.08) {
        p.noStroke();
        p.fill(255, 220, 140, 120);
        p.circle(cx, cy, Math.min(c.w, c.h) * 0.08);
      }
    }

    p.noStroke();
    p.fill(180, 210, 255, 160);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("click to rebuild recursive grid", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}