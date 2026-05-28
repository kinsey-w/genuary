import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day26(p) {
  let host;
  let stars = [];

  const COUNT = 10;
  const STEP = 10; // grid resolution

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(30);
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
    const spread = Math.min(p.width, p.height) * 0.32;

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * p.TAU;
      const r = spread * (0.4 + 0.5 * ((i % 3) + 1) / 3);

      stars.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        s: p.random(40, 90),
        rot: p.random(p.TAU),
        speed: p.random(-0.01, 0.01)
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

  function pointInPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const hit =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi + 0.000001) + xi;
      if (hit) inside = !inside;
    }
    return inside;
  }

  p.draw = () => {
    p.background(0); // pure black

    const polys = [];

    for (const s of stars) {
      s.rot += s.speed;
      polys.push(starPoints(s.x, s.y, s.s, s.rot));
    }

    // binary field rendering
    for (let y = 0; y < p.height; y += STEP) {
      for (let x = 0; x < p.width; x += STEP) {
        let insideCount = 0;

        for (const poly of polys) {
          if (pointInPoly(x + STEP * 0.5, y + STEP * 0.5, poly)) {
            insideCount++;
          }
        }

        // PURE BOOLEAN RULE:
        // XOR-style: odd = white, even = black
        const white = insideCount % 2 === 1;

        if (white) {
          p.fill(255);
          p.rect(x, y, STEP, STEP);
        }
      }
    }

    // subtle structural outlines (still pure white)
    p.stroke(255);
    p.strokeWeight(1);
    p.noFill();
    for (const poly of polys) {
      p.beginShape();
      for (const pt of poly) p.vertex(pt[0], pt[1]);
      p.endShape(p.CLOSE);
    }

    p.noStroke();
    p.fill(255);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("black / white only — XOR field", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}