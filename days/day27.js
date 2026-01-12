export default {
  meta: {
    day: 27,
    prompt: "Lifeform. A shape or structure that behaves as if it’s alive or growing.",
    svg: false,
  },

  setup() {
    noFill_();

    const ARMS = 16;      // number of tendrils
    const SEG = 30;       // segments per tendril
    const maxR = 210;

    const TAU = Math.PI * 2;

    // deterministic-ish helper
    const hash = (a, b) => {
      const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    this.arms = [];

    for (let k = 0; k < ARMS; k++) {
      const baseAngle = (k / ARMS) * TAU + hash(k, 1.23) * 0.4;
      const bend = 0.22 * (hash(k, 9.9) - 0.5);   // how much the arm curves
      const wobble = 0.35 + 0.4 * hash(k, 2.7);   // animation amount

      const nodes = [];
      for (let i = 1; i <= SEG; i++) {
        const u = i / SEG;
        const rBase = u * maxR;

        // little radial jitter so it’s not perfectly straight
        const rJit = (hash(k, i * 1.13) - 0.5) * 14;
        const angle = baseAngle + bend * u + (hash(k * 3.1, i) - 0.5) * 0.12;

        nodes.push({
          r: rBase + rJit,
          a: angle,
          phase: hash(k * 7.7, i * 4.4) * Math.PI * 2,
          wobble,
        });
      }

      this.arms.push({
        nodes,
        hue: 160 + 140 * hash(k, 5.5),
        growthDelay: hash(k, 8.8) * 0.8, // stagger growth
      });
    }
  },

  draw({ DX, DY, PI, t }) {
    background_("#050308");
    translate_(DX, DY);

    const TAU = PI * 2;

    // global growth factor (0..1 over ~25 seconds)
    const grow = Math.min(1, t / 25);

    // soft “aura” behind everything
    const auraR = 60 + 20 * Math.sin(t * 0.9);
    stroke_("rgba(120,220,200,0.12)");
    strokeWeight(1);
    beginShape_();
    const stepsAura = 80;
    for (let i = 0; i <= stepsAura; i++) {
      const a = (i / stepsAura) * TAU;
      const r = auraR * (1 + 0.12 * Math.sin(4 * a + t));
      vertex_(r * Math.cos(a), r * Math.sin(a));
    }
    endShape_();

    // draw arms
    for (const arm of this.arms) {
      const { nodes, hue, growthDelay } = arm;

      // effective growth for this arm (delayed)
      const g = Math.max(0, Math.min(1, (grow - growthDelay) / (1 - growthDelay || 1)));
      if (g <= 0) continue;

      const maxIndex = Math.floor(g * nodes.length);
      if (maxIndex <= 0) continue;

      // color for this arm
      const sat = 65;
      const lum = 45 + 10 * Math.sin(t * 0.3 + hue * 0.01);
      stroke_(`hsla(${hue},${sat}%,${lum}%,0.75)`);
      strokeWeight(1.3);

      let prev = { x: 0, y: 0 }; // start from core

      for (let i = 0; i < maxIndex; i++) {
        const n = nodes[i];

        // pulsing radius, like fluid moving through the tendril
        const rPulse = n.r * (1 + 0.06 * Math.sin(t * n.wobble + n.phase));
        const x = rPulse * Math.cos(n.a);
        const y = rPulse * Math.sin(n.a);

        // segment
        beginShape_();
        vertex_(prev.x, prev.y);
        vertex_(x, y);
        endShape_();

        // small node bump (circle-ish via polyline)
        const nodeR = 2 + 2 * Math.sin(t * 1.2 + n.phase);
        if (nodeR > 0.5) {
          beginShape_();
          const nSteps = 10;
          for (let j = 0; j <= nSteps; j++) {
            const aa = (j / nSteps) * TAU;
            vertex_(x + nodeR * Math.cos(aa), y + nodeR * Math.sin(aa));
          }
          endShape_();
        }

        prev = { x, y };
      }
    }

    // central “heart” that beats, feeding the arms
    const heartBeat = 1 + 0.25 * Math.sin(t * 2.0);
    const heartR = 14 * heartBeat;

    stroke_("rgba(255,255,255,0.85)");
    strokeWeight(1.2);
    beginShape_();
    const hSteps = 40;
    for (let i = 0; i <= hSteps; i++) {
      const a = (i / hSteps) * TAU;
      const r = heartR * (1 + 0.15 * Math.sin(3 * a + t * 1.4));
      vertex_(r * Math.cos(a), r * Math.sin(a));
    }
    endShape_();

    // inner core
    stroke_("rgba(120,240,210,0.85)");
    strokeWeight(0.8);
    beginShape_();
    for (let i = 0; i <= hSteps; i++) {
      const a = (i / hSteps) * TAU;
      const r = (heartR * 0.45) * (1 + 0.25 * Math.sin(5 * a - t * 1.1));
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
