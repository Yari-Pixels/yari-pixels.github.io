
document.addEventListener('DOMContentLoaded', function () {

    let currentImageId = undefined;

    let offsetX = 0;
    let offsetY = 0;

    let touchStart = undefined;

    let currentZoom = 1;
    const minZoom = 1;
    const maxZoom = 3;
    const stepSize = 0.001;

    const modalContainer = document.getElementById('modal-display');
    const aspectRatioContainer = document.getElementById('aspect-ratio-container');
    const modalImage = document.getElementById('modal-image');

    loadJSON();

    document.querySelectorAll('.gallery-image').forEach(image => {
        image.addEventListener('click', openModal);
    });

    window.addEventListener('click', function (event) {
        if (event.target === modalContainer || event.target === aspectRatioContainer)
            closeModal()
    });

    modalImage.addEventListener("wheel", zoomImage);

    document.getElementById('modal-prev-arrow').addEventListener('click', function () { nextImage(-1) });
    document.getElementById('modal-next-arrow').addEventListener('click', function () { nextImage(1) });

    document.addEventListener('touchstart', function (event) {
        if (currentZoom != 1 || modalContainer.style.display === "none")
            return;
        touchScrollStart(event);
    });

    document.addEventListener('touchmove', function (event) {
        if (!touchStart || currentZoom != 1 || modalContainer.style.display === "none")
            return;
        touchScroll(event);
    });

    document.addEventListener('touchend', function () {
        if (!touchStart || currentZoom != 1)
            return;
        if (modalContainer.style.display === "none")
            enableScroll();
        touchScrollEnd();
    });

    window.addEventListener('keydown', function (event) {
        if (modalContainer.style.display === "none")
            return;
        if (event.key === 'ArrowRight')
            nextImage(1);
        else if (event.key === 'ArrowLeft')
            nextImage(-1);
        else if (event.key === 'Escape')
            closeModal();
        else
            return;
        event.preventDefault();
    });

    function openModal() {
        currentImageId = this.id;
        modalImage.src = images[currentImageId].src;
        modalImage.alt = images[currentImageId].alt;
        modalImage.title = images[currentImageId].hover;

        let img = new Image();
        img.src = images[currentImageId].src;
        modalImage.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight
        aspectRatioContainer.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight
        disableScroll();
        modalContainer.style.display = "flex";
    }

    function closeModal() {
        modalContainer.style.display = "none";
        enableScroll();
        resetModalImage();
    }


    function touchScrollStart(e) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    function touchScroll(e) {
        let xDiff = touchStart.x - e.touches[0].clientX;
        let yDiff = touchStart.y - e.touches[0].clientY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            modalImage.style.transform = "translate(" + -xDiff * 1 + "px, 0px)";
            modalImage.style.opacity = (110 - Math.abs(xDiff)) / 110;
            if (xDiff > 110) {
                touchStart = undefined; //prevents from changing image multiple times in one swipe
                nextImage(1)
            }
            else if (xDiff < -110) {
                touchStart = undefined;
                nextImage(-1)
            }
        }
        else {
            modalImage.style.transform = "translate(0px, " + -yDiff + "px)";
            modalImage.style.opacity = (250 - Math.abs(yDiff)) / 250;
            modalContainer.style.opacity = (250 - Math.abs(yDiff)) / 250;
            if (Math.abs(yDiff) > 250) {
                closeModal();
                disableScroll(); //scroll should only be re-enabled once the touch which closed the image ends
            }
        }
    }

    function touchScrollEnd() {
        modalImage.style.transform = "translate(0px, 0px) scale(1)";
        modalImage.style.opacity = "unset";
        modalContainer.style.opacity = "unset";
    }

    function resetModalImage() {
        currentZoom = 1;
        offsetX = 0;
        offsetY = 0;
        modalImage.style.transform = "translate(0px, 0px) scale(1)";
        modalImage.style.aspectRatio = "unset";
        modalImage.style.opacity = "unset"
        modalContainer.style.opacity = "unset";
    }

    function nextImage(direction) {
        currentImageId -= direction;
        let length = Object.keys(images).length
        currentImageId = currentImageId < 1 ? length : currentImageId;
        currentImageId = currentImageId > length ? 1 : currentImageId;

        resetModalImage();

        modalImage.src = images[currentImageId].src;
        modalImage.alt = images[currentImageId].alt;
        modalImage.title = images[currentImageId].hover;

        let img = new Image();
        img.src = images[currentImageId].src;
        modalImage.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight;
        aspectRatioContainer.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight;
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

        let zoomPointX = e.clientX - (modalImage.offsetLeft + offsetX);
        let zoomPointY = e.clientY - (modalImage.offsetTop + offsetY);

        offsetX -= zoomPointX * deltaZoom / currentZoom;
        offsetY -= zoomPointY * deltaZoom / currentZoom;

        if (newZoom == 1) {
            offsetX = 0;
            offsetY = 0;
        }

        currentZoom = newZoom;

        modalImage.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + currentZoom + ")";
        e.stopPropagation();
    }

    async function loadJSON() {
        let response = await fetch("js/images.json");
        let images = await response.json();

        for (const [id, image] of Object.entries(images)) {
            console.log(id)
            createImageElement(id, image)
        }
        //images.forEach(item => createImageElement(item));
    };

    function createImageElement(id, image) {
        const img = document.createElement('img');
        img.id = id;
        img.src = image.src;
        img.alt = image.alt;
        img.classList.add('grid-item', 'gallery-image');
        img.addEventListener('click', openModal);

        const container = document.getElementById('main-gallery');
        container.prepend(img);
    };
});