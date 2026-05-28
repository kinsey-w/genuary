import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day18(p) {
  let host;
  let stars = [];
  let glitches = [];

  const COUNT = 14;

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
    glitches = [];

    for (let i = 0; i < COUNT; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(30, 70),
        rot: p.random(Math.PI * 2),
        phase: p.random(Math.PI * 2)
      });
    }
  }

  function starPoints(cx, cy, r, rot) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function maybeGlitch(pts) {
    const mode = p.random();

    if (mode < 0.25) {
      // reorder points
      return p.shuffle([...pts]);
    }

    if (mode < 0.5) {
      // duplicate one point
      const idx = p.floor(p.random(pts.length));
      const copy = [...pts];
      copy.splice(idx, 0, pts[idx]);
      return copy;
    }

    if (mode < 0.75) {
      // offset points
      return pts.map(([x, y]) => [
        x + p.random(-10, 10),
        y + p.random(-10, 10)
      ]);
    }

    // skip a connection
    return pts.filter((_, i) => i !== p.floor(p.random(pts.length)));
  }

  function drawStar(pts, col, w) {
    p.noFill();
    p.stroke(col);
    p.strokeWeight(w);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  p.draw = () => {
    p.background("#060812");

    for (const s of stars) {
      const pulse = 1 + 0.08 * Math.sin(p.frameCount * 0.04 + s.phase);
      const basePts = starPoints(s.x, s.y, s.r * pulse, s.rot);

      // occasional glitch trigger
      if (p.random() < 0.03) {
        glitches.push({
          life: 1,
          pts: maybeGlitch(basePts),
          x: s.x,
          y: s.y
        });
      }

      // draw normal star
      drawStar(basePts, "rgba(120,180,255,0.4)", 1.2);

      // draw glitch echoes
      for (let g of glitches) {
        if (g.life > 0) {
          const alpha = g.life * 255;

          p.stroke(255, 120, 200, alpha * 0.6);
          drawStar(g.pts, `rgba(255,120,200,${g.life})`, 1.5);

          // glitch stabilizes into new geometry
          if (g.life < 0.4) {
            drawStar(g.pts, `rgba(120,255,200,${g.life})`, 1);
          }

          g.life -= 0.02;
        }
      }
    }

    // cleanup
    glitches = glitches.filter(g => g.life > 0);

    // subtle scanline effect
    p.stroke(255, 255, 255, 6);
    for (let y = 0; y < p.height; y += 3) {
      p.line(0, y, p.width, y);
    }

    p.noStroke();
    p.fill(255, 200, 180, 160);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("glitch detected → accepted → integrated", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}