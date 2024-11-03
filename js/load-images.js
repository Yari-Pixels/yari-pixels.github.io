document.addEventListener('DOMContentLoaded', function () {

    loadJSON();

    function createImageElement(image) {
        const img = document.createElement('img');
        console.log("AAAAAAAAAa")
        img.src = image.scr;
        img.alt = image.alt;
        img.classList.add('grid-item', 'gallery-image');
        img.addEventListener('click', function () { openModal(); });

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

