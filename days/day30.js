export default {
  meta: {
    day: 30,
    prompt: "Abstract map",
    svg: false,
  },

  setup() {
    noFill_();

    // generate pseudo-random control points
    this.noiseSeed = Math.random() * 1000;

    // road seeds
    this.roads = [];
    for (let i = 0; i < 18; i++) {
      this.roads.push({
        a: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2,
        width: 0.8 + Math.random() * 1.4,
      });
    }

    // district rings
    this.rings = [];
    for (let i = 0; i < 6; i++) {
      this.rings.push({
        r: 40 + i * 30,
        wobble: 6 + i * 3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // transit lines
    this.lines = [];
    for (let i = 0; i < 4; i++) {
      this.lines.push({
        angle: Math.random() * Math.PI * 2,
        offset: (Math.random() * 2 - 1) * 60,
        hue: 20 + i * 90,
      });
    }
  },

  draw({ DX, DY, t, PI }) {
    background_("#f4f1ec");
    translate_(DX, DY);

    const TAU = PI * 2;

    // --- elevation / water bands ---
    stroke_("rgba(90,120,160,0.25)");
    for (let y = -220; y <= 220; y += 14) {
      beginShape_();
      for (let x = -220; x <= 220; x += 12) {
        const n =
          Math.sin(x * 0.02 + this.noiseSeed) +
          Math.cos(y * 0.03 + t * 0.1);
        vertex_(x, y + n * 6);
      }
      endShape_();
    }

    // --- district boundaries ---
    stroke_("rgba(80,80,80,0.35)");
    for (const ring of this.rings) {
      beginShape_();
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * TAU;
        const r =
          ring.r +
          ring.wobble *
            Math.sin(a * 3 + ring.phase + t * 0.15);
        vertex_(r * Math.cos(a), r * Math.sin(a));
      }
      endShape_();
    }

    // --- major roads ---
    stroke_("rgba(40,40,40,0.7)");
    for (const rd of this.roads) {
      strokeWeight(rd.width);
      beginShape_();
      for (let u = -220; u <= 220; u += 10) {
        const bend =
          40 *
          Math.sin(
            u * 0.01 +
              rd.phase +
              t * 0.2
          );
        const x = u * Math.cos(rd.a) - bend * Math.sin(rd.a);
        const y = u * Math.sin(rd.a) + bend * Math.cos(rd.a);
        vertex_(x, y);
      }
      endShape_();
    }
    strokeWeight(1);

    // --- transit lines ---
    for (const ln of this.lines) {
      stroke_(`hsla(${ln.hue},70%,45%,0.8)`);
      beginShape_();
      for (let u = -220; u <= 220; u += 8) {
        const w =
          ln.offset +
          12 * Math.sin(u * 0.04 + t);
        const x = u * Math.cos(ln.angle) -
                  w * Math.sin(ln.angle);
        const y = u * Math.sin(ln.angle) +
                  w * Math.cos(ln.angle);
        vertex_(x, y);
      }
      endShape_();
    }

    // --- intersection nodes ---
    noStroke();
    fill(30, 30, 30, 120);
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * TAU;
      const r = 40 + (i % 6) * 28;
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      rect(x - 2, y - 2, 4, 4);
    }

    // --- frame ---
    stroke_("rgba(0,0,0,0.18)");
    noFill_();
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235);
    vertex_(235,235);   vertex_(-235,235);
    vertex_(-235,-235);
    endShape_();
  },
};
