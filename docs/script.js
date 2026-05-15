document.addEventListener("DOMContentLoaded", () => {

  function initCarousel(id, visible = 3) {

    const container = document.getElementById(id);
    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prev = container.querySelector(".prev");
    const next = container.querySelector(".next");

    const itemsOriginal = Array.from(track.children);
    const total = itemsOriginal.length;
    const gap = 20;

    const clonesBefore = itemsOriginal.slice(-visible).map(el => el.cloneNode(true));
    const clonesAfter = itemsOriginal.slice(0, visible).map(el => el.cloneNode(true));

    clonesBefore.forEach(el => track.insertBefore(el, track.firstChild));
    clonesAfter.forEach(el => track.appendChild(el));

    let items = Array.from(track.children);
    let index = visible;
    let width = 0;

    function update() {
      const containerWidth = container.clientWidth;

      width = Math.floor((containerWidth - gap * (visible - 1)) / visible);

      items.forEach((item, i) => {
        item.style.flex = `0 0 ${width}px`;
        item.style.marginRight = i === items.length - 1 ? "0px" : gap + "px";
      });

      track.style.transition = "none";
      track.style.transform = `translateX(-${index * (width + gap)}px)`;
      void track.offsetWidth;
      track.style.transition = "transform 0.45s ease";
    }

    function move(dir) {
      index += dir;
      track.style.transform = `translateX(-${index * (width + gap)}px)`;
    }

    prev?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));

    track.addEventListener("transitionend", () => {
      if (index >= total + visible) {
        track.style.transition = "none";
        index -= total;
      }

      if (index < visible) {
        track.style.transition = "none";
        index += total;
      }

      track.style.transform = `translateX(-${index * (width + gap)}px)`;
      void track.offsetWidth;
      track.style.transition = "transform 0.45s ease";
    });

    update();
    window.addEventListener("resize", () => setTimeout(update, 100));
  }

  initCarousel("carousel1", 3);
  initCarousel("carousel2", 3);

});
