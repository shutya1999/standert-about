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
  sectionsScroller.forEach(function (sectionScroller) {
    var screens = gsap.utils.toArray(sectionScroller.querySelectorAll(".js-screen"));
    var scrollTween = gsap.to(screens, {
      xPercent: -100 * (screens.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionScroller,
        pin: true,
        scrub: 1,
        // snap: 1 / (screens.length - 1),
        end: function end() {
          return "+=" + sectionScroller.offsetWidth;
        }
      }
    });
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
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // 50% of the video block should be visible
  };
  var observerCallback = function observerCallback(entries, observer) {
    entries.forEach(function (entry) {
      var video = entry.target;
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
  var observer = new IntersectionObserver(observerCallback, observerOptions);
  videos.forEach(function (video) {
    observer.observe(video);
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
  });
}