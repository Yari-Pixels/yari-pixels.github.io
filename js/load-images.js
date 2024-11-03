document.addEventListener('DOMContentLoaded', function () {

    loadJSON();

    function createImageElement(image) {
        const img = document.createElement('img');
        console.log("AAAAAAAAAa")
        img.src = "img/blue_tit(big).png";
        img.alt = "OUCH";
        img.classList.add('grid-item', 'gallery-image'); 

        const container = document.getElementById('main-gallery');
        container.appendChild(img);
    }

    function loadJSON() {
        response = fetch("images.json");
        
        data = response.json();

        data.images.forEach(item => createImageElement(item));
    }
});

