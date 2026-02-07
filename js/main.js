// Main JavaScript entry point
async function loadPartial(elementId, partialPath) {
    try {
        const response = await fetch(partialPath);
        if (!response.ok) {
            throw new Error(`Failed to load ${partialPath}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error("Error loading partial:", error);
    }
}

async function loadMetaTags() {
    try {
        const response = await fetch("partials/meta.html");
        if (!response.ok) {
            throw new Error("Failed to load meta tags");
        }
        const html = await response.text();

        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Get all link and meta elements from the partial
        const links = tempDiv.querySelectorAll("link");
        const metas = tempDiv.querySelectorAll("meta");

        // Append to head
        links.forEach((link) => {
            // Check if link doesn't already exist
            const href = link.getAttribute("href");
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                document.head.appendChild(link.cloneNode(true));
            }
        });

        // Note: Meta tags with same name will not be duplicated by browser
        metas.forEach((meta) => {
            const name =
                meta.getAttribute("name") || meta.getAttribute("property");
            if (
                name &&
                !document.querySelector(
                    `meta[name="${name}"], meta[property="${name}"]`
                )
            ) {
                document.head.appendChild(meta.cloneNode(true));
            }
        });
    } catch (error) {
        console.error("Error loading meta tags:", error);
    }
}

function setActiveNavigation() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (
            href === currentPage ||
            (currentPage === "" && href === "index.html")
        ) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
    await loadMetaTags();
    await loadPartial("header-placeholder", "partials/header.html");
    await loadPartial("footer-placeholder", "partials/footer.html");
    await loadPartial("modal-placeholder", "partials/modal.html");

    setActiveNavigation();
});
