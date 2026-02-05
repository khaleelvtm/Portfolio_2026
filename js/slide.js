let currentSlide = 0;
const totalSlides = 5;
let isScrolling = false;
const slider = document.getElementById("slider");

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    currentSlide = index;

    slider.style.transform = `translateY(-${currentSlide * 100}vh)`;
}

window.addEventListener(
    "wheel",
    (e) => {
        if (isScrolling) return;

        if (e.deltaY > 0) {
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
                setScrollTimeout();
            }
        } else {
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
                setScrollTimeout();
            }
        }
    },
    { passive: false }
);

function setScrollTimeout() {
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}


const header = document.getElementById("header-placeholder");
const sections = document.querySelectorAll("[data-header]");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const headerTheme = entry.target.getAttribute("data-header");
                header.classList.add(headerTheme);
            } else {
                const headerTheme = entry.target.getAttribute("data-header");
                header.classList.remove(headerTheme);
            }
        });
    },
    {
        threshold: 0.8
    }
);

sections.forEach(section => observer.observe(section));