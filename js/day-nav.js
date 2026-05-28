export function initDayNav() {
  const stage = document.getElementById("scrollStage");
  const toggle = document.getElementById("dayMenuToggle");
  const menu = document.getElementById("dayMenu");
  const list = document.getElementById("dayMenuList");
  const label = document.getElementById("currentDayLabel");
  const prevBtn = document.getElementById("prevDayBtn");
  const nextBtn = document.getElementById("nextDayBtn");

  if (!stage || !toggle || !menu || !list || !label || !prevBtn || !nextBtn) return;

  const panels = Array.from(document.querySelectorAll(".panel[data-day]"));
  if (!panels.length) return;

  let currentIndex = 0;

  function goToIndex(index) {
    const safe = Math.max(0, Math.min(panels.length - 1, index));
    const panel = panels[safe];
    if (!panel) return;

    currentIndex = safe;
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    updateUI();
  }

  function updateUI() {
    const panel = panels[currentIndex];
    if (!panel) return;

    const day = panel.dataset.day;
    const prompt = panel.querySelector(".prompt")?.textContent?.trim() || "";

    label.textContent = `Day ${day}`;
    toggle.title = prompt ? `Day ${day}: ${prompt}` : `Day ${day}`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === panels.length - 1;

    const items = list.querySelectorAll(".day-menu-item");
    items.forEach((item, i) => {
      item.classList.toggle("active", i === currentIndex);
      item.setAttribute("aria-current", i === currentIndex ? "true" : "false");
    });
  }

  function openMenu() {
    menu.classList.remove("hidden");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.add("hidden");
    toggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    menu.classList.contains("hidden") ? openMenu() : closeMenu();
  }

  panels.forEach((panel, i) => {
    const day = panel.dataset.day;
    const prompt = panel.querySelector(".prompt")?.textContent?.trim() || `Day ${day}`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-menu-item";
    btn.setAttribute("role", "menuitem");
    btn.innerHTML = `
      <span class="day-menu-day">Day ${day}</span>
      <span class="day-menu-prompt">${prompt}</span>
    `;
    btn.addEventListener("click", () => {
      goToIndex(i);
      closeMenu();
    });

    list.appendChild(btn);
  });

  toggle.addEventListener("click", toggleMenu);
  prevBtn.addEventListener("click", () => goToIndex(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToIndex(currentIndex + 1));

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  currentIndex = 0;
  updateUI();
}