document.addEventListener("DOMContentLoaded", () => {

  function initInfiniteCarousel(id, visibleCount) {

    const container = document.getElementById(id);

    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");

    if (!track || !prevBtn || !nextBtn) return;

    const gap = 20;

    const originals = Array.from(track.children);
    const totalOriginal = originals.length;

    const clonesBefore = originals
      .slice(-visibleCount)
      .map(node => node.cloneNode(true));

    const clonesAfter = originals
      .slice(0, visibleCount)
      .map(node => node.cloneNode(true));

    clonesBefore.forEach(node => {
      track.insertBefore(node, track.firstChild);
    });

    clonesAfter.forEach(node => {
      track.appendChild(node);
    });

    let items = Array.from(track.children);
    let itemWidth = 0;
    let currentIndex = visibleCount;

    function setSizes() {

      const containerWidth = container.clientWidth;

      itemWidth = Math.floor(
        (containerWidth - gap * (visibleCount - 1)) / visibleCount
      );

      items.forEach((item, index) => {

        item.style.width = itemWidth + "px";
        item.style.flex = `0 0 ${itemWidth}px`;

        item.style.marginRight =
          index === items.length - 1 ? "0px" : gap + "px";
      });

      track.style.transition = "none";

      track.style.transform =
        `translateX(-${currentIndex * (itemWidth + gap)}px)`;

      void track.offsetWidth;

      track.style.transition = "transform 0.45s ease";
    }

    setSizes();

    window.addEventListener("resize", () => {
      setTimeout(setSizes, 120);
    });

    function moveTo(newIndex) {

      currentIndex = newIndex;

      track.style.transform =
        `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }

    prevBtn.addEventListener("click", () => {
      moveTo(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      moveTo(currentIndex + 1);
    });

    track.addEventListener("transitionend", () => {

      if (currentIndex >= visibleCount + totalOriginal) {

        track.style.transition = "none";

        currentIndex = currentIndex - totalOriginal;

        track.style.transform =
          `translateX(-${currentIndex * (itemWidth + gap)}px)`;

        void track.offsetWidth;

        track.style.transition = "transform 0.45s ease";
      }

      if (currentIndex < visibleCount) {

        track.style.transition = "none";

        currentIndex = currentIndex + totalOriginal;

        track.style.transform =
          `translateX(-${currentIndex * (itemWidth + gap)}px)`;

        void track.offsetWidth;

        track.style.transition = "transform 0.45s ease";
      }
    });
  }

  initInfiniteCarousel("carousel1", 3);

});
