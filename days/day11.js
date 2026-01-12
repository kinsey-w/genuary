export default {
  meta: { day: 11, prompt: "In the style of Anni Albers (1899–1994).", svg: false },

  setup() {
    // we want filled “threads”
    noStroke();
  },

  draw({ DX, DY, t }) {
    // linen ground
    background("#f3efe6");
    translate(DX, DY);

    const W = 460, H = 460;
    const x0 = -W / 2, y0 = -H / 2;

    // Albers-ish palette (muted, textile)
    const ink = {
      dark:  "#1b1a18",
      indigo:"#25324a",
      brick: "#8a3b2d",
      ochre: "#b98c3f",
      olive: "#5d6b46",
      linen: "#f3efe6",
    };

    // deterministic hash
    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    // frame / boundary
    stroke("rgba(0,0,0,0.12)");
    noFill();
    beginShape_();
    vertex_(x0+2,y0+2); vertex_(x0+W-2,y0+2); vertex_(x0+W-2,y0+H-2); vertex_(x0+2,y0+H-2); vertex_(x0+2,y0+2);
    endShape_();
    noStroke();

    // weave parameters
    const cell = 14;                   // thread module
    const cols = Math.floor(W / cell);
    const rows = Math.floor(H / cell);
    const drift = 0.7 * Math.sin(t * 0.35); // subtle “tension” shift

    // choose warp/weft colors by region (Albers: structured blocks)
    const warpCols = [ink.dark, ink.indigo, ink.olive];
    const weftCols = [ink.ochre, ink.brick, ink.dark];

    // ---- WARP (vertical threads) ----
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      const band = u < 0.33 ? 0 : (u < 0.66 ? 1 : 2);
      const col = warpCols[band];

      // slight irregularity in width (handwoven feel)
      const w = cell * (0.78 + 0.20 * hash(c, 9.1));
      const x = x0 + c * cell + (cell - w) * 0.5 + drift;

      fill(col);
      rect(x, y0, w, H);
    }

    // ---- WEFT (horizontal threads) with over/under breaks ----
    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1);
      const band = v < 0.40 ? 0 : (v < 0.72 ? 1 : 2);
      const col = weftCols[band];

      // “thread” thickness
      const h = cell * (0.62 + 0.18 * hash(7.3, r));
      const y = y0 + r * cell + (cell - h) * 0.5 - drift;

      // break into segments to simulate interlacing
      for (let c = 0; c < cols; c++) {
        const x = x0 + c * cell;

        // over/under pattern + a couple of motif zones
        const base = (c + r + (t * 0.6)) | 0;
        const motif =
          (c > cols * 0.18 && c < cols * 0.40 && r > rows * 0.18 && r < rows * 0.52) ||
          (c > cols * 0.58 && c < cols * 0.86 && r > rows * 0.55 && r < rows * 0.82);

        const over = motif ? ((c + r) % 3 === 0) : (base % 2 === 0);
        if (!over) continue;

        // segment width with tiny jitter
        const w = cell * (0.92 + 0.08 * hash(c, r));
        fill(col);
        rect(x, y, w, h);

        // a darker “selvage” line for depth (still very subtle)
        fill("rgba(0,0,0,0.10)");
        rect(x, y + h - 1, w, 1);
      }
    }

    // ---- accent blocks (Albers-like structural inserts) ----
    noStroke();
    fill("rgba(0,0,0,0.06)");
    rect(x0 + W*0.10, y0 + H*0.08, W*0.34, H*0.10);
    rect(x0 + W*0.58, y0 + H*0.18, W*0.28, H*0.08);

    fill("rgba(255,255,255,0.10)");
    rect(x0 + W*0.18, y0 + H*0.62, W*0.24, H*0.10);
    rect(x0 + W*0.62, y0 + H*0.68, W*0.18, H*0.08);
  },
};
