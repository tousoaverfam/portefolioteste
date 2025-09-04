document.addEventListener("DOMContentLoaded", () => {
  // mobile nav toggle
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => nav.classList.toggle("show"));
  }

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

  function initInfiniteCarousel(containerId, visibleCount, link) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    if (!track || !prevBtn || !nextBtn) return;

    const gap = 20;
    const originals = Array.from(track.children);
    const totalOriginal = originals.length;
    if (totalOriginal === 0) return;

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
      track.style.transition = "transform 0.45s ease";
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

    // drag/swipe support
    let isDown = false, startX = 0, startTranslate = 0;
    track.addEventListener("mousedown", e => {
      isDown = true; startX = e.pageX;
      startTranslate = getTranslateXFromTransform(getComputedStyle(track).transform);
      track.style.transition = "none"; track.style.cursor = "grabbing";
    });
    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false; track.style.cursor = "";
      const currentTranslate = Math.abs(getTranslateXFromTransform(getComputedStyle(track).transform));
      const slot = itemWidth + gap;
      currentIndex = Math.round(currentTranslate / slot);
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });
    window.addEventListener("mousemove", e => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      track.style.transform = `translateX(${startTranslate + dx}px)`;
    });

    // touch
    let touchStartX = 0, touchStartTranslate = 0;
    track.addEventListener("touchstart", e => { touchStartX = e.touches[0].pageX; touchStartTranslate = getTranslateXFromTransform(getComputedStyle(track).transform); track.style.transition = "none"; }, { passive: true });
    track.addEventListener("touchmove", e => { const dx = e.touches[0].pageX - touchStartX; track.style.transform = `translateX(${touchStartTranslate + dx}px)`; }, { passive: true });
    track.addEventListener("touchend", () => {
      const currentTranslate = Math.abs(getTranslateXFromTransform(getComputedStyle(track).transform));
      const slot = itemWidth + gap;
      currentIndex = Math.round(currentTranslate / slot);
      track.style.transition = "transform 0.45s ease";
      track.style.transform = `translateX(-${currentIndex * slot}px)`;
    });

    // Make carousel items clickable
    items.forEach(it => {
      it.addEventListener("click", () => {
        if(link) window.location.href = link;
      });
    });

    return { container, track };
  }

  // Initialize carousels
  initInfiniteCarousel("carousel1", 3, "portefolio.html");
  initInfiniteCarousel("carousel2", 4, "projetos.html");

  // Timeline clicks
  const timelinePoints = document.querySelectorAll(".timeline-point");
  timelinePoints.forEach(pt => {
    pt.addEventListener("click", () => {
      timelinePoints.forEach(p => p.classList.remove("active"));
      pt.classList.add("active");
    });
  });
});
