const root = document.documentElement;
const revealItems = document.querySelectorAll("[data-reveal]");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

revealItems.forEach((item, index) => {
  item.style.animationDelay = motion.matches ? "0ms" : `${index * 110}ms`;
});

root.classList.add("is-ready");

if (!motion.matches && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    root.style.setProperty("--x", `${event.clientX}px`);
    root.style.setProperty("--y", `${event.clientY}px`);
  });
}
