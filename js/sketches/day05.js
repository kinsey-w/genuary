import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day05(p) {
  let host;
  let stars = [];

  const GRID_W = 5;
  const GRID_H = 5;
  const TILE_W = 90;
  const TILE_H = 46;

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
    stars = [];
    const originX = p.width / 2;
    const originY = p.height * 0.5;

    for (let gy = 0; gy < GRID_H; gy++) {
      for (let gx = 0; gx < GRID_W; gx++) {
        const x = originX + (gx - gy) * TILE_W * 0.5;
        const y = originY + (gx + gy) * TILE_H * 0.5;

        stars.push({
          gx,
          gy,
          x,
          y,
          r: p.random(22, 34),
          h: p.random(18, 52),
          phase: p.random(Math.PI * 2),
          speed: p.random(0.01, 0.03),
          hueShift: p.random(-20, 20)
        });
      }
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

  function drawFace(topPts, dx, dy, fillColor) {
    p.fill(fillColor);
    p.beginShape();
    for (let i = 0; i < topPts.length; i++) {
      p.vertex(topPts[i][0], topPts[i][1]);
    }
    for (let i = topPts.length - 1; i >= 0; i--) {
      p.vertex(topPts[i][0] + dx, topPts[i][1] + dy);
    }
    p.endShape(p.CLOSE);
  }

  function drawSideQuads(topPts, dx, dy, c1, c2) {
    for (let i = 0; i < topPts.length; i++) {
      const a = topPts[i];
      const b = topPts[(i + 1) % topPts.length];
      const avgX = (a[0] + b[0]) * 0.5;
      const shade = avgX < p.width / 2 ? c1 : c2;

      p.fill(shade);
      p.beginShape();
      p.vertex(a[0], a[1]);
      p.vertex(b[0], b[1]);
      p.vertex(b[0] + dx, b[1] + dy);
      p.vertex(a[0] + dx, a[1] + dy);
      p.endShape(p.CLOSE);
    }
  }

  function drawIsoStar(s) {
    const lift = Math.sin(p.frameCount * s.speed + s.phase) * 10;
    const topY = s.y - s.h - lift;

    const topPts = starPoints(s.x, topY, s.r);
    const dx = -18;
    const dy = 12;

    drawSideQuads(topPts, dx, dy, "#1a2a6c", "#10204e");
    drawFace(
      topPts,
      dx,
      dy,
      p.color(255, 210 + s.hueShift, 90, 255)
    );

    p.noFill();
    p.stroke(255, 245, 190, 220);
    p.strokeWeight(1.2);
    p.beginShape();
    for (let i = 0; i < topPts.length; i++) {
      p.vertex(topPts[i][0], topPts[i][1]);
    }
    p.endShape(p.CLOSE);
  }

  p.draw = () => {
    p.background("#07111f");

    p.noStroke();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      p.fill(20, 40, 70, 120);
      p.beginShape();
      p.vertex(s.x, s.y + 14);
      p.vertex(s.x + TILE_W * 0.5, s.y + 14 + TILE_H * 0.5);
      p.vertex(s.x, s.y + 14 + TILE_H);
      p.vertex(s.x - TILE_W * 0.5, s.y + 14 + TILE_H * 0.5);
      p.endShape(p.CLOSE);
    }

    stars.sort((a, b) => a.y - b.y);
    for (const s of stars) drawIsoStar(s);
  };

  p.windowResized = () => {
    resize();
    build();
  };
}