import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day28(p) {
  let host, pg;
  let stars = [];

  const COUNT = 16;

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
    pg = p.createGraphics(p.width, p.height);
    pg.pixelDensity(1);
  }

  function build() {
    stars = [];
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;
    const spread = Math.min(p.width, p.height) * 0.32;

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * p.TAU;
      const rr = spread * p.random(0.2, 1);
      stars.push({
        x: cx + Math.cos(a) * rr + p.random(-40, 40),
        y: cy + Math.sin(a) * rr + p.random(-40, 40),
        r: p.random(20, 72),
        rot: p.random(p.TAU),
        speed: p.random(-0.02, 0.02),
        phase: p.random(p.TAU),
        tint: p.random([
          [120, 180, 255],
          [255, 210, 120],
          [255, 120, 200]
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

  function drawScene() {
    pg.background("#050814");

    for (let i = 0; i < 7; i++) {
      pg.noFill();
      pg.stroke(20, 40, 90, 16);
      pg.circle(
        pg.width * 0.5,
        pg.height * 0.5,
        Math.min(pg.width, pg.height) * (0.34 + i * 0.13)
      );
    }

    for (const s of stars) {
      const pulse = 1 + 0.1 * Math.sin(p.frameCount * 0.03 + s.phase);
      const pts = starPoints(s.x, s.y, s.r * pulse, s.rot + p.frameCount * s.speed);

      pg.noStroke();
      pg.fill(s.tint[0], s.tint[1], s.tint[2], 24);
      for (let i = 0; i < 3; i++) {
        pg.circle(s.x, s.y, s.r * (2 + i * 0.35));
      }

      pg.noFill();
      pg.stroke(s.tint[0], s.tint[1], s.tint[2], 220);
      pg.strokeWeight(1.4);
      pg.beginShape();
      for (const pt of pts) pg.vertex(pt[0], pt[1]);
      pg.endShape(p.CLOSE);
    }
  }

  function drawChannelShift(img, dxR, dxG, dxB) {
    p.blendMode(p.BLEND);
    p.tint(255, 0, 0, 90);
    p.image(img, dxR, 0);
    p.tint(0, 255, 120, 70);
    p.image(img, dxG, 0);
    p.tint(120, 160, 255, 90);
    p.image(img, dxB, 0);
    p.noTint();
  }

  function drawSliceTears(img) {
    for (let y = 0; y < p.height; y += 12) {
      const h = 8 + ((y / 12) % 3) * 4;
      const shift =
        Math.sin(p.frameCount * 0.08 + y * 0.06) * 12 +
        (p.noise(y * 0.03, p.frameCount * 0.03) - 0.5) * 80;

      p.copy(img, 0, y, p.width, h, shift, y, p.width, h);
    }
  }

  function drawGhostCopies(img) {
    p.tint(255, 26);
    p.image(img, -8, 0);
    p.image(img, 8, 0);
    p.noTint();
  }

  function drawScanlines() {
    p.stroke(255, 255, 255, 10);
    p.strokeWeight(1);
    for (let y = 0; y < p.height; y += 3) {
      p.line(0, y, p.width, y);
    }
  }

  function drawDataBars() {
    p.noStroke();
    for (let i = 0; i < 5; i++) {
      const y = 30 + i * 16;
      const w = 60 + ((p.frameCount * (i + 1)) % 140);
      p.fill(i % 2 ? "#7ab4ff" : "#ff78c8");
      p.rect(20, y, w, 4);
    }
  }

  p.draw = () => {
    drawScene();

    p.background("#02030a");
    drawGhostCopies(pg);
    drawChannelShift(
      pg,
      Math.sin(p.frameCount * 0.11) * 6,
      Math.cos(p.frameCount * 0.09) * -4,
      Math.sin(p.frameCount * 0.07) * 9
    );
    drawSliceTears(pg);
    drawScanlines();
    drawDataBars();

    p.noStroke();
    p.fill(255, 235, 180, 150);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("signal unstable / glitch feed active", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}