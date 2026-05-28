import { bindV3GAToP5Instance } from "./_shared/v3ga-bridge.js";

export default function day17(p) {
  let host;
  let creature;
  let drift = 0;

  p.setup = () => {
    bindV3GAToP5Instance(p);
    host = p._userNode;
    resize();
    build();
    p.frameRate(60);
    p.pixelDensity(1);
  };

  function resize() {
    const w = host?.clientWidth ?? innerWidth;
    const h = host?.clientHeight ?? innerHeight;
    if (!p.canvas) p.createCanvas(w, h);
    else p.resizeCanvas(w, h);
  }

  function build() {
    creature = {
      x: p.width * 0.5,
      y: p.height * 0.5,
      tx: p.width * 0.5,
      ty: p.height * 0.5,
      r: Math.min(p.width, p.height) * 0.1,
      phase: p.random(Math.PI * 2),
      pulse: 0,
      limbs: []
    };

    const limbCount = 10;
    for (let i = 0; i < limbCount; i++) {
      creature.limbs.push({
        baseA: (i / limbCount) * Math.PI * 2,
        len: p.random(90, 190),
        joints: p.floor(p.random(5, 8)),
        wiggle: p.random(0.01, 0.03),
        phase: p.random(Math.PI * 2),
        bias: p.random(-0.4, 0.4),
        type: p.random(["feeler", "feeler", "fin", "anchor"])
      });
    }
  }

  function starPoints(cx, cy, r, rot = -Math.PI / 2) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (Math.PI * 2 * 3 / 5);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  function drawStar(cx, cy, r, rot, alpha, w = 1.4) {
    const pts = starPoints(cx, cy, r, rot);
    p.noFill();
    p.stroke(120, 220, 255, alpha);
    p.strokeWeight(w);
    p.beginShape();
    for (const pt of pts) p.vertex(pt[0], pt[1]);
    p.endShape(p.CLOSE);
  }

  function updateCreature() {
    drift += 0.003;

    const targetX = p.mouseX || p.width * 0.5;
    const targetY = p.mouseY || p.height * 0.5;

    creature.tx = targetX + Math.cos(drift) * 20;
    creature.ty = targetY + Math.sin(drift * 1.3) * 16;

    creature.x = p.lerp(creature.x, creature.tx, 0.015);
    creature.y = p.lerp(creature.y, creature.ty, 0.015);

    const heartbeat = Math.pow((Math.sin(p.frameCount * 0.045) + 1) * 0.5, 6);
    creature.pulse = heartbeat;
  }

  function drawCore() {
    const breathe = 1 + 0.1 * Math.sin(p.frameCount * 0.035 + creature.phase) + creature.pulse * 0.18;
    const r = creature.r * breathe;

    for (let i = 0; i < 5; i++) {
      p.noFill();
      p.stroke(80, 180, 255, 18 + i * 12);
      p.strokeWeight(1);
      p.circle(creature.x, creature.y, r * (1.8 + i * 0.42));
    }

    drawStar(creature.x, creature.y, r, p.frameCount * 0.012, 235, 2);
    drawStar(creature.x, creature.y, r * 0.62, -p.frameCount * 0.02, 190, 1.2);

    p.noStroke();
    p.fill(255, 235, 170, 120 + creature.pulse * 100);
    p.circle(creature.x, creature.y, r * 0.26);

    p.fill(120, 220, 255, 70);
    p.circle(creature.x, creature.y, r * 0.5);
  }

  function drawLimb(limb) {
    const points = [];
    let x = creature.x;
    let y = creature.y;

    const toMouse = Math.atan2(p.mouseY - creature.y, p.mouseX - creature.x);
    const follow = p.lerpAngle ? p.lerpAngle(limb.baseA, toMouse, 0.08) : limb.baseA + Math.sin(toMouse - limb.baseA) * 0.08;
    const base = follow + limb.bias;

    const seg = limb.len / limb.joints;
    let energy = 0.5 + 0.5 * Math.sin(p.frameCount * limb.wiggle + limb.phase);

    for (let i = 0; i < limb.joints; i++) {
      const t = i / Math.max(1, limb.joints - 1);

      let amp = 0.45 - t * 0.18;
      if (limb.type === "feeler") amp *= 1.4;
      if (limb.type === "anchor") amp *= 0.7;
      if (limb.type === "fin") amp *= 1.1;

      const a =
        base +
        Math.sin(p.frameCount * limb.wiggle + limb.phase + i * 0.8) * amp +
        Math.cos(p.frameCount * limb.wiggle * 0.7 + i * 0.5) * 0.08;

      x += Math.cos(a) * seg;
      y += Math.sin(a) * seg;
      points.push([x, y]);
    }

    p.noFill();
    p.stroke(100, 210, 255, 70 + energy * 50);
    p.strokeWeight(limb.type === "anchor" ? 3 : 2);
    p.beginShape();
    p.curveVertex(creature.x, creature.y);
    p.curveVertex(creature.x, creature.y);
    for (const pt of points) p.curveVertex(pt[0], pt[1]);
    const tip = points[points.length - 1];
    p.curveVertex(tip[0], tip[1]);
    p.endShape();

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const t = i / points.length;
      p.noStroke();
      p.fill(120, 220, 255, 25 + t * 70);
      p.circle(pt[0], pt[1], 3 + t * 7);
    }

    if (limb.type === "feeler") {
      drawStar(
        tip[0],
        tip[1],
        7 + 5 * Math.sin(p.frameCount * 0.04 + limb.phase),
        p.frameCount * 0.03 + limb.phase,
        220,
        1.1
      );
    } else if (limb.type === "fin") {
      p.noStroke();
      p.fill(255, 200, 120, 90);
      p.circle(tip[0], tip[1], 10 + energy * 6);
    } else {
      p.noStroke();
      p.fill(180, 240, 255, 80);
      p.circle(tip[0], tip[1], 6);
    }
  }

  p.draw = () => {
    p.background("#061018");

    updateCreature();

    for (let i = 0; i < 7; i++) {
      p.noFill();
      p.stroke(20, 60, 90, 10);
      p.circle(
        creature.x,
        creature.y,
        Math.min(p.width, p.height) * (0.24 + i * 0.16)
      );
    }

    for (const limb of creature.limbs) drawLimb(limb);
    drawCore();
  };

  p.mousePressed = () => build();

  p.windowResized = () => {
    resize();
    build();
  };
}