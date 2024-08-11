window.addEventListener('load', () => {
    // Custom VH
    let vh = window.innerHeight * 0.01;
    let vw = document.documentElement.clientWidth * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        vw = document.documentElement.clientWidth * 0.01;
        document.documentElement.style.setProperty('--vw', `${vw}px`);
    });
})

// Remove class
function removeClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.remove(className);
    })
}

function addClass(nodes, className) {
    nodes.forEach(node => {
        node.classList.add(className);
    })
}

window.addEventListener('load', () => {
    const swiper = new Swiper('.swiper', {
        // effect: "fade",
        // slideActiveClass: 'start-animation',
        speed: 400,
        // delay: 5000,
        mousewheel: {
            thresholdDelta: 25,
            releaseOnEdges: true
        },
        on: {
            init: function (swiper) {
                swiper.slides[swiper.activeIndex].classList.add('start-animation');
            },
            slideChangeTransitionStart: function (swiper) {
                console.log(123);
                swiper.slides[swiper.previousIndex].classList.add('anim-hide');
            },
            slideChangeTransitionEnd: function (swiper) {
                //removeClass(swiper.slides, 'start-animation')
                swiper.slides.forEach(slide => {
                    slide.classList.remove('start-animation');
                    slide.classList.remove('anim-hide');
                })
                swiper.slides[swiper.activeIndex].classList.add('start-animation');
            },
        },
    });



    // Video play/pause controls
    let videos = document.querySelectorAll('video');
    if (videos.length) {
        const observerCallbackVideo = (entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (video.closest('.video-block')) {
                    if (entry.isIntersecting) {
                        // In viewport
                        video.play();
                        video.closest('.video-block').classList.add('_played');
                    } else {
                        // out viewport
                        video.pause();
                        video.closest('.video-block').classList.remove('_played');
                    }
                }
            });
        };

        const observerVideo = new IntersectionObserver(observerCallbackVideo, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // 50% of the video block should be visible
        });

        videos.forEach(video => {
            observerVideo.observe(video);

            if (video.closest('.video-block')) {
                const playBtn = video.closest('.video-block').querySelector('.play-btn'),
                    pauseBtn = video.closest('.video-block').querySelector('.pause-btn'),
                    muteControls = video.closest('.video-block').querySelector('.mute-controls');

                if (playBtn && pauseBtn && muteControls) {
                    playBtn.addEventListener('click', () => {
                        video.play();
                        video.closest('.video-block').classList.add('_played');
                    })

                    pauseBtn.addEventListener('click', () => {
                        video.pause();
                        video.closest('.video-block').classList.remove('_played');
                    })

                    muteControls.addEventListener('click', () => {
                        if (video.muted) {
                            video.muted = false;
                            video.closest('.video-block').classList.add('_unmute');
                        } else {
                            video.muted = true;
                            video.closest('.video-block').classList.remove('_unmute');
                        }
                    })
                }
            }
        })
    }
})