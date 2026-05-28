import { PROMPTS } from "./prompts.js";

export function mountGallery() {
  const stage = document.getElementById("scrollStage");

  const hero = document.createElement("section");
  hero.className = "panel hero splash";
  hero.id = "top";
  hero.innerHTML = `
  <div class="splash-bg"></div>
  <div class="splash-grid"></div>
  <div class="splash-stars"></div>

  <div class="splash-gate" aria-hidden="true">
    <div class="gate-ring gate-ring-a"></div>
    <div class="gate-ring gate-ring-b"></div>
    <div class="gate-ring gate-ring-c"></div>
    <div class="gate-core">✦</div>
  </div>

  <div class="panel-inner splash-layout">
    <div class="splash-copy">
      <div class="splash-kicker">Genuary-inspired generative atlas</div>

      <h1 class="splash-title">
        <span>31</span>
        <span>Stars</span>
        <span>31</span>
        <span>Mutations</span>
      </h1>

      <p class="splash-lead">
        One recurring star system is transformed through glitches, cities, plants,
        logic, lifeforms, pixel fields, and cosmic accidents.
      </p>

      <div class="splash-actions">
        <a class="btn hero-btn-primary" href="#day01">Enter the atlas</a>
        <button class="btn hero-btn-secondary" type="button" id="jumpRandomDay">
          Random mutation
        </button>
      </div>
    </div>

    <div class="splash-console">
      <div class="console-line">
        <span>system</span>
        <strong>star_engine.init()</strong>
      </div>
      <div class="console-line">
        <span>motif</span>
        <strong>regular star</strong>
      </div>
      <div class="console-line">
        <span>days</span>
        <strong>31 prompts</strong>
      </div>
      <div class="console-line">
        <span>mode</span>
        <strong>scroll atlas</strong>
      </div>

      <div class="prompt-cloud">
        <span>glitch</span>
        <span>plants</span>
        <span>boolean</span>
        <span>city</span>
        <span>lifeform</span>
        <span>pixels</span>
      </div>
    </div>
  </div>

  <a class="splash-scroll" href="#day01" aria-label="Scroll to day 1">
    <span></span>
    Scroll to launch
  </a>
`;
  stage.appendChild(hero);

  const randomBtn = hero.querySelector("#jumpRandomDay");
  randomBtn?.addEventListener("click", () => {
    const n = Math.floor(Math.random() * 31) + 1;
    const day = String(n).padStart(2, "0");
    document
      .getElementById(`day${day}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  for (let d = 1; d <= 31; d++) {
    const day = String(d).padStart(2, "0");
    const section = document.createElement("section");
    section.className = "panel";
    section.id = `day${day}`;
    section.dataset.day = day;

    section.innerHTML = `
      <div class="sketch-full" data-mount="day${day}"></div>

      <div class="panel-inner">
        <div class="meta">
          <div class="day">Day ${day}</div>
          <div class="prompt">${PROMPTS[d] ?? ""}</div>
        </div>
      </div>

      <div class="panel-bg layer-stars"></div>
      <div class="panel-bg layer-nebula"></div>
    `;
    stage.appendChild(section);
  }
}
