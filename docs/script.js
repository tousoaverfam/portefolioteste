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

    carousel.addEventListener("mousedown", e => {
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

    carousel.addEventListener("mousemove", e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Velocidade do arrasto
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Suporte para touch devices
    let startTouchX = 0;
    let scrollStart = 0;

    carousel.addEventListener("touchstart", e => {
      startTouchX = e.touches[0].pageX;
      scrollStart = carousel.scrollLeft;
    });

    carousel.addEventListener("touchmove", e => {
      const x = e.touches[0].pageX;
      const walk = (x - startTouchX) * 2;
      carousel.scrollLeft = scrollStart - walk;
    });
  });
});
