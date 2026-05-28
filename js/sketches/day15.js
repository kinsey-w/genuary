import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day15(p) {
  let host;
  let colonies = [];

  const COUNT = 22;

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
    colonies = [];
    for (let i = 0; i < COUNT; i++) {
      colonies.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(24, 72),
        rot: p.random(Math.PI * 2),
        pulse: p.random(Math.PI * 2),
        speed: p.random(0.01, 0.035),
        branches: p.floor(p.random(5, 11)),
        tint: p.random([
          [120, 220, 255],
          [255, 180, 120],
          [180, 255, 190],
          [255, 120, 190]
        ])
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

  function drawStar(cx, cy, r, rot, col, alpha, w = 1.2) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(col[0], col[1], col[2], alpha);
    p.strokeWeight(w);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function drawColony(c) {
    const breathe = 1 + 0.18 * Math.sin(p.frameCount * c.speed + c.pulse);
    const coreR = c.r * breathe;

    for (let i = 0; i < c.branches; i++) {
      const t = i / c.branches;
      const a = c.rot + t * Math.PI * 2;
      const len = coreR * (0.7 + 0.55 * Math.sin(a * 3 + c.pulse));
      const x2 = c.x + Math.cos(a) * len;
      const y2 = c.y + Math.sin(a) * len;

      p.stroke(c.tint[0], c.tint[1], c.tint[2], 80);
      p.strokeWeight(1);
      p.line(c.x, c.y, x2, y2);

      p.noFill();
      p.stroke(c.tint[0], c.tint[1], c.tint[2], 70);
      p.circle(x2, y2, coreR * 0.18);

      drawStar(
        x2,
        y2,
        coreR * (0.12 + 0.06 * Math.sin(p.frameCount * 0.02 + i)),
        a,
        c.tint,
        150,
        1
      );
    }

    for (let ring = 0; ring < 4; ring++) {
      const rr = coreR * (0.3 + ring * 0.22);
      drawStar(c.x, c.y, rr, c.rot + ring * 0.2, c.tint, 60 + ring * 25, 1.1);
    }

    p.noStroke();
    p.fill(c.tint[0], c.tint[1], c.tint[2], 90);
    p.circle(c.x, c.y, coreR * 0.22);
  }

  p.draw = () => {
    p.background("#081018");

    for (let i = 0; i < 6; i++) {
      p.noFill();
      p.stroke(20, 60, 90, 16);
      p.circle(
        p.width * 0.5,
        p.height * 0.5,
        Math.min(p.width, p.height) * (0.35 + i * 0.16)
      );
    }

    colonies.sort((a, b) => a.r - b.r);
    for (const c of colonies) drawColony(c);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}