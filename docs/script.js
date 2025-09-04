document.addEventListener("DOMContentLoaded", () => {
  // mobile nav toggle
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("show"));
  }

  // generic function to init an infinite carousel
  function initInfiniteCarousel(containerId, visibleCount) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    if (!track || !prevBtn || !nextBtn) return;

    const gap = 20; // must match CSS margin-right on items
    const originals = Array.from(track.children);
    const totalOriginal = originals.length;
    if (totalOriginal === 0) return;

    // clone last visible -> prepend, first visible -> append
    const clonesBefore = originals.slice(-visibleCount).map(n => n.cloneNode(true));
    const clonesAfter = originals.slice(0, visibleCount).map(n => n.cloneNode(true));
    clonesBefore.forEach(node => track.insertBefore(node, track.firstChild));
    clonesAfter.forEach(node => track.appendChild(node));

    // updated items array
    let items = Array.from(track.children);

    let itemWidth = 0;
    let currentIndex = visibleCount; // start showing first original at index = visibleCount

    // set widths of items based on container width and visibleCount
    function setSizes() {
      const containerWidth = container.clientWidth;
      // compute item width so exactly `visibleCount` items fit inside container including gaps
      itemWidth = Math.floor((containerWidth - gap * (visibleCount - 1)) / visibleCount);
      items = Array.from(track.children);

      items.forEach((it, idx) => {
        it.style.width = itemWidth + "px";
        it.style.marginRight = (idx === items.length - 1 ? "0px" : gap + "px");
      });

      // position track to show the originals starting at currentIndex
      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
      // force reflow
      void track.offsetWidth;
      track.style.transition = "transform 0.45s ease";
    }

    // initial sizing
    setSizes();

    // update on resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setSizes();
      }, 120);
    });

    // move helpers
    function moveToIndex(newIndex) {
      currentIndex = newIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }

    prevBtn.addEventListener("click", () => {
      moveToIndex(currentIndex - 1);
    });

    nextBtn.addEventListener("click", () => {
      moveToIndex(currentIndex + 1);
    });

    // after transition, check bounds and reset without transition if needed
    track.addEventListener("transitionend", () => {
      // when going forward past end: if index >= visible + totalOriginal -> subtract totalOriginal
      if (currentIndex >= visibleCount + totalOriginal) {
        track.style.transition = "none";
        currentIndex = currentIndex - totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        // force reflow then restore transition
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }
      // when going backward past start: if index < visible -> add totalOriginal
      if (currentIndex < visibleCount) {
        track.style.transition = "none";
        currentIndex = currentIndex + totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }
    });

    // Optional: enable drag/swipe for carousels (mouse/touch)
    let isDown = false, startX, startTranslate;
    track.addEventListener("mousedown", (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX;
      // current translate in px
      const transform = window.getComputedStyle(track).transform;
      if (transform && transform !== "none") {
        const matrix = new WebKitCSSMatrix(transform);
        startTranslate = matrix.m41;
      } else {
        startTranslate = 0;
      }
      track.style.transition = "none";
    });
    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = '';
      // snap to nearest item
      const transform = window.getComputedStyle(track).transform;
      const matrix = transform !== "none" ? new WebKitCSSMatrix(transform) : { m41: 0 };
      const currentTranslate = Math.abs(matrix.m41);
      const slot = itemWidth + gap;
      let approxIndex = Math.round(currentTranslate / slot);
      currentIndex = approxIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      const slot = itemWidth + gap;
      track.style.transform = `translateX(${startTranslate + dx}px)`;
    });

    // touch events
    let touchStartX = 0, touchStartTranslate = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX;
      const transform = window.getComputedStyle(track).transform;
      touchStartTranslate = transform !== "none" ? new WebKitCSSMatrix(transform).m41 : 0;
      track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      const dx = e.touches[0].pageX - touchStartX;
      track.style.transform = `translateX(${touchStartTranslate + dx}px)`;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      // snap
      const transform = window.getComputedStyle(track).transform;
      const matrix = transform !== "none" ? new WebKitCSSMatrix(transform) : { m41: 0 };
      const currentTranslate = Math.abs(matrix.m41);
      const slot = itemWidth + gap;
      let approxIndex = Math.round(currentTranslate / slot);
      currentIndex = approxIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });

    // Expose (not necessary) but good to leave
    return {
      container, track
    };
  }

  // Initialize carousels on page (index.html)
  initInfiniteCarousel("carousel1", 3);
  initInfiniteCarousel("carousel2", 4);
});
