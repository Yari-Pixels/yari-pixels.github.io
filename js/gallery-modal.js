let images = undefined;

document.addEventListener('DOMContentLoaded', function () {

    let currentImageId = undefined;

    let offsetX = 0;
    let offsetY = 0;

    let touchStart = undefined;
    let touchLast = undefined;

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
        if (!touchStart || currentZoom != 1 || modalContainer.style.display === "none")
            return;
        touchScrollEnd(event);
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
        disableScroll();
        currentImageId = this.id;
        modalImage.src = images[currentImageId].src;
        modalImage.alt = images[currentImageId].alt;
        modalImage.title = images[currentImageId].hover;

        let img = new Image();
        img.src = images[currentImageId].src;
        modalImage.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight
        aspectRatioContainer.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight
        modalContainer.style.display = "flex";
    }

    function closeModal() {
        modalContainer.style.display = "none";
        enableScroll();
        resetModalImage();
    }


    function touchScrollStart(e) {
        touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        touchLast = {
            x: 0,
            y: 0
        };
    };

    function touchScroll(e) {
        touchLast.x = touchStart.x - e.touches[0].clientX,
            touchLast.y = touchStart.y - e.touches[0].clientY

        if (Math.abs(touchLast.x) > Math.abs(touchLast.y)) {
            modalImage.style.transform = "translate(" + -touchLast.x * 2 + "px, 0px)";
            modalImage.style.opacity = (110 - Math.abs(touchLast.x)) / 110;
        }
        else {
            modalImage.style.transform = "translate(0px, " + -touchLast.y + "px)";
            modalImage.style.opacity = (250 - Math.abs(touchLast.y)) / 250;
            modalContainer.style.opacity = (250 - Math.abs(touchLast.y)) / 250;
        }
    }

    function touchScrollEnd(e) {
        console.log(touchLast.x);
        if (Math.abs(touchLast.x) > Math.abs(touchLast.y)) {
            if (touchLast.x > 100) {
                nextImageSwipe(1);
                return
            }
            if (touchLast.x < 100) {
                nextImageSwipe(-1);
                return
            }
        }
        if (Math.abs(touchLast.y) > 150) {
            closeModal();
            return;
        }
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

    function nextImageSwipe(direction) {
        modalImage.classList.add("no-transition");
        modalImage.style.transform = "translate(" + direction * 250 + "px, 0px)";
        modalImage.style.opacity = 0;
        modalImage.offsetHeight; //flushing the CSS changes by reading them
        modalImage.classList.remove("no-transition");
        nextImage(direction);
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
        let response = await fetch("./js/images.json");
        images = await response.json();

        for (const [id, image] of Object.entries(images)) {
            createImageElement(id, image)
        }
    };

    function createImageElement(id, image) {
        const img = document.createElement('img');
        img.id = id;
        img.src = image.thumb.src;
        img.alt = image.alt;
        img.style.objectFit = image.thumb.mode;
        img.style.objectPosition = image.thumb.position;
        img.style.backgroundColor = image.thumb.background;
        img.classList.add('grid-item', 'gallery-image');
        img.addEventListener('click', openModal);

        const container = document.getElementById('main-gallery');
        container.prepend(img);
    };
});