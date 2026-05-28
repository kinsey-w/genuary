import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day13(p) {
  let host;
  let stars = [];
  let walker;

  const STAR_COUNT = 9;
  const STEP = 4;
  const TURN = 0.08;
  const MAX_POINTS = 2600;

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
    const spread = Math.min(p.width, p.height) * 0.28;

    for (let i = 0; i < STAR_COUNT; i++) {
      const a = (i / STAR_COUNT) * Math.PI * 2;
      const r = spread * (0.45 + 0.35 * ((i % 3) + 1) / 3);
      stars.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        s: p.random(44, 88),
        rot: p.random(Math.PI * 2)
      });
    }

    walker = {
      x: cx,
      y: cy,
      angle: -Math.PI / 2,
      pts: [[cx, cy]]
    };
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

  function insideAnyStar(x, y) {
    for (const s of stars) {
      const poly = starPoints(s.x, s.y, s.s, s.rot);
      if (pointInPolygon(x, y, poly)) return true;
    }
    return false;
  }

  function updateWalker() {
    const inside = insideAnyStar(walker.x, walker.y);

    // the one simple rule:
    // inside a star -> turn left, outside -> turn right
    walker.angle += inside ? -TURN : TURN;

    walker.x += Math.cos(walker.angle) * STEP;
    walker.y += Math.sin(walker.angle) * STEP;

    if (walker.x < 0) walker.x += p.width;
    if (walker.x > p.width) walker.x -= p.width;
    if (walker.y < 0) walker.y += p.height;
    if (walker.y > p.height) walker.y -= p.height;

    walker.pts.push([walker.x, walker.y]);
    if (walker.pts.length > MAX_POINTS) walker.pts.shift();
  }

  function drawStars() {
    p.noFill();
    p.stroke(90, 120, 200, 40);
    p.strokeWeight(1);
    for (const s of stars) {
      const pts = starPoints(s.x, s.y, s.s, s.rot);
      p.beginShape();
      for (const pt of pts) p.vertex(pt[0], pt[1]);
      p.endShape(p.CLOSE);
    }
  }

  function drawPath() {
    for (let i = 1; i < walker.pts.length; i++) {
      const a = walker.pts[i - 1];
      const b = walker.pts[i];
      const t = i / walker.pts.length;
      p.stroke(100 + 155 * t, 160 + 60 * t, 255, 40 + 160 * t);
      p.strokeWeight(1.2);
      p.line(a[0], a[1], b[0], b[1]);
    }
  }

  p.draw = () => {
    p.background("#050814");

    for (let i = 0; i < 12; i++) updateWalker();

    drawStars();
    drawPath();

    p.noStroke();
    p.fill(255, 235, 160, 230);
    p.circle(walker.x, walker.y, 6);

    p.fill(180, 200, 255, 180);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("rule: inside star = turn left, outside = turn right", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}