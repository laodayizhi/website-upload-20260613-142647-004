(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setHeroSlide(hero, index) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return index;
        }
        var next = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === next);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === next);
        });
        hero.setAttribute("data-current", String(next));
        return next;
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var index = 0;
        var slides = hero.querySelectorAll("[data-hero-slide]");
        var nextButton = hero.querySelector("[data-hero-next]");
        var prevButton = hero.querySelector("[data-hero-prev]");
        var dots = hero.querySelectorAll("[data-hero-dot]");
        var timer = null;

        function show(nextIndex) {
            index = setHeroSlide(hero, nextIndex);
        }

        function restart() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 6200);
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        if (prevButton) {
            prevButton.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });
        if (slides.length > 1) {
            restart();
        }
    }

    function initMobileNav() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function cardText(card) {
        return [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-tags") || "",
            card.getAttribute("data-category") || "",
            card.textContent || ""
        ].join(" ").toLowerCase();
    }

    function applyCardFilters(scope) {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var query = "";
        var input = document.querySelector("[data-search]");
        var active = document.querySelector("[data-filter].is-active");
        var filterValue = active ? active.getAttribute("data-filter") : "all";
        if (input) {
            query = input.value.trim().toLowerCase();
        }
        cards.forEach(function (card) {
            var text = cardText(card);
            var category = card.getAttribute("data-category") || "";
            var region = card.getAttribute("data-region") || "";
            var tags = card.getAttribute("data-tags") || "";
            var passesFilter = filterValue === "all" || category === filterValue || region.indexOf(filterValue) !== -1 || tags.indexOf(filterValue) !== -1;
            var passesQuery = !query || text.indexOf(query) !== -1;
            card.hidden = !(passesFilter && passesQuery);
        });
    }

    function initSearchAndFilter() {
        var input = document.querySelector("[data-search]");
        var filters = document.querySelectorAll("[data-filter]");
        if (input) {
            input.addEventListener("input", applyCardFilters);
        }
        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                filters.forEach(function (item) {
                    item.classList.remove("is-active");
                });
                button.classList.add("is-active");
                applyCardFilters();
            });
        });
    }

    ready(function () {
        initHero();
        initMobileNav();
        initSearchAndFilter();
    });
})();
