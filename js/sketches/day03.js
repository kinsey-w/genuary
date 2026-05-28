import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";
export default function day03(p) {
  let host, pts = [];
  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(60);
    p.pixelDensity(1);
  };
  function resize() {
    const w = host?.clientWidth ?? innerWidth, h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h); else p.resizeCanvas(w, h);
  }
  function build() {
    const r = Math.min(p.width, p.height) * 0.32, cx = p.width / 2, cy = p.height / 2;
    pts = [];
    for (let i = 0; i < 5; i++) {
      const a = Math.PI / 2 + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  p.draw = () => {
    p.background("#050816");
    p.stroke("#7aa2ff");
    p.noFill();
    p.strokeWeight(1.25);
    for (let i = 0; i < 5; i++) {
      const a = pts[i], b = pts[(i + 1) % 5];
      p.line(a[0], a[1], b[0], b[1]);
    }
    for (let i = 0; i < 37; i++) {
      const a = pts[i % 5], b = pts[(i * 2 + 1) % 5];
      const t = i / 36, n = Math.sin(p.frameCount * 0.02 + i * 0.4) * 24;
      const x1 = p.lerp(a[0], p.width * 0.5, t);
      const y1 = p.lerp(a[1], p.height * 0.5, t) + n;
      p.line(x1, y1, b[0], b[1]);
    }
  };
  p.windowResized = () => { resize(); build(); };
}