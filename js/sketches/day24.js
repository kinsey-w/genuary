import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day24(p) {
  let host;
  const cell = 10;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    p.frameRate(30);
    p.pixelDensity(1);
    p.noStroke();
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

  function pointInPolygon(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const hit =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi + 0.000001) + xi;
      if (hit) inside = !inside;
    }
    return inside;
  }

  p.draw = () => {
    p.background("#050814");

    const t = p.frameCount * 0.02;
    const cx = p.width * 0.5;
    const cy = p.height * 0.5;
    const base = Math.min(p.width, p.height) * 0.18;

    const A = starPoints(
      cx + Math.cos(t * 1.1) * base * 0.9,
      cy + Math.sin(t * 0.8) * base * 0.5,
      base,
      t * 0.7
    );

    const B = starPoints(
      cx + Math.cos(t * 0.9 + 2.0) * base * 0.9,
      cy + Math.sin(t * 1.2 + 1.0) * base * 0.5,
      base,
      -t * 0.6 + 0.7
    );

    const C = starPoints(
      cx + Math.cos(t * 1.3 + 4.0) * base * 0.9,
      cy + Math.sin(t * 1.0 + 2.2) * base * 0.5,
      base,
      t * 0.5 + 1.4
    );

    for (let y = 0; y < p.height; y += cell) {
      for (let x = 0; x < p.width; x += cell) {
        const px = x + cell * 0.5;
        const py = y + cell * 0.5;

        const a = pointInPolygon(px, py, A);
        const b = pointInPolygon(px, py, B);
        const c = pointInPolygon(px, py, C);

        const andAB = a && b;
        const xorAB = (a || b) && !(a && b);
        const orABC = a || b || c;
        const notABC = !orABC;

        if (a && b && c) {
          p.fill(255, 245, 190, 230);         // A ∧ B ∧ C
        } else if (andAB || (a && c) || (b && c)) {
          p.fill(255, 130, 190, 200);         // pairwise intersections
        } else if (xorAB || ((a || b || c) && !(a && b && c) && !(andAB || (a && c) || (b && c)))) {
          p.fill(120, 185, 255, 180);         // XOR-like single ownership
        } else if (notABC) {
          p.fill(10, 16, 30, 255);            // NOT(A ∨ B ∨ C)
        }

        p.rect(x, y, cell, cell);
      }
    }

    p.noFill();
    p.strokeWeight(1.2);
    p.stroke(120, 185, 255, 120);
    for (const poly of [A, B, C]) {
      p.beginShape();
      for (const pt of poly) p.vertex(pt[0], pt[1]);
      p.endShape(p.CLOSE);
    }

    p.noStroke();
    p.fill(220, 230, 255, 170);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("A ∧ B, A ∨ B, XOR, NOT", 18, p.height - 18);
  };

  p.windowResized = () => resize();
}