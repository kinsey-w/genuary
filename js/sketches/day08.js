import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day08(p) {
  let host;
  let agents = [];
  const COUNT = 180;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
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

  function build() {
    agents = [];
    for (let i = 0; i < COUNT; i++) {
      agents.push({
        x: p.random(-2, 2),
        y: p.random(-2, 2),
        s: p.random(6, 18),
        phase: p.random(Math.PI * 2),
        speed: p.random(0.002, 0.01),
        hue: p.random(0.7, 1.15)
      });
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

  function drawStar(cx, cy, r, rot, alpha, tint) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(110 * tint, 150 * tint, 255, alpha);
    p.strokeWeight(1);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  p.draw = () => {
    p.background(4, 6, 16, 28);

    const a = 1.4 + p.map(p.mouseX, 0, p.width, -0.25, 0.25);
    const b = -2.3 + p.map(p.mouseY, 0, p.height, -0.25, 0.25);
    const c = 2.4;
    const d = -2.1;

    const scale = Math.min(p.width, p.height) * 0.18;
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;

    p.noStroke();
    p.fill(8, 10, 24, 16);
    p.rect(0, 0, p.width, p.height);

    for (const ag of agents) {
      const nx = Math.sin(a * ag.y) - Math.cos(b * ag.x);
      const ny = Math.sin(c * ag.x) - Math.cos(d * ag.y);
      ag.x = nx;
      ag.y = ny;

      const sx = cx + ag.x * scale;
      const sy = cy + ag.y * scale;
      const rot = p.frameCount * ag.speed + ag.phase;
      const pulse = 0.8 + 0.35 * Math.sin(p.frameCount * 0.03 + ag.phase);
      const r = ag.s * pulse;
      const alpha = 45 + 90 * pulse;

      drawStar(sx, sy, r, rot, alpha, ag.hue);
    }

    p.noFill();
    p.stroke(90, 120, 220, 40);
    p.strokeWeight(1);
    p.circle(cx, cy, scale * 4.8);
  };

  p.windowResized = () => {
    resize();
    build();
  };
}