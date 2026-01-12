export default {
  meta: {
    day: 25,
    prompt: "Organic Geometry. Forms that look or act organic but are constructed entirely from geometric shapes.",
    svg: false,
  },

  setup() {
    noFill_();

    // pre-generate a spiral of polygon "cells"
    this.cells = [];
    const count = 85;
    const golden = Math.PI * (3 - Math.sqrt(5)); // golden angle
    const baseR = 12;

    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      const radius = 20 + u * 190;
      const angle = i * golden;

      const cx = radius * Math.cos(angle);
      const cy = radius * Math.sin(angle);

      const sides = 5 + (i % 2);     // 5 or 6 sides
      const size = baseR * (0.7 + 0.8 * u);
      const phase = Math.random() * Math.PI * 2;

      this.cells.push({
        cx,
        cy,
        sides,
        size,
        phase,
        angle,
      });
    }
  },

  draw({ DX, DY, PI, t }) {
    background_("#f5f2eb");
    translate_(DX, DY);

    // palette (soft coral / plant vibes)
    const inks = [
      "#305f72",
      "#f2a999",
      "#e6c87f",
      "#7aa37b",
      "#c98cdf",
    ];

    const TAU = PI * 2;

    const poly = (cx, cy, r, sides, rot, col) => {
      stroke_(col);
      beginShape_();
      for (let k = 0; k <= sides; k++) {
        const a = rot + (k / sides) * TAU;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        vertex_(x, y);
      }
      endShape_();
    };

    // connect neighbors with straight segments (vein-like)
    stroke_("rgba(0,0,0,0.12)");
    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1];
      const b = this.cells[i];

      const pa = 1 + 0.1 * Math.sin(t * 0.7 + a.phase);
      const pb = 1 + 0.1 * Math.sin(t * 0.7 + b.phase);

      const ax = a.cx * pa;
      const ay = a.cy * pa;
      const bx = b.cx * pb;
      const by = b.cy * pb;

      beginShape_();
      vertex_(ax, ay);
      vertex_(bx, by);
      endShape_();
    }

    // draw cells themselves
    for (let i = 0; i < this.cells.length; i++) {
      const c = this.cells[i];

      // breathing / wobble
      const breathe = 1 + 0.1 * Math.sin(t * 0.9 + c.phase);
      const sway = 6 * Math.sin(t * 0.5 + c.angle * 0.8);

      const cx = c.cx * breathe;
      const cy = c.cy * breathe + sway;
      const r = c.size * breathe;

      const col = inks[i % inks.length];
      const rot = c.angle + 0.2 * Math.sin(t * 0.4 + c.phase);

      poly(cx, cy, r, c.sides, rot, col);
    }

    // outer ring of larger polygons, still geometric, to “contain” the organism
    const ringCount = 18;
    for (let i = 0; i < ringCount; i++) {
      const u = i / ringCount;
      const a = u * TAU;
      const R = 220 + 8 * Math.sin(t * 0.3 + i);

      const cx = R * Math.cos(a);
      const cy = R * Math.sin(a);

      const r = 18 + 5 * Math.sin(t * 0.6 + i);
      const sides = 6;
      const col = "rgba(0,0,0,0.18)";
      const rot = a + 0.3;

      poly(cx, cy, r, sides, rot, col);
    }

    // frame
    stroke_("rgba(0,0,0,0.18)");
    beginShape_();
    vertex_(-235, -235); vertex_(235, -235);
    vertex_(235, 235);   vertex_(-235, 235);
    vertex_(-235, -235);
    endShape_();
  },
};
