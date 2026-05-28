import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day29(p) {
  let host;
  let stars = [];
  let selected = 0;

  const COUNT = 7;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(30);
    p.pixelDensity(1);
    p.textFont("monospace");
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
    const spread = Math.min(p.width, p.height) * 0.28;

    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * p.TAU;
      const rr = spread * (0.45 + 0.4 * ((i % 3) + 1) / 3);
      stars.push({
        id: i,
        x: cx + Math.cos(a) * rr,
        y: cy + Math.sin(a) * rr,
        r: p.random(26, 68),
        rot: p.random(p.TAU),
        speed: p.random(-0.02, 0.02),
        phase: p.random(p.TAU),
        active: i === 0
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

  function nearestStar() {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const d = p.dist(p.mouseX, p.mouseY, s.x, s.y);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  function drawGrid() {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);

    const step = 40;
    for (let x = 0; x < p.width; x += step) p.line(x, 0, x, p.height);
    for (let y = 0; y < p.height; y += step) p.line(0, y, p.width, y);

    p.stroke(255, 180, 100, 55);
    p.line(p.width * 0.5, 0, p.width * 0.5, p.height);
    p.line(0, p.height * 0.5, p.width, p.height * 0.5);
  }

  function drawStarDebug(s, isSelected) {
    const rot = s.rot + p.frameCount * s.speed;
    const pts = starPoints(s.x, s.y, s.r, rot);

    p.noFill();

    p.stroke(90, 120, 180, 80);
    p.strokeWeight(1);
    p.circle(s.x, s.y, s.r * 2);

    p.stroke(70, 90, 130, 60);
    p.circle(s.x, s.y, s.r * 3);

    p.stroke(isSelected ? "#fff2a8" : "#7ab4ff");
    p.strokeWeight(isSelected ? 2 : 1.2);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.stroke(255, 120, 120, 120);
    p.strokeWeight(1);
    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      p.line(s.x, s.y, pt[0], pt[1]);
    }

    for (let i = 0; i < pts.length; i++) {
      const pt = pts[i];
      p.noStroke();
      p.fill(isSelected ? "#fff2a8" : "#ff78c8");
      p.circle(pt[0], pt[1], 6);

      p.fill(220, 230, 255, 170);
      p.textSize(10);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(`${i}`, pt[0] + 6, pt[1] - 4);
    }

    p.noStroke();
    p.fill("#7ab4ff");
    p.circle(s.x, s.y, 5);

    p.fill(220, 230, 255, 180);
    p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    p.text(
      `id:${s.id}\nx:${Math.round(s.x)} y:${Math.round(s.y)}\nr:${Math.round(s.r)}\nrot:${rot.toFixed(2)}`,
      s.x + 12,
      s.y + 12
    );
  }

  function drawConnections() {
    p.stroke(120, 255, 180, 70);
    p.strokeWeight(1);
    for (let i = 0; i < stars.length - 1; i++) {
      const a = stars[i];
      const b = stars[i + 1];
      p.line(a.x, a.y, b.x, b.y);
    }
  }

  function drawHUD(selectedStar) {
    p.noStroke();
    p.fill(0, 0, 0, 190);
    p.rect(16, 16, 260, 110, 10);

    p.fill(180, 255, 210);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text(
      `DEBUG VIEW\nstars: ${stars.length}\nselected: ${selectedStar.id}\nmouse: ${Math.round(p.mouseX)}, ${Math.round(p.mouseY)}\nmode: construction overlay`,
      28,
      28
    );
  }

  p.draw = () => {
    p.background("#0a0d14");

    drawGrid();
    drawConnections();

    selected = nearestStar();

    for (let i = 0; i < stars.length; i++) {
      drawStarDebug(stars[i], i === selected);
    }

    drawHUD(stars[selected]);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}