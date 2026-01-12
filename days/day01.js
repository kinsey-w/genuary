export default {
  meta: {
    day: 1,
    prompt: "Vertical or horizontal lines only",
    svg: true,
  },

  setup() {
    noFill_();
  },

  draw({ DX, DY }) {
    translate_(DX, DY);

    const steps = 260;
    const walkers = 12;
    const palette = ["#ff0077", "#00c8ff", "#ffb300", "#00f060"];

    for (let w = 0; w < walkers; w++) {
      stroke_(palette[w % palette.length]);
      beginShape_();

      let x = random(-180, 180);
      let y = random(-180, 180);
      vertex_(x, y);

      for (let i = 0; i < steps; i++) {
        if (random() < 0.5) x += random([-20, 20]);
        else y += random([-20, 20]);
        vertex_(x, y);
      }
      endShape_();
    }
  },
};
