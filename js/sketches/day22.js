import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day22(p) {
  let host;
  let floaters = [];
  let ripples = [];

  const COUNT = 7;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(60);
    p.pixelDensity(1);
    p.noFill();
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    floaters = [];
    ripples = [];

    for (let i = 0; i < COUNT; i++) {
      floaters.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-2.2, 2.2) || 1.2,
        vy: p.random(-2.2, 2.2) || -1.4,
        r: p.random(28, 72),
        rot: p.random(p.TAU),
        spin: p.random(-0.02, 0.02),
        phase: p.random(p.TAU),
        tint: p.random([
          [120, 180, 255],
          [255, 210, 120],
          [255, 130, 200],
          [170, 255, 220]
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

  function drawStar(cx, cy, r, rot, tint, alpha, weight = 1.5) {
    const pts = starPoints(cx, cy, r, rot);
    p.stroke(tint[0], tint[1], tint[2], alpha);
    p.strokeWeight(weight);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function addRipple(x, y, tint) {
    ripples.push({ x, y, r: 10, a: 90, tint });
  }

  function updateFloaters() {
    for (const f of floaters) {
      f.x += f.vx;
      f.y += f.vy;
      f.rot += f.spin;

      let bounced = false;

      if (f.x - f.r < 0) {
        f.x = f.r;
        f.vx *= -1;
        bounced = true;
      }
      if (f.x + f.r > p.width) {
        f.x = p.width - f.r;
        f.vx *= -1;
        bounced = true;
      }
      if (f.y - f.r < 0) {
        f.y = f.r;
        f.vy *= -1;
        bounced = true;
      }
      if (f.y + f.r > p.height) {
        f.y = p.height - f.r;
        f.vy *= -1;
        bounced = true;
      }

      if (bounced) addRipple(f.x, f.y, f.tint);
    }
  }

  function drawFloaters() {
    for (const f of floaters) {
      const pulse = 1 + 0.08 * Math.sin(p.frameCount * 0.03 + f.phase);

      for (let i = 0; i < 3; i++) {
        p.stroke(f.tint[0], f.tint[1], f.tint[2], 12 - i * 2);
        p.strokeWeight(10 - i * 2);
        drawStar(f.x, f.y, f.r * pulse * (1.15 + i * 0.12), f.rot, f.tint, 12 - i * 2, 10 - i * 2);
      }

      drawStar(f.x, f.y, f.r * pulse, f.rot, f.tint, 220, 1.6);

      const orbA = p.frameCount * 0.02 + f.phase;
      const ox = f.x + Math.cos(orbA) * f.r * 1.5;
      const oy = f.y + Math.sin(orbA) * f.r * 1.5;
      drawStar(ox, oy, f.r * 0.22, -f.rot * 2, [255, 245, 200], 180, 1);
    }
  }

  function drawRipples() {
    for (const r of ripples) {
      p.stroke(r.tint[0], r.tint[1], r.tint[2], r.a);
      p.strokeWeight(1.2);
      p.circle(r.x, r.y, r.r);
      r.r += 4;
      r.a -= 1.8;
    }
    ripples = ripples.filter(r => r.a > 0);
  }

  p.draw = () => {
    p.background("#040814");

    for (let i = 0; i < 6; i++) {
      p.stroke(20, 40, 90, 14);
      p.strokeWeight(1);
      p.circle(
        p.width * 0.5,
        p.height * 0.5,
        Math.min(p.width, p.height) * (0.35 + i * 0.14)
      );
    }

    updateFloaters();
    drawRipples();
    drawFloaters();

    p.noStroke();
    p.fill(255, 235, 180, 130);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("screensaver mode", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}