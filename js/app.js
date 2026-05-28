import { setupScrollFX } from "./scrollfx.js";
import { mountGallery } from "./gallery.js";
import { registerSketches } from "./sketches/register.js";
import { initDayNav } from "./day-nav.js";

mountGallery();
registerSketches();
setupScrollFX();
initDayNav();

