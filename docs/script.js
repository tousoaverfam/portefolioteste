document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Carrosséis com setas
  document.querySelectorAll(".carousel-container").forEach(container => {
    const carousel = container.querySelector(".carousel");
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");
    const visible = parseInt(container.getAttribute("data-visible")) || 1;
    const itemWidth = carousel.querySelector(".carousel-item").offsetWidth + 20; // largura + gap

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -itemWidth * visible, behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: itemWidth * visible, behavior: "smooth" });
    });
  });
});
