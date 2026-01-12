export default {
  meta: {
    day: 29,
    prompt: "Genetic evolution and mutation.",
    svg: false,
  },

  setup() {
    noFill_();

    this.POP = 14;            // population size
    this.GEN_LEN = 7;         // genes per organism
    this.GEN_TIME = 6;        // seconds per generation

    // 🔥 more chaos
    this.mutationRate = 0.4;

    this.generation = 0;
    this.birthTime = 0;

    // initial random population
    this.population = [];
    for (let i = 0; i < this.POP; i++) {
      this.population.push(this.randomGenome());
    }
  },

  randomGenome() {
    // genome is just numbers → geometry later
    const genes = [];
    for (let i = 0; i < this.GEN_LEN; i++) {
      genes.push(Math.random());
    }
    return {
      genes,
      fitness: 0,
    };
  },

  mutate(genes) {
    // stronger + more frequent mutations
    return genes.map(g => {
      if (Math.random() < this.mutationRate) {
        let m = g + (Math.random() * 2 - 1) * 0.35; // was 0.2
        return Math.max(0, Math.min(1, m));
      }
      return g;
    });
  },

  reproduce(parentA, parentB) {
    // small chance of a complete random "mutant"
    if (Math.random() < 0.05) {
      return this.randomGenome();
    }

    const genes = parentA.genes.map((g, i) =>
      Math.random() < 0.5 ? g : parentB.genes[i]
    );
    return {
      genes: this.mutate(genes),
      fitness: 0,
    };
  },

  evaluateFitness(org) {
    // still bias toward symmetry + moderate complexity,
    // but keep it soft so weirdos can survive
    const g = org.genes;
    const symmetry = 1 - Math.abs(g[5] - 0.5) * 2;
    const complexity = 1 - Math.abs(g[2] - 0.4) * 2;
    // flatten the curve a bit
    return Math.max(0, symmetry * 0.5 + complexity * 0.3 + 0.2);
  },

  evolve() {
    // score everyone
    for (const o of this.population) {
      o.fitness = this.evaluateFitness(o);
    }

    // sort by fitness
    this.population.sort((a, b) => b.fitness - a.fitness);

    // keep top third
    const survivors = this.population.slice(0, Math.floor(this.POP / 3));

    const next = [...survivors];
    while (next.length < this.POP) {
      const a = survivors[Math.floor(Math.random() * survivors.length)];
      const b = survivors[Math.floor(Math.random() * survivors.length)];
      next.push(this.reproduce(a, b));
    }

    this.population = next;
    this.generation++;
  },

  drawOrganism(org, cx, cy, t) {
    const g = org.genes;
    const arms = Math.floor(6 + g[0] * 18);
    const baseR = 20 + g[1] * 60;
    const wobble = g[2] * 0.4;
    const curl = g[3] * 0.8;
    const thick = 0.6 + g[4] * 1.4;
    const sym = Math.round(2 + g[5] * 6);
    const hue = 140 + g[6] * 180;

    stroke_(`hsla(${hue},65%,55%,0.8)`);
    strokeWeight(thick);

    const TAU = Math.PI * 2;

    for (let i = 0; i < arms; i++) {
      const a0 = (i / arms) * TAU;
      beginShape_();
      for (let j = 0; j <= 18; j++) {
        const u = j / 18;
        const r = baseR * u * (1 + wobble * Math.sin(t * 2 + i + u * 6));
        const a = a0 + curl * u + Math.sin(u * sym) * 0.12;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        vertex_(x, y);
      }
      endShape_();
    }
  },

  draw({ DX, DY, t }) {
    background_("#06070c");
    translate_(DX, DY);

    // evolve every GEN_TIME seconds
    if (t - this.birthTime > this.GEN_TIME) {
      this.birthTime = t;
      this.evolve();
    }

    // layout organisms in a ring
    const R = 120;
    const TAU = Math.PI * 2;

    for (let i = 0; i < this.population.length; i++) {
      const a = (i / this.population.length) * TAU;
      const x = R * Math.cos(a);
      const y = R * Math.sin(a);
      this.drawOrganism(this.population[i], x, y, t);
    }

    // center “genome pool”
    stroke_("rgba(255,255,255,0.2)");
    strokeWeight(1);
    beginShape_();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;
      const r = 18 + 4 * Math.sin(t * 2 + a * 3);
      vertex_(r * Math.cos(a), r * Math.sin(a));
    }
    endShape_();

    // generation label
    noStroke();
    fill("#cfd4e8");
    textAlign(CENTER, CENTER);
    textSize(11);
    text(`Generation ${this.generation}`, 0, 210);

    // frame
    noFill_();
    stroke_("rgba(255,255,255,0.12)");
    beginShape_();
    vertex_(-235,-235); vertex_(235,-235);
    vertex_(235,235);   vertex_(-235,235);
    vertex_(-235,-235);
    endShape_();
  },
};
