export function bindV3GAToP5Instance(p) {
  // --- p5 math
  window.abs = p.abs.bind(p);
  window.atan = p.atan.bind(p);
  window.sqrt = p.sqrt.bind(p);
  window.random = p.random.bind(p);
  window.int = p.int.bind(p);
  window.cos = p.cos.bind(p);
  window.sin = p.sin.bind(p);

  // --- constants
  window.CLOSE = p.CLOSE;

  // --- canvas & drawing primitives
  window.createCanvas = (w, h, renderer) => {
    const c = p.createCanvas(w, h, renderer);
    // keep global width/height in sync for v3ga TRACE()
    window.width = p.width;
    window.height = p.height;
    return c;
  };

  window.background = p.background.bind(p);
  window.stroke = p.stroke.bind(p);
  window.strokeWeight = p.strokeWeight.bind(p);   // ← ADD THIS
  window.noFill = p.noFill.bind(p);
  window.beginShape = p.beginShape.bind(p);
  window.vertex = p.vertex.bind(p);
  window.endShape = p.endShape.bind(p);
  window.translate = p.translate.bind(p);

  // --- save + vector helpers used by svg path
  window.save = p.save.bind(p);
  window.createVector = p.createVector.bind(p);

  if (p.noCanvas) window.noCanvas = p.noCanvas.bind(p);

  // In case something calls TRACE before createCanvas (rare),
  // initialize to current instance values if present:
  window.width = p.width ?? window.width;
  window.height = p.height ?? window.height;
  
}