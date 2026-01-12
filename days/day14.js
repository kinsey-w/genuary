export default {
  meta: { day: 14, prompt: "Pure black and white. No gray.", svg: false },

  setup() { /* intentionally empty */ },

  draw({ DX, DY, t }) {
    // strict B/W only
    background("#fff");
    translate(DX, DY);

    const W = 460, H = 460;
    const x0 = -W/2, y0 = -H/2;

    // simple deterministic hash (no noise, no gray)
    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    // draw a grid of black/white tiles with moving “cut” threshold
    const cells = 46;
    const s = W / cells;
    const cut = 0.50 + 0.18 * Math.sin(t * 0.35);

    noStroke();

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const n = hash(c + 0.13, r + 0.91);

        // evolving but still binary
        const v = n + 0.12 * Math.sin(t * 0.6 + (c - r) * 0.18);

        // pure black or pure white, nothing else
        if (v > cut) fill("#000");
        else fill("#fff");

        // add structure: occasional “domino” merges (still B/W)
        const x = x0 + c * s;
        const y = y0 + r * s;
        const wide = (n > 0.92 && c < cells - 1);
        const tall = (n < 0.08 && r < cells - 1);

        if (wide) rect(x, y, s * 2, s);
        else if (tall) rect(x, y, s, s * 2);
        else rect(x, y, s, s);
      }
    }

    // hard frame (still only black)
    noFill();
    stroke("#000");
    beginShape_();
    vertex_(x0, y0); vertex_(x0+W, y0); vertex_(x0+W, y0+H); vertex_(x0, y0+H); vertex_(x0, y0);
    endShape_();
  },
};
