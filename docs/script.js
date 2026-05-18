const heroTrack = document.querySelector('.hero-track');
const heroSlides = document.querySelectorAll('.hero-slide');
const prevBtn = document.querySelector('.hero-btn.prev');
const nextBtn = document.querySelector('.hero-btn.next');

let currentSlide = 0;

function updateHeroCarousel() {
  heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

if(nextBtn){
  nextBtn.addEventListener('click', () => {
    currentSlide++;

    if(currentSlide >= heroSlides.length){
      currentSlide = 0;
    }

    updateHeroCarousel();
  });
}

if(prevBtn){
  prevBtn.addEventListener('click', () => {
    currentSlide--;

    if(currentSlide < 0){
      currentSlide = heroSlides.length - 1;
    }

    updateHeroCarousel();
  });
}

setInterval(() => {
}, 5000);
