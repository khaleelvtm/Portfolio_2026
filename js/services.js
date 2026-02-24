// Load services data from JSON file
async function loadServicesData() {
    try {
        const response = await fetch("data/services.json");
        if (!response.ok) {
            throw new Error("Failed to load services data");
        }
        const hoverData = await response.json();
        return hoverData;
    } catch (error) {
        console.error("Error loading services data:", error);
        return [];
    }
}

function updateContent(data, detailsArea, badge, desc, list) {
    detailsArea.classList.add("fade");

    setTimeout(() => {
        badge.textContent = data.badge;
        desc.textContent = data.text;
        list.innerHTML = data.points.map((p) => `<li>${p}</li>`).join("");
        detailsArea.classList.remove("fade");
    }, 150);
}

// Initialize List with category-based loading
async function initializeServicesList() {
    const hoverData = await loadServicesData();

    if (!hoverData || hoverData.length === 0) {
        return; // No data available
    }

    // Get all sections with section-head
    const sections = document.querySelectorAll(".what.container");

    sections.forEach((section, sectionIndex) => {
        const sectionHead = section.querySelector(".section-head");
        if (!sectionHead) return;

        const categoryName = sectionHead.textContent.trim();
        const sectionNumber = sectionIndex + 1;

        // Find elements for this section
        const navList = document.getElementById(`listItems-${sectionNumber}`);
        const detailsArea = document.getElementById(
            `details-area-${sectionNumber}`,
        );
        const badge = document.getElementById(`badge-${sectionNumber}`);
        const desc = document.getElementById(`desc-${sectionNumber}`);
        const list = document.getElementById(`list-${sectionNumber}`);

        if (!navList || !detailsArea || !badge || !desc || !list) {
            return; // Elements not found for this section
        }

        // Filter services by category
        const categoryServices = hoverData.filter(
            (item) => item.category === categoryName,
        );

        if (categoryServices.length === 0) {
            return; // No services for this category
        }

        // Populate the list
        categoryServices.forEach((item, index) => {
            const div = document.createElement("div");
            div.className = "item";
            div.textContent = item.label;

            // Create a scoped selector for this section's items
            const sectionItemsSelector = `#listItems-${sectionNumber} .item`;

            div.addEventListener("mouseenter", () => {
                // Remove active from all items in this section
                document
                    .querySelectorAll(sectionItemsSelector)
                    .forEach((i) => i.classList.remove("active"));
                div.classList.add("active");
                updateContent(item, detailsArea, badge, desc, list);
            });

            navList.appendChild(div);

            // Set first item as active
            if (index === 0) {
                div.classList.add("active");
                updateContent(item, detailsArea, badge, desc, list);
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    await initializeServicesList();
});
