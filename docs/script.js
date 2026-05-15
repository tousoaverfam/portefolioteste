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

    const clonesBefore = originals.slice(-visibleCount).map(n => n.cloneNode(true));
    const clonesAfter = originals.slice(0, visibleCount).map(n => n.cloneNode(true));

    clonesBefore.forEach(n => track.insertBefore(n, track.firstChild));
    clonesAfter.forEach(n => track.appendChild(n));

    let items = Array.from(track.children);
    let currentIndex = visibleCount;
    let itemWidth = 0;

    function setSizes() {
      const containerWidth = container.clientWidth;

      itemWidth = Math.floor(
        (containerWidth - gap * (visibleCount - 1)) / visibleCount
      );

      items.forEach((item, index) => {
        item.style.width = itemWidth + "px";
        item.style.flex = `0 0 ${itemWidth}px`;
        item.style.marginRight = index === items.length - 1 ? "0px" : gap + "px";
      });

      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
      void track.offsetWidth;
      track.style.transition = "transform 0.45s ease";
    }

    function moveTo(newIndex) {
      currentIndex = newIndex;
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }

    prevBtn.addEventListener("click", () => moveTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => moveTo(currentIndex + 1));

    track.addEventListener("transitionend", () => {

      if (currentIndex >= visibleCount + totalOriginal) {
        track.style.transition = "none";
        currentIndex -= totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }

      if (currentIndex < visibleCount) {
        track.style.transition = "none";
        currentIndex += totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }
    });

    setSizes();
    window.addEventListener("resize", () => setTimeout(setSizes, 100));
  }

  initInfiniteCarousel("carousel1", 3);
  initInfiniteCarousel("carousel2", 3);

  // MENU MOBILE
  document.querySelectorAll(".hamburger").forEach(btn => {
    btn.addEventListener("click", () => {
      const nav = btn.parentElement.querySelector("nav");
      if (nav) nav.classList.toggle("show");
    });
  });

});
