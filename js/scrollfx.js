export function setupScrollFX() {
  const panels = Array.from(document.querySelectorAll(".panel"));

  function onScroll() {
    const vh = window.innerHeight;

    for (const panel of panels) {
      const r = panel.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const t = (center - vh / 2) / vh; // around -1..1

      const inner = panel.querySelector(".panel-inner");
      if (!inner) continue;

      const rotX = (-t * 6).toFixed(2);
      const rotY = (t * 4).toFixed(2);
      const z = (-Math.abs(t) * 30).toFixed(1);

      inner.style.transform = `translate3d(0,0,${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
}