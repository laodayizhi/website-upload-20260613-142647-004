(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-mobile-menu-button]');
        var mobileNav = document.querySelector('[data-mobile-menu]');
        if (menuButton && mobileNav) {
            menuButton.addEventListener('click', function () {
                mobileNav.classList.toggle('is-open');
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var nextButton = document.querySelector('[data-hero-next]');
        var prevButton = document.querySelector('[data-hero-prev]');
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
        }

        if (slides.length) {
            showSlide(0);
            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    showSlide(activeIndex + 1);
                });
            }
            if (prevButton) {
                prevButton.addEventListener('click', function () {
                    showSlide(activeIndex - 1);
                });
            }
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5600);
        }

        var searchInput = document.querySelector('[data-search-input]');
        if (searchInput) {
            var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
            searchInput.addEventListener('input', function () {
                var value = searchInput.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-keywords')).toLowerCase();
                    card.hidden = value && text.indexOf(value) === -1;
                });
            });
        }
    });

    window.startMoviePlayer = function (url) {
        var video = document.getElementById('movie-player');
        var overlay = document.querySelector('[data-play-overlay]');
        var hlsInstance = null;
        var loaded = false;

        if (!video) {
            return;
        }

        function attachSource() {
            if (loaded) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
            loaded = true;
        }

        function play() {
            attachSource();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
