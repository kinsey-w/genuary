export default {
  meta: { day: 22, prompt: "Gradients only.", svg: false },

  setup() {
    noStroke();
  },

  draw({ DX, DY, t }) {
    translate(DX, DY);

    const W = 480, H = 480;
    const x0 = -W / 2, y0 = -H / 2;

    // helper: linear gradient as stacked 1px (or thin) rectangles
    const lerp = (a, b, u) => a + (b - a) * u;
    const gradRect = (x, y, w, h, c0, c1, vertical = true, steps = 220) => {
      const n = steps | 0;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const r = lerp(c0[0], c1[0], u);
        const g = lerp(c0[1], c1[1], u);
        const b = lerp(c0[2], c1[2], u);
        const a = lerp(c0[3], c1[3], u);
        fill(r, g, b, a);
        if (vertical) rect(x, y + (h * i) / n, w, h / n + 1);
        else rect(x + (w * i) / n, y, w / n + 1, h);
      }
    };

    // --- background: one big gradient (still “gradients only”) ---
    background(0); // just a base clear; the visible is the gradient below
    gradRect(x0, y0, W, H, [15, 12, 28, 255], [235, 240, 245, 255], true, 260);

    // --- gradient ribbons (all gradients, no strokes) ---
    const bands = 7;
    for (let k = 0; k < bands; k++) {
      const u = k / (bands - 1);
      const y = y0 + 50 + u * 360 + 18 * Math.sin(t * 0.35 + k * 1.2);
      const h = 62 + 10 * Math.sin(t * 0.25 + k * 0.9);

      // each band is itself a vertical gradient
      const hueShift = 0.5 + 0.5 * Math.sin(t * 0.18 + k);
      const cA = [lerp(40, 120, hueShift), lerp(90, 180, u), lerp(140, 80, u), 120];
      const cB = [lerp(240, 180, u), lerp(160, 220, hueShift), lerp(120, 240, hueShift), 120];

      gradRect(x0 + 30, y, W - 60, h, cA, cB, false, 180);
    }

    // --- “radial-ish” gradient orbs using layered circles (still gradients only) ---
    const orb = (cx, cy, r, cInner, cOuter) => {
      const steps = 48;
      for (let i = steps; i >= 1; i--) {
        const u = i / steps;
        const rr = r * u;
        const c = [
          lerp(cOuter[0], cInner[0], u),
          lerp(cOuter[1], cInner[1], u),
          lerp(cOuter[2], cInner[2], u),
          lerp(cOuter[3], cInner[3], u),
        ];
        fill(c[0], c[1], c[2], c[3]);
        circle(cx, cy, rr * 2);
      }
    };

    orb(-120, -80, 90, [255, 200, 120, 90], [60, 120, 220, 0]);
    orb( 110, -30, 70, [160, 240, 210, 80], [220, 120, 210, 0]);
    orb( -20, 120, 110,[180, 160, 255, 70], [90, 140, 180, 0]);
  },
};
