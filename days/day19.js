export default {
  meta: { day: 19, prompt: "Op Art.", svg: false },

  setup() {
    noFill_();
  },

  draw({ DX, DY, PI, t }) {
    background_("#ffffff");
    translate_(DX, DY);

    // simple line helper
    const lineSeg = (x1, y1, x2, y2) => {
      beginShape_();
      vertex_(x1, y1);
      vertex_(x2, y2);
      endShape_();
    };

    const R = 210;          // drawing radius
    const step = 12;        // spacing of grid lines
    const amp = 26;         // global wave amplitude
    const lensR = 120;      // central "lens" radius

    stroke_("#000000");

    // --- vertical wavy lines ---
    for (let x0 = -R; x0 <= R; x0 += step) {
      beginShape_();
      for (let y0 = -R; y0 <= R; y0 += 4) {
        const r = Math.hypot(x0, y0);
        const base = y0;

        // normal wave
        let offset = amp * Math.sin(0.05 * y0 + 0.9 * t + x0 * 0.18);

        // inside lens: invert + strengthen
        if (r < lensR) {
          offset *= -1.4;
        }

        const x = x0 + offset;
        const y = base;
        vertex_(x, y);
      }
      endShape_();
    }

    // --- horizontal wavy lines ---
    for (let y0 = -R; y0 <= R; y0 += step) {
      beginShape_();
      for (let x0 = -R; x0 <= R; x0 += 4) {
        const r = Math.hypot(x0, y0);
        const base = x0;

        let offset = amp * Math.sin(0.05 * x0 + 0.9 * t + y0 * 0.18);

        if (r < lensR) {
          offset *= -1.4;
        }

        const x = base;
        const y = y0 + offset;
        vertex_(x, y);
      }
      endShape_();
    }

    // --- central circle outline (focus point) ---
    stroke_("#000000");
    beginShape_();
    const circleSteps = 160;
    for (let i = 0; i <= circleSteps; i++) {
      const a = (i / circleSteps) * 2 * PI;
      const x = lensR * Math.cos(a);
      const y = lensR * Math.sin(a);
      vertex_(x, y);
    }
    endShape_();

    // --- outer frame ---
    const F = 230;
    beginShape_();
    vertex_(-F, -F);
    vertex_( F, -F);
    vertex_( F,  F);
    vertex_(-F,  F);
    vertex_(-F, -F);
    endShape_();
  },
};
