(function () {
    window.initVideoPlayer = function (options) {
        var video = document.getElementById(options.videoId || "moviePlayer");
        var overlay = document.getElementById(options.overlayId || "playerOverlay");
        var button = document.getElementById(options.buttonId || "moviePlayButton");
        var streamUrl = options.url;
        var prepared = false;
        var hlsInstance = null;

        if (!video || !streamUrl) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function start() {
            prepare();
            video.setAttribute("controls", "controls");
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }
        if (button) {
            button.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("ended", function () {
            if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
                hlsInstance.stopLoad();
            }
        });
    };
})();
