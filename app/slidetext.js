const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

showSlide(currentSlide);
setInterval(nextSlide, 4000);

function ajustarSlidesSwiffy() {
    const slider = document.querySelector('.swiffy-slider');
    if (!slider) return;
    if (window.innerWidth >= 768) {
        slider.classList.remove('slider-item-show1');
        slider.classList.add('slider-item-show2');
    } else {
        slider.classList.remove('slider-item-show2');
        slider.classList.add('slider-item-show1');
    }
}

window.addEventListener('resize', ajustarSlidesSwiffy);
window.addEventListener('DOMContentLoaded', ajustarSlidesSwiffy);