document.addEventListener("DOMContentLoaded", () => {

  function initCarousel(id) {
    const container = document.getElementById(id);
    if (!container) return;

    const track = container.querySelector(".carousel-track");
    const prev = container.querySelector(".prev");
    const next = container.querySelector(".next");

    let index = 0;

    function update(){
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    prev?.addEventListener("click", ()=>{
      index = Math.max(0, index - 1);
      update();
    });

    next?.addEventListener("click", ()=>{
      index = Math.min(track.children.length - 1, index + 1);
      update();
    });
  }

  initCarousel("carousel1");
});
