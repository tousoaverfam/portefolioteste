document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = container.querySelector(".next");

    const gap = 20;

    const originals = Array.from(track.children);
    const totalOriginal = originals.length;

    const clonesBefore = originals.slice(-visibleCount).map(n => n.cloneNode(true));
    const clonesAfter = originals.slice(0, visibleCount).map(n => n.cloneNode(true));

    clonesBefore.forEach(node => track.insertBefore(node, track.firstChild));
    clonesAfter.forEach(node => track.appendChild(node));

    let items = Array.from(track.children);
    let itemWidth = 0;
    let currentIndex = visibleCount;

    function setSizes() {

      const containerWidth = container.clientWidth;

      itemWidth = Math.floor((containerWidth - gap * (visibleCount - 1)) / visibleCount);

      items.forEach((it, idx) => {
        it.style.width = itemWidth + "px";
        it.style.flex = `0 0 ${itemWidth}px`;
        it.style.marginRight = (idx === items.length - 1 ? "0px" : gap + "px");
      });

      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;

      void track.offsetWidth;

      track.style.transition = "transform 0.45s ease";
    }

    setSizes();

    window.addEventListener("resize", () => setTimeout(setSizes, 120));

    function moveTo(newIndex) {
      currentIndex = newIndex;
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }

    prevBtn.addEventListener("click", () => moveTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => moveTo(currentIndex + 1));

    track.addEventListener("transitionend", () => {

      if (currentIndex >= visibleCount + totalOriginal) {

        track.style.transition = "none";
        currentIndex = currentIndex - totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;

        void track.offsetWidth;

        track.style.transition = "transform 0.45s ease";
      }

      if (currentIndex < visibleCount) {

        track.style.transition = "none";
        currentIndex = currentIndex + totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;

        void track.offsetWidth;

        track.style.transition = "transform 0.45s ease";
      }
    });
  }

  initInfiniteCarousel("carousel1", 3);
  initInfiniteCarousel("carousel2", 3);

});
