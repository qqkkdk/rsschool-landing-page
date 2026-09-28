const sliderWindow = document.querySelector('.slider-window');
const sliderTrack = document.querySelector('.slider-track');
const slides = [...sliderTrack.children];
const indicators = document.querySelectorAll('.slider-indicators span');
let currentSlide = 0;
let touchStartX = 0;
let touchStartY = 0;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;

        slide.setAttribute('aria-hidden', !isActive);
        indicators[slideIndex].classList.toggle('active', isActive);
    });
}

document.querySelector('.slider-prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

document.querySelector('.slider-next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

sliderWindow.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
    }
});

sliderWindow.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

sliderWindow.addEventListener('touchend', (event) => {
    const distanceX = event.changedTouches[0].clientX - touchStartX;
    const distanceY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(distanceX) > 40 && Math.abs(distanceX) > Math.abs(distanceY)) {
        showSlide(currentSlide + (distanceX < 0 ? 1 : -1));
    }
}, { passive: true });

showSlide(0);
