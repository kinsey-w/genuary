import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day04(p) {
  let host, pts = [];
  const CELL = 18;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(30);
    p.noStroke();
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    const r = Math.min(p.width, p.height) * 0.34;
    const cx = p.width / 2;
    const cy = p.height / 2;
    pts = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.PI / 2 + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const wx = px - ax;
    const wy = py - ay;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy;
    const t = Math.max(0, Math.min(1, c1 / c2));
    const sx = ax + vx * t;
    const sy = ay + vy * t;
    return Math.hypot(px - sx, py - sy);
  }

  p.draw = () => {
    p.background("#03040a");

    const jitterX = (p.mouseX - p.width / 2) * 0.02;
    const jitterY = (p.mouseY - p.height / 2) * 0.02;
    const threshold = CELL * 0.52;

    for (let y = 0; y < p.height; y += CELL) {
      for (let x = 0; x < p.width; x += CELL) {
        const cx = x + CELL * 0.5 + jitterX;
        const cy = y + CELL * 0.5 + jitterY;

        let d = Infinity;
        for (let i = 0; i < 5; i++) {
          const a = pts[i];
          const b = pts[(i + 1) % 5];
          d = Math.min(d, distToSegment(cx, cy, a[0], a[1], b[0], b[1]));
        }

        if (d < threshold) {
          const glow = 1 - d / threshold;
          p.fill(80, 130 + glow * 80, 255, 210);
          p.rect(x, y, CELL, CELL);
        } else {
          const noise = 8 + 10 * Math.sin(x * 0.01 + y * 0.01 + p.frameCount * 0.03);
          p.fill(noise, noise + 4, noise + 10, 120);
          p.rect(x, y, CELL, CELL);
        }
      }
    }
  };

  p.windowResized = () => {
    resize();
    build();
  };
}