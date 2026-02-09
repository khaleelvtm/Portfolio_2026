let currentSlide = 0;
let isScrolling = false;
const slider = document.getElementById("slider");
const slides = slider ? slider.querySelectorAll('.slide') : [];
const totalSlides = slides.length;
let touchStartY = 0;

// Helper to check if we are on desktop
const isDesktop = () => window.innerWidth >= 992;

function goToSlide(index) {
    // Extra check: if user resized window mid-session
    if (!isDesktop() || !slider || index < 0 || index >= totalSlides) return;

    currentSlide = index;
    slider.style.transform = `translateY(-${currentSlide * 100}vh)`;
}

function setScrollTimeout() {
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

if (slider && totalSlides > 0) {

    // 1. Mouse Wheel Support
    window.addEventListener("wheel", (e) => {
        if (!isDesktop() || isScrolling) return; // Exit if mobile

        if (e.deltaY > 0 && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
            setScrollTimeout();
        } else if (e.deltaY < 0 && currentSlide > 0) {
            goToSlide(currentSlide - 1);
            setScrollTimeout();
        }
    }, { passive: false });

    // 2. Touch Support
    window.addEventListener("touchstart", (e) => {
        if (!isDesktop()) return; // Exit if mobile
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        if (!isDesktop() || isScrolling) return; // Exit if mobile

        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const threshold = 50;

        if (deltaY > threshold && currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
            setScrollTimeout();
        } else if (deltaY < -threshold && currentSlide > 0) {
            goToSlide(currentSlide - 1);
            setScrollTimeout();
        }
    }, { passive: true });
}

// Ensure the slider resets if the window is resized from desktop to mobile
window.addEventListener('resize', () => {
    if (!isDesktop() && slider) {
        slider.style.transform = 'none'; // Reset transform for normal scrolling
    }
});

// --- Header Theme Logic remains the same ---
const header = document.getElementById("header-placeholder");
const sections = document.querySelectorAll("[data-header]");

const observerOptions = {
    threshold: 0.6 // Slightly lower than 0.8 for better reliability
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const theme = entry.target.getAttribute("data-header");

        if (entry.isIntersecting) {
            // Add the current section's theme
            header.classList.add(theme);
        } else {
            // Remove theme when exiting
            header.classList.remove(theme);
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));