export default {
  meta: { day: 12, prompt: "Lava lamp.", svg: false },

  setup() {
    noFill_();
  },

  draw({ DX, DY, PI, t }) {
    background_("#0a0712");
    translate_(DX, DY);

    // --- capsule frame ---
    stroke_("rgba(255,255,255,0.10)");
    noFill_();
    capsule(-170, -225, 340, 450, 90); // x,y,w,h,r

    // subtle glass highlight
    stroke_("rgba(255,255,255,0.05)");
    beginShape_();
    vertex_(-120, -210); vertex_(-90, -220); vertex_(-65, -205); vertex_(-55, -160);
    vertex_(-60,  140); vertex_(-75,  190); vertex_(-100, 215); vertex_(-125, 205);
    endShape_();

    // --- lava blobs (metaball-ish via layered rings) ---
    const blobs = [
      blob(  0,  120, 70,  0.30, 0.22,  0.7),
      blob( 60,   20, 55, -0.20, 0.18,  1.2),
      blob(-50,  -40, 62,  0.15, 0.14,  2.0),
      blob( 10, -140, 48,  0.10, 0.20,  2.7),
      blob(-20, -210, 30, -0.05, 0.25,  3.1),
    ];

    for (let i = 0; i < blobs.length; i++) {
      drawLava(blobs[i], i);
    }

    // base / cap
    stroke_("rgba(255,255,255,0.10)");
    noFill_();
    beginShape_();
    vertex_(-110, 235); vertex_(110, 235);
    endShape_();

    // -------- helpers --------
    function blob(x, y, r, ax, ay, ph) {
      // animate position and radius slowly
      const bx = x + 40 * Math.sin(t * ax + ph) + 10 * Math.sin(t * 0.9 + ph);
      const by = y + 55 * Math.cos(t * ay + ph) + 12 * Math.sin(t * 0.6 + ph * 1.7);
      const br = r + 10 * Math.sin(t * 0.5 + ph);
      return { x: bx, y: by, r: br, ph };
    }

    function drawLava(b, idx) {
      // warm palette that shifts subtly
      const hue = (220 + 70 * Math.sin(t * 0.25 + b.ph)) % 360;
      const core = `hsla(${hue}, 85%, 60%, 0.14)`;
      const rim  = `hsla(${hue}, 85%, 70%, 0.10)`;

      // clip-ish: only draw blobs inside capsule bounds (cheap reject)
      if (b.y < -240 || b.y > 240) return;

      // layered rings (gives soft blob gradient)
      const rings = 18;
      for (let k = rings; k >= 1; k--) {
        const u = k / rings;
        const rr = b.r * u;

        // wobble edge so it feels fluid
        const wob = 1 + 0.06 * Math.sin(t * 1.2 + idx * 2 + k * 0.7);
        const r2 = rr * wob;

        stroke_(k > rings * 0.55 ? core : rim);
        circleApprox(b.x, b.y, r2, 64);
      }

      // a tiny highlight
      stroke_("rgba(255,255,255,0.06)");
      circleApprox(b.x - b.r * 0.22, b.y - b.r * 0.18, b.r * 0.22, 40);
    }

    function circleApprox(cx, cy, r, n) {
      beginShape_();
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * PI * 2;
        vertex_(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      endShape_();
    }

    function capsule(x, y, w, h, r) {
      // outline only, built from primitives (arcs approximated with polyline)
      const n = 40;
      // top arc
      beginShape_();
      for (let i = 0; i <= n; i++) {
        const a = PI + (i / n) * PI;
        vertex_(x + w/2 + (w/2 - r) * Math.cos(0) + r * Math.cos(a),
                y + r + r * Math.sin(a));
      }
      // sides
      vertex_(x + w, y + r);
      vertex_(x + w, y + h - r);
      // bottom arc
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * PI;
        vertex_(x + w/2 + (w/2 - r) * Math.cos(0) + r * Math.cos(a),
                y + h - r + r * Math.sin(a));
      }
      vertex_(x, y + h - r);
      vertex_(x, y + r);
      endShape_();
    }
  },
};
