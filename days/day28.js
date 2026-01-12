export default {
  meta: {
    day: 28,
    prompt: "Its not a bug, its a feature.",
    svg: false,
  },

  setup() {
    noStroke();
    textFont("monospace");
    textSize(10);
  },

  draw({ DX, DY, t, PI }) {
    background_("#0c0d14");
    translate_(DX, DY);

    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    // main "app" card (slightly off center … of course)
    fill("#151721");
    rect(-215, -165, 430, 330, 12);

    // header bar
    fill("#1f2230");
    rect(-215, -165, 430, 32, 12, 12, 0, 0);

    // header dots
    fill("#f26b6b"); circle(-195, -149, 8);
    fill("#e7c86f"); circle(-178, -149, 8);
    fill("#58c676"); circle(-161, -149, 8);

    // title slightly misaligned
    fill("#c6cad8");
    textAlign(LEFT, CENTER);
    text("build: feature-branch / log", -140, -149);

    // subtle "line numbers" column
    fill("#52586a");
    const rows = 17;
    for (let r = 0; r < rows; r++) {
      const y = -130 + r * 16;
      text(String(r + 1).padStart(2, "0"), -196, y + 6);
    }

    // code / log area (where the “bugs” live)
    const xBase = -175;
    const tick = Math.floor(t * 3);

    for (let r = 0; r < rows; r++) {
      const y = -130 + r * 16;

      // stable width per row (so it feels like a layout)
      const wBase = 260 + 60 * hash(r, 99.3);

      // this frame's "bug factor"
      const n = hash(r + 0.13, tick + 0.7);
      const isGlitch = n > 0.78 || r === 4 || r === 11;

      // base color
      let col = [83, 90, 111, 180];

      // on glitch rows, hue is "wrong" and slightly animated
      if (isGlitch) {
        const phase = t * 2 + r;
        const h = 200 + 80 * Math.sin(phase);
        const s = 80;
        const l = 55;
        const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        const hp = ((h % 360) + 360) % 360 / 60;
        const x = c * (1 - Math.abs((hp % 2) - 1));
        let r1=0,g1=0,b1=0;
        if (hp < 1) { r1=c; g1=x; }
        else if (hp < 2){ r1=x; g1=c; }
        else if (hp < 3){ g1=c; b1=x; }
        else if (hp < 4){ g1=x; b1=c; }
        else if (hp < 5){ r1=x; b1=c; }
        else            { r1=c; b1=x; }
        const m = l/100 - c/2;
        col = [
          Math.round((r1+m)*255),
          Math.round((g1+m)*255),
          Math.round((b1+m)*255),
          210
        ];
      }

      // position “bug”: one row is nudged, one is squashed
      let x = xBase;
      let h = 10;

      if (r === 4) x += 7;          // whole row slightly shifted right
      if (r === 11) h = 7;         // cramped line height
      if (r === 9) x -= 4;         // tiny shift left

      // flickery overflow bug: sometimes width overshoots the panel
      let w = wBase;
      if (isGlitch && n > 0.9) w += 40 * Math.sin(t * 5 + r);

      fill(col[0], col[1], col[2], col[3]);
      rect(x, y, w, h, 3);

      // a tiny misaligned “cursor” on one line
      if (r === 6) {
        fill("#f8f8f2");
        const cx = x + wBase * 0.52 + 3 * Math.sin(t * 6);
        rect(cx, y - 1, 2, h + 2);
      }
    }

    // "NOT A BUG" toast that jitters slightly
    const toastY = 140 + 2 * Math.sin(t * 3.5);
    const toastX = 30 + 3 * Math.cos(t * 4.2);
    fill("#151721");
    rect(toastX - 122, toastY - 18, 285, 36, 6);
    fill("#f2d57f");
    rect(toastX - 118, toastY - 14, 28, 28, 4);
    fill("#151721");
    textAlign(CENTER, CENTER);
    text("!", toastX - 104, toastY);

    textAlign(LEFT, CENTER);
    fill("#e4e3e0");
    text("Warning: layout glitch detected", toastX - 82, toastY - 6);
    fill("#8f96aa");
    text("Status: acknowledged → documented → FEATURE", toastX - 82, toastY + 8);

    // outside panel: slightly crooked status bar
    fill("#171923");
    rect(-215, 175, 430, 16);
    fill("#a6acbe");
    textAlign(LEFT, CENTER);
    text("build #042 • tests: 1 failing (ignored)", -205, 183);

    // outer frame (but not quite centered on canvas)
    noFill_();
    stroke_("rgba(255,255,255,0.12)");
    beginShape_();
    vertex_(-236, -222); vertex_(238, -222);
    vertex_(238, 224);   vertex_(-236, 224);
    vertex_(-236, -222);
    endShape_();
  },
};
