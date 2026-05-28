import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day12(p) {
  let host;
  let blobs = [];

  const COUNT = 14;

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
    blobs = [];
    for (let i = 0; i < COUNT; i++) {
      blobs.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(70, 150),
        vx: p.random(-0.15, 0.15),
        vy: p.random(-0.6, -0.15),
        phase: p.random(Math.PI * 2),
        speed: p.random(0.01, 0.03)
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

  function drawSoftStar(cx, cy, r, rot, alpha) {
    const pts = starPoints(cx, cy, r, rot);
    p.fill(255, 210, 120, alpha);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function updateBlobs() {
    for (const b of blobs) {
      b.x += b.vx + Math.sin(p.frameCount * b.speed + b.phase) * 0.25;
      b.y += b.vy;

      if (b.y < -b.r) {
        b.y = p.height + b.r;
        b.x = p.random(p.width);
      }
      if (b.x < -b.r) b.x = p.width + b.r;
      if (b.x > p.width + b.r) b.x = -b.r;
    }
  }

  function drawBlobField() {
    for (const b of blobs) {
      const pulse = 1 + Math.sin(p.frameCount * b.speed + b.phase) * 0.12;
      const rr = b.r * pulse;

      for (let i = 0; i < 5; i++) {
        const a = 18 - i * 3;
        p.fill(255, 120 + i * 10, 70, a);
        p.circle(b.x, b.y, rr * (1.15 + i * 0.08));
      }

      p.fill(255, 145, 80, 135);
      p.circle(b.x, b.y, rr);
    }
  }

  function drawStarEmbeds() {
    for (let i = 0; i < blobs.length; i += 2) {
      const b = blobs[i];
      const rot = p.frameCount * 0.01 + b.phase;
      const alpha = 70 + 40 * Math.sin(p.frameCount * 0.02 + b.phase);
      drawSoftStar(b.x, b.y, b.r * 0.28, rot, alpha);
    }
  }

  p.draw = () => {
    p.background("#120913");

    // lamp glow
    for (let i = 0; i < 6; i++) {
      p.fill(70 + i * 8, 10, 90 + i * 10, 20);
      p.circle(
        p.width * 0.5,
        p.height * 0.55,
        Math.min(p.width, p.height) * (1.2 + i * 0.12)
      );
    }

    // glass silhouette feel
    p.fill(20, 8, 26, 120);
    p.rect(0, 0, p.width, p.height);

    updateBlobs();

    p.blendMode(p.ADD);
    drawBlobField();
    drawStarEmbeds();
    p.blendMode(p.BLEND);

    // subtle lamp frame
    const cx = p.width * 0.5;
    const topY = p.height * 0.12;
    const botY = p.height * 0.88;
    const w = Math.min(p.width, p.height) * 0.42;

    p.noFill();
    p.stroke(255, 235, 180, 40);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(cx - w * 0.24, topY);
    p.vertex(cx - w * 0.42, botY);
    p.vertex(cx + w * 0.42, botY);
    p.vertex(cx + w * 0.24, topY);
    p.endShape(p.CLOSE);

    p.fill(255, 225, 170, 160);
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.text("STAR LAMP", cx, p.height - 18);
  };

  p.windowResized = () => {
    resize();
    build();
  };
}