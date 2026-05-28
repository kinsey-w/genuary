import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day19(p) {
  let host;
  let branches = [];
  let blooms = [];

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
    branches = [];
    blooms = [];

    branches.push({
      x: p.width * 0.5,
      y: p.height * 0.6,
      a: -Math.PI / 2,
      len: Math.min(p.width, p.height) * 0.015,
      depth: 0,
      energy: 1,
      age: 0,
      dead: false
    });
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const ang = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
    }
    return pts;
  }

  function drawStar(cx, cy, r, rot, alpha) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(255, 220, 130, alpha);
    p.strokeWeight(1.2);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function grow() {
    const newborn = [];

    for (const b of branches) {
      if (b.dead) continue;

      const step = b.len;
      const nx = b.x + Math.cos(b.a) * step;
      const ny = b.y + Math.sin(b.a) * step;

      p.stroke(120, 220, 160, 140);
      p.strokeWeight(Math.max(1, 3.5 - b.depth * 0.35));
      p.line(b.x, b.y, nx, ny);

      b.x = nx;
      b.y = ny;
      b.age += 1;

      const drift = p.noise(b.x * 0.004, b.y * 0.004, p.frameCount * 0.003) - 0.5;
      b.a += drift * 0.18;

      if (b.age > 8 + b.depth * 2 && p.random() < 0.05 + b.depth * 0.004) {
        const n = p.random() < 0.72 ? 2 : 3;
        for (let i = 0; i < n; i++) {
          newborn.push({
            x: b.x,
            y: b.y,
            a: b.a + p.random(-0.9, 0.9),
            len: b.len * p.random(0.88, 0.96),
            depth: b.depth + 1,
            energy: b.energy * 0.78,
            age: 0,
            dead: false
          });
        }
        b.dead = true;
      }

      if (b.depth > 8 || b.energy < 0.16 || b.age > 60) {
        b.dead = true;
        blooms.push({
          x: b.x,
          y: b.y,
          r: p.random(6, 16),
          rot: p.random(Math.PI * 2),
          phase: p.random(Math.PI * 2)
        });
      }
    }

    branches.push(...newborn);
  }

  function drawBlooms() {
    for (const fl of blooms) {
      const pulse = 1 + 0.12 * Math.sin(p.frameCount * 0.04 + fl.phase);
      drawStar(fl.x, fl.y, fl.r * pulse, fl.rot + p.frameCount * 0.01, 220);

      p.noStroke();
      p.fill(255, 235, 170, 80);
      p.circle(fl.x, fl.y, fl.r * 0.9);
    }
  }

  p.draw = () => {
    p.background("#08110d");

    for (let i = 0; i < 8; i++) {
      if (branches.some(b => !b.dead)) grow();
    }

    drawBlooms();

    p.noStroke();
    p.fill(255, 230, 180, 180);
    p.circle(p.width * 0.5, p.height * 0.72, 6);

    p.fill(180, 220, 200, 150);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("click to plant a new seed", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}