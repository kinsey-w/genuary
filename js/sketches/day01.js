import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day01(p) {
  let t = 0;
  let host;
  let K = 5;
  let HOP = 3;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;

    resizeToHost();

    // single color rule
    window.BG_COLOR = "#050816";
    window.STROKE_COLOR = "#3A6BFF";

    p.frameRate(60);
  };

  function resizeToHost() {
    const W = host?.clientWidth ?? window.innerWidth;
    const H = host?.clientHeight ?? window.innerHeight;

    if (!p.canvas) {
      p.createCanvas(W, H);
    } else {
      p.resizeCanvas(W, H);
    }

    window.width = p.width;
    window.height = p.height;
  }

  function drawStar() {
    window.OUTPUT = "";

    const W = p.width;
    const H = p.height;
    const NP = Math.min(W, H);
    const CX = W / 2;
    const CY = H / 2;

    const pulse = 1 + Math.sin(t) * 0.05;
    const R = NP * 0.45 * pulse;
    const AD = Math.PI / 2;

    const dx = (p.mouseX - CX) * 0.0008;
    const dy = (p.mouseY - CY) * 0.0008;

    background_(window.BG_COLOR);
    stroke_(window.STROKE_COLOR);
    strokeWeight(1.5 + Math.sin(t * 2) * 0.8);
    noFill_();

    beginShape_();

    for (let I = 0; I < K; I++) {
      const angle = 2 * I * HOP * Math.PI / K + AD;

      const distortX = dx * Math.sin(angle * 2);
      const distortY = dy * Math.cos(angle * 2);

      const X = CX + (R * Math.cos(angle)) + distortX * 200;
      const Y = CY + (R * Math.sin(angle)) + distortY * 200;

      vertex_(X, Y);
    }

    endShape_(CLOSE);
  }

  p.draw = () => {
    t += 0.02;
    drawStar();
  };

  p.windowResized = () => {
    resizeToHost();
  };
}