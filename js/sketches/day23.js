import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day23(p) {
  let host;
  let towers = [];

  const GRID_W = 12;
  const GRID_H = 10;
  const TILE_W = 78;
  const TILE_H = 40;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(30);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    towers = [];
    const originX = p.width * 0.5;
    const originY = p.height * 0.28;

    for (let gy = 0; gy < GRID_H; gy++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        const isoX = originX + (gx - gy) * TILE_W * 0.5;
        const isoY = originY + (gx + gy) * TILE_H * 0.5;

        const cx = GRID_W * 0.5;
        const cy = GRID_H * 0.5;
        const d = Math.hypot(gx - cx, gy - cy);
        const density = Math.max(0, 1 - d / (Math.max(GRID_W, GRID_H) * 0.55));

        if (p.random() < 0.18 + density * 0.82) {
          towers.push({
            gx,
            gy,
            x: isoX,
            y: isoY,
            h: p.random(30, 180) * (0.6 + density * 0.9),
            r: p.random(10, 26) * (0.8 + density * 0.5),
            rot: p.random([ -Math.PI / 2, -Math.PI / 2 + Math.PI / 5 ]),
            tint: p.random([
              [120, 180, 255],
              [255, 210, 120],
              [255, 140, 190],
              [160, 255, 220]
            ]),
            pulse: p.random(Math.PI * 2)
          });
        }
      }
    }

    towers.sort((a, b) => a.y - b.y);
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawStreetGrid() {
    p.stroke(40, 70, 110, 42);
    p.strokeWeight(1);

    const originX = p.width * 0.5;
    const originY = p.height * 0.28;

    for (let gy = 0; gy <= GRID_H; gy++) {
      const x1 = originX + (0 - gy) * TILE_W * 0.5;
      const y1 = originY + (0 + gy) * TILE_H * 0.5;
      const x2 = originX + (GRID_W - gy) * TILE_W * 0.5;
      const y2 = originY + (GRID_W + gy) * TILE_H * 0.5;
      p.line(x1, y1, x2, y2);
    }

    for (let gx = 0; gx <= GRID_W; gx++) {
      const x1 = originX + (gx - 0) * TILE_W * 0.5;
      const y1 = originY + (gx + 0) * TILE_H * 0.5;
      const x2 = originX + (gx - GRID_H) * TILE_W * 0.5;
      const y2 = originY + (gx + GRID_H) * TILE_H * 0.5;
      p.line(x1, y1, x2, y2);
    }
  }

  function drawRoof(topPts, tint) {
    p.noStroke();
    p.fill(tint[0], tint[1], tint[2], 180);
    p.beginShape();
    for (const pt of topPts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.noFill();
    p.stroke(255, 245, 220, 170);
    p.strokeWeight(1.1);
    p.beginShape();
    for (const pt of topPts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function drawSides(topPts, h, tint) {
    for (let i = 0; i < topPts.length; i++) {
      const a = topPts[i];
      const b = topPts[(i + 1) % topPts.length];

      const avgY = (a[1] + b[1]) * 0.5;
      const shade = avgY < p.height * 0.55 ? 0.55 : 0.38;

      p.noStroke();
      p.fill(tint[0] * shade, tint[1] * shade, tint[2] * shade, 165);
      p.beginShape();
      p.vertex(a[0], a[1]);
      p.vertex(b[0], b[1]);
      p.vertex(b[0], b[1] + h);
      p.vertex(a[0], a[1] + h);
      p.endShape(p.CLOSE);

      const span = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const count = Math.max(1, Math.floor(span / 14));
      for (let j = 1; j <= count; j++) {
        const t = j / (count + 1);
        const wx = p.lerp(a[0], b[0], t);
        const wy = p.lerp(a[1], b[1], t);
        for (let yy = wy + 10; yy < wy + h - 8; yy += 14) {
          p.fill(255, 230, 170, 55);
          p.rect(wx - 1.5, yy, 3, 5);
        }
      }
    }
  }

  function drawTower(t) {
    const pulse = 1 + Math.sin(p.frameCount * 0.02 + t.pulse) * 0.03;
    const roofY = t.y - t.h;
    const topPts = starPoints(t.x, roofY, t.r * pulse, t.rot);

    for (let i = 0; i < 3; i++) {
      p.noFill();
      p.stroke(t.tint[0], t.tint[1], t.tint[2], 14 - i * 3);
      p.strokeWeight(8 - i * 2);
      p.beginShape();
      for (const pt of topPts) p.vertex(pt[0], pt[1]);
      p.endShape(p.CLOSE);
    }

    drawSides(topPts, t.h, t.tint);
    drawRoof(topPts, t.tint);

    p.stroke(255, 240, 190, 120);
    p.strokeWeight(1);
    p.line(t.x, roofY, t.x, roofY - 10);

    p.noStroke();
    p.fill(255, 235, 170, 180);
    p.circle(t.x, roofY - 12, 4);
  }

  p.draw = () => {
    p.background("#07101a");

    for (let i = 0; i < 7; i++) {
      p.noFill();
      p.stroke(18, 40, 80, 16);
      p.circle(
        p.width * 0.5,
        p.height * 0.58,
        Math.min(p.width, p.height) * (0.45 + i * 0.14)
      );
    }

    drawStreetGrid();

    for (const t of towers) drawTower(t);

    p.noStroke();
    p.fill(180, 210, 255, 150);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("click to rebuild the metropolis", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}