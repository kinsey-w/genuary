export default {
  meta: {
    day: 24,
    prompt: "Perfectionist’s nightmare",
    svg: false,
  },

  setup() {
    noStroke();
  },

  draw({ DX, DY, t }) {
    background_("#f5f3ef");
    translate_(DX, DY);

    const cols = 7;
    const rows = 7;
    const cell = 52;

    const gridW = cols * cell;
    const gridH = rows * cell;
    const x0 = -gridW / 2;
    const y0 = -gridH / 2 + 6; // already slightly off vertically 🙂

    // palette for “nice” tiles
    const palette = [
      "#f0d3c3",
      "#e7c9dd",
      "#d0d8f0",
      "#cbe4dd",
      "#f3e4b8",
    ];

    // offending indices
    const shiftedRow = 3;          // this whole row is nudged sideways
    const rotatedCol = 5;          // one tile rotated a bit
    const rotatedRow = 1;
    const wrongColorCol = 2;       // one tile color is “wrong”
    const wrongColorRow = 4;

    // soft drop shadow under grid (slightly off center)
    fill("#d3cbc3");
    rect(x0 + 9, y0 + 12, gridW, gridH, 8);

    // background for grid
    fill("#ffffff");
    rect(x0, y0, gridW, gridH, 10);

    // draw tiles
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = x0 + c * cell;
        const gy = y0 + r * cell;

        // “perfect” tile outline grid
        stroke("#d4cec8");
        noFill_();
        beginShape_();
        vertex_(gx, gy);
        vertex_(gx + cell, gy);
        vertex_(gx + cell, gy + cell);
        vertex_(gx, gy + cell);
        vertex_(gx, gy);
        endShape_();

        // inner colored tile, normally centered
        const cx = gx + cell / 2;
        const cy = gy + cell / 2;

        // base size
        const inner = cell * 0.7;
        let ix = cx;
        let iy = cy;

        // mild infuriation #1: one entire row shifted a bit
        if (r === shiftedRow) {
          ix += 5; // just enough to be wrong
        }

        // decide color
        let col = palette[(r + c) % palette.length];

        // mild infuriation #2: one single tile has the “wrong” color
        if (r === wrongColorRow && c === wrongColorCol) {
          col = "#8c3f45"; // way too strong
        }

        noStroke();
        fill(col);

        // mild infuriation #3: one tile is rotated very slightly
        if (r === rotatedRow && c === rotatedCol) {
          push();
          translate(ix, iy);
          const angle = 0.04 * Math.sin(t * 0.7); // tiny wobble
          rotate(angle);
          rect(-inner / 2, -inner / 2, inner, inner, 4);
          pop();
        } else {
          rect(ix - inner / 2, iy - inner / 2, inner, inner, 4);
        }

        // mild infuriation #4: one vertical “grout” line is thicker
        if (c === 1) {
          stroke("#c0b9b2");
          const xLine = gx + cell;
          beginShape_();
          vertex_(xLine + 1, y0);
          vertex_(xLine + 1, y0 + gridH);
          endShape_();
        }
      }
    }

    // top “alignment” bar, almost centered but not quite
    noStroke();
    fill("#c9c3bc");
    rect(-gridW / 2 + 14, y0 - 28, gridW - 36, 6, 3);

    // progress bar stuck at 99%
    const barY = y0 + gridH + 30;
    const barW = gridW;
    fill("#ded8d1");
    rect(x0, barY, barW, 10, 5);
    fill("#4e7bd4");
    rect(x0, barY, barW * 0.985, 10, 5); // just shy of full…

    // label with slightly off-left alignment
    noStroke();
    fill("#6a625b");
    textAlign(LEFT, CENTER);
    textSize(11);
    text("Aligning tiles… 99%", x0, barY - 12);

    // outer frame (not perfectly centered vs grid)
    stroke("#b9b2aa");
    noFill_();
    beginShape_();
    vertex_(-240, -220);
    vertex_(240, -220);
    vertex_(240, 220);
    vertex_(-240, 220);
    vertex_(-240, -220);
    endShape_();
  },
};
