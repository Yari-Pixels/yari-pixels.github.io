document.addEventListener('DOMContentLoaded', function () {

    let currentGallery = undefined;
    let indexOfImage = undefined;

    let offsetX = 0;
    let offsetY = 0;

    let currentZoom = 1;
    const minZoom = 1;
    const maxZoom = 3;
    const stepSize = 0.001;

    const modalContainer = document.getElementById('modal-display');
    const modalImage = document.getElementById('modal-image');

    document.querySelectorAll('.gallery-image').forEach(image => {
        image.addEventListener('click', openModal);
    });

    window.addEventListener('click', function (event) {
        if (event.target === modalContainer)
            closeModal()
    });

    modalImage.addEventListener("wheel", zoomImage);

    window.addEventListener('keydown', function (event) {
        if (modalContainer.style.display === "none")
            return
        if (event.key == 'ArrowRight')
            nextImage(1);
        else if (event.key == 'ArrowLeft')
            nextImage(-1);
        else if (event.key == 'Escape')
            closeModal();
        else
            return;
        event.preventDefault();
    });

    function openModal() {
        modalContainer.style.display = "flex";
        modalImage.src = this.src;
        modalImage.alt = this.alt;

        currentGallery = Array.from(this.parentElement.querySelectorAll(".gallery-image"));
        indexOfImage = currentGallery.indexOf(this);

        disableScroll();
    }

    function closeModal() {
        modalContainer.style.display = "none";
        enableScroll();
        resetModalImage();
    }

    function resetModalImage() {
        currentZoom = 1;
        offsetX = 0;
        offsetY = 0;
        modalImage.style.transform = "scale(1) translate(0px, 0px)";
    }

    function nextImage(direction) {
        indexOfImage += direction;
        indexOfImage = indexOfImage < 0 ? currentGallery.length - 1 : indexOfImage;
        indexOfImage = indexOfImage > currentGallery.length - 1 ? 0 : indexOfImage;

        modalImage.src = currentGallery[indexOfImage].src;
        modalImage.alt = currentGallery[indexOfImage].alt;

        resetModalImage();
    }

    function zoomImage(e) {
        e.preventDefault();
        let deltaZoom = -e.deltaY * currentZoom * stepSize;
        let newZoom = currentZoom + deltaZoom;

        if (newZoom < minZoom) {
            newZoom = minZoom;
            deltaZoom = newZoom - currentZoom
        }
        else if (newZoom > maxZoom) {
            newZoom = maxZoom;
            deltaZoom = newZoom - currentZoom
        }

        if (deltaZoom === 0) {
            e.stopPropagation();
            return;
        }

        let zoomPointX = e.clientX - modalImage.offsetLeft;
        let zoomPointY = e.clientY - modalImage.offsetTop;

        offsetX -= zoomPointX * deltaZoom;
        offsetY -= zoomPointY * deltaZoom;

        if (newZoom == 1) {
            console.log("HELP");
            offsetX = 0;
            offsetY = 0;
        }

        currentZoom = newZoom;

        modalImage.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + currentZoom + ")";

        e.stopPropagation();
    }
});