function disableScroll() {
    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, { passive: false });
}

function enableScroll() {
    window.removeEventListener('wheel', preventDefault, { passive: false });
    window.removeEventListener('touchmove', preventDefault, { passive: false });
    window.removeEventListener('keydown', preventKeyScroll, { passive: false });
}

function preventDefault(e) {
    e.preventDefault();
}

function preventKeyScroll(e) {
    const keys = [
        'ArrowUp', 'ArrowDown',
        'PageUp', 'PageDown',
        'Home', 'End',
        ' '
    ];

    console.log(e.key);

    if (keys.includes(e.key)) {
        e.preventDefault();
    }
}