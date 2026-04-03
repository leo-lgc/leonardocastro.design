const toggle = document.getElementById("language-toggle");
const themeToggle = document.getElementById("theme-toggle");
const translatableNodes = document.querySelectorAll("[data-pt][data-en]");
const mediaTriggers = document.querySelectorAll(".media-trigger");
const mediaModal = document.getElementById("media-modal");
const mediaModalImage = document.getElementById("media-modal-image");
const mediaModalClose = document.getElementById("media-modal-close");
const mediaModalBackdrop = document.getElementById("media-modal-backdrop");
const parallaxRoots = document.querySelectorAll("[data-parallax-root]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentLanguage = "en";
let currentTheme = localStorage.getItem("portfolio-theme") || "light";

function triggerToggleAnimation(element) {
  if (!element) return;
  element.classList.remove("is-animating");
  void element.offsetWidth;
  element.classList.add("is-animating");
}

function updateLanguage(lang) {
  document.documentElement.lang = lang;
  translatableNodes.forEach((node) => {
    node.textContent = node.dataset[lang];
  });
  toggle.setAttribute("aria-pressed", String(lang === "pt"));
  document.body.dataset.language = lang;
}

function updateTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem("portfolio-theme", theme);
}

function setupParallax() {
  if (!parallaxRoots.length || prefersReducedMotion.matches) return;

  parallaxRoots.forEach((root) => {
    const layers = root.querySelectorAll("[data-parallax-layer]");

    const resetLayers = () => {
      layers.forEach((layer) => {
        layer.style.setProperty("--px", "0px");
        layer.style.setProperty("--py", "0px");
        layer.style.setProperty("--pr", "0deg");
      });
    };

    root.addEventListener("pointermove", (event) => {
      const bounds = root.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 10);
        const intensity = layer.classList.contains("hero-tag") ? 0.9 : 0.6;
        const rotate = layer.classList.contains("hero-tag") ? x * depth * 0.05 : x * depth * 0.02;

        layer.style.setProperty("--px", `${x * depth * intensity}px`);
        layer.style.setProperty("--py", `${y * depth * (intensity * 0.9)}px`);
        layer.style.setProperty("--pr", `${rotate}deg`);
      });
    });

    root.addEventListener("pointerleave", resetLayers);
    resetLayers();
  });
}

toggle.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "pt" : "en";
  triggerToggleAnimation(toggle);
  updateLanguage(currentLanguage);
});

themeToggle?.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  triggerToggleAnimation(themeToggle);
  updateTheme(currentTheme);
});

function openMediaModal(src, alt) {
  mediaModalImage.src = src;
  mediaModalImage.alt = alt;
  mediaModal.classList.add("is-open");
  mediaModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMediaModal() {
  mediaModal.classList.remove("is-open");
  mediaModal.setAttribute("aria-hidden", "true");
  mediaModalImage.src = "";
  mediaModalImage.alt = "";
  document.body.style.overflow = "";
}

mediaTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openMediaModal(trigger.dataset.previewSrc, trigger.dataset.previewAlt || "Preview image");
  });
});

mediaModalClose?.addEventListener("click", closeMediaModal);
mediaModalBackdrop?.addEventListener("click", closeMediaModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mediaModal?.classList.contains("is-open")) {
    closeMediaModal();
  }
});

updateLanguage(currentLanguage);
updateTheme(currentTheme);
setupParallax();
