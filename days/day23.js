export default {
  meta: { day: 23, prompt: "Transparency. Explore the concept of transparency.", svg: false },

  setup() {
    noStroke();

    this.tiles = [];
    const step = 60;
    for (let y = -240; y < 240; y += step) {
      for (let x = -240; x < 240; x += step) {
        const r = 80 + Math.random() * 120;
        const g = 80 + Math.random() * 120;
        const b = 140 + Math.random() * 100;
        const a = 70 + Math.random() * 90;
        this.tiles.push({ x, y, w: step + 1, h: step + 1, r, g, b, a });
      }
    }

    this.panels = [];
    for (let i = 0; i < 18; i++) {
      const cx = (Math.random() * 2 - 1) * 160;
      const cy = (Math.random() * 2 - 1) * 160;
      const w = 80 + Math.random() * 140;
      const h = 40 + Math.random() * 80;
      const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6;
      const r = 120 + Math.random() * 120;
      const g = 120 + Math.random() * 120;
      const b = 120 + Math.random() * 120;
      const a = 50 + Math.random() * 90;
      const phase = Math.random() * Math.PI * 2;
      const amp = 14 + Math.random() * 10;
      this.panels.push({ cx, cy, w, h, angle, r, g, b, a, phase, amp });
    }
  },

  draw({ DX, DY, t }) {
    background_("#0b0e1a");
    translate_(DX, DY);

    // --- NORMAL WORLD ---
    noStroke();
    for (const tile of this.tiles) {
      fill(tile.r, tile.g, tile.b, tile.a);
      rect(tile.x, tile.y, tile.w, tile.h);
    }

    for (const p of this.panels) {
      const offY = p.amp * Math.sin(t * 0.6 + p.phase);
      push();
      translate(p.cx, p.cy + offY);
      rotate(p.angle);
      fill(p.r, p.g, p.b, p.a);
      rect(-p.w / 2, -p.h / 2, p.w, p.h);
      pop();
    }

    // small “signals”
    noStroke();
    for (let i = 0; i < 10; i++) {
      const x = -200 + (i * 43) % 400;
      const y = 160 + 10 * Math.sin(t * 0.7 + i);
      fill(240, 220, 160, 160);
      rect(x - 6, y - 2, 12, 4);
    }

    // --- VEIL (makes transparency meaningful) ---
    fill(0, 0, 0, 190);
    rect(-240, -240, 480, 480);

    // cursor in centered coords
    let cx = 120 * Math.sin(t * 0.6), cy = 120 * Math.cos(t * 0.5);
    if (typeof mouseX !== "undefined") { cx = mouseX - DX; cy = mouseY - DY; }

    const rLens = 140;

    // --- XRAY WORLD: only inside the lens ---
    const ctx = drawingContext;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rLens, 0, Math.PI * 2);
    ctx.clip();

    // inside lens: redraw a DIFFERENT interpretation
    // use SCREEN to feel like scanning / x-ray overlay
    blendMode(SCREEN);

    // 1) “false color” tiles (swap channels + brighten)
    noStroke();
    for (const tile of this.tiles) {
      fill(tile.b, tile.r, tile.g, 140);
      rect(tile.x, tile.y, tile.w, tile.h);
    }

    // 2) panels become wireframes (transparent structure)
    blendMode(BLEND);
    stroke_("rgba(170,255,245,0.55)");
    noFill_();
    for (const p of this.panels) {
      const offY = p.amp * Math.sin(t * 0.6 + p.phase);
      push();
      translate(p.cx, p.cy + offY);
      rotate(p.angle);
      beginShape_();
      vertex_(-p.w/2, -p.h/2); vertex_( p.w/2, -p.h/2);
      vertex_( p.w/2,  p.h/2); vertex_(-p.w/2,  p.h/2);
      vertex_(-p.w/2, -p.h/2);
      endShape_();
      pop();
    }

    // 3) scanlines (makes it clearly “different”)
    noStroke();
    for (let y = -240; y <= 240; y += 8) {
      const a = 18 + 18 * (0.5 + 0.5 * Math.sin(t * 2 + y * 0.08));
      fill(120, 220, 255, a);
      rect(-240, y, 480, 2);
    }

    // restore normal blending + clip
    blendMode(BLEND);
    ctx.restore();

    // lens ring + crosshair (outside clip)
    stroke_("rgba(255,255,255,0.55)");
    noFill_();
    beginShape_();
    const segs = 90;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      vertex_(cx + rLens * Math.cos(a), cy + rLens * Math.sin(a));
    }
    endShape_();

    beginShape_(); vertex_(cx - 7, cy); vertex_(cx + 7, cy); endShape_();
    beginShape_(); vertex_(cx, cy - 7); vertex_(cx, cy + 7); endShape_();

    // subtle frame
    stroke_("rgba(255,255,255,0.12)");
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235);
    vertex_(235,235); vertex_(-235,235);
    vertex_(-235,-235);
    endShape_();
  },
};
