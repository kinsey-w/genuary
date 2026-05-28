import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day25(p) {
  let host;
  let generations = [];
  let nextId = 0;

  const COLS = 7;
  const MAX_GENERATIONS = 6;
  const BIRTH_INTERVAL = 90;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(60);
    p.pixelDensity(1);
    p.textFont("monospace");
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    generations = [];
    nextId = 0;

    const root = [];
    for (let i = 0; i < COLS; i++) {
      root.push(makeRandomIndividual());
    }
    generations.push(root);
    layoutGenerations();
  }

  function makeRandomIndividual() {
    return {
      id: nextId++,
      parentId: null,
      x: 0,
      y: 0,
      r: p.random(18, 32),
      arms: p.floor(p.random(4, 8)),
      rotOffset: p.random(p.TAU),
      rotSpeed: p.random(-0.01, 0.01),
      hue: p.random([
        [120, 180, 255],
        [255, 210, 120],
        [255, 140, 200],
        [160, 255, 220]
      ]),
      mutated: true,
      mutationScore: 1
    };
  }

  function cloneGene(parent) {
    return {
      id: nextId++,
      parentId: parent.id,
      x: 0,
      y: 0,
      r: parent.r,
      arms: parent.arms,
      rotOffset: parent.rotOffset,
      rotSpeed: parent.rotSpeed,
      hue: [...parent.hue],
      mutated: false,
      mutationScore: 0
    };
  }

  function mutate(child) {
    let score = 0;

    if (p.random() < 0.8) {
      child.r += p.random(-6, 6);
      score++;
    }
    if (p.random() < 0.65) {
      child.arms += p.random([-1, 1]);
      score++;
    }
    if (p.random() < 0.75) {
      child.rotSpeed += p.random(-0.008, 0.008);
      score++;
    }
    if (p.random() < 0.85) {
      child.hue[0] = p.constrain(child.hue[0] + p.random(-35, 35), 80, 255);
      child.hue[1] = p.constrain(child.hue[1] + p.random(-35, 35), 80, 255);
      child.hue[2] = p.constrain(child.hue[2] + p.random(-35, 35), 80, 255);
      score++;
    }

    child.arms = Math.max(3, Math.min(10, child.arms));
    child.r = Math.max(10, Math.min(42, child.r));
    child.mutated = score > 0;
    child.mutationScore = score;
  }

  function breedNextGeneration() {
    const prev = generations[generations.length - 1];
    const next = [];

    for (let i = 0; i < prev.length; i++) {
      const parent = prev[i];
      const child = cloneGene(parent);
      mutate(child);
      next.push(child);
    }

    generations.push(next);

    if (generations.length > MAX_GENERATIONS) {
      generations.shift();
    }

    layoutGenerations();
  }

  function layoutGenerations() {
    const left = p.width * 0.1;
    const right = p.width * 0.9;
    const top = p.height * 0.16;
    const bottom = p.height * 0.88;

    const rowCount = generations.length;
    const rowStep = rowCount > 1 ? (bottom - top) / (rowCount - 1) : 0;
    const colStep = COLS > 1 ? (right - left) / (COLS - 1) : 0;

    for (let gy = 0; gy < generations.length; gy++) {
      const row = generations[gy];
      for (let gx = 0; gx < row.length; gx++) {
        const n = row[gx];
        n.x = left + gx * colStep;
        n.y = top + gy * rowStep;
      }
    }
  }

  function starPoints(cx, cy, r, arms, rot) {
    const pts = [];
    const step = Math.floor(arms / 2);
    for (let i = 0; i < arms; i++) {
      const a = rot + i * (p.TAU * step / arms);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawStar(ind) {
    const rot = ind.rotOffset + p.frameCount * ind.rotSpeed;
    const pulse = 1 + 0.06 * Math.sin(p.frameCount * 0.03 + ind.id);
    const pts = starPoints(ind.x, ind.y, ind.r * pulse, ind.arms, rot);

    if (ind.mutated) {
      p.noFill();
      p.stroke(255, 110, 110, 40 + ind.mutationScore * 20);
      p.strokeWeight(1);
      p.circle(ind.x, ind.y, ind.r * 3.2);
    }

    p.noFill();
    p.stroke(ind.hue[0], ind.hue[1], ind.hue[2], 220);
    p.strokeWeight(1.5);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);

    p.noStroke();
    p.fill(255, 240, 190, 180);
    p.circle(ind.x, ind.y, 4);

    p.fill(220, 230, 255, 170);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${ind.arms}a · ${Math.round(ind.r)}`, ind.x, ind.y + ind.r + 10);

    if (ind.mutated) {
      p.fill(255, 120, 120, 190);
      p.text("mut", ind.x, ind.y - ind.r - 16);
    }
  }

  function drawConnections() {
    for (let gy = 1; gy < generations.length; gy++) {
      const row = generations[gy];
      const prev = generations[gy - 1];

      for (let i = 0; i < row.length; i++) {
        const child = row[i];
        const parent = prev.find(n => n.id === child.parentId) || prev[i];
        if (!parent) continue;

        p.stroke(120, 170, 255, 70);
        p.strokeWeight(1);
        p.line(parent.x, parent.y + parent.r + 6, child.x, child.y - child.r - 6);

        if (child.mutated) {
          p.stroke(255, 110, 110, 80);
          p.line(
            parent.x + 4,
            parent.y + parent.r + 10,
            child.x + 4,
            child.y - child.r - 10
          );
        }
      }
    }
  }

  function drawGenerationLabels() {
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);

    for (let gy = 0; gy < generations.length; gy++) {
      const row = generations[gy];
      if (!row.length) continue;
      p.fill(180, 210, 255, 160);
      p.text(`gen ${gy + 1}`, 18, row[0].y);
    }
  }

  p.draw = () => {
    p.background("#060812");

    for (let i = 0; i < 7; i++) {
      p.noFill();
      p.stroke(18, 34, 70, 16);
      p.circle(
        p.width * 0.5,
        p.height * 0.5,
        Math.min(p.width, p.height) * (0.3 + i * 0.14)
      );
    }

    if (p.frameCount % BIRTH_INTERVAL === 0) {
      breedNextGeneration();
    }

    drawConnections();

    for (const row of generations) {
      for (const ind of row) {
        drawStar(ind);
      }
    }

    drawGenerationLabels();

    p.noStroke();
    p.fill(255, 235, 180, 180);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    p.text("inheritance lines + visible mutations", 18, p.height - 18);
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}