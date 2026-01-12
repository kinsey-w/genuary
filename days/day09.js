export default {
  meta: { day: 9, prompt: "The textile design patterns of public transport seating.", svg: false },

  setup() {
    // we want fills for moquette
    noStroke();
  },

  draw({ DX, DY, t }) {
    // deep fabric base
    background("#0b1020");
    translate(DX, DY);

    const W = 470, H = 470;
    const x0 = -W / 2, y0 = -H / 2;

    // moquette-ish palette (bright pops)
    const pal = [
      [245, 108, 70],   // orange-red
      [88, 205, 255],   // cyan
      [255, 210, 88],   // yellow
      [168, 255, 120],  // acid green
      [190, 120, 255],  // purple
      [255, 120, 200],  // pink
    ];

    // tiny drift (like fabric shifting)
    const driftX = Math.round(3 * Math.sin(t * 0.25));
    const driftY = Math.round(3 * Math.cos(t * 0.22));

    const tile = 64;
    const cols = Math.ceil(W / tile) + 1;
    const rows = Math.ceil(H / tile) + 1;

    // deterministic hash (no p5 noise needed)
    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    // draw repeated tiles
    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const ox = x0 + gx * tile + driftX;
        const oy = y0 + gy * tile + driftY;

        // per-tile seed
        const n = hash(gx + 13.7, gy + 9.2);
        drawTile(ox, oy, tile, gx, gy, n);
      }
    }

    // subtle “weave” overlay (very low alpha)
    noStroke();
    fill(255, 255, 255, 10);
    for (let y = y0; y < y0 + H; y += 6) rect(x0, y, W, 1);

    // frame
    stroke("rgba(255,255,255,0.08)");
    noFill();
    beginShape_();
    vertex_(x0 + 2, y0 + 2); vertex_(x0 + W - 2, y0 + 2);
    vertex_(x0 + W - 2, y0 + H - 2); vertex_(x0 + 2, y0 + H - 2);
    vertex_(x0 + 2, y0 + 2);
    endShape_();

    // ---- tile renderer (moquette motifs) ----
    function drawTile(x, y, s, gx, gy, n) {
      // base speckle (fabric texture)
      noStroke();
      fill(255, 255, 255, 6);
      for (let i = 0; i < 10; i++) {
        const px = x + (hash(n * 10 + i, gx) * s);
        const py = y + (hash(n * 10 + i, gy) * s);
        rect(px, py, 1, 1);
      }

      // diagonal “ribbons”
      const a = (n < 0.5) ? 1 : -1;
      const band = 10 + Math.floor(8 * hash(gx, gy));
      fill(20, 28, 55, 160); // darker band shadow
      quad(x, y + s * 0.2, x + s * 0.2 * a, y, x + s, y + s * 0.8, x + s * 0.8 * a, y + s);

      // bright band on top
      const c1 = pal[(Math.floor(hash(gx + 1.1, gy + 2.2) * pal.length))];
      fill(c1[0], c1[1], c1[2], 150);
      quad(x, y + band, x + band * a, y, x + s, y + s - band, x + s - band * a, y + s);

      // clustered dots / lozenges
      const c2 = pal[(Math.floor(hash(gx + 7.7, gy + 8.8) * pal.length))];
      const c3 = pal[(Math.floor(hash(gx + 4.4, gy + 5.5) * pal.length))];

      // big motif circle
      const cx = x + s * (0.25 + 0.5 * hash(n, gx + 0.3));
      const cy = y + s * (0.25 + 0.5 * hash(n, gy + 0.7));
      fill(c2[0], c2[1], c2[2], 190);
      circle(cx, cy, s * (0.38 + 0.10 * hash(gx + 3, gy + 9)));

      // inner counter-shape
      fill(11, 16, 32, 200);
      circle(cx + s * 0.05 * a, cy + s * 0.03, s * 0.18);

      // small dot constellation
      fill(c3[0], c3[1], c3[2], 170);
      for (let i = 0; i < 5; i++) {
        const px = x + s * hash(gx + i * 2.1, gy + 1.3);
        const py = y + s * hash(gx + 1.7, gy + i * 2.4);
        circle(px, py, 4 + 6 * hash(px, py));
      }

      // tiny “ticket punch” rectangles
      fill(255, 255, 255, 22);
      rect(x + s * 0.08, y + s * 0.78, s * 0.18, 2);
      rect(x + s * 0.70, y + s * 0.18, s * 0.18, 2);
    }
  },
};
