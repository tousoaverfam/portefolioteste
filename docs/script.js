// Menu hambúrguer
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('nav').classList.toggle('open');
});

// Carrosséis infinitos com clique vs drag
document.querySelectorAll('.carousel-container').forEach(container => {
  const track = container.querySelector('.carousel-track');
  const items = Array.from(track.children);
  const prevBtn = container.querySelector('.prev');
  const nextBtn = container.querySelector('.next');
  const visible = parseInt(container.dataset.visible);
  const total = items.length;
  const link = container.dataset.link;

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * (100 / visible)}%)`;
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % total;
    updateCarousel();
  });
  prevBtn.addEventListener('click', () => {
    index = (index - 1 + total) % total;
    updateCarousel();
  });

  // Clique vs drag
  items.forEach(item => {
    item.addEventListener('mousedown', e => { isDragging = false; startX = e.clientX; });
    item.addEventListener('mouseup', e => {
      if (Math.abs(e.clientX - startX) < 5 && !isDragging) {
        window.location.href = link;
      }
    });
    item.addEventListener('mousemove', () => { isDragging = true; });
  });
});

// Timeline
document.querySelectorAll('.timeline-point').forEach(point => {
  point.addEventListener('click', () => {
    document.querySelectorAll('.timeline-point').forEach(p => p.classList.remove('active'));
    point.classList.add('active');
  });
});
