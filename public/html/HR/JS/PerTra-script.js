const stars = document.querySelectorAll('.star');
const ratingDisplay = document.getElementById('rating');
const progressSlider = document.getElementById('progressSlider');
const progressValueDisplay = document.getElementById('progressValue');

let ratingValue = 0;

// Star Rating Functionality
stars.forEach((star) => {
    star.addEventListener('click', () => {
        ratingValue = star.getAttribute('data-value');
        ratingDisplay.textContent = ratingValue;

        stars.forEach((s) => {
            s.classList.remove('selected');
        });
        for (let i = 0; i < ratingValue; i++) {
            stars[i].classList.add('selected');
        }
    });
});

// Slider Functionality
progressSlider.addEventListener('input', () => {
    progressValueDisplay.textContent = progressSlider.value;
});
