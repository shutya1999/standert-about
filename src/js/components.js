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
const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

gsap.registerPlugin(ScrollTrigger);
// Init scroll effect for section
let sectionsScroller = document.querySelectorAll(".js-section-scroller");

if (sectionsScroller.length){
    sectionsScroller.forEach(sectionScroller => {
        let screens = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));

        let scrollTween = gsap.to(screens, {
            xPercent: -100 * (screens.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: sectionScroller,
                pin: true,
                scrub: 1,
                // snap: 1 / (screens.length - 1),
                end: () => "+=" + sectionScroller.offsetWidth
            }
        });


        if (sectionScroller.querySelector('.overlay-eclipse')){
            const overlayEclipse = sectionScroller.querySelectorAll('.overlay-eclipse');

            overlayEclipse.forEach(overlay => {
                gsap.to(overlay, {
                    // backgroundColor: "#1e90ff",
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: overlay,
                        containerAnimation: scrollTween,
                        start: "center 100%",
                        end: "center 50%",
                        scrub: true,
                        // markers: true
                    }
                });
            })
        }
    })

}


// Custom scrollbar
const scrollThumb = document.querySelector('.scroll-bar__thumb');
if (scrollThumb){
    let thumbHeight = Math.ceil(window.innerHeight * (window.innerHeight / document.documentElement.scrollHeight));
    scrollThumb.style.setProperty('--thumb-height', thumbHeight + "px")

    gsap.to(scrollThumb, {
        y: function () {
            return window.innerHeight - scrollThumb.getBoundingClientRect().height;
        },
        ease: "none",
        scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: true
        }
    });
}


// Video play/pause controls
let videos = document.querySelectorAll('video');
if (videos.length){
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // 50% of the video block should be visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // In viewport
                video.play();
                video.closest('.video-block').classList.add('_played');
            } else {
                // out viewport
                video.pause();
                video.closest('.video-block').classList.remove('_played');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    videos.forEach(video => {
        observer.observe(video);

        const playBtn = video.closest('.video-block').querySelector('.play-btn'),
            pauseBtn = video.closest('.video-block').querySelector('.pause-btn'),
            muteControls = video.closest('.video-block').querySelector('.mute-controls');

        if (playBtn && pauseBtn && muteControls){
            playBtn.addEventListener('click', () => {
                video.play();
                video.closest('.video-block').classList.add('_played');
            })

            pauseBtn.addEventListener('click', () => {
                video.pause();
                video.closest('.video-block').classList.remove('_played');
            })

            muteControls.addEventListener('click', () => {
                if (video.muted){
                    video.muted = false;
                    video.closest('.video-block').classList.add('_unmute');
                }else {
                    video.muted = true;
                    video.closest('.video-block').classList.remove('_unmute');
                }
            })
        }

    })

}


