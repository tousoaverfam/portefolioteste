// Menu mobile
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("show");
});

// Carrosséis infinitos com clique e arrasto
document.querySelectorAll(".carousel-container").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const items = Array.from(track.children);
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");

  let index = 0;
  const total = items.length;
  const visible =
    carousel.dataset.carousel === "1" ? 3 : 4; // nº visíveis por carrossel

  function updateCarousel() {
    const itemWidth = items[0].offsetWidth + 16; // inclui margem
    track.style.transform = `translateX(-${index * itemWidth}px)`;
  }

  prevButton.addEventListener("click", () => {
    index = (index - 1 + total) % total;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    index = (index + 1) % total;
    updateCarousel();
  });

  // Clique vs arrasto
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add("dragging");
  });

  track.addEventListener("mouseleave", () => (isDragging = false));
  track.addEventListener("mouseup", () => {
    isDragging = false;
    track.classList.remove("dragging");
  });

  track.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  // Tornar itens clicáveis apenas em clique simples
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (carousel.dataset.carousel === "1") {
        window.location.href = "portefolio.html";
      } else {
        window.location.href = "projetos.html";
      }
    });
  });
});

// Timeline
document.querySelectorAll(".timeline-step").forEach((step) => {
  step.addEventListener("click", () => {
    document.querySelectorAll(".timeline-step").forEach((s) =>
      s.classList.remove("active")
    );
    step.classList.add("active");
  });
});
