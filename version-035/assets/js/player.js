document.addEventListener('DOMContentLoaded', function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-hls-player]'));

    shells.forEach(function (shell) {
        var video = shell.querySelector('video');
        var overlay = shell.querySelector('[data-player-overlay]');
        var status = shell.querySelector('[data-player-status]');

        if (!video) {
            return;
        }

        var source = video.getAttribute('data-source');
        var hls = null;

        var setStatus = function (message) {
            if (status) {
                status.textContent = message;
            }
        };

        if (source) {
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus('播放源已就绪');
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('播放源加载异常，请稍后重试');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                setStatus('播放源已就绪');
            } else {
                video.src = source;
                setStatus('正在尝试使用浏览器播放器');
            }
        }

        var startPlayback = function () {
            if (!video) {
                return;
            }
            video.play().then(function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
                setStatus('正在播放');
            }).catch(function () {
                video.controls = true;
                setStatus('请点击播放器控制栏开始播放');
            });
        };

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
});
