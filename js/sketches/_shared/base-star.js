export function drawBaseStar(opts = {}) {
  window.OUTPUT = "";

  const W = opts.W ?? window.innerWidth;
  const H = opts.H ?? window.innerHeight;

  // Use a square "design size" NP for geometry, but draw it centered in W x H
  window.NP = opts.NP ?? Math.floor(Math.min(W, H));
  window.DESSIN = opts.DESSIN ?? 7;

  const PI = Math.PI;

  let K = 5, HOP = 3; // rename to avoid shadowing canvas H
  let CX = W / 2;
  let CY = H / 2;
  let R  = NP * 0.45;
  let AD = PI / 2;

  if (DESSIN == 8) K = 7;
  else if (DESSIN == 9)  { K = 20; HOP = 9; }
  else if (DESSIN == 10) { K = 20; HOP = 7; }
  else if (DESSIN == 11) { K = 51; HOP = 20; }
  else if (DESSIN == 12) { K = 51; HOP = 25; }

  // Fullscreen canvas init (uses v3ga internal init_)
  init_(W, H, opts.initOpts ?? {});

  for (let I = 0; I < K; I++) {
    let X = int(CX + R * cos(2 * I * HOP * PI / K + AD));
    let Y = int(CY + R * sin(2 * I * HOP * PI / K + AD));
    if (I == 0) LPRINT(`M${X},${Y}`);
    else LPRINT(`D${X},${Y}`);
  }

  TRACE(opts.traceOpts ?? {});
}