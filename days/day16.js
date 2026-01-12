export default {
  meta: { day: 16, prompt: "Generative palette.", svg: false },

  setup() {
    noStroke();
  },

  draw({ DX, DY, PI, t }) {
    background("#111111");          // dark so colors really pop
    translate(DX, DY);

    // -------- palette generation (HSL → RGB) --------
    const baseHue = (t * 18) % 360; // slow drift
    const colors = [];

    // helper: HSL (0–360, 0–1, 0–1) → [r,g,b]
    const hslToRgb = (h, s, l) => {
      h = ((h % 360) + 360) % 360;
      s = Math.max(0, Math.min(1, s));
      l = Math.max(0, Math.min(1, l));
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const hp = h / 60;
      const x = c * (1 - Math.abs((hp % 2) - 1));
      let r1 = 0, g1 = 0, b1 = 0;
      if      (hp < 1) { r1 = c; g1 = x; }
      else if (hp < 2) { r1 = x; g1 = c; }
      else if (hp < 3) { g1 = c; b1 = x; }
      else if (hp < 4) { g1 = x; b1 = c; }
      else if (hp < 5) { r1 = x; b1 = c; }
      else             { r1 = c; b1 = x; }
      const m = l - c / 2;
      return [
        Math.round((r1 + m) * 255),
        Math.round((g1 + m) * 255),
        Math.round((b1 + m) * 255),
      ];
    };

    const N = 8; // number of palette colors
    for (let i = 0; i < N; i++) {
      const h = baseHue + (360 / N) * i;
      const s = 0.55 + 0.25 * Math.sin(i * 1.3);
      const l = 0.45 + 0.15 * Math.cos(i * 0.9);
      colors.push(hslToRgb(h, s, l));
    }

    // -------- show palette as swatches --------
    const sw = 430 / N;
    const ySw = -210;
    for (let i = 0; i < N; i++) {
      const [r, g, b] = colors[i];
      fill(r, g, b);
      rect(-215 + i * sw, ySw, sw - 4, 40);
    }

    // -------- use palette in a simple composition --------
    const R = 170;
    const rings = 5;

    for (let ring = 0; ring < rings; ring++) {
      const radiusInner = (R / rings) * ring;
      const radiusOuter = (R / rings) * (ring + 1);
      const slices = N;

      for (let sIdx = 0; sIdx < slices; sIdx++) {
        const [r, g, b] = colors[sIdx];
        fill(r, g, b);

        const a0 = (sIdx / slices) * PI * 2 + t * 0.05;
        const a1 = ((sIdx + 1) / slices) * PI * 2 + t * 0.05;

        beginShape();
        // outer arc
        for (let j = 0; j <= 6; j++) {
          const a = a0 + (a1 - a0) * (j / 6);
          vertex(radiusOuter * Math.cos(a), radiusOuter * Math.sin(a));
        }
        // inner arc (backwards)
        for (let j = 6; j >= 0; j--) {
          const a = a0 + (a1 - a0) * (j / 6);
          vertex(radiusInner * Math.cos(a), radiusInner * Math.sin(a));
        }
        endShape(CLOSE);
      }
    }

    // -------- little strips at the bottom (second palette view) --------
    const stripH = 14;
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < N; i++) {
        const [r, g, b] = colors[(i + row) % N];
        fill(r, g, b);
        const y = 180 + row * (stripH + 3);
        const w = 430 / N;
        rect(-215 + i * w, y, w - 4, stripH);
      }
    }
  },
};
