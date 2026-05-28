let currentInstance = null;
let currentMount = null;
let currentKey = null;

async function loadSketch(key) {
  try {
    const mod = await import(`./${key}.js`);
    return mod.default;
  } catch (err) {
    console.error(`Could not load sketch: ${key}`, err);
    return null;
  }
}

function mountSketch(mountEl, sketchFactory, key) {
  if (currentInstance) {
    currentInstance.remove();
    currentInstance = null;
  }

  mountEl.innerHTML = "";
  currentInstance = new p5((p) => sketchFactory(p), mountEl);
  currentMount = mountEl;
  currentKey = key;
}

export function registerSketches() {
  const mounts = Array.from(document.querySelectorAll("[data-mount]"));

  const io = new IntersectionObserver(async (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;

    const best = visible[0];
    const el = best.target;
    const key = el.dataset.mount;

    if (currentMount === el || currentKey === key) return;

    const sketchFactory = await loadSketch(key);
    if (!sketchFactory) return;

    mountSketch(el, sketchFactory, key);
  }, {
    threshold: [0.25, 0.5, 0.75],
    rootMargin: "0px"
  });

  mounts.forEach((m) => io.observe(m));
}