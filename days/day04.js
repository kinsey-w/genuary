export default {
  meta: { day: 4, prompt: "Black on black.", svg: false },

  setup() { noFill_(); },

  draw({ DX, DY, t }) {
    background_("#303030ff");
    translate_(DX, DY);

    // still “black”, but readable
    const inkA = "rgba(18,18,18,0.22)";
    const inkB = "rgba(28,28,28,0.14)";
    const glint = "rgba(55,55,55,0.10)";

    const hash = (x, y) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    const R = 230, step = 10;

    // layered micro-hatching field
    for (let y = -R; y <= R; y += step) {
      for (let x = -R; x <= R; x += step) {
        const n = hash(x * 0.08 + t * 0.10, y * 0.08 - t * 0.08);
        if (n < 0.72) continue;

        // alternate inks for depth
        stroke_(n < 0.86 ? inkA : inkB);

        const horiz = hash(x * 0.11 + t * 0.05, y * 0.11) < 0.5;
        const len = step * (1 + Math.floor(hash(x * 0.2, y * 0.2 + t * 0.07) * 4));

        beginShape_();
        if (horiz) { vertex_(x - len, y); vertex_(x + len, y); }
        else { vertex_(x, y - len); vertex_(x, y + len); }
        endShape_();

        // occasional moving “glint” (tiny, still dark)
        const g = hash(x * 0.03 + t * 0.35, y * 0.03 - t * 0.33);
        if (g > 0.985) {
          stroke_(glint);
          beginShape_();
          vertex_(x - 2, y - 2); vertex_(x + 2, y + 2);
          endShape_();
        }
      }
    }

    // soft vignette frame (very subtle)
    stroke_("rgba(20,20,20,0.10)");
    beginShape_();
    vertex_(-232, -232); vertex_(232, -232); vertex_(232, 232); vertex_(-232, 232); vertex_(-232, -232);
    endShape_();
  },
};
