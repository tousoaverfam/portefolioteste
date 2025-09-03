document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Carrossel arrastável
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      carousel.classList.add("active");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.classList.remove("active");
    });

    carousel.addEventListener("mouseup", () => {
      isDown = false;
      carousel.classList.remove("active");
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Velocidade
      carousel.scrollLeft = scrollLeft - walk;
    });
  });
});
