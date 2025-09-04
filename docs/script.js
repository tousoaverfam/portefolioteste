document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Função para carrosséis infinitos
  function setupCarousel(carouselId) {
    const container = document.querySelector(`#${carouselId}`);
    const track = container.querySelector(".carousel-track");
    const items = Array.from(track.children);
    const prevBtn = container.querySelector(".prev");
    const nextBtn = container.querySelector(".next");

    let index = 0;

    function updateCarousel() {
      const itemWidth = items[0].offsetWidth + 20; // largura + margin
      track.style.transform = `translateX(${-index * itemWidth}px)`;
    }

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + items.length) % items.length;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % items.length;
      updateCarousel();
    });

    updateCarousel();
  }

  setupCarousel("carousel1");
  setupCarousel("carousel2");
});
