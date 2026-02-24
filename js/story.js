let experiences = [],
    currentIndex = 0,
    isAnimating = false;
const expSection = document.getElementById("experience-section"),
    expContent = document.getElementById("exp-content"),
    paginationContainer = document.getElementById("pagination-dots"),
    mainSlider = document.getElementById("slider");

async function loadExperienceData() {
    try {
        const res = await fetch("data/experience.json");
        if (!res.ok) throw new Error("Failed to load");
        return await res.json();
    } catch (err) {
        console.error("Error loading experience data:", err);
        return [];
    }
}

async function initExperienceSection() {
    experiences = await loadExperienceData();
    if (!experiences?.length) return;

    experiences.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = `dot ${i === 0 ? "active" : ""}`;
        dot.onclick = () => navigateToExperience(i);
        paginationContainer.appendChild(dot);
    });
    renderContent(0);
}

function renderContent(idx) {
    if (!experiences?.length) return;
    const d = experiences[idx];
    const sHtml = d.skills
        .map(
            (s) =>
                `<li>${s}</li>`,
        )
        .join("");
    const bHtml = d.bullets
        .map((b) => `<li class="exp-bullet-item">${b}</li>`)
        .join("");

    expContent.innerHTML = `
        <div class="exp-left">
            <p class="exp-date">${d.date}</p>
            <h3 class="exp-company">${d.company}</h3>
            <h6 class="exp-role">${d.role}</h6>
            <p class="exp-location"><i class="hugeicons--location-01"></i>${d.location}</p>
        </div>
        <div class="exp-right">
            <p class="exp-desc">${d.desc1}</p>
            <ul class="exp-bullets">${bHtml}</ul>
            <p class="exp-desc">${d.desc2}</p>
            <div class="skills-section">
                <h4 class="skills-title">Tools & Skills</h4>
                <ul class="skills-list">${sHtml}</ul>
            </div>
        </div>`;
}

function updatePagination(idx) {
    paginationContainer.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === idx);
    });
}

function navigateToExperience(nIdx) {
    if (isAnimating || nIdx === currentIndex) return;
    const dir = nIdx > currentIndex ? 1 : -1;
    isAnimating = true;

    expContent.classList.add(dir > 0 ? "fade-out-up" : "fade-out-down");

    setTimeout(() => {
        currentIndex = nIdx;
        renderContent(nIdx);
        updatePagination(nIdx);
        expContent.classList.remove("fade-out-up", "fade-out-down");
        expContent.classList.add(dir > 0 ? "fade-out-down" : "fade-out-up");
        void expContent.offsetWidth;
        expContent.classList.remove("fade-out-up", "fade-out-down");
        setTimeout(() => (isAnimating = false), 500);
    }, 300);
}

if (expSection) {
    const isDesktop = () => window.innerWidth >= 992;
    expSection.addEventListener(
        "wheel",
        (e) => {
            if (!isDesktop() || !e.target.closest("#experience-section"))
                return;
            const down = e.deltaY > 0;
            if (
                (down && currentIndex < experiences.length - 1) ||
                (!down && currentIndex > 0)
            ) {
                e.preventDefault();
                e.stopPropagation();
                navigateToExperience(
                    down ? currentIndex + 1 : currentIndex - 1,
                );
            }
        },
        { passive: false },
    );
}

initExperienceSection();
