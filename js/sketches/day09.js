import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day09(p) {
  let host;
  let cols = 0, rows = 0, cell = 14;
  const chars = " .:-=+*#%@";

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    p.frameRate(30);
    p.pixelDensity(1);
    p.textFont("monospace");
    p.textAlign(p.LEFT, p.TOP);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
    cols = Math.floor(p.width / cell);
    rows = Math.floor(p.height / cell);
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay;
    const wx = px - ax, wy = py - ay;
    const c1 = vx * wx + vy * wy;
    const c2 = vx * vx + vy * vy;
    const t = Math.max(0, Math.min(1, c1 / c2));
    const sx = ax + vx * t, sy = ay + vy * t;
    return Math.hypot(px - sx, py - sy);
  }

  function sampleField(x, y, pts, t) {
    let d = Infinity;
    for (let i = 0; i < 5; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % 5];
      d = Math.min(d, distToSegment(x, y, a[0], a[1], b[0], b[1]));
    }

    const halo = Math.max(0, 1 - d / 90);
    const core = Math.max(0, 1 - d / 22);

    const ripple =
      0.12 *
      Math.sin(x * 0.02 + t * 1.7) *
      Math.cos(y * 0.018 - t * 1.2);

    return Math.max(0, Math.min(1, halo * 0.55 + core * 0.9 + ripple));
  }

  p.draw = () => {
    p.background("#03060d");
    p.fill("#8cc2ff");
    p.noStroke();
    p.textSize(cell);

    const cx = p.width / 2;
    const cy = p.height / 2;
    const r = Math.min(p.width, p.height) * 0.28;
    const t = p.frameCount * 0.03;

    const mx = (p.mouseX - cx) * 0.05;
    const my = (p.mouseY - cy) * 0.05;

    const pts = starPoints(cx + mx, cy + my, r, -Math.PI / 2 + Math.sin(t) * 0.08);

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const x = gx * cell + cell * 0.15;
        const y = gy * cell + cell * 0.05;

        const v = sampleField(x, y, pts, t);
        const idx = Math.max(0, Math.min(chars.length - 1, Math.floor(v * chars.length)));
        const ch = chars[idx];

        const alpha = 50 + v * 205;
        p.fill(140, 194, 255, alpha);
        p.text(ch, x, y);
      }
    }

    p.fill(255, 235, 170, 220);
    p.textSize(12);
    p.text("ASCII STAR TERMINAL", 18, 18);
  };

  p.windowResized = () => resize();
}