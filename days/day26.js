export default {
  meta: {
    day: 26,
    prompt: "Symmetry",
    svg: false,
  },

  setup() {
    noFill_();

    const layers = 5;
    const ptsPerLayer = 80;
    this.layers = [];

    for (let k = 0; k < layers; k++) {
      const pts = [];
      for (let i = 0; i < ptsPerLayer; i++) {
        const u = i / (ptsPerLayer - 1);
        // quarter-circle angles: 0..PI/2 (we draw one quadrant, then mirror)
        const a = u * (Math.PI / 2);

        // base radius band per layer
        const baseR = 40 + k * 30;
        const jitter = 18 + k * 4;
        const r0 = baseR + (Math.random() - 0.5) * jitter;

        const phase = Math.random() * Math.PI * 2;
        const freq = 0.4 + Math.random() * 0.6;

        pts.push({ a, r0, phase, freq });
      }

      this.layers.push({
        pts,
        hue: 210 + k * 25,
        thickness: 1.2 + k * 0.4,
      });
    }
  },

  draw({ DX, DY, PI, t }) {
    background_("#0b0b11");
    translate_(DX, DY);

    const TAU = PI * 2;

    // slight global breathing
    const breathe = 1 + 0.03 * Math.sin(t * 0.4);

    for (let li = 0; li < this.layers.length; li++) {
      const layer = this.layers[li];
      const pts = layer.pts;

      // color shifts gently over time, but same for all 4 symmetric copies
      const hue = (layer.hue + 20 * Math.sin(t * 0.2 + li)) % 360;
      const sat = 70;
      const lum = 50 + 6 * Math.sin(t * 0.3 + li);
      stroke_(`hsla(${hue},${sat}%,${lum}%,0.75)`);

      // stroke thickness per layer
      strokeWeight(layer.thickness);

      // compute base path in first quadrant
      const path = [];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const wobble = 1 + 0.14 * Math.sin(t * p.freq + p.phase);
        const r = p.r0 * wobble * breathe;
        const x = r * Math.cos(p.a);
        const y = r * Math.sin(p.a);
        path.push({ x, y });
      }

      // helper to draw mirrored copies
      const drawPath = (sx, sy, flipXY = false) => {
        beginShape_();
        for (let i = 0; i < path.length; i++) {
          let px = path[i].x * sx;
          let py = path[i].y * sy;
          if (flipXY) {
            const tmp = px;
            px = py;
            py = tmp;
          }
          vertex_(px, py);
        }
        endShape_();
      };

      // fourfold symmetry (mirrors across both axes)
      drawPath( 1,  1);  // +x, +y
      drawPath(-1,  1);  // -x, +y
      drawPath( 1, -1);  // +x, -y
      drawPath(-1, -1);  // -x, -y

      // and rotate 90° → effectively 8-fold apparent symmetry
      drawPath( 1,  1, true);
      drawPath(-1,  1, true);
      drawPath( 1, -1, true);
      drawPath(-1, -1, true);
    }

    // central small symmetric “core”
    stroke_("rgba(255,255,255,0.6)");
    strokeWeight(1);
    const coreR = 10 + 4 * Math.sin(t * 0.8);
    beginShape_();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;
      const r = coreR * (1 + 0.15 * Math.sin(4 * a + t));
      vertex_(r * Math.cos(a), r * Math.sin(a));
    }
    endShape_();

    // subtle frame
    stroke_("rgba(255,255,255,0.15)");
    strokeWeight(1);
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235);
    vertex_(235,235);   vertex_(-235,235);
    vertex_(-235,-235);
    endShape_();
  },
};
