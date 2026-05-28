import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day14(p) {
  let host;
  let stars = [];

  const COLS = 8;
  const ROWS = 6;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(24);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    stars = [];

    const marginX = p.width * 0.08;
    const marginY = p.height * 0.14;
    const cellW = (p.width - marginX * 2) / COLS;
    const cellH = (p.height - marginY * 2) / ROWS;
    const baseR = Math.min(cellW, cellH) * 0.28;

    for (let gy = 0; gy < ROWS; gy++) {
      for (let gx = 0; gx < COLS; gx++) {
        const shouldBeX = marginX + gx * cellW + cellW * 0.5;
        const shouldBeY = marginY + gy * cellH + cellH * 0.5;

        stars.push({
          x: shouldBeX + p.random(-10, 10),
          y: shouldBeY + p.random(-10, 10),
          r: baseR + p.random(-6, 6),
          rot: -Math.PI / 2 + p.random(-0.18, 0.18),
          strokeW: 1.2 + p.random(-0.35, 0.35),
          tint: p.random([
            [110, 170, 255],
            [255, 210, 110],
            [255, 130, 170]
          ]),
          bad: p.random() < 0.16
        });
      }
    }

    // one really annoying offender
    const offender = p.random(stars);
    offender.x += cellW * 0.18;
    offender.y -= cellH * 0.12;
    offender.r *= 1.22;
    offender.rot += 0.42;
    offender.strokeW = 2.4;
    offender.bad = true;
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawGuideGrid() {
    p.stroke(255, 255, 255, 18);
    p.strokeWeight(1);

    const marginX = p.width * 0.08;
    const marginY = p.height * 0.14;
    const cellW = (p.width - marginX * 2) / COLS;
    const cellH = (p.height - marginY * 2) / ROWS;

    for (let gx = 0; gx <= COLS; gx++) {
      const x = marginX + gx * cellW;
      p.line(x, marginY, x, p.height - marginY);
    }
    for (let gy = 0; gy <= ROWS; gy++) {
      const y = marginY + gy * cellH;
      p.line(marginX, y, p.width - marginX, y);
    }
  }

  function drawStar(s) {
    const pts = starPoints(s.x, s.y, s.r, s.rot);

    p.noFill();
    p.stroke(s.tint[0], s.tint[1], s.tint[2], 220);
    p.strokeWeight(s.strokeW);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    if (s.bad) {
      p.stroke(255, 80, 80, 40);
      p.strokeWeight(1);
      p.circle(s.x, s.y, s.r * 2.4);
    }
  }

  p.draw = () => {
    p.background("#0a0d16");

    drawGuideGrid();

    for (const s of stars) drawStar(s);

    p.noStroke();
    p.fill(255, 255, 255, 140);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("everything is almost correct", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}