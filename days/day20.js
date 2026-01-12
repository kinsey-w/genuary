export default {
  meta: { day: 20, prompt: "Generative Architecture", svg: false },

  setup() {
    noStroke();

    // palette of architectural “materials”
    this.materials = [
      { front: "#d9e0e7", side: "#b0bac7", top: "#f3f5f8" },
      { front: "#f0e2d0", side: "#c8b299", top: "#f7eee3" },
      { front: "#d7e4da", side: "#aabdaf", top: "#edf4ef" },
      { front: "#e3d8ef", side: "#b8a4cf", top: "#f5f0fb" },
    ];

    // pre-generate a row of buildings
    this.buildings = [];
    const span = 440;
    const cols = 14;
    const cell = span / cols;
    const baseX = -span / 2;

    for (let i = 0; i < cols; i++) {
      const x = baseX + i * cell;
      const w = cell * random(0.65, 1.15);
      const h = random(80, 220);
      const d = random(26, 60); // depth
      const mat = this.materials[i % this.materials.length];

      // small chance of “tower” on the roof
      const hasTower = random() < 0.35;
      const towerH = hasTower ? h * random(0.18, 0.35) : 0;

      this.buildings.push({
        x,
        w,
        h,
        d,
        mat,
        hasTower,
        towerH,
      });
    }
  },

  draw({ DX, DY, t }) {
    background_("#f4f2ed");
    translate_(DX, DY);

    const groundY = 120;

    // simple deterministic hash
    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    // horizon band
    noStroke();
    fill("#e1e5ea");
    rect(-260, -260, 520, 120);
    fill("#cfd7de");
    rect(-260, -140, 520, 40);

    // ground plane
    fill("#d2cbc0");
    rect(-260, groundY, 520, 180);

    // slight foreground shadow strip
    fill("#c1b7aa");
    rect(-260, groundY + 72, 520, 10);

    // draw buildings back-to-front (just left-to-right is fine here)
    const scan = (Math.sin(t * 0.35) * 0.5 + 0.5); // 0..1
    const scanH = 200 * scan;

    for (const b of this.buildings) {
      drawBuilding(b);
    }

    // a simple foreground “street” line
    stroke_("rgba(0,0,0,0.18)");
    noFill_();
    beginShape_();
    vertex_(-240, groundY + 40);
    vertex_(240, groundY + 40);
    endShape_();

    // tiny “plot” ticks
    for (let i = -220; i <= 220; i += 40) {
      beginShape_();
      vertex_(i, groundY + 40);
      vertex_(i, groundY + 46);
      endShape_();
    }

    // --------- helpers inside draw ---------

    function drawPrismFace(points, col) {
      fill(col);
      beginShape();
      for (const p of points) vertex(p.x, p.y);
      endShape(CLOSE);
    }

    function lighten(hex, f) {
      // very small, rough lightener: mix toward white
      const c = hexToRgb(hex);
      const mix = (cComp) => Math.round(cComp + (255 - cComp) * f);
      return `rgb(${mix(c.r)},${mix(c.g)},${mix(c.b)})`;
    }

    function darken(hex, f) {
      const c = hexToRgb(hex);
      const mix = (cComp) => Math.round(cComp * (1 - f));
      return `rgb(${mix(c.r)},${mix(c.g)},${mix(c.b)})`;
    }

    function hexToRgb(hex) {
      const h = hex.replace("#", "");
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return { r, g, b };
    }

    function drawBuilding(b) {
      const ox = -b.d * 0.45;
      const oy = -b.d * 0.45;

      const x0 = b.x;
      const x1 = b.x + b.w;
      const yBase = groundY;
      const yTop = groundY - b.h;

      // front face
      drawPrismFace(
        [
          { x: x0, y: yTop },
          { x: x1, y: yTop },
          { x: x1, y: yBase },
          { x: x0, y: yBase },
        ],
        b.mat.front
      );

      // top face
      drawPrismFace(
        [
          { x: x0, y: yTop },
          { x: x1, y: yTop },
          { x: x1 + ox, y: yTop + oy },
          { x: x0 + ox, y: yTop + oy },
        ],
        b.mat.top
      );

      // side face
      drawPrismFace(
        [
          { x: x1, y: yTop },
          { x: x1 + ox, y: yTop + oy },
          { x: x1 + ox, y: yBase + oy },
          { x: x1, y: yBase },
        ],
        b.mat.side
      );

      // optional tower volume on roof
      if (b.hasTower && b.towerH > 0) {
        const tw = b.w * 0.4;
        const tx0 = x0 + b.w * 0.3;
        const tx1 = tx0 + tw;
        const tyBase = yTop;
        const tyTop = yTop - b.towerH;

        const tFront = darken(b.mat.front, 0.08);
        const tTop = lighten(b.mat.top, 0.08);
        const tSide = darken(b.mat.side, 0.12);

        // tower front
        drawPrismFace(
          [
            { x: tx0, y: tyTop },
            { x: tx1, y: tyTop },
            { x: tx1, y: tyBase },
            { x: tx0, y: tyBase },
          ],
          tFront
        );

        // tower top
        drawPrismFace(
          [
            { x: tx0, y: tyTop },
            { x: tx1, y: tyTop },
            { x: tx1 + ox * 0.7, y: tyTop + oy * 0.7 },
            { x: tx0 + ox * 0.7, y: tyTop + oy * 0.7 },
          ],
          tTop
        );

        // tower side
        drawPrismFace(
          [
            { x: tx1, y: tyTop },
            { x: tx1 + ox * 0.7, y: tyTop + oy * 0.7 },
            { x: tx1 + ox * 0.7, y: tyBase + oy * 0.7 },
            { x: tx1, y: tyBase },
          ],
          tSide
        );
      }

      // front windows as small grid, using a hash so every building is different
      const floors = Math.floor(b.h / 26);
      const bays = Math.max(2, Math.floor(b.w / 26));
      const padX = b.w * 0.12;
      const padY = b.h * 0.16;
      const cellW = (b.w - padX * 2) / bays;
      const cellH = (b.h - padY * 2) / floors;

      for (let r = 0; r < floors; r++) {
        for (let c = 0; c < bays; c++) {
          const n = hash(b.x * 0.1 + c, r + b.h * 0.01);

          // sparse, some “core” zones with no windows
          if (n < 0.18) continue;

          const wx = x0 + padX + c * cellW + cellW * 0.18;
          const wy = yTop + padY + r * cellH + cellH * 0.18;
          const ww = cellW * 0.64;
          const wh = cellH * 0.54;

          // animated light band: brighter near scanH
          const yCenter = yBase - (wy + wh * 0.5);
          const dist = Math.abs(yCenter - (scanH - b.h * 0.5));
          const glow = Math.max(0, 1 - dist / 80);

          const baseCol = darken("#1a2028", 0.1);
          const highlight = "rgb(255, 224, 164)";

          const blend = 0.2 + 0.6 * glow;
          const cCol = mixRgb(baseCol, highlight, blend);

          fill(cCol);
          rect(wx, wy, ww, wh);
        }
      }

      // crisp outline
      stroke_("rgba(0,0,0,0.22)");
      noFill_();
      beginShape_();
      vertex_(x0, yTop);
      vertex_(x1, yTop);
      vertex_(x1 + ox, yTop + oy);
      vertex_(x1 + ox, yBase + oy);
      vertex_(x0 + ox, yBase + oy);
      vertex_(x0, yBase);
      vertex_(x0, yTop);
      endShape_();
      noStroke();
    }

    function mixRgb(aHex, bHex, f) {
      const a = hexToRgb(aHex.replace("rgb(", "").replace(")", "").replace("#", ""));
      const b = hexToRgb(bHex.replace("rgb(", "").replace(")", "").replace("#", ""));
      const mix = (ca, cb) => Math.round(ca + (cb - ca) * f);
      return `rgb(${mix(a.r, b.r)},${mix(a.g, b.g)},${mix(a.b, b.b)})`;
    }

    function hexToRgb(h) {
      if (h.indexOf(",") !== -1) {
        const parts = h.split(",").map(s => parseInt(s.replace(/[^\d]/g, ""), 10));
        return { r: parts[0], g: parts[1], b: parts[2] };
      }
      if (h.length === 6) {
        return {
          r: parseInt(h.substring(0, 2), 16),
          g: parseInt(h.substring(2, 4), 16),
          b: parseInt(h.substring(4, 6), 16),
        };
      }
      return { r: 0, g: 0, b: 0 };
    }
  },
};
