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
let isPortrait = () => window.matchMedia('screen and (orientation: portrait)').matches;

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

    let sectionsScroller = document.querySelectorAll(".js-section-scroller"),
        TveenSectionInMenu = {};

    if (sectionsScroller.length) {
        sectionsScroller.forEach((sectionScroller, index) => {
            let thumbNails = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));

            ScrollTrigger.create({
                trigger: sectionScroller,
                start: `top top`,
                end: () => {
                    if (isPortrait()) {
                        console.log((sectionScroller.querySelectorAll('.js-screen').length - 1) * window.innerHeight);

                        let previousSectionScroll = 0;

                        if (sectionsScroller[index - 1]) {
                            previousSectionScroll = sectionsScroller[index - 1].querySelectorAll('.js-screen').length * window.innerHeight;
                        }

                        
                        return ((sectionScroller.querySelectorAll('.js-screen').length - 1) * window.innerHeight) + previousSectionScroll; 
                    }
                


                    let previousSectionScroll = 0;

                    if (sectionsScroller[index - 1]) {
                        previousSectionScroll = sectionsScroller[index - 1].querySelector('.section-wrapper').scrollWidth;
                    }
                    
                    return (sectionScroller.scrollWidth + previousSectionScroll) * 0.5

                },
                pin: true,
                anticipatePin: 1,
                scrub: 1,
                invalidateOnRefresh: true,
                // markers: true
            })

            let scrollTweens = [];

            thumbNails.forEach((thumb, i) => {
                let scrollTween = gsap.to(thumb, {
                    x: () => {
                        return - (i * window.innerWidth)
                    },
                    //xPercent: -100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: thumb.closest(".section-wrapper"),
                        start: 'top top',
                        scrub: 1,
                        invalidateOnRefresh: true,
                        //end: () => "+=" + (i * window.innerWidth),
                        end: () => {
                            if (isPortrait()) {
                                return "+=" + ((i * (window.innerHeight)))    
                            }
                            return "+=" + ((i * (window.innerWidth * 0.5)))
                        },
                    }
                });
                scrollTweens.push(scrollTween);

                ScrollTrigger.create({
                    trigger: thumb,
                    // containerAnimation: scrollTween,
                    containerAnimation: (i === 0) ? false : scrollTween,
                    start: "start 1px",
                    end: "10% 50%",
                    onEnter: (e) => {
                        const trigger = e.trigger;
                        const screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');
                        if (screens.length > 0) {
                            removeClass(screens, 'start-animation');
                            //removeClass(document.querySelectorAll('.floating-image'), 'active-image');
                        }
                        setTimeout(() => {
                            trigger.classList.add('start-animation');
                        }, 200)
                        //console.log(e.trigger, 'onLeave')

                        if (screens[i - 2] && screens[i - 2].querySelector('.floating-image')) {
                            screens[i - 2].querySelector('.floating-image').classList.add('anim-hide')
                        }

                    },
                    onLeave: (e) => {
                        //console.log(e.trigger, 'onLeave')
                    },
                    onEnterBack: (e) => {
                        const trigger = e.trigger;
                        const screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');

                        if (trigger.previousElementSibling) {
                            if (screens.length > 0) {
                                removeClass(screens, 'start-animation');
                            }
                            setTimeout(() => {
                                trigger.previousElementSibling.classList.add('start-animation');
                            }, 200)
                        }

                        // console.log(e.trigger, 'onEnterBack')

                        if (screens[i - 2] && screens[i - 2].querySelector('.floating-image')) {
                            screens[i - 2].querySelector('.floating-image').classList.remove('anim-hide')
                        }
                    },
                    onLeaveBack: (e) => {
                        //console.log(e.trigger, 'onLeaveBack')
                    },
                    //markers: true
                })


                if (thumb.id) {

                    if (document.querySelector(`.navigation-block [href="#${thumb.id}"]`)) {
                        TveenSectionInMenu[thumb.id] = scrollTween;
                    }
                }

            });




            thumbNails.forEach((thumb, i) => {
                if (thumb.querySelector('._js-image_clippath img')) {
                    const imagesClipPath = thumb.querySelectorAll('._js-image_clippath img');
                    const nextScreen = thumb.nextElementSibling;

                    if (nextScreen && imagesClipPath.length > 0) {

                        imagesClipPath.forEach((img, imgIndex) => {

                            let start = 100 - ((imgIndex * 100) / imagesClipPath.length);
                            let end = (100 - ((100 / imagesClipPath.length) * (imgIndex + 1)));

                            if (imgIndex === imagesClipPath.length - 1) {
                                end = 5;
                            }
                            if (imgIndex === 0) {
                                start = 95;
                            }

                            gsap.to(img, {
                                "--clip": '100%',
                                ease: "none",
                                scrollTrigger: {
                                    trigger: nextScreen,
                                    containerAnimation: scrollTweens[i + 1],
                                    start: `start ${start}%`,
                                    end: `end ${end}%`,
                                    scrub: true,
                                    onEnter: (e) => {
                                        console.log('onEnter', imgIndex);

                                        for (let index = imgIndex; index >= 0; index--) {
                                            imagesClipPath[index].classList.add('active');
                                        }
                                    },
                                    onEnterBack: (e) => {
                                        console.log('onEnterBack', imgIndex);

                                        for (let index = imgIndex; index < imagesClipPath.length; index++) {
                                            imagesClipPath[index].classList.remove('active');
                                        }
                                    },
                                    // markers: true
                                }
                            });
                        })

                    }
                }

                // 2 text block in one section
                if (thumb.querySelector('.split-text-blocks')) {
                    const floatingImage = thumb.querySelector('.floating-image:not(.hidden)'),
                        nextScreen = thumb.nextElementSibling,
                        textBlocks = thumb.querySelectorAll('.basic-text-block');


                    gsap.to(nextScreen, {
                        //x: "-50%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: nextScreen,
                            containerAnimation: scrollTweens[i + 1],
                            start: `start 90%`,
                            end: `start 50%`,
                            scrub: true,
                            // markers: true,
                            onEnter: (e) => {
                                textBlocks[0].classList.add('active');
                                textBlocks[1].classList.remove('active');
                            },
                            onLeave: (e) => {
                                textBlocks[0].classList.remove('active');
                                textBlocks[1].classList.add('active');
                            },
                            onEnterBack: (e) => {
                                textBlocks[0].classList.add('active');
                                textBlocks[1].classList.remove('active');
                            },
                            onLeaveBack: (e) => {
                                textBlocks[0].classList.remove('active');
                                textBlocks[1].classList.remove('active');
                            }

                        }
                    })

                    // Scroll effect for image
                    gsap.to(floatingImage, {
                        x: "-50%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: nextScreen,
                            containerAnimation: scrollTweens[i + 1],
                            start: `start 100%`,
                            end: `end 0`,
                            scrub: true,
                            // markers: true,
                        }
                    })
                }
            })
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
                const id = menuItem.getAttribute('href'),
                    section = document.querySelector(id);

                if (section) {                
                    let scrollTo = 0;

                    let index = Array.prototype.indexOf.call(sectionsScroller, section);
                    if (index > 0) {
                        Array.prototype.slice.call(sectionsScroller, 0, index).forEach(elem => {
                            console.log(elem);
                            scrollTo += elem.querySelectorAll('.js-screen').length * (window.innerWidth * 0.5);
                        })
                        
                        scrollTo += window.innerHeight
                    } 

                    window.scrollTo({
                        top: scrollTo,
                        behavior: "smooth",
                    });   
                }
            })
        })
    }
})


window.addEventListener('scroll', (e) => {
    let posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;    
})

