import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day02(p) {
  let t = 0;
  let host;

  const LAYERS = 60;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;

    resizeToHost();
    p.frameRate(60);
    p.noFill();
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

  function drawLayeredStars() {
    p.background("#02030A");

    const W = p.width;
    const H = p.height;
    const CX = W / 2;
    const CY = H / 2;

    const NP = Math.min(W, H);
    const BASE_R = NP * 0.42;

    const mouseInfluenceX = (p.mouseX - CX) * 0.0005;
    const mouseInfluenceY = (p.mouseY - CY) * 0.0005;

    const K = 5;
    const HOP = 3;

    for (let layer = 0; layer < LAYERS; layer++) {
      const depth = layer / LAYERS;
      const R = BASE_R * (0.3 + depth * 0.8);
      const rotation = t * 0.3 + depth * Math.PI * 2;
      const alpha = 255 * (1 - depth) * 0.25;

      p.stroke(122, 162, 255, alpha);
      p.strokeWeight(1);
      p.beginShape();

      for (let I = 0; I < K; I++) {
        const angle = 2 * I * HOP * Math.PI / K + Math.PI / 2 + rotation;

        const dx = Math.sin(angle * 2 + t) * mouseInfluenceX * 200;
        const dy = Math.cos(angle * 2 + t) * mouseInfluenceY * 200;

        const X = CX + R * Math.cos(angle) + dx;
        const Y = CY + R * Math.sin(angle) + dy;

        p.vertex(X, Y);
      }

      p.endShape(p.CLOSE);
    }
  }

  p.draw = () => {
    t += 0.01;
    drawLayeredStars();
  };

  p.windowResized = () => {
    resizeToHost();
  };
}