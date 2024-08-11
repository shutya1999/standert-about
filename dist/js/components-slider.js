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
  var swiper = new Swiper('.swiper', {
    // effect: "fade",
    // slideActiveClass: 'start-animation',
    speed: 400,
    // delay: 5000,
    mousewheel: {
      thresholdDelta: 25,
      releaseOnEdges: true
    },
    on: {
      init: function init(swiper) {
        swiper.slides[swiper.activeIndex].classList.add('start-animation');
      },
      slideChangeTransitionStart: function slideChangeTransitionStart(swiper) {
        console.log(123);
        swiper.slides[swiper.previousIndex].classList.add('anim-hide');
      },
      slideChangeTransitionEnd: function slideChangeTransitionEnd(swiper) {
        //removeClass(swiper.slides, 'start-animation')
        swiper.slides.forEach(function (slide) {
          slide.classList.remove('start-animation');
          slide.classList.remove('anim-hide');
        });
        swiper.slides[swiper.activeIndex].classList.add('start-animation');
      }
    }
  });

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
});