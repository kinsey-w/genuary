import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day30(p) {
  let host;
  let plants = [];
  const COUNT = 18;

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
    plants = [];
    const groundY = p.height * 0.84;

    for (let i = 0; i < COUNT; i++) {
      plants.push({
        x: p.map(i, 0, COUNT - 1, p.width * 0.08, p.width * 0.92) + p.random(-18, 18),
        y: groundY + p.random(-10, 10),
        h: p.random(90, 240),
        sway: p.random(0.003, 0.012),
        phase: p.random(p.TAU),
        lean: p.random(-0.6, 0.6),
        branches: p.floor(p.random(2, 5)),
        bloomR: p.random(10, 28),
        tint: p.random([
          [120, 210, 150],
          [110, 185, 255],
          [255, 190, 120],
          [255, 120, 180]
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

  function drawStarBloom(x, y, r, rot, col) {
    const pts = starPoints(x, y, r, rot);

    for (let i = 3; i > 0; i--) {
      p.noStroke();
      p.fill(col[0], col[1], col[2], 16 * i);
      p.beginShape();
      for (const pt of pts) {
        const dx = (pt[0] - x) * (1 + i * 0.12);
        const dy = (pt[1] - y) * (1 + i * 0.12);
        p.vertex(x + dx, y + dy);
      }
      p.endShape(p.CLOSE);
    }

    p.noFill();
    p.stroke(col[0], col[1], col[2], 220);
    p.strokeWeight(1.4);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.noStroke();
    p.fill(255, 240, 180, 190);
    p.circle(x, y, r * 0.32);
  }

  function drawLeaf(x, y, a, len, col) {
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    const nx = Math.cos(a + p.HALF_PI) * len * 0.18;
    const ny = Math.sin(a + p.HALF_PI) * len * 0.18;

    p.noStroke();
    p.fill(col[0], col[1], col[2], 120);
    p.beginShape();
    p.vertex(x, y);
    p.vertex(x + nx, y + ny);
    p.vertex(x2, y2);
    p.vertex(x - nx, y - ny);
    p.endShape(p.CLOSE);
  }

  function drawPlant(pl) {
    const t = p.frameCount;
    const growth = 0.75 + 0.25 * Math.sin(t * 0.01 + pl.phase);
    const stemH = pl.h * growth;

    let x = pl.x;
    let y = pl.y;

    const steps = 18;
    const seg = stemH / steps;
    const pts = [];

    for (let i = 0; i <= steps; i++) {
      const k = i / steps;
      const bend =
        Math.sin(t * pl.sway + pl.phase + k * 4.0) * 24 * (1 - k * 0.2) +
        pl.lean * 24 * k;
      const px = x + bend;
      const py = y - seg * i;
      pts.push([px, py]);
    }

    p.noFill();
    p.stroke(100, 180, 120, 180);
    p.strokeWeight(2.2);
    p.beginShape();
    for (const pt of pts) p.curveVertex(pt[0], pt[1]);
    p.endShape();

    for (let i = 3; i < steps - 2; i += 3) {
      if ((i / 3) % 2 === 0) {
        const a = -p.HALF_PI + 0.9 + Math.sin(t * 0.02 + i) * 0.2;
        drawLeaf(pts[i][0], pts[i][1], a, 18 + i * 1.2, [80, 170, 110]);
      } else {
        const a = -p.HALF_PI - 0.9 + Math.cos(t * 0.02 + i) * 0.2;
        drawLeaf(pts[i][0], pts[i][1], a, 18 + i * 1.2, [80, 170, 110]);
      }
    }

    for (let b = 0; b < pl.branches; b++) {
      const idx = p.floor(p.map(b, 0, pl.branches - 1, 5, steps - 5));
      const bp = pts[idx];
      const dir = b % 2 === 0 ? -1 : 1;
      const ang = -p.HALF_PI + dir * (0.7 + 0.2 * Math.sin(t * 0.015 + pl.phase + b));
      const len = 18 + idx * 1.4;

      p.stroke(100, 180, 120, 120);
      p.strokeWeight(1.4);
      p.line(bp[0], bp[1], bp[0] + Math.cos(ang) * len, bp[1] + Math.sin(ang) * len);

      drawLeaf(
        bp[0] + Math.cos(ang) * len,
        bp[1] + Math.sin(ang) * len,
        ang + dir * 0.45,
        14 + idx * 0.6,
        [90, 190, 120]
      );
    }

    const tip = pts[pts.length - 1];
    drawStarBloom(
      tip[0],
      tip[1],
      pl.bloomR * (0.9 + 0.12 * Math.sin(t * 0.03 + pl.phase)),
      t * 0.01 + pl.phase,
      pl.tint
    );
  }

  p.draw = () => {
    p.background("#08110c");

    for (let i = 0; i < 6; i++) {
      p.noStroke();
      p.fill(20, 45 + i * 8, 30 + i * 6, 24);
      p.circle(
        p.width * (0.15 + i * 0.14),
        p.height * (0.28 + (i % 2) * 0.1),
        Math.min(p.width, p.height) * (0.22 + i * 0.06)
      );
    }

    p.noStroke();
    p.fill(18, 38, 22, 255);
    p.rect(0, p.height * 0.84, p.width, p.height * 0.16);

    for (const pl of plants) drawPlant(pl);

    p.fill(220, 235, 200, 150);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("click to regrow the garden", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}