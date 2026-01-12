export default {
  meta: { prompt: "You can only use TAU in your code, no other number allowed.", svg: false },

  setup() {
    noFill_();
    strokeWeight(TAU / TAU);
  },

  draw({ DX, DY, t }) {
    background_("black");
    translate_(DX, DY);

    const pal = ["dimgray", "gray", "lightgray", "white"];
    const zero = TAU - TAU;
    const one = TAU / TAU;

    let K = TAU + TAU;
    for (let k = zero; k < K; k += one) {
      stroke_(pal[Math.floor((k + t) % pal.length)]);
      beginShape_();

      let N = TAU * TAU;
      for (let i = zero; i < N; i += one) {
        let u = i / N;
        let a = (k / K) * TAU + t / TAU;
        let r = DX * u;
        let w = Math.sin(u * TAU + t + k) * (DX / TAU / TAU);
        vertex_((r + w) * Math.cos(a), (r + w) * Math.sin(a));
      }

      endShape_();
    }
  },
};
