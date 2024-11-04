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
    const AspectRatioContainer = document.getElementById('aspect-ratio-container');
    const modalImage = document.getElementById('modal-image');

    loadJSON();

    document.querySelectorAll('.gallery-image').forEach(image => {
        image.addEventListener('click', openModal);
    });

    window.addEventListener('click', function (event) {
        if (event.target === modalContainer)
            closeModal()
    });

    modalImage.addEventListener("wheel", zoomImage);

    document.getElementById('modal-prev-arrow').addEventListener('click', function () {nextImage(-1)});
    document.getElementById('modal-next-arrow').addEventListener('click', function () {nextImage(1)});


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
        
        let imageRect = modalImage.getBoundingClientRect();
        
        modalImage.style.width = "100%"
        modalImage.style.aspectRatio = imageRect.width + "/" + imageRect.height;
        AspectRatioContainer.style.aspectRatio = imageRect.width + "/" + imageRect.height;

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
        modalImage.style.aspectRatio = "unset";
        modalImage.style.width = "auto";
        modalImage.style.height = "auto";
    }

    function nextImage(direction) {
        indexOfImage += direction;
        indexOfImage = indexOfImage < 0 ? currentGallery.length - 1 : indexOfImage;
        indexOfImage = indexOfImage > currentGallery.length - 1 ? 0 : indexOfImage;

        resetModalImage();

        modalImage.src = currentGallery[indexOfImage].src;
        modalImage.alt = currentGallery[indexOfImage].alt;

        let imageRect = modalImage.getBoundingClientRect();
        
        modalImage.style.width = "100%"
        modalImage.style.aspectRatio = imageRect.width + "/" + imageRect.height;
        AspectRatioContainer.style.aspectRatio = imageRect.width + "/" + imageRect.height;
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

    function createImageElement(image) {
        const img = document.createElement('img');
        console.log("AAAAAAAAAa")
        img.src = image.scr;
        img.alt = image.alt;
        img.classList.add('grid-item', 'gallery-image');
        img.addEventListener('click', openModal);

        const container = document.getElementById('main-gallery');
        container.appendChild(img);
    };

    async function loadJSON() {
        let response = await fetch("js/images.json");
        console.log(response);
        let data = await response.json();
        console.log(data);

        data.images.forEach(item => createImageElement(item));
    };
});