import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day27(p) {
  let host;
  let stars = [];
  let palette = [];
  const COUNT = 18;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    p.colorMode(p.HSB, 360, 100, 100, 1);
    build();
    p.frameRate(60);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function makePalette() {
    const base = p.random(360);
    const spread = p.random([18, 24, 30, 42, 60, 120, 180]);
    const satA = p.random(55, 90);
    const satB = p.random(35, 75);
    const briA = p.random(80, 100);
    const briB = p.random(55, 85);

    const hues = [
      base,
      (base + spread) % 360,
      (base + spread * 2) % 360,
      (base + 180) % 360,
      (base + 180 + spread * 0.5) % 360
    ];

    return [
      p.color(hues[0], satA, briA, 1),
      p.color(hues[1], satB, briB, 1),
      p.color(hues[2], satA, briB, 1),
      p.color(hues[3], satB, briA, 1),
      p.color(hues[4], satA * 0.7, 100, 1)
    ];
  }

  function build() {
    palette = makePalette();
    stars = [];

    const cx = p.width * 0.5;
    const cy = p.height * 0.52;
    const spread = Math.min(p.width, p.height) * 0.3;

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * p.TAU;
      const rr = spread * p.random(0.15, 1);
      stars.push({
        x: cx + Math.cos(a) * rr + p.random(-40, 40),
        y: cy + Math.sin(a) * rr + p.random(-40, 40),
        r: p.random(18, 70),
        rot: p.random(p.TAU),
        speed: p.random(-0.015, 0.015),
        phase: p.random(p.TAU),
        col: p.random(palette)
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

  function drawStar(s) {
    const pulse = 1 + 0.08 * Math.sin(p.frameCount * 0.03 + s.phase);
    const r = s.r * pulse;
    const rot = s.rot + p.frameCount * s.speed;
    const pts = starPoints(s.x, s.y, r, rot);

    const c = s.col;
    p.noStroke();

    for (let i = 4; i > 0; i--) {
      const a = 0.05 * i;
      p.fill(p.hue(c), p.saturation(c), p.brightness(c), a);
      p.beginShape();
      for (const pt of pts) {
        const dx = (pt[0] - s.x) * (1 + i * 0.08);
        const dy = (pt[1] - s.y) * (1 + i * 0.08);
        p.vertex(s.x + dx, s.y + dy);
      }
      p.endShape(p.CLOSE);
    }

    p.fill(p.hue(c), p.saturation(c), p.brightness(c), 0.9);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.stroke(0, 0, 100, 0.28);
    p.strokeWeight(1);
    p.noFill();
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function drawPaletteBar() {
    const pad = 18;
    const sw = 64;
    const sh = 22;
    const gap = 10;
    const total = palette.length * sw + (palette.length - 1) * gap;
    const x0 = p.width * 0.5 - total * 0.5;
    const y = p.height - 52;

    p.noStroke();
    for (let i = 0; i < palette.length; i++) {
      p.fill(palette[i]);
      p.rect(x0 + i * (sw + gap), y, sw, sh, 8);
    }

    p.fill(0, 0, 100, 0.75);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.text("click to generate a new palette", p.width * 0.5, y - 8);
  }

  p.draw = () => {
    const bg = palette[0];
    p.background(
      (p.hue(bg) + 220) % 360,
      Math.max(18, p.saturation(bg) * 0.35),
      10
    );

    for (let i = 0; i < 5; i++) {
      const c = palette[i % palette.length];
      p.noStroke();
      p.fill(p.hue(c), p.saturation(c), p.brightness(c), 0.08);
      p.circle(
        p.width * (0.2 + i * 0.16),
        p.height * (0.2 + (i % 2) * 0.22),
        Math.min(p.width, p.height) * (0.28 + i * 0.06)
      );
    }

    for (const s of stars) drawStar(s);
    drawPaletteBar();
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}