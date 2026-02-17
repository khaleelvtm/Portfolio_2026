// Loading Animation
window.addEventListener('load', () => {
    const loadDelay = 1800;

    setTimeout(() => {
        document.body.classList.add('loaded');
        setTimeout(() => {
            const loader = document.getElementById('loader-wrapper');
            if (loader) loader.remove();
        }, 1000);

    }, loadDelay);
});

setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        document.body.classList.add('loaded');
    }
}, 1000);