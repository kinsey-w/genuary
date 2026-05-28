import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day10(p) {
  let host;
  let stars = [];

  const U = p.TAU / p.TAU;
  const O = U - U;
  const II = U + U;
  const III = II + U;
  const IV = II + II;
  const V = IV + U;
  const VI = V + U;
  const VIII = IV + IV;
  const X = V + V;
  const XII = VI + VI;
  const XVI = VIII + VIII;
  const XX = X + X;
  const XL = XX + XX;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(XL);
    p.pixelDensity(U);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    stars = [];
    const cx = p.width / II;
    const cy = p.height / II;
    const base = Math.min(p.width, p.height) / VI;

    for (let ring = O; ring < IV; ring += U) {
      const count = VIII + ring * V;
      const radius = base * (U + ring / II);
      for (let i = O; i < count; i += U) {
        stars.push({
          ring,
          i,
          count,
          radius,
          phase: p.random(p.TAU),
          spin: p.random(p.TAU) / XL
        });
      }
    }

    stars.cx = cx;
    stars.cy = cy;
  }

  function starPoints(cx, cy, r, rot) {
    const pts = [];
    for (let i = O; i < V; i += U) {
      const a = rot + i * (p.TAU * (III / V));
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawStar(cx, cy, r, rot, tint) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(tint);
    p.strokeWeight(U);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[O], pt[U]);
    p.endShape(p.CLOSE);
  }

  p.draw = () => {
    p.background("midnightblue");

    const t = p.frameCount / XL;
    const mx = (p.mouseX - p.width / II) / XX;
    const my = (p.mouseY - p.height / II) / XX;

    for (const s of stars) {
      const a = s.phase + (s.i / s.count) * p.TAU + t * (U + s.ring / VIII);
      const r = s.radius + Math.sin(t + s.phase) * (s.radius / XX);
      const x = stars.cx + Math.cos(a) * r + mx * (U + s.ring);
      const y = stars.cy + Math.sin(a) * r + my * (U + s.ring);
      const rot = a + t * s.spin * X;
      const size = Math.max(U, r / XX);

      drawStar(x, y, size, rot, s.ring % II ? "gold" : "deepskyblue");
    }

    drawStar(stars.cx, stars.cy, Math.min(p.width, p.height) / X, t, "white");
  };

  p.windowResized = () => {
    resize();
    build();
  };
}