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
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
gsap.registerPlugin(ScrollTrigger);
// Init scroll effect for section
var sectionsScroller = document.querySelectorAll(".js-section-scroller");
if (sectionsScroller.length) {
  sectionsScroller.forEach(function (sectionScroller, index) {
    var screens = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));
    var scrollTween = gsap.to(screens, {
      xPercent: -100 * (screens.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionScroller,
        pin: true,
        scrub: 1,
        onEnter: function onEnter(e) {
          var interval = index === 0 ? 300 : 0;
          if (e.trigger.querySelector('.js-screen')) {
            setTimeout(function () {
              e.trigger.querySelector('.js-screen').classList.add('start-animation');
            }, interval);
          }
        },
        // snap: 1 / (screens.length - 1),
        end: function end() {
          return screens.length > 1 ? "+=".concat(sectionScroller.offsetWidth * 2) : '0';
        }
        // markers: true,
      }
    });

    // Trigger for screen
    screens.forEach(function (screen) {
      ScrollTrigger.create({
        trigger: screen,
        containerAnimation: scrollTween,
        onEnter: function onEnter(e) {
          screen.classList.add('start-animation');
        },
        start: "start 50%"
        // markers: true
      });
    });

    // Overlay animation
    if (sectionScroller.querySelector('.overlay-eclipse')) {
      var overlayEclipse = sectionScroller.querySelectorAll('.overlay-eclipse');
      overlayEclipse.forEach(function (overlay) {
        gsap.to(overlay, {
          // backgroundColor: "#1e90ff",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: overlay,
            containerAnimation: scrollTween,
            start: "center 100%",
            end: "center 50%",
            scrub: true
            // markers: true
          }
        });
      });
    }

    // floating image animation
    if (sectionScroller.querySelector('.floating-image')) {
      var floatingImages = sectionScroller.querySelectorAll('.floating-image');
      floatingImages.forEach(function (image) {
        gsap.to(image, {
          x: "50%",
          // xPercent: -100,
          // opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            containerAnimation: scrollTween,
            start: "-100% 100%",
            end: "50% 50%",
            scrub: true
            //markers: true
          }
        });
      });
    }
  });
}

// Custom scrollbar
var scrollThumb = document.querySelector('.scroll-bar__thumb');
if (scrollThumb) {
  var thumbHeight = Math.ceil(window.innerHeight * (window.innerHeight / document.documentElement.scrollHeight));
  scrollThumb.style.setProperty('--thumb-height', thumbHeight + "px");
  gsap.to(scrollThumb, {
    y: function y() {
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
    threshold: 0.5 // 50% of the video block should be visible
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