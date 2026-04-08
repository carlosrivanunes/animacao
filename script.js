const revealItems = document.querySelectorAll("[data-reveal]");
const replayButtons = document.querySelectorAll("[data-replay]");
const parallaxRoots = document.querySelectorAll("[data-parallax-root]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

function restartAnimations(target) {
  if (!target) return;

  const animatedNodes = target.querySelectorAll("*");
  target.classList.add("is-replaying");

  animatedNodes.forEach((node) => {
    node.style.animation = "none";
    node.offsetHeight;
    node.style.animation = "";
  });

  window.setTimeout(() => {
    target.classList.remove("is-replaying");
  }, 100);
}

replayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.replay;
    const target = document.querySelector(`[data-demo="${key}"]`);
    restartAnimations(target);
  });
});

parallaxRoots.forEach((root) => {
  const layers = root.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  root.addEventListener("pointermove", (event) => {
    const rect = root.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    layers.forEach((layer) => {
      const factor = Number(layer.dataset.parallax || 0);
      const moveX = (offsetX / rect.width) * factor;
      const moveY = (offsetY / rect.height) * factor;
      layer.style.setProperty("--move-x", `${moveX}px`);
      layer.style.setProperty("--move-y", `${moveY}px`);
    });
  });

  root.addEventListener("pointerleave", () => {
    layers.forEach((layer) => {
      layer.style.removeProperty("--move-x");
      layer.style.removeProperty("--move-y");
    });
  });
});
