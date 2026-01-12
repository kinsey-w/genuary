export default {
  meta: { day: 18, prompt: "What does wind look like?", svg: false },

  setup() {
    noFill_();

    // palettes: cool wind ribbons + warm leaves
    this.ribbonColors = [
      "rgba(46, 182, 205, 0.22)",  // teal
      "rgba(96, 161, 220, 0.20)",  // sky blue
      "rgba(132, 126, 212, 0.18)", // violet
      "rgba(64, 207, 152, 0.20)"   // greenish
    ];
    this.leafColors = [
      [244, 164, 96],   // sandy orange
      [235, 112, 130],  // pink
      [254, 215, 102],  // gold
      [181, 225, 140],  // soft green
      [199, 140, 230],  // lilac
    ];

    // precompute flow “streams”
    this.streams = [];
    const streamCount = 18;
    const steps = 80;

    for (let s = 0; s < streamCount; s++) {
      const baseY = random(-180, 180);
      const amp = random(20, 60);
      const freq = random(0.6, 1.4);
      const phase = random(TAU);
      const wobble = random(5, 18);
      const col = this.ribbonColors[s % this.ribbonColors.length];

      const pts = [];
      for (let i = 0; i < steps; i++) {
        const u = i / (steps - 1);
        const x = -260 + 520 * u;
        const y = baseY + amp * Math.sin(u * freq * TAU + phase);
        pts.push({ x, y, u, wobble });
      }

      this.streams.push({
        pts,
        color: col,
        amp,
        freq,
        phase,
        leafPhase: random(TAU)
      });
    }
  },

  draw({ DX, DY, PI, t }) {
    // twilight sky so colors pop
    background_("#060b16");
    translate_(DX, DY);

    // subtle star/dust field
    stroke_("rgba(255,255,255,0.08)");
    for (let i = 0; i < 120; i++) {
      const x = -240 + (i * 37 % 480);
      const y = -240 + ((i * 91 + 137 * Math.sin(t*0.05)) % 480);
      beginShape_(); vertex_(x, y); vertex_(x+0.5, y); endShape_();
    }

    // draw flowing ribbons
    for (const s of this.streams) {
      stroke_(s.color);
      beginShape_();

      const pts = s.pts;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // approximate tangent from neighbors
        const prev = pts[Math.max(0, i - 1)];
        const next = pts[Math.min(pts.length - 1, i + 1)];
        let tx = next.x - prev.x;
        let ty = next.y - prev.y;
        const mag = Math.hypot(tx, ty) || 1;
        tx /= mag; ty /= mag;

        // normal (perpendicular) for side-to-side shimmer
        const nx = -ty;
        const ny = tx;

        const wave = Math.sin(t * 0.9 + p.u * s.freq * TAU + s.phase);
        const disp = p.wobble * 0.4 * wave;

        const x = p.x + nx * disp;
        const y = p.y + ny * disp;
        vertex_(x, y);
      }
      endShape_();
    }

    // drifting “leaves” riding along the streams
    noStroke();
    const leafCountPerStream = 6;

    for (const s of this.streams) {
      const pts = s.pts;
      const L = pts.length - 1;

      for (let i = 0; i < leafCountPerStream; i++) {
        const phase = s.leafPhase + i * 0.9;
        // position along stream (wrap around)
        let u = (0.2 + 0.8 * ((t * 0.12 + phase / TAU) % 1));
        const idx = u * L;
        const i0 = Math.floor(idx);
        const i1 = Math.min(L, i0 + 1);
        const f = idx - i0;

        const p0 = pts[i0];
        const p1 = pts[i1];
        const x = p0.x + (p1.x - p0.x) * f;
        const y = p0.y + (p1.y - p0.y) * f;

        // local tangent for leaf orientation
        const tx = p1.x - p0.x;
        const ty = p1.y - p0.y;
        const ang = Math.atan2(ty, tx);

        // size & wobble
        const baseSize = 10 + 6 * Math.sin(phase + t*0.4);
        const [r,g,b] = this.leafColors[(i + Math.floor(phase*10)) % this.leafColors.length];
        fill(r, g, b, 190);

        // draw a little rotated leaf (diamond)
        push();
        translate(x, y);
        rotate(ang + 0.3 * Math.sin(t*0.7 + phase));
        beginShape();
        vertex(0, -baseSize * 0.7);
        vertex(baseSize * 0.8, 0);
        vertex(0, baseSize * 0.7);
        vertex(-baseSize * 0.6, 0);
        endShape(CLOSE);
        pop();
      }
    }

    // a slight “gust” arc in front
    stroke_("rgba(255,255,255,0.12)");
    noFill_();
    const gustR = 210 + 10 * Math.sin(t * 0.5);
    beginShape_();
    for (let i = 0; i <= 60; i++) {
      const a = PI * 0.15 + (PI * 0.7) * (i / 60);
      const r = gustR + 6 * Math.sin(3 * a + t);
      vertex_(r * Math.cos(a), r * Math.sin(a) * 0.5);
    }
    endShape_();
  },
};
