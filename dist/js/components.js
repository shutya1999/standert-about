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
var isPortrait = function isPortrait() {
  return window.matchMedia('screen and (orientation: portrait)').matches;
};

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
  var sectionsScroller = document.querySelectorAll(".js-section-scroller"),
    TveenSectionInMenu = {};
  if (sectionsScroller.length) {
    sectionsScroller.forEach(function (sectionScroller, index) {
      var thumbNails = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));
      ScrollTrigger.create({
        trigger: sectionScroller,
        start: "top top",
        end: function end() {
          if (isPortrait()) {
            console.log((sectionScroller.querySelectorAll('.js-screen').length - 1) * window.innerHeight);
            var _previousSectionScroll = 0;
            if (sectionsScroller[index - 1]) {
              _previousSectionScroll = sectionsScroller[index - 1].querySelectorAll('.js-screen').length * window.innerHeight;
            }
            return (sectionScroller.querySelectorAll('.js-screen').length - 1) * window.innerHeight + _previousSectionScroll;
          }
          var previousSectionScroll = 0;
          if (sectionsScroller[index - 1]) {
            previousSectionScroll = sectionsScroller[index - 1].querySelector('.section-wrapper').scrollWidth;
          }
          return (sectionScroller.scrollWidth + previousSectionScroll) * 0.5;
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
              if (isPortrait()) {
                return "+=" + i * window.innerHeight;
              }
              return "+=" + i * (window.innerWidth * 0.5);
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

            // console.log(e.trigger, 'onEnterBack')

            if (screens[i - 2] && screens[i - 2].querySelector('.floating-image')) {
              screens[i - 2].querySelector('.floating-image').classList.remove('anim-hide');
            }
          },
          onLeaveBack: function onLeaveBack(e) {
            //console.log(e.trigger, 'onLeaveBack')
          }
          //markers: true
        });
        if (thumb.id) {
          if (document.querySelector(".navigation-block [href=\"#".concat(thumb.id, "\"]"))) {
            TveenSectionInMenu[thumb.id] = scrollTween;
          }
        }
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
                "--clip": '100%',
                ease: "none",
                scrollTrigger: {
                  trigger: nextScreen,
                  containerAnimation: scrollTweens[i + 1],
                  start: "start ".concat(start, "%"),
                  end: "end ".concat(end, "%"),
                  scrub: true,
                  onEnter: function onEnter(e) {
                    img.classList.add('active');
                  },
                  onEnterBack: function onEnterBack(e) {
                    img.classList.remove('active');
                  }
                  // markers: true
                }
              });
            });
          }
        }

        // 2 text block in one section
        if (thumb.querySelector('.split-text-blocks')) {
          var floatingImage = thumb.querySelector('.floating-image:not(.hidden)'),
            _nextScreen = thumb.nextElementSibling,
            textBlocks = thumb.querySelectorAll('.basic-text-block');
          gsap.to(_nextScreen, {
            //x: "-50%",
            ease: "none",
            scrollTrigger: {
              trigger: _nextScreen,
              containerAnimation: scrollTweens[i + 1],
              start: "start 90%",
              end: "start 50%",
              scrub: true,
              // markers: true,
              onEnter: function onEnter(e) {
                textBlocks[0].classList.add('active');
                textBlocks[1].classList.remove('active');
              },
              onLeave: function onLeave(e) {
                textBlocks[0].classList.remove('active');
                textBlocks[1].classList.add('active');
              },
              onEnterBack: function onEnterBack(e) {
                textBlocks[0].classList.add('active');
                textBlocks[1].classList.remove('active');
              },
              onLeaveBack: function onLeaveBack(e) {
                textBlocks[0].classList.remove('active');
                textBlocks[1].classList.remove('active');
              }
            }
          });

          // Scroll effect for image
          gsap.to(floatingImage, {
            x: "-50%",
            ease: "none",
            scrollTrigger: {
              trigger: _nextScreen,
              containerAnimation: scrollTweens[i + 1],
              start: "start 100%",
              end: "end 0",
              scrub: true
              // markers: true,
            }
          });
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
        var id = menuItem.getAttribute('href'),
          section = document.querySelector(id);
        if (section) {
          var scrollTo = 0;
          var index = Array.prototype.indexOf.call(sectionsScroller, section);
          if (index > 0) {
            Array.prototype.slice.call(sectionsScroller, 0, index).forEach(function (elem) {
              console.log(elem);
              scrollTo += elem.querySelectorAll('.js-screen').length * (window.innerWidth * 0.5);
            });
            scrollTo += window.innerHeight;
          }
          window.scrollTo({
            top: scrollTo,
            behavior: "smooth"
          });
        }
      });
    });
  }
});
window.addEventListener('scroll', function (e) {
  var posTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
});