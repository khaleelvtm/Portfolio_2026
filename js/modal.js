
// About Modal
function toggleModal(show) {
    const overlay = document.getElementById('modalOverlay');
    if (show) {
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
    } else {
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

function handleOverlayClick(event) {
    if (event.target === document.getElementById('modalOverlay')) {
        toggleModal(false);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleModal(false);
});