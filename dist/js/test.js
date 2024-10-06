"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var sections = document.querySelectorAll("section");
var images = document.querySelectorAll(".bg");
var headings = gsap.utils.toArray(".section-heading");
var outerWrappers = gsap.utils.toArray(".outer");
var innerWrappers = gsap.utils.toArray(".inner");
document.addEventListener("wheel", handleWheel);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
var listening = false,
  direction = "down",
  current,
  next = 0;
var touch = {
  startX: 0,
  startY: 0,
  dx: 0,
  dy: 0,
  startTime: 0,
  dt: 0
};
var tlDefaults = {
  ease: "slow.inOut",
  duration: 1.25
};
var splitHeadings = headings.map(function (heading) {
  return new SplitText(heading, {
    type: "chars, words, lines",
    linesClass: "clip-text"
  });
});
function revealSectionHeading() {
  return gsap.to(splitHeadings[next].chars, {
    autoAlpha: 1,
    yPercent: 0,
    duration: 1,
    ease: "power2",
    stagger: {
      each: 0.02,
      from: "random"
    }
  });
}
gsap.set(outerWrappers, {
  yPercent: 100
});
gsap.set(innerWrappers, {
  yPercent: -100
});

// Slides a section in on scroll down
function slideIn() {
  // The first time this function runs, current is undefined
  if (current !== undefined) gsap.set(sections[current], {
    zIndex: 0
  });
  gsap.set(sections[next], {
    autoAlpha: 1,
    zIndex: 1
  });
  gsap.set(images[next], {
    yPercent: 0
  });
  gsap.set(splitHeadings[next].chars, {
    autoAlpha: 0,
    yPercent: 100
  });
  var tl = gsap.timeline({
    paused: true,
    defaults: tlDefaults,
    onComplete: function onComplete() {
      listening = true;
      current = next;
    }
  }).to([outerWrappers[next], innerWrappers[next]], {
    yPercent: 0
  }, 0).from(images[next], {
    yPercent: 15
  }, 0).add(revealSectionHeading(), 0);
  if (current !== undefined) {
    tl.add(gsap.to(images[current], _objectSpread({
      yPercent: -15
    }, tlDefaults)), 0).add(gsap.timeline().set(outerWrappers[current], {
      yPercent: 100
    }).set(innerWrappers[current], {
      yPercent: -100
    }).set(images[current], {
      yPercent: 0
    }).set(sections[current], {
      autoAlpha: 0
    }));
  }
  tl.play(0);
}

// Slides a section out on scroll up
function slideOut() {
  gsap.set(sections[current], {
    zIndex: 1
  });
  gsap.set(sections[next], {
    autoAlpha: 1,
    zIndex: 0
  });
  gsap.set(splitHeadings[next].chars, {
    autoAlpha: 0,
    yPercent: 100
  });
  gsap.set([outerWrappers[next], innerWrappers[next]], {
    yPercent: 0
  });
  gsap.set(images[next], {
    yPercent: 0
  });
  gsap.timeline({
    defaults: tlDefaults,
    onComplete: function onComplete() {
      listening = true;
      current = next;
    }
  }).to(outerWrappers[current], {
    yPercent: 100
  }, 0).to(innerWrappers[current], {
    yPercent: -100
  }, 0).to(images[current], {
    yPercent: 15
  }, 0).from(images[next], {
    yPercent: -15
  }, 0).add(revealSectionHeading(), ">-1").set(images[current], {
    yPercent: 0
  });
}
function handleDirection() {
  listening = false;
  if (direction === "down") {
    next = current + 1;
    if (next >= sections.length) next = 0;
    slideIn();
  }
  if (direction === "up") {
    next = current - 1;
    if (next < 0) next = sections.length - 1;
    slideOut();
  }
}
function handleWheel(e) {
  if (!listening) return;
  direction = e.wheelDeltaY < 0 ? "down" : "up";
  handleDirection();
}
function handleTouchStart(e) {
  if (!listening) return;
  var t = e.changedTouches[0];
  touch.startX = t.pageX;
  touch.startY = t.pageY;
}
function handleTouchMove(e) {
  if (!listening) return;
  e.preventDefault();
}
function handleTouchEnd(e) {
  if (!listening) return;
  var t = e.changedTouches[0];
  touch.dx = t.pageX - touch.startX;
  touch.dy = t.pageY - touch.startY;
  if (touch.dy > 10) direction = "up";
  if (touch.dy < -10) direction = "down";
  handleDirection();
}
slideIn();