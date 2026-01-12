export default {
  meta: {
    day: 21,
    prompt: "Unexpected path. Draw a route that changes direction based on one very simple rule.",
    svg: false,
  },

  setup() {
    noFill_();

    this.step = 6;              // pixel size of each grid move
    this.maxRadius = 230;       // bounds for the walk
    this.segmentsPerFrame = 10; // how fast the path grows
    this.maxSegments = 6000;    // trail length (older segments fade out)

    // integer grid coordinates
    this.x = 0;
    this.y = 0;
    // start heading right
    this.dx = 1;
    this.dy = 0;

    this.visited = new Map();   // key "x,y" -> visit count
    this.path = [];             // array of segments {x0,y0,x1,y1,count}

    // colors per visit count
    this.palette = [
      { h: 190, s: 85, l: 60 },  // 1st visit  -> cyan
      { h: 130, s: 80, l: 60 },  // 2nd        -> green
      { h: 50,  s: 90, l: 60 },  // 3rd        -> yellow
      { h: 20,  s: 90, l: 55 },  // 4th        -> orange
      { h: 300, s: 80, l: 60 },  // 5th        -> magenta
      { h: 0,   s: 0,  l: 100 }, // 6+         -> white
    ];
  },

  draw({ DX, DY }) {
    // clear each frame (your runner calls INIT; this ensures our background is what we want)
    background_("#05070b");
    translate_(DX, DY);

    // extend the path a bit this frame
    for (let i = 0; i < this.segmentsPerFrame; i++) {
      this.stepOnce();
    }

    // draw all segments in the rolling trail
    for (const seg of this.path) {
      const idx = Math.min(seg.count - 1, this.palette.length - 1);
      const c = this.palette[idx];
      stroke_(`hsl(${c.h},${c.s}%,${c.l}%)`);
      beginShape_();
      vertex_(seg.x0, seg.y0);
      vertex_(seg.x1, seg.y1);
      endShape_();
    }

    // subtle frame
    stroke_("rgba(255,255,255,0.18)");
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235);
    vertex_(235, 235);  vertex_(-235, 235);
    vertex_(-235,-235);
    endShape_();
  },

  stepOnce() {
    const { step, maxRadius } = this;

    // current grid cell
    const key = this.x + "," + this.y;
    const prev = this.visited.get(key) || 0;
    const count = prev + 1;
    this.visited.set(key, count);

    const px = this.x * step;
    const py = this.y * step;

    // ---- RANDOM RULE for direction ----
    // mostly straight, sometimes left or right
    const r = Math.random();
    if (r < 0.6) {
      // keep direction
    } else if (r < 0.8) {
      // turn left
      const ndx = -this.dy;
      const ndy = this.dx;
      this.dx = ndx; this.dy = ndy;
    } else {
      // turn right
      const ndx = this.dy;
      const ndy = -this.dx;
      this.dx = ndx; this.dy = ndy;
    }

    // candidate next cell
    let nx = this.x + this.dx;
    let ny = this.y + this.dy;
    let qx = nx * step;
    let qy = ny * step;

    // if out of bounds, try turning a few times to stay inside
    let attempts = 0;
    while ((Math.abs(qx) > maxRadius || Math.abs(qy) > maxRadius) && attempts < 4) {
      // random left/right when we hit the wall
      if (Math.random() < 0.5) {
        const ndx = -this.dy;
        const ndy = this.dx;
        this.dx = ndx; this.dy = ndy;
      } else {
        const ndx = this.dy;
        const ndy = -this.dx;
        this.dx = ndx; this.dy = ndy;
      }
      nx = this.x + this.dx;
      ny = this.y + this.dy;
      qx = nx * step;
      qy = ny * step;
      attempts++;
    }

    // if we *still* can't find a good direction, reset to center
    if (Math.abs(qx) > maxRadius || Math.abs(qy) > maxRadius) {
      this.x = 0;
      this.y = 0;
      this.dx = 1;
      this.dy = 0;
      return;
    }

    // store segment
    this.path.push({ x0: px, y0: py, x1: qx, y1: qy, count });
    if (this.path.length > this.maxSegments) this.path.shift();

    // advance
    this.x = nx;
    this.y = ny;
  },
};
