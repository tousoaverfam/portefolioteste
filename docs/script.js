document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Função para carrosséis infinitos
  function initCarousel(id, visibleItems) {
    const carousel = document.querySelector(`#${id}`);
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const items = Array.from(track.children);
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    let index = 0;
    const totalItems = items.length;

    function updateCarousel() {
      const itemWidth = items[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % totalItems;
      updateCarousel();
    });

    updateCarousel();
  }

  // Inicializar carrosséis
  initCarousel("carousel1", 3);
  initCarousel("carousel2", 4);
});
