import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day07(p) {
  let host;
  let progress = 0;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    p.frameRate(60);
    p.pixelDensity(1);
    p.textFont("monospace");
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawBaseStar(cx, cy, r) {
    const pts = starPoints(cx, cy, r);
    p.noFill();
    p.stroke(70, 95, 150, 110);
    p.strokeWeight(1.2);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
    return pts;
  }

  function drawSegments(cx, cy, r, amount) {
    const pts = starPoints(cx, cy, r);
    const total = 24;
    const lit = Math.floor(total * amount);

    for (let i = 0; i < total; i++) {
      const a0 = -Math.PI / 2 + (i / total) * Math.PI * 2;
      const a1 = -Math.PI / 2 + ((i + 0.7) / total) * Math.PI * 2;

      if (i < lit) {
        p.stroke(120, 185, 255, 255);
        p.strokeWeight(4);
      } else {
        p.stroke(35, 50, 75, 110);
        p.strokeWeight(3);
      }

      p.noFill();
      p.arc(cx, cy, r * 2.35, r * 2.35, a0, a1);
    }

    p.stroke(255, 235, 150, 240);
    p.strokeWeight(2.2);

    const edgeCount = 5;
    const activeEdges = Math.max(1, Math.floor(edgeCount * amount));
    for (let i = 0; i < activeEdges; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      p.line(a[0], a[1], b[0], b[1]);
    }
  }

  function drawBar(cx, cy, w, h, amount) {
    p.noFill();
    p.stroke(55, 70, 100, 180);
    p.strokeWeight(1);
    p.rect(cx - w / 2, cy - h / 2, w, h, 8);

    p.noStroke();
    p.fill(110, 185, 255, 220);
    p.rect(cx - w / 2 + 3, cy - h / 2 + 3, (w - 6) * amount, h - 6, 6);
  }

  p.draw = () => {
    p.background("#040714");

    const cx = p.width / 2;
    const cy = p.height / 2;
    const r = Math.min(p.width, p.height) * 0.16;

    const speedBoost = p.map(p.mouseX, 0, p.width, 0.002, 0.02);
    progress += speedBoost;
    if (progress > 1.001) progress = 0;

    for (let i = 0; i < 5; i++) {
      p.noFill();
      p.stroke(20, 45, 90, 20 - i * 3);
      p.strokeWeight(1);
      p.circle(cx, cy, r * (3.2 + i * 0.38));
    }

    drawBaseStar(cx, cy, r);
    drawSegments(cx, cy, r, progress);
    drawBar(cx, cy + r * 2.25, Math.min(320, p.width * 0.34), 18, progress);

    p.noStroke();
    p.fill(255, 244, 190, 240);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text("CONSTELLATION SYNC", cx, cy - r * 1.95);

    p.fill(120, 185, 255, 250);
    p.textSize(28);
    p.text(`${String(Math.floor(progress * 100)).padStart(2, "0")}%`, cx, cy);

    p.fill(180, 200, 255, 180);
    p.textSize(12);
    p.text("loading orbital geometry...", cx, cy + r * 1.95);
  };

  p.windowResized = () => resize();
}