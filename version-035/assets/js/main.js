document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

    if (slides.length > 1) {
        var current = 0;
        var showSlide = function (index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        };

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterInput = document.querySelector('[data-local-filter]');
    var filterGrid = document.querySelector('[data-filter-grid]');

    if (filterInput && filterGrid) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.movie-card'));
        filterInput.addEventListener('input', function () {
            var keyword = filterInput.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = [card.dataset.title, card.dataset.region, card.dataset.year].join(' ').toLowerCase();
                card.style.display = haystack.indexOf(keyword) === -1 ? 'none' : '';
            });
        });
    }
});
