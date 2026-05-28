import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day31(p) {
  let host;
  let stars = [];
  let phase = 0; // 0 = orbit, 1 = collapse, 2 = explosion
  let timer = 0;

  const COUNT = 60;

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
    const cx = p.width / 2;
    const cy = p.height / 2;
    const spread = Math.min(p.width, p.height) * 0.42;

    for (let i = 0; i < COUNT; i++) {
      const a = p.random(p.TAU);
      const r = p.random(spread);
      stars.push({
        a,
        r,
        baseR: r,
        speed: p.random(-0.01, 0.01),
        size: p.random(6, 18),
        phase: p.random(p.TAU),
        tint: p.random([
          [120, 180, 255],
          [255, 210, 120],
          [255, 120, 190],
          [170, 255, 220]
        ])
      });
    }

    phase = 0;
    timer = 0;
  }

  function starPoints(cx, cy, r, rot = -p.HALF_PI) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const ang = rot + i * (p.TAU * 3 / 5);
      pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
    }
    return pts;
  }

  function drawStar(x, y, r, rot, col, alpha) {
    const pts = starPoints(x, y, r, rot);
    p.noFill();
    p.stroke(col[0], col[1], col[2], alpha);
    p.strokeWeight(1.2);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function updateStars() {
    for (const s of stars) {
      s.a += s.speed;

      if (phase === 0) {
        // orbit
        s.r = s.baseR + Math.sin(p.frameCount * 0.01 + s.phase) * 6;
      } else if (phase === 1) {
        // collapse
        s.r *= 0.96;
      } else if (phase === 2) {
        // explosion
        s.r *= 1.08;
      }
    }
  }

  function updatePhase() {
    timer++;

    if (phase === 0 && timer > 240) {
      phase = 1;
      timer = 0;
    } else if (phase === 1 && timer > 120) {
      phase = 2;
      timer = 0;
    } else if (phase === 2 && timer > 120) {
      build(); // reset cycle
    }
  }

  p.draw = () => {
    p.background("#04070f");

    const cx = p.width / 2;
    const cy = p.height / 2;

    updatePhase();
    updateStars();

    // trails
    p.noStroke();
    p.fill(4, 7, 15, 40);
    p.rect(0, 0, p.width, p.height);

    // draw stars
    for (const s of stars) {
      const x = cx + Math.cos(s.a) * s.r;
      const y = cy + Math.sin(s.a) * s.r;

      const pulse = 1 + 0.2 * Math.sin(p.frameCount * 0.03 + s.phase);

      drawStar(
        x,
        y,
        s.size * pulse,
        s.a + p.frameCount * 0.01,
        s.tint,
        200
      );
    }

    // singularity core
    if (phase !== 0) {
      const glow = phase === 1 ? 1.5 : 2.2;

      for (let i = 0; i < 6; i++) {
        p.noStroke();
        p.fill(255, 230, 180, 20 + i * 10);
        p.circle(cx, cy, glow * 20 + i * 16);
      }
    }

    // explosion flash
    if (phase === 2) {
      const flash = Math.sin(timer * 0.08) * 120;
      p.noStroke();
      p.fill(255, 255, 255, flash);
      p.circle(cx, cy, flash * 2);
    }

    // subtle label
    p.noStroke();
    p.fill(255, 240, 200, 120);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("singularity → collapse → rebirth", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}