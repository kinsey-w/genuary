export default {
  meta: { day: 8, prompt: "Draw one million of something.", svg: false },

  setup() {
    background(255);
    noFill();
    strokeWeight(1);

    this.target = 1_000_000;
    this.drawn = 0;
    this.batch = 20_000; // tune: 10k smoother, 50k faster

    this.seed = 1337;
    this.R = 230;

    // palette in RGB
    this.pal = [
      [30, 30, 30],
      [190, 70, 70],
      [70, 130, 175],
      [120, 170, 110],
      [210, 150, 70],
      [150, 90, 180],
    ];
  },

  draw({ DX, DY }) {
    translate(DX, DY);

    // fast RNG
    let s = this.seed;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    const n = Math.min(this.batch, this.target - this.drawn);
    const pal = this.pal;
    const R = this.R;

    for (let i = 0; i < n; i++) {
      const x = (rnd() * 2 - 1) * R;
      const y = (rnd() * 2 - 1) * R;

      // pick per-point color
      const c = pal[(rnd() * pal.length) | 0];
      stroke(c[0], c[1], c[2], 55); // alpha 0..255

      // tiny tick (horizontal/vertical)
      if (rnd() < 0.5) line(x, y, x + 0.8, y);
      else line(x, y, x, y + 0.8);
    }

    this.drawn += n;
    this.seed = s;

    if (this.drawn >= this.target) {
      stroke(0, 25);
      noFill();
      rect(-235, -235, 470, 470);
      if (typeof noLoop === "function") noLoop();
    }
  },
};
