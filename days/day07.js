export default {
  meta: { day: 7, prompt: "Use software that is not intended to create art or images.", svg: false },

  setup() {
    // p5 text settings (not part of v3ga, but fine to use)
    textFont("monospace");
    textSize(10);
    textAlign(LEFT, TOP);
  },

  draw({ DX, DY, t }) {
    background_("#fbfbfa");
    translate_(DX, DY);

    // ---- spreadsheet geometry ----
    const W = 460, H = 460;
    const x0 = -W/2, y0 = -H/2;
    const cols = 12, rows = 18;
    const cw = W / (cols + 1);   // +1 for row header
    const rh = H / (rows + 1);   // +1 for col header

    // helpers
    const rectPath = (x,y,w,h)=>{beginShape_();vertex_(x,y);vertex_(x+w,y);vertex_(x+w,y+h);vertex_(x,y+h);vertex_(x,y);endShape_();};
    const hash = (a,b)=>{const s=Math.sin(a*12.9898+b*78.233)*43758.5453; return s-Math.floor(s);};
    const colName = i => String.fromCharCode(65 + i); // A..L

    // ---- outer frame ----
    stroke_("rgba(0,0,0,0.18)");
    rectPath(x0, y0, W, H);

    // ---- headers background (primitive rectangles via outlines + fills using p5) ----
    noStroke(); fill(245,245,244); rect(x0, y0, W, rh);           // column header band
    noStroke(); fill(245,245,244); rect(x0, y0, cw, H);           // row header band
    noStroke(); fill(240,240,238); rect(x0, y0, cw, rh);          // corner

    // ---- conditional formatting (subtle) ----
    // (still “spreadsheet”: cells tinted by value)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = x0 + cw*(c+1), y = y0 + rh*(r+1);
        const v = 0.5 + 0.5*Math.sin(t*0.6 + c*0.55 + r*0.25) * Math.cos(t*0.35 + r*0.45);
        const a = 18 + Math.floor(42 * Math.max(0, v));
        // soft green/amber tint, very low alpha
        noStroke();
        fill(60 + 80*v, 110 + 60*v, 80 + 40*v, a);
        rect(x+1, y+1, cw-2, rh-2);
      }
    }

    // ---- grid lines ----
    stroke_("rgba(0,0,0,0.10)");
    for (let c = 0; c <= cols+1; c++) {
      const x = x0 + cw*c;
      beginShape_(); vertex_(x, y0); vertex_(x, y0+H); endShape_();
    }
    for (let r = 0; r <= rows+1; r++) {
      const y = y0 + rh*r;
      beginShape_(); vertex_(x0, y); vertex_(x0+W, y); endShape_();
    }

    // ---- header labels ----
    fill(25); noStroke();
    for (let c = 0; c < cols; c++) {
      const x = x0 + cw*(c+1) + 6, y = y0 + 4;
      text(colName(c), x, y);
    }
    for (let r = 0; r < rows; r++) {
      const x = x0 + 6, y = y0 + rh*(r+1) + 4;
      text(String(r+1), x, y);
    }

    // ---- cell content: numbers + formulas (looks like software output) ----
    fill(20); noStroke();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = x0 + cw*(c+1) + 6;
        const y = y0 + rh*(r+1) + 4;

        // stable-ish seed per cell, with slight “recalc” wobble
        const n = hash(c+1, r+1);
        const wob = 0.12*Math.sin(t*0.9 + (c+r)*0.6);
        const val = Math.floor(1000 * (0.25 + 0.75 * Math.abs(Math.sin((n+wob)*6.28))));

        // some cells show formulas instead of numbers
        if (n > 0.92) {
          const a = colName(Math.max(0, c-1)) + (r+1);
          const b = colName(Math.min(cols-1, c+1)) + (r+1);
          text(`=SUM(${a}:${b})`, x, y);
        } else if (n < 0.08) {
          text(`=#N/A`, x, y);
        } else {
          text(String(val), x, y);
        }
      }
    }

    // ---- a tiny “status bar” like a spreadsheet app ----
    noStroke(); fill(248,248,247); rect(x0, y0+H-18, W, 18);
    stroke_("rgba(0,0,0,0.10)"); beginShape_(); vertex_(x0, y0+H-18); vertex_(x0+W, y0+H-18); endShape_();
    noStroke(); fill(30);
    text(`Ready  |  Calc: ${(0.5+0.5*Math.sin(t*0.8)).toFixed(2)}  |  Sheet1`, x0+8, y0+H-16);
  },
};
