import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day06(p) {
  let host;
  let lightsOn = true;
  let stars = [];
  const COLS = 5;
  const ROWS = 4;

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
    const mx = p.width * 0.16;
    const my = p.height * 0.2;
    const sx = (p.width - mx * 2) / (COLS - 1);
    const sy = (p.height - my * 2) / (ROWS - 1);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        stars.push({
          x: mx + x * sx,
          y: my + y * sy,
          r: p.random(22, 38),
          phase: p.random(Math.PI * 2),
          speed: p.random(0.01, 0.03)
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

  function drawStar(cx, cy, r, alpha, wobble) {
    const pts = starPoints(cx, cy, r + wobble);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function drawConnections(alpha) {
    p.stroke(120, 170, 255, alpha);
    p.strokeWeight(lightsOn ? 1.4 : 0.6);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x;
        const a = stars[i];

        if (x < COLS - 1) {
          const b = stars[i + 1];
          p.line(a.x, a.y, b.x, b.y);
        }
        if (y < ROWS - 1) {
          const b = stars[i + COLS];
          p.line(a.x, a.y, b.x, b.y);
        }
      }
    }
  }

  p.draw = () => {
    p.background(lightsOn ? "#040816" : "#020202");

    const mx = (p.mouseX - p.width / 2) * 0.01;
    const my = (p.mouseY - p.height / 2) * 0.01;

    if (lightsOn) {
      for (let i = 0; i < 8; i++) {
        const a = 18 - i * 2;
        p.noFill();
        p.stroke(40, 90, 220, a);
        p.circle(p.width / 2, p.height / 2, Math.min(p.width, p.height) * (0.35 + i * 0.08));
      }
    }

    drawConnections(lightsOn ? 110 : 28);

    p.noStroke();
    for (const s of stars) {
      const wobble = Math.sin(p.frameCount * s.speed + s.phase) * 2.5;
      const x = s.x + mx * 0.15;
      const y = s.y + my * 0.15;

      if (lightsOn) {
        p.fill(90, 150, 255, 30);
        drawStar(x, y, s.r * 1.9, 30, wobble);

        p.fill(120, 190, 255, 70);
        drawStar(x, y, s.r * 1.35, 70, wobble);

        p.fill(255, 235, 170, 255);
        drawStar(x, y, s.r, 255, wobble);
      } else {
        p.fill(24, 32, 48, 180);
        drawStar(x, y, s.r, 180, wobble * 0.5);

        p.stroke(70, 85, 110, 55);
        p.strokeWeight(1);
        p.noFill();
        drawStar(x, y, s.r * 1.02, 55, wobble * 0.3);
        p.noStroke();
      }
    }

    p.fill(lightsOn ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.38)");
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(14);
    p.text(`lights ${lightsOn ? "on" : "off"}  — click / L`, 18, p.height - 18);
  };

  function toggleLights() {
    lightsOn = !lightsOn;
  }

  p.mousePressed = () => toggleLights();

  p.keyPressed = () => {
    if (p.key === "l" || p.key === "L") toggleLights();
  };

  p.windowResized = () => {
    resize();
    build();
  };
}