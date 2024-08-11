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
    gsap.registerPlugin(ScrollTrigger);


    let sectionsScroller = document.querySelectorAll(".js-section-scroller");

    if (sectionsScroller.length) {
        sectionsScroller.forEach((sectionScroller, index) => {
            let thumbNails = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));

            ScrollTrigger.create({
                trigger: sectionScroller,
                start: `top top`,
                end: () => {
                    let previousSectionScroll = 0;

                    if (sectionsScroller[index - 1]){
                        previousSectionScroll = sectionsScroller[index - 1].querySelector('.section-wrapper').scrollWidth;
                    }

                    return sectionScroller.scrollWidth + previousSectionScroll

                },
                pin: true,
                anticipatePin: 1,
                scrub: 1,
                invalidateOnRefresh: true,
                // markers: true
            })


            thumbNails.forEach((thumb, i) => {
                let scrollTween = gsap.to(thumb, {
                    x: () => {
                        return - (i * window.innerWidth)
                    },
                    ease: "none",
                    scrollTrigger: {
                        trigger: thumb.closest(".section-wrapper"),
                        start: 'top top',
                        scrub: 1,
                        invalidateOnRefresh: true,
                        //end: () => "+=" + (i * window.innerWidth),
                        end: () => {
                            return "+=" + (i * window.innerWidth)
                        },
                    }
                });

                ScrollTrigger.create({
                    trigger: thumb,
                    // containerAnimation: scrollTween,
                    containerAnimation: (i === 0) ? false : scrollTween,
                    start: "start 1px",
                    end: "10% 50%",
                    onEnter: (e) => {
                        const trigger = e.trigger;
                        const screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');
                        if (screens.length > 0){
                            removeClass(screens, 'start-animation');
                            //removeClass(document.querySelectorAll('.floating-image'), 'active-image');
                        }
                        setTimeout(() => {
                            trigger.classList.add('start-animation');
                        }, 200)

                        // if (trigger.querySelector('.floating-image') && trigger.querySelector('.floating-image').dataset.id){
                        //     document.getElementById(trigger.querySelector('.floating-image').dataset.id).classList.add('active-image')
                        // }

                    },
                    onLeave: (e) => {
                        console.log(e.trigger, 'onLeave')
                    },
                    onEnterBack: (e) => {
                        const trigger = e.trigger;
                        const screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');

                        if (trigger.previousElementSibling){
                            if (screens.length > 0){
                                removeClass(screens, 'start-animation');
                            }
                            setTimeout(() => {
                                trigger.previousElementSibling.classList.add('start-animation');
                            }, 200)
                        }
                    },
                    onLeaveBack: (e) => {
                        console.log(e.trigger, 'onLeaveBack')
                    },
                    //markers: true
                })

                // floating image animation
                // if (sectionScroller.querySelector('.floating-image:not(.hidden)')) {
                //     const floatingImages = sectionScroller.querySelectorAll('.floating-image');
                //
                //     floatingImages.forEach(image => {
                //         gsap.to(image, {
                //             x: "-100%",
                //             // xPercent: -100,
                //             // opacity: 0,
                //             ease: "none",
                //             scrollTrigger: {
                //                 trigger: image,
                //                 containerAnimation: scrollTween,
                //                 // start: "-100% 100%",
                //                 // end: "50% 50%",
                //                 scrub: true,
                //                 markers: true
                //             }
                //         });
                //     })
                // }
            });
        })
    }

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
            threshold: 0.9 // 50% of the video block should be visible
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


    // Custom scrollbar
    gsap.to('progress', {
        value: 100,
        ease: 'none',
        scrollTrigger: { scrub: 0.3 }
    });


    // Menu scroll
    const sectionInMenu = document.querySelectorAll('.js-menu-section'),
        menuElements = document.querySelectorAll('nav a');

    if (sectionInMenu.length) {
        const observerCallbackSection = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    removeClass(menuElements, 'active');
                    if (document.querySelector(`nav a[href="#${target.id}"]`)) {
                        document.querySelector(`nav a[href="#${target.id}"]`).classList.add('active');
                    }

                }
            });
        };

        const observerSection = new IntersectionObserver(observerCallbackSection, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 50% of the video block should be visible
        });
        sectionInMenu.forEach(section => {
            observerSection.observe(section);
        })


        menuElements.forEach(menuItem => {
            menuItem.addEventListener('click', (e) => {
                e.preventDefault();
                const id = menuItem.getAttribute('href');
                document.querySelector(id).scrollIntoView({
                    behavior: "smooth",
                });
            })
        })
    }
})