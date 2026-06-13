document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-search-form]');
    var results = document.querySelector('[data-search-results]');
    var empty = document.querySelector('[data-empty-state]');

    if (!form || !results || !Array.isArray(window.MOVIE_SEARCH_INDEX)) {
        return;
    }

    var keywordInput = form.querySelector('[name="keyword"]');
    var regionSelect = form.querySelector('[name="region"]');
    var yearSelect = form.querySelector('[name="year"]');

    var render = function () {
        var keyword = (keywordInput.value || '').trim().toLowerCase();
        var region = regionSelect.value;
        var year = yearSelect.value;
        var items = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
            var haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.tags,
                movie.oneLine,
                movie.category
            ].join(' ').toLowerCase();

            if (keyword && haystack.indexOf(keyword) === -1) {
                return false;
            }
            if (region && movie.region !== region) {
                return false;
            }
            if (year && String(movie.year) !== year) {
                return false;
            }
            return true;
        }).slice(0, 120);

        results.innerHTML = items.map(function (movie) {
            return [
                '<article class="movie-card">',
                '  <a class="poster-link" href="movies/' + movie.id + '.html" aria-label="观看' + escapeHtml(movie.title) + '">',
                '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
                '    <span class="poster-mask"><span class="play-badge">▶</span></span>',
                '    <span class="quality-badge">HD</span>',
                '  </a>',
                '  <div class="movie-info">',
                '    <h3><a href="movies/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
                '    <p>' + escapeHtml(movie.oneLine) + '</p>',
                '    <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
                '  </div>',
                '</article>'
            ].join('');
        }).join('');

        if (empty) {
            empty.style.display = items.length ? 'none' : 'block';
        }
    };

    var escapeHtml = function (value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    };

    form.addEventListener('input', render);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        render();
    });

    render();
});
