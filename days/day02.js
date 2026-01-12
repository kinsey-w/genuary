export default {
  meta: {
    day: 2,
    prompt: "Layers upon layers upon layers",
    svg: true,
  },

  setup() {
    noFill_();
  },

  draw({ DX, DY, PI }) {
    translate_(DX, DY);

    const layers = 18;
    const steps = 1200;
    const A = 3, B = 4;

    for (let i = 0; i < layers; i++) {
      const hue = (i / layers) * 360;
      stroke_(`hsla(${hue}, 75%, 50%, 0.35)`);
      beginShape_();

      const phx = (i * 0.25) * PI;
      const phy = (i * 0.17) * PI;
      const R = 75 + i * 6;

      for (let tt = 0; tt < steps; tt++) {
        const u = tt * 0.01;
        const x = R * Math.sin(A * u + phx);
        const y = R * Math.sin(B * u + phy);
        vertex_(x, y);
      }
      endShape_();
    }
  },
};
