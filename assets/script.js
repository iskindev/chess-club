const stages = () => {
  const wrapper = document.getElementById("stepsWrapper");
  const dotsContainer = document.getElementById("dotsContainer");
  const slides = document.querySelectorAll(".slider__step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentSlide = 0;
  const totalSlides = slides.length;

  const createDots = () => {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (i === currentSlide) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  };

  const goToSlide = (index) => {
    if (window.innerWidth >= 1300) return;
    currentSlide = index;
    const offset = currentSlide * 100;
    const gapOffset = currentSlide * 20;
    wrapper.style.transform = `translateX(calc(-${offset}% - ${gapOffset}px))`;
    document.querySelectorAll(".slider-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
  };

  nextBtn.addEventListener("click", () => {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  });
  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  });

  createDots();
  goToSlide(0);

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1300) {
      wrapper.style.transform = "none";
    } else {
      goToSlide(currentSlide);
    }
  });
};
stages();

const participants = () => {
  const track = document.getElementById("carouselTrack");
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const currentCount = document.getElementById("current");
  const totalCount = document.getElementById("total");
  const cloneCount = 3;
  const autoPlayTime = 4000;

  let index = 0;
  let isTransitioning = false;
  const totalOriginalItems = slides.length;
  totalCount.textContent = totalOriginalItems;
  const getItemsPerView = () => (window.innerWidth > 1300 ? 3 : 1);
  let itemsPerView = getItemsPerView();

  for (let i = 0; i < cloneCount; i++) {
    const firstClone = slides[i].cloneNode(true);
    const lastClone = slides[totalOriginalItems - 1 - i].cloneNode(true);
    track.appendChild(firstClone);
    track.prepend(lastClone);
  }
  index = cloneCount;
  const updatePosition = (animation = true) => {
    const slide = track.querySelector(".carousel-slide");
    const slideWidth = slide.offsetWidth;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseInt(trackStyle.columnGap) || 0;
    track.style.transition = animation ? "transform 0.5s ease-in-out" : "none";
    const xOffset = index * (slideWidth + gap);
    track.style.transform = `translateX(${-xOffset}px)`;
    let displayIdx = (index - cloneCount) % totalOriginalItems;
    if (displayIdx < 0) displayIdx = totalOriginalItems + displayIdx;
    const currentVal =
      itemsPerView === 3
        ? Math.min(displayIdx + 3, totalOriginalItems)
        : displayIdx + 1;
    currentCount.textContent = currentVal;
  };

  const jumpWithoutAnimation = () => {
    isTransitioning = false;
    if (index >= totalOriginalItems + cloneCount) {
      index = cloneCount;
      updatePosition(false);
    } else if (index < cloneCount) {
      index = totalOriginalItems + cloneCount - itemsPerView;
      if (index < cloneCount) index = cloneCount;
      updatePosition(false);
    }
  };

  const moveNext = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index += itemsPerView;
    updatePosition();
  };
  const movePrev = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    index -= itemsPerView;
    updatePosition();
  };

  track.addEventListener("transitionend", jumpWithoutAnimation);

  let autoPlay;
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlay = setInterval(moveNext, autoPlayTime);
  };
  const stopAutoPlay = () => clearInterval(autoPlay);
  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  nextBtn.addEventListener("click", () => {
    moveNext();
    resetAutoPlay();
  });
  prevBtn.addEventListener("click", () => {
    movePrev();
    resetAutoPlay();
  });

  track.addEventListener("mouseenter", stopAutoPlay);
  track.addEventListener("mouseleave", startAutoPlay);

  window.addEventListener("resize", () => {
    itemsPerView = getItemsPerView();
    index = cloneCount;
    updatePosition(false);
  });

  updatePosition(false);
  startAutoPlay();
};

participants();
