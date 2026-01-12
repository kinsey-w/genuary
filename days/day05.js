export default {
  meta: { day: 5, prompt: "Isometric Art (No vanishing points).", svg: false },

  setup() { noFill_(); },

  draw({ DX, DY, PI, t }) {
    background_("#fff");
    translate_(DX, DY);

    // --- isometric projection (no vanishing points) ---
    const ca = Math.cos(PI / 6), sa = Math.sin(PI / 6); // 30°
    const iso = (x, y, z) => [ (x - y) * ca, (x + y) * sa - z ];

    const M = (x, y) => { beginShape_(); vertex_(x, y); };
    const L = (x, y) => vertex_(x, y);
    const S = () => endShape_();

    const drawEdge = (A, B) => {
      const a = iso(...A), b = iso(...B);
      M(a[0], a[1]); L(b[0], b[1]); S();
    };

    const box = (x, y, z, w, d, h) => {
      // 8 corners in 3D (axis-aligned)
      const p000 = [x,     y,     z];
      const p100 = [x + w, y,     z];
      const p010 = [x,     y + d, z];
      const p110 = [x + w, y + d, z];
      const p001 = [x,     y,     z + h];
      const p101 = [x + w, y,     z + h];
      const p011 = [x,     y + d, z + h];
      const p111 = [x + w, y + d, z + h];

      // edges (12)
      drawEdge(p000, p100); drawEdge(p000, p010); drawEdge(p000, p001);
      drawEdge(p100, p110); drawEdge(p100, p101);
      drawEdge(p010, p110); drawEdge(p010, p011);
      drawEdge(p001, p101); drawEdge(p001, p011);
      drawEdge(p110, p111);
      drawEdge(p101, p111);
      drawEdge(p011, p111);
    };

    // --- scene ---
    // gentle animation: “scan” waves change which stacks are taller
    const grid = 10;
    const size = 18;

    for (let gy = -grid; gy <= grid; gy++) {
      for (let gx = -grid; gx <= grid; gx++) {
        // height field (stable + animated)
        const a = gx * 0.55 + gy * 0.35;
        const b = gx * 0.20 - gy * 0.50;
        const hh = 8 + 22 * (0.5 + 0.5 * Math.sin(a + t * 0.7)) * (0.6 + 0.4 * Math.cos(b - t * 0.5));

        // subtle shading by orientation (still wireframe-ish)
        const shade = 20 + Math.floor(40 * (0.5 + 0.5 * Math.sin(a)));
        stroke_(`rgba(0,0,0,${0.14 + shade / 400})`);

        box(gx * size, gy * size, 0, size * 0.9, size * 0.9, hh);
      }
    }

    // frame
    stroke_("rgba(0,0,0,0.10)");
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235); vertex_(235,235); vertex_(-235,235); vertex_(-235,-235);
    endShape_();
  },
};
