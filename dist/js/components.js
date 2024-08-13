"use strict";

window.addEventListener('load', function () {
  // Custom VH
  var vh = window.innerHeight * 0.01;
  var vw = document.documentElement.clientWidth * 0.01;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  window.addEventListener('resize', function () {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    vw = document.documentElement.clientWidth * 0.01;
    document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
  });
});

// Remove class
function removeClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.remove(className);
  });
}
function addClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.add(className);
  });
}
window.addEventListener('load', function () {
  gsap.registerPlugin(ScrollTrigger);

  // Observer.create({
  //     type: "wheel,touch,pointer",
  //     wheelSpeed: -1,
  //     onDown: () => console.log('onDown'),
  //     onUp: () => console.log('onUp'),
  //     tolerance: 10,
  //     preventDefault: true
  // });

  var sectionsScroller = document.querySelectorAll(".js-section-scroller");
  if (sectionsScroller.length) {
    sectionsScroller.forEach(function (sectionScroller, index) {
      var thumbNails = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));
      ScrollTrigger.create({
        trigger: sectionScroller,
        start: "top top",
        end: function end() {
          var previousSectionScroll = 0;
          if (sectionsScroller[index - 1]) {
            previousSectionScroll = sectionsScroller[index - 1].querySelector('.section-wrapper').scrollWidth;
            // console.log(previousSectionScroll);
          }

          //return (sectionScroller.scrollWidth + previousSectionScroll) * 0.5
          return sectionScroller.scrollWidth + previousSectionScroll;
        },
        pin: true,
        anticipatePin: 1,
        scrub: 1,
        invalidateOnRefresh: true
        // markers: true
      });
      var scrollTweens = [];
      thumbNails.forEach(function (thumb, i) {
        var scrollTween = gsap.to(thumb, {
          x: function x() {
            return -(i * window.innerWidth);
          },
          //xPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: thumb.closest(".section-wrapper"),
            start: 'top top',
            scrub: 1,
            invalidateOnRefresh: true,
            //end: () => "+=" + (i * window.innerWidth),
            end: function end() {
              //return "+=" + ((i * (window.innerWidth * 0.5)))
              return "+=" + i * window.innerWidth;
            }
          }
        });
        scrollTweens.push(scrollTween);
        ScrollTrigger.create({
          trigger: thumb,
          // containerAnimation: scrollTween,
          containerAnimation: i === 0 ? false : scrollTween,
          start: "start 1px",
          end: "10% 50%",
          onEnter: function onEnter(e) {
            var trigger = e.trigger;
            var screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');
            if (screens.length > 0) {
              removeClass(screens, 'start-animation');
              //removeClass(document.querySelectorAll('.floating-image'), 'active-image');
            }
            setTimeout(function () {
              trigger.classList.add('start-animation');
            }, 200);
            //console.log(e.trigger, 'onLeave')

            if (screens[i - 2] && screens[i - 2].querySelector('.floating-image')) {
              screens[i - 2].querySelector('.floating-image').classList.add('anim-hide');
            }
          },
          onLeave: function onLeave(e) {
            //console.log(e.trigger, 'onLeave')
          },
          onEnterBack: function onEnterBack(e) {
            var trigger = e.trigger;
            var screens = trigger.closest('.js-section-scroller').querySelectorAll('.js-screen');
            if (trigger.previousElementSibling) {
              if (screens.length > 0) {
                removeClass(screens, 'start-animation');
              }
              setTimeout(function () {
                trigger.previousElementSibling.classList.add('start-animation');
              }, 200);
            }
            console.log(e.trigger, 'onEnterBack');
            if (screens[i - 2] && screens[i - 2].querySelector('.floating-image')) {
              screens[i - 2].querySelector('.floating-image').classList.remove('anim-hide');
            }
          },
          onLeaveBack: function onLeaveBack(e) {
            //console.log(e.trigger, 'onLeaveBack')
          }
          //markers: true
        });

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
      thumbNails.forEach(function (thumb, i) {
        if (thumb.querySelector('._js-image_clippath img')) {
          var imagesClipPath = thumb.querySelectorAll('._js-image_clippath img');
          var nextScreen = thumb.nextElementSibling;
          if (nextScreen && imagesClipPath.length > 0) {
            imagesClipPath.forEach(function (img, imgIndex) {
              var start = 100 - imgIndex * 100 / imagesClipPath.length;
              var end = 100 - 100 / imagesClipPath.length * (imgIndex + 1);
              if (imgIndex === imagesClipPath.length - 1) {
                end = 10;
              }
              gsap.to(img, {
                //y: -120,
                //opacity: 0,
                //webkitClipPath: 'inset(0 0 0 0)',
                //clipPath: 'inset(0 0 0 0)',
                "--clip": '100%',
                ease: "none",
                scrollTrigger: {
                  trigger: nextScreen,
                  containerAnimation: scrollTweens[i + 1],
                  start: "start ".concat(start, "%"),
                  end: "end ".concat(end, "%"),
                  scrub: true
                  // markers: true
                  //id: "2"
                }
              });
            });
          }
        }
        if (thumb.querySelector('.floating-image')) {
          var floatingImage = thumb.querySelector('.floating-image:not(.hidden)');
          var _nextScreen = thumb.nextElementSibling;
          if (_nextScreen && floatingImage) {
            //console.log(nextScreen, floatingImage);

            gsap.to(floatingImage, {
              //y: -120,
              //opacity: 0,
              //webkitClipPath: 'inset(0 0 0 0)',
              //clipPath: 'inset(0 0 0 0)',
              //"--clip": '100%',
              x: "-50%",
              ease: "none",
              scrollTrigger: {
                trigger: _nextScreen,
                containerAnimation: scrollTweens[i + 1],
                start: "start 100%",
                end: "end 0",
                scrub: true,
                //markers: true,
                //id: "2",
                onEnter: function onEnter(e) {
                  //console.log('onenter');
                },
                onLeave: function onLeave(e) {
                  //console.log('onLeave');
                }
              }
            });
          }
        }
      });
    });
  }

  // Video play/pause controls
  var videos = document.querySelectorAll('video');
  if (videos.length) {
    var observerCallbackVideo = function observerCallbackVideo(entries, observer) {
      entries.forEach(function (entry) {
        var video = entry.target;
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
    var observerVideo = new IntersectionObserver(observerCallbackVideo, {
      root: null,
      rootMargin: '0px',
      threshold: 0.9 // 50% of the video block should be visible
    });
    videos.forEach(function (video) {
      observerVideo.observe(video);
      if (video.closest('.video-block')) {
        var playBtn = video.closest('.video-block').querySelector('.play-btn'),
          pauseBtn = video.closest('.video-block').querySelector('.pause-btn'),
          muteControls = video.closest('.video-block').querySelector('.mute-controls');
        if (playBtn && pauseBtn && muteControls) {
          playBtn.addEventListener('click', function () {
            video.play();
            video.closest('.video-block').classList.add('_played');
          });
          pauseBtn.addEventListener('click', function () {
            video.pause();
            video.closest('.video-block').classList.remove('_played');
          });
          muteControls.addEventListener('click', function () {
            if (video.muted) {
              video.muted = false;
              video.closest('.video-block').classList.add('_unmute');
            } else {
              video.muted = true;
              video.closest('.video-block').classList.remove('_unmute');
            }
          });
        }
      }
    });
  }

  // Custom scrollbar
  gsap.to('progress', {
    value: 100,
    ease: 'none',
    scrollTrigger: {
      scrub: 0.3
    }
  });

  // Menu scroll
  var sectionInMenu = document.querySelectorAll('.js-menu-section'),
    menuElements = document.querySelectorAll('nav a');
  if (sectionInMenu.length) {
    var observerCallbackSection = function observerCallbackSection(entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          removeClass(menuElements, 'active');
          if (document.querySelector("nav a[href=\"#".concat(target.id, "\"]"))) {
            document.querySelector("nav a[href=\"#".concat(target.id, "\"]")).classList.add('active');
          }
        }
      });
    };
    var observerSection = new IntersectionObserver(observerCallbackSection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 50% of the video block should be visible
    });
    sectionInMenu.forEach(function (section) {
      observerSection.observe(section);
    });
    menuElements.forEach(function (menuItem) {
      menuItem.addEventListener('click', function (e) {
        e.preventDefault();
        var id = menuItem.getAttribute('href');
        document.querySelector(id).scrollIntoView({
          behavior: "smooth"
        });
      });
    });
  }
});