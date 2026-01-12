export default {
  meta: { day: 17, prompt: "What happens if pi=4?", svg: false },

  setup() {
    noFill_();
    textFont("monospace");
    textSize(11);
  },

  draw({ DX, DY, PI, t }) {
    background_("#05070b");
    translate_(DX, DY);

    const R = 150;

    // smooth reference circle
    stroke_("rgba(255,255,255,0.20)");
    circleApprox(0, 0, R, 220);

    // choose resolution based on time (more steps → closer to 4)
    const baseN = 24;
    const extra = Math.floor(60 * (0.5 + 0.5 * Math.sin(t * 0.25)));
    const N = baseN + extra;

    // draw Manhattan circle + get length
    stroke_("#ffcc33");
    const L = manhattanCircle(R, N, PI);

    // effective pi if you believe this jaggy path is the circumference
    const piEff = L / (2 * R);

    // grid for context
    stroke_("rgba(255,255,255,0.06)");
    const step = 20;
    for (let x = -220; x <= 220; x += step) {
      beginShape_(); vertex_(x, -220); vertex_(x, 220); endShape_();
    }
    for (let y = -220; y <= 220; y += step) {
      beginShape_(); vertex_(-220, y); vertex_(220, y); endShape_();
    }

    // info text
    noStroke();
    fill(255);
    const txtY = 200;
    text(
      `N = ${N} steps   L ≈ ${L.toFixed(1)}   π_eff ≈ ${piEff.toFixed(4)}`,
      -220,
      txtY
    );
    text(
      "yellow: Manhattan-length circle  |  white: Euclidean circle",
      -220,
      txtY + 16
    );
  },
};

// --- helpers -------------------------------------------------

function circleApprox(cx, cy, r, n) {
  beginShape_();
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    vertex_(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  endShape_();
}

// circle traced with only horizontal + vertical steps
// returns total Manhattan length of the path
function manhattanCircle(R, N, PI) {
  const d = (2 * PI) / N;
  let x0 = R, y0 = 0;
  let len = 0;

  beginShape_();
  vertex_(x0, y0);

  for (let i = 1; i <= N; i++) {
    const a = i * d;
    const x = R * Math.cos(a);
    const y = R * Math.sin(a);

    // vertical leg
    vertex_(x0, y);
    len += Math.abs(y - y0);

    // horizontal leg
    vertex_(x, y);
    len += Math.abs(x - x0);

    x0 = x; y0 = y;
  }

  endShape_();
  return len;
}
