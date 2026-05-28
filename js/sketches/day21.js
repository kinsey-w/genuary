import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day21(p) {
  let host;
  let stars = [];

  const COUNT = 9;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(60);
    p.pixelDensity(1);
    p.noStroke();
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    stars = [];
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;
    const spread = Math.min(p.width, p.height) * 0.3;

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * p.TAU;
      const rr = spread * (0.35 + 0.5 * ((i % 3) + 1) / 3);
      stars.push({
        x: cx + Math.cos(a) * rr,
        y: cy + Math.sin(a) * rr,
        r: p.random(36, 82),
        phase: p.random(p.TAU),
        speed: p.random(0.01, 0.025),
        hue: p.random([
          [110, 170, 255],
          [255, 180, 120],
          [190, 255, 220],
          [255, 120, 210]
        ])
      });
    }

    stars.push({
      x: cx,
      y: cy,
      r: Math.min(p.width, p.height) * 0.12,
      phase: p.random(p.TAU),
      speed: 0.012,
      hue: [255, 235, 180]
    });
  }

  function softDisc(x, y, r, col, alpha, steps = 14) {
    for (let i = steps; i > 0; i--) {
      const t = i / steps;
      const a = alpha * Math.pow(1 - t, 2.2);
      p.fill(col[0], col[1], col[2], a);
      p.circle(x, y, r * 2 * t);
    }
  }

  function gradientStar(x, y, r, rot, col, pulse) {
    const outer = r * (1.2 + pulse * 0.08);
    const inner = r * (0.55 + pulse * 0.04);

    for (let i = 0; i < 5; i++) {
      const a = rot + i * (p.TAU * 3 / 5);

      const ox = x + Math.cos(a) * outer;
      const oy = y + Math.sin(a) * outer;
      softDisc(ox, oy, r * 0.95, col, 28, 12);

      const ix = x + Math.cos(a) * inner;
      const iy = y + Math.sin(a) * inner;
      softDisc(ix, iy, r * 0.55, col, 42, 10);
    }

    softDisc(x, y, r * 1.2, col, 44, 14);
    softDisc(x, y, r * 0.42, [255, 245, 220], 70, 10);
  }

  p.draw = () => {
    p.blendMode(p.BLEND);
    p.background("#050814");

    softDisc(p.width * 0.22, p.height * 0.2, Math.min(p.width, p.height) * 0.45, [70, 100, 255], 28, 18);
    softDisc(p.width * 0.78, p.height * 0.35, Math.min(p.width, p.height) * 0.38, [255, 80, 210], 18, 18);
    softDisc(p.width * 0.52, p.height * 0.82, Math.min(p.width, p.height) * 0.42, [80, 255, 220], 14, 18);

    p.blendMode(p.ADD);

    const mx = (p.mouseX - p.width * 0.5) * 0.015;
    const my = (p.mouseY - p.height * 0.5) * 0.015;

    for (const s of stars) {
      const pulse = Math.sin(p.frameCount * s.speed + s.phase);
      const x = s.x + mx * 0.2;
      const y = s.y + my * 0.2;
      const r = s.r * (1 + pulse * 0.08);
      const rot = p.frameCount * 0.002 + s.phase;

      gradientStar(x, y, r, rot, s.hue, pulse);
    }

    p.blendMode(p.BLEND);

    p.fill(255, 240, 200, 160);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("gradients only", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}