document.addEventListener("DOMContentLoaded", () => {
  // mobile nav toggle
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("show"));
  }

  // helper: parse translateX from transform matrix reliably
  function getTranslateXFromTransform(transform) {
    if (!transform || transform === 'none') return 0;
    const m = transform.match(/matrix3d\((.+)\)/);
    if (m) {
      const values = m[1].split(',').map(v => parseFloat(v));
      return values[12] || 0;
    }
    const m2 = transform.match(/matrix\((.+)\)/);
    if (m2) {
      const values = m2[1].split(',').map(v => parseFloat(v));
      return values[4] || 0;
    }
    return 0;
  }

  // init infinite carousel with clones & snapping
  function initInfiniteCarousel(containerId, visibleCount) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    if (!track || !prevBtn || !nextBtn) return;

    const gap = 20; // must match CSS margin-right on .carousel-item

    // originals
    const originals = Array.from(track.children);
    const totalOriginal = originals.length;
    if (totalOriginal === 0) return;

    // create clones
    const clonesBefore = originals.slice(-visibleCount).map(n => n.cloneNode(true));
    const clonesAfter = originals.slice(0, visibleCount).map(n => n.cloneNode(true));
    clonesBefore.forEach(node => track.insertBefore(node, track.firstChild));
    clonesAfter.forEach(node => track.appendChild(node));

    // updated items array
    let items = Array.from(track.children);
    let itemWidth = 0;
    let currentIndex = visibleCount; // start pointing to first original (after clonesBefore)

    // sizing function
    function setSizes() {
      const containerWidth = container.clientWidth;
      // calculate width so exactly visibleCount items fit inside container (accounting gaps)
      itemWidth = Math.floor((containerWidth - gap * (visibleCount - 1)) / visibleCount);
      items = Array.from(track.children);
      items.forEach((it, idx) => {
        it.style.width = itemWidth + "px";
        it.style.flex = `0 0 ${itemWidth}px`;
        // keep margin-right for gap except last
        it.style.marginRight = (idx === items.length - 1 ? "0px" : gap + "px");
      });

      // position the track to show the correct index without transition
      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
      // force reflow
      void track.offsetWidth;
      track.style.transition = "transform 0.45s ease";
    }

    // initial sizing
    setSizes();

    // handle resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setSizes, 120);
    });

    // move function
    function moveTo(newIndex) {
      currentIndex = newIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
    }

    prevBtn.addEventListener("click", () => moveTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => moveTo(currentIndex + 1));

    // after transition, if we've moved into clones, jump back to the matching original index without animation
    track.addEventListener("transitionend", () => {
      // forward overflow
      if (currentIndex >= visibleCount + totalOriginal) {
        track.style.transition = "none";
        currentIndex = currentIndex - totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }
      // backward overflow
      if (currentIndex < visibleCount) {
        track.style.transition = "none";
        currentIndex = currentIndex + totalOriginal;
        track.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
        void track.offsetWidth;
        track.style.transition = "transform 0.45s ease";
      }
    });

    // DRAG / SWIPE support (mouse & touch)
    let isDown = false;
    let startX = 0;
    let startTranslate = 0;

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      startTranslate = getTranslateXFromTransform(getComputedStyle(track).transform);
      track.style.transition = "none";
      track.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = "";
      // snap
      const currentTranslate = Math.abs(getTranslateXFromTransform(getComputedStyle(track).transform));
      const slot = itemWidth + gap;
      const approxIndex = Math.round(currentTranslate / slot);
      currentIndex = approxIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      track.style.transform = `translateX(${startTranslate + dx}px)`;
    });

    // touch
    let touchStartX = 0;
    let touchStartTranslate = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX;
      touchStartTranslate = getTranslateXFromTransform(getComputedStyle(track).transform);
      track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      const dx = e.touches[0].pageX - touchStartX;
      track.style.transform = `translateX(${touchStartTranslate + dx}px)`;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      const currentTranslate = Math.abs(getTranslateXFromTransform(getComputedStyle(track).transform));
      const slot = itemWidth + gap;
      const approxIndex = Math.round(currentTranslate / slot);
      currentIndex = approxIndex;
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });

    // Return internals if needed
    return { container, track };
  }

  // Initialize carousels (homepage)
  initInfiniteCarousel("carousel1", 3);
  initInfiniteCarousel("carousel2", 4);
});
