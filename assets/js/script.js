"use strict";
// navbar search roller js start ----
document.querySelectorAll(".search-roller").forEach((roller) => {
  const track = roller.querySelector(".search-roller-track");
  const items = [...track.children];

  if (items.length <= 1) return;

  // Duplicate first item
  track.appendChild(items[0].cloneNode(true));

  const itemHeight = items[0].offsetHeight;

  let index = 0;
  let total = items.length;

  function next() {
    index++;

    track.style.transition = "transform .9s ease";
    track.style.transform = `translateY(-${index * itemHeight}px)`;

    // Reset when duplicate reached
    if (index === total) {
      track.addEventListener("transitionend", function reset() {
        track.removeEventListener("transitionend", reset);

        track.style.transition = "none";
        track.style.transform = "translateY(0)";

        index = 0;

        // Force reflow
        track.offsetHeight;
      });
    }
  }

  setInterval(next, 2000);
});
// navbar search roller js end --

// navbar sticky search js start----
let lastScroll = 0;

window.addEventListener("load", handleScroll);
window.addEventListener("scroll", handleScroll);

function handleScroll() {
  const scrolling = window.scrollY;
  const header = document.querySelector(".header");
  const home_nav_active = document.querySelector(".home-nav-active");

  lastScroll = scrolling;

  if ((scrolling > 80) & header.classList.contains("home-nav-active")) {
    home_nav_active.classList.add("home-nav");
  } else if ((scrolling < 80) & header.classList.contains("home-nav-active")) {
    home_nav_active.classList.remove("home-nav");
  }
}
// navbar sticky search js end----

// navbar search open js start ---
document.addEventListener("click", function (e) {
  // Close Search
  if (
    e.target.closest(".search-bar-close") ||
    e.target.closest(".search-bar-window-cls-btn")
  ) {
    document.querySelector(".search-bar-wrap")?.classList.remove("active");
    document.body.classList.remove("active");
    return;
  }

  // Open Search
  if (e.target.closest(".navbar-search-open-btn")) {
    document.querySelector(".search-bar-wrap")?.classList.add("active");
    document.body.classList.add("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Remove active from search wrap
    document.querySelectorAll(".search-bar-wrap.active").forEach((el) => {
      el.classList.remove("active");
    });

    // Remove active from body
    document.body.classList.remove("active");
  }
});
// navbar search open js end ---

// mobile-menu sidebar js start---
const mobileMenu = document.querySelector(".mobile-menu-wrap");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");

function openMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.add("active");
  mobileMenuContainer?.classList.add("active");
}

function closeMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.remove("active");
  mobileMenuContainer?.classList.remove("active");
}

document.querySelectorAll(".app-menu-open").forEach((btn) => {
  btn.addEventListener("click", openMobileMenu);
});

document
  .querySelectorAll(".mobile-menu-close-window-btn, .mobile-menu-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeMobileMenu);
  });

// mobile-menu sidebar js end---

// mobile-menu-tab js start--
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".mobile-menu-tabs-contents");
  const tabs = [...document.querySelectorAll(".mobile-menu-tab")];
  const contents = [...document.querySelectorAll(".mobile-menu-tabs-content")];

  if (!container || !tabs.length || !contents.length) return;

  let isClickScroll = false;
  let scrollTimer;

  const setActive = (id, scroll = true) => {
    const tab = tabs.find((el) => el.hash === `#${id}`);
    if (!tab) return;

    tabs.forEach((el) => el.classList.toggle("active", el === tab));

    if (scroll) {
      tab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Tab click
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const target = document.getElementById(tab.hash.slice(1));
      if (!target) return;

      isClickScroll = true;
      setActive(target.id);

      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isClickScroll = false;
      }, 2000);
    });
  });

  // Content scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScroll) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    {
      root: container,
      rootMargin: "-10% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.5, 0.75],
    },
  );

  contents.forEach((content) => observer.observe(content));

  // Initial state
  setActive(
    tabs.find((tab) => tab.classList.contains("active"))?.hash.slice(1) ||
      tabs[0].hash.slice(1),
    false,
  );
});
// mobile-menu-tab js end--

// cart-drawer js start---
const cartDrawer = document.querySelector(".cart-drawer");
const cartDrawerInner = document.querySelector(".cart-drawer-inner");

function openCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.add("active");
  cartDrawerInner?.classList.add("active");
}

function closeCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.remove("active");
  cartDrawerInner?.classList.remove("active");
}

document.querySelectorAll(".cart-drawer-open").forEach((btn) => {
  btn.addEventListener("click", openCartDrawer);
});

document
  .querySelectorAll(".cart-drawer-close-window-btn, .cart-drawer-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeCartDrawer);
  });

// cart-drawer js end---

// cart-drawer slider js start--
var swiper = new Swiper(".cart-drawer-slider", {
  slidesPerView: 2.1,
  spaceBetween: 5,
  grabCursor: true,
  loop: true,
  speed: 500,
  // autoplay: {
  //   delay: 2500,
  //   disableOnInteraction: false,
  // },
  navigation: {
    nextEl: ".cart-drawer-slider-btn-next",
    prevEl: ".cart-drawer-slider-btn-prev",
  },
});
// cart-drawer slider js end--

// cart-drawer progesss-bar js start--
const progress = document.querySelector(".progress");
progress.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #d55a3c 0%, #422c26 ${value}%,rgb(236 219 216) ${value}%)`;
});
// cart-drawer progesss-bar js end--

// hero slider js start--
var swiper = new Swiper(".hero-slider", {
  slidesPerView: 1,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero-button-next",
    prevEl: ".hero-button-prev",
  },
  breakpoints: {
    1: {
      spaceBetween: 0,
    },
    993: {
      spaceBetween: 16,
    },
  },
});
// hero slider js end--

// category js start--
var swiper = new Swiper(".category-slider", {
  slidesPerView: "auto",
  spaceBetween: 10,
  grabCursor: true,
  loop: true,
  navigation: {
    nextEl: ".category-button-next",
    prevEl: ".category-button-prev",
  },
});
// category js end--

// count-down js start--
document.querySelectorAll(".countdown").forEach((countdown) => {
  const endDate = new Date(countdown.dataset.end).getTime();

  const daysEl = countdown.querySelector(".countdown-days");
  const hoursEl = countdown.querySelector(".countdown-hours");
  const minutesEl = countdown.querySelector(".countdown-minutes");
  const secondsEl = countdown.querySelector(".countdown-seconds");

  const updateCountdown = () => {
    const remaining = endDate - Date.now();

    if (remaining <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
// count-down js end--

// card slider js start--
var swiper = new Swiper(".card-slider", {
  effect: "coverflow",
  slidesPerView: 2,
  centeredSlides: true,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 500,
  autoplay: false,
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 150,
    modifier: 1,
    slideShadows: false,
  },
  // autoplay: {
  //   delay: 3500,
  //   disableOnInteraction: false,
  // },
  breakpoints: {
    1: {
      effect: "coverflow",
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 24,
    },
    576: {
      effect: "coverflow",
      slidesPerView: 2.2,
      centeredSlides: true,
      spaceBetween: 16,
    },
    768: {
      effect: "slide",
      slidesPerView: 3.2,
      centeredSlides: false,
      spaceBetween: 10,
    },
    993: {
      effect: "slide",
      slidesPerView: 3.8,
      centeredSlides: false,
      spaceBetween: 10,
    },
    1200: {
      effect: "slide",
      slidesPerView: 4,
      centeredSlides: false,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// card slider js start--
var swiper = new Swiper(".explore-slider", {
  slidesPerView: 4.5,
  centeredSlides: false,
  spaceBetween: 10,
  grabCursor: true,
  loop: true,
  speed: 500,
  autoplay: false,
  navigation: {
    nextEl: ".explore-slider-button-next",
    prevEl: ".explore-slider-button-prev",
  },
  breakpoints: {
    1: {
      slidesPerView: 2,
      spaceBetween: 5,
    },
    576: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    993: {
      slidesPerView: 4.5,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// tab-section js start--
document.querySelectorAll(".tab-section-nav-item").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    document
      .querySelectorAll(".tab-section-nav-item")
      .forEach((el) => el.classList.toggle("active", el === tab));

    document
      .querySelectorAll(".tab-section-panel")
      .forEach((panel) =>
        panel.classList.toggle("active", panel.id === target),
      );
  });
});
// tab-section js end--

// image-category-slider js start--
var swiper = new Swiper(".image-category-slider", {
  slidesPerView: 4,
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  breakpoints: {
    // when window width is >= 320px
    1: {
      spaceBetween: 10,
      slidesPerView: 1.7,
    },
    // when window width is >= 576px
    576: {
      spaceBetween: 10,
      slidesPerView: 2.2,
    },
    // when window width is >= 767px
    768: {
      spaceBetween: 16,
      slidesPerView: 3.3,
    },
    // when window width is >= 993px
    993: {
      spaceBetween: 20,
      slidesPerView: 4,
    },
  },
});
// image-category-slider js end--

// shop-by-brand-slider js start--
var swiper = new Swiper(".shop-by-brand-slider", {
  slidesPerView: 5,
  spaceBetween: 0,
  grabCursor: true,
  loop: true,
  speed: 800,
  navigation: {
    nextEl: ".shop-by-brand-slider .swiper-button-next",
    prevEl: ".shop-by-brand-slider .swiper-button-prev",
  },
  breakpoints: {
    1: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    993: {
      slidesPerView: 5,
    },
  },
});
// shop-by-brand-slider js end--

// community-review-section js start--
// add / edit review here, section and popup are built from this list
// wrap a word in {curly braces} inside caption to highlight it
const communityReviews = [
  {
    video: "./assets/videos/review-1.mp4",
    poster: "./assets/videos/review-1.jpg",
    duration: 20,
    caption: "See why {1000+} customers trust us",
    reviewer: "Nusrat Jahan",
    location: "Dhaka",
    rating: 5,
    text: "Wearing it daily for two weeks — heel pain is almost gone. Delivery came next day!",
    views: 12400,
    likes: 864,
    product: {
      title: "Orthotics Heel Protector",
      img: "./assets/images/product-slider-img1.avif",
      price: 1870,
      previousPrice: 2200,
      url: "product.html",
    },
  },
  {
    video: "./assets/videos/review-2.mp4",
    poster: "./assets/videos/review-2.jpg",
    duration: 11,
    caption: "Comfort you can {feel} instantly",
    reviewer: "Rakib Hasan",
    location: "Chattogram",
    rating: 5,
    text: "Super soft sole, feels like walking on cloud. Ordered a second pair for my father.",
    views: 9800,
    likes: 621,
    product: {
      title: "Ehans Mart Cloud Comfort Arch Support Slippers",
      img: "./assets/images/product-slider-img3.webp",
      price: 1870,
      previousPrice: 2200,
      url: "product.html",
    },
  },
  {
    video: "./assets/videos/review-3.mp4",
    poster: "./assets/videos/review-3.jpg",
    duration: 6,
    caption: "Real people. Real {reviews}",
    reviewer: "Tanvir Ahmed",
    location: "Sylhet",
    rating: 4,
    text: "Strap quality is great and the size fit perfectly. Packaging was premium too.",
    views: 7300,
    likes: 402,
    product: {
      title: "Ehans Mart Men's Comfort Dual Strap Sandals",
      img: "./assets/images/product-slider-img5.webp",
      price: 1870,
      previousPrice: 2200,
      url: "product.html",
    },
  },
  {
    video: "./assets/videos/review-4.mp4",
    poster: "./assets/videos/review-4.jpg",
    duration: 11,
    caption: "Premium product {reviews}",
    reviewer: "Farzana Akter",
    location: "Khulna",
    rating: 5,
    text: "Fabric is so comfortable and the colour is exactly like the photos. Loved it!",
    views: 15100,
    likes: 1032,
    product: {
      title: "Ehans Mart Women's Comfort Dress",
      img: "./assets/images/product-slider-img6.avif",
      price: 870,
      previousPrice: 1200,
      url: "product.html",
    },
  },
];

const communityReviewTotal = "1000+";

(() => {
  const section = document.querySelector(".community-review-section");
  const track = section?.querySelector(".community-review-items");
  const popup = document.querySelector(".community-review-popup");
  const reviews = communityReviews;

  if (!section || !track || !popup || !reviews.length) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData === true;
  const canAutoPreview = !reducedMotion && !saveData;
  const likesKey = "ehans-community-review-likes";

  // helpers
  const esc = (str) =>
    String(str).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const highlight = (str) =>
    esc(str).replace(/\{(.+?)\}/g, '<span class="highlight">$1</span>');
  const plain = (str) => str.replace(/[{}]/g, "");
  const money = (n) => "Tk" + Number(n).toLocaleString("en-US");
  const compact = (n) =>
    n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K" : String(n);
  const time = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  const initials = (name) =>
    name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const discount = (p) =>
    p.previousPrice > p.price ? Math.round((1 - p.price / p.previousPrice) * 100) : 0;

  const icons = {
    star: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.333l2.06 4.174 4.607.67-3.333 3.249.786 4.587L8 11.846l-4.12 2.167.787-4.587L1.333 6.177l4.607-.67L8 1.333Z" fill="currentColor"/></svg>',
    verified: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L10 18.5l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1L10 1.5Z" fill="currentColor"/><path d="M6.8 10.2l2.1 2.1 4.3-4.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M1.7 10S4.7 4.2 10 4.2 18.3 10 18.3 10 15.3 15.8 10 15.8 1.7 10 1.7 10Z" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>',
    play: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.3v11.4c0 .6.7 1 1.2.6l8.4-5.7c.4-.3.4-.9 0-1.2L7.7 3.7c-.5-.4-1.2 0-1.2.6Z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="4" width="3.4" height="12" rx="1" fill="currentColor"/><rect x="11.6" y="4" width="3.4" height="12" rx="1" fill="currentColor"/></svg>',
    sound: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 8v4h3.5L11 16V4L6.5 8H3Z" fill="currentColor"/><path class="community-review-sound-waves" d="M14 7c1 .8 1 5.2 0 6M16.3 5c2 2 2 8 0 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path class="community-review-sound-off" d="M14 7.5l4 5M18 7.5l-4 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.2s-6.8-4.1-6.8-9a3.8 3.8 0 0 1 6.8-2.3 3.8 3.8 0 0 1 6.8 2.3c0 4.9-6.8 9-6.8 9Z" stroke="currentColor" stroke-width="1.5"/></svg>',
    share: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="15" cy="5" r="2.2" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="15" r="2.2" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="10" r="2.2" stroke="currentColor" stroke-width="1.5"/><path d="M7 8.8 13 5.8M7 11.2l6 3" stroke="currentColor" stroke-width="1.5"/></svg>',
    prev: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15.5 7 10l5.5-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const stars = (rating) =>
    `<span class="community-review-stars" aria-label="${rating} out of 5 stars">${[1, 2, 3, 4, 5]
      .map((i) => `<i class="${i <= rating ? "on" : ""}">${icons.star}</i>`)
      .join("")}</span>`;

  let likedSet = new Set();
  try {
    likedSet = new Set(JSON.parse(localStorage.getItem(likesKey) || "[]"));
  } catch (e) {}
  const saveLikes = () => {
    try {
      localStorage.setItem(likesKey, JSON.stringify([...likedSet]));
    } catch (e) {}
  };

  // section
  const summary = section.querySelector(".community-review-summary");
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  summary.innerHTML = `<strong>${avg.toFixed(1)}</strong>${stars(Math.round(avg))}<span>${communityReviewTotal} happy customers</span>`;
  summary.hidden = false;

  track.innerHTML = reviews
    .map(
      (r, i) => `
    <div class="community-review-item-wrap" role="listitem">
      <button class="community-review-item" type="button" data-review-index="${i}"
        aria-label="Watch ${esc(r.reviewer)}'s review: ${esc(plain(r.caption))}">
        <img class="community-review-item-poster" src="${r.poster}" alt="" loading="lazy" decoding="async">
        <video class="community-review-item-video" data-src="${r.video}" muted loop playsinline preload="none"></video>
        <span class="community-review-item-top">
          <span class="community-review-chip">${icons.eye}${compact(r.views)}</span>
          <span class="community-review-chip">${time(r.duration)}</span>
        </span>
        <span class="community-review-item-play">${icons.play}</span>
        <span class="community-review-item-content">
          <span class="community-review-reviewer">
            <span class="community-review-avatar">${initials(r.reviewer)}</span>
            <span class="community-review-reviewer-name">${esc(r.reviewer)}<i class="community-review-verified" title="Verified buyer">${icons.verified}</i></span>
          </span>
          ${stars(r.rating)}
          <span class="community-review-item-text">${highlight(r.caption)}</span>
          <span class="community-review-item-product">
            <img src="${r.product.img}" alt="" loading="lazy" decoding="async">
            <span class="community-review-item-product-title">${esc(r.product.title)}</span>
            <span class="community-review-item-product-price">${money(r.product.price)}</span>
          </span>
        </span>
      </button>
    </div>`,
    )
    .join("");

  const cards = [...track.querySelectorAll(".community-review-item")];
  const previews = cards.map((c) => c.querySelector("video"));
  let popupOpen = false;

  function playPreview(video) {
    if (popupOpen) return;
    if (!video.src) video.src = video.dataset.src;
    video.play().then(
      () => video.closest(".community-review-item").classList.add("playing"),
      () => {},
    );
  }
  function pausePreview(video) {
    video.pause();
    video.closest(".community-review-item").classList.remove("playing");
  }

  // only previews that are actually on screen download & play
  const visible = new Set();
  if (canAutoPreview && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target.querySelector("video");
          if (e.isIntersecting) {
            visible.add(v);
            playPreview(v);
          } else {
            visible.delete(v);
            pausePreview(v);
          }
        }),
      { threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
  } else {
    // reduced motion / data saver: preview only on hover
    cards.forEach((c, i) => {
      c.addEventListener("pointerenter", () => playPreview(previews[i]));
      c.addEventListener("pointerleave", () => pausePreview(previews[i]));
    });
  }

  // desktop arrows
  const arrows = section.querySelectorAll(".community-review-arrow");
  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    arrows[0].disabled = track.scrollLeft <= 2;
    arrows[1].disabled = track.scrollLeft >= max;
    section.classList.toggle("scrollable", max > 0);
  };
  arrows.forEach((btn) =>
    btn.addEventListener("click", () =>
      track.scrollBy({ left: (btn.classList.contains("next") ? 1 : -1) * track.clientWidth * 0.8, behavior: "smooth" }),
    ),
  );
  track.addEventListener("scroll", updateArrows, { passive: true });
  addEventListener("resize", updateArrows, { passive: true });
  updateArrows();

  // popup
  popup.innerHTML = `
    <span class="community-review-popup-close-window-btn"></span>
    <button class="community-review-popup-nav-btn prev" type="button" aria-label="previous review">${icons.prev}</button>
    <div class="community-review-popup-card">
      <div class="community-review-popup-video-wrap">
        <div class="community-review-popup-progress">${reviews.map(() => '<span class="community-review-popup-progress-bar"><i></i></span>').join("")}</div>
        <div class="community-review-popup-top">
          <div class="community-review-reviewer">
            <span class="community-review-avatar"></span>
            <span class="community-review-popup-reviewer-text">
              <span class="community-review-reviewer-name"><b></b><i class="community-review-verified" title="Verified buyer">${icons.verified}</i></span>
              <small class="community-review-popup-location"></small>
            </span>
          </div>
          <div class="community-review-popup-top-btns">
            <button class="community-review-popup-icon-btn community-review-popup-play-btn" type="button" aria-label="pause">${icons.pause}</button>
            <button class="community-review-popup-icon-btn community-review-popup-mute-btn" type="button" aria-label="mute">${icons.sound}</button>
            <button class="community-review-popup-icon-btn community-review-popup-close-btn" type="button" aria-label="close">${icons.close}</button>
          </div>
        </div>
        <video class="community-review-popup-video" playsinline preload="auto"></video>
        <span class="community-review-popup-loader" aria-hidden="true"></span>
        <span class="community-review-popup-state" aria-hidden="true"></span>
        <div class="community-review-popup-side">
          <button class="community-review-popup-side-btn community-review-popup-like-btn" type="button" aria-pressed="false" aria-label="like">${icons.heart}<span></span></button>
          <button class="community-review-popup-side-btn community-review-popup-share-btn" type="button" aria-label="share">${icons.share}<span>Share</span></button>
        </div>
        <div class="community-review-popup-bottom">
          <p class="community-review-popup-caption"></p>
          <div class="community-review-popup-review"></div>
        </div>
      </div>
      <div class="community-review-popup-product">
        <a class="community-review-popup-product-img" href="#"><img alt=""></a>
        <div class="community-review-popup-product-info">
          <a class="community-review-popup-product-title" href="#"></a>
          <div class="community-review-popup-product-price"><span class="curr"></span><span class="prev"></span><span class="off"></span></div>
        </div>
      </div>
      <div class="community-review-popup-btn-wrap">
        <a class="community-review-popup-btn community-review-popup-btn-ghost community-review-popup-view-btn" href="#">View product</a>
        <button class="community-review-popup-btn community-review-popup-add-btn" type="button">Add to cart</button>
      </div>
    </div>
    <button class="community-review-popup-nav-btn next" type="button" aria-label="next review">${icons.next}</button>
    <div class="community-review-popup-toast" role="status" aria-live="polite"></div>`;

  const $ = (sel) => popup.querySelector(sel);
  const video = $(".community-review-popup-video");
  const stage = $(".community-review-popup-video-wrap");
  const bars = [...popup.querySelectorAll(".community-review-popup-progress-bar i")];
  const toggleBtn = $(".community-review-popup-play-btn");
  const muteBtn = $(".community-review-popup-mute-btn");
  const likeBtn = $(".community-review-popup-like-btn");
  const addBtn = $(".community-review-popup-add-btn");
  const toast = $(".community-review-popup-toast");
  const navPrev = $(".community-review-popup-nav-btn.prev");
  const navNext = $(".community-review-popup-nav-btn.next");
  const preloader = document.createElement("video");
  preloader.preload = "auto";
  preloader.muted = true;

  let current = 0;
  let muted = false; // opening is a user click, so sound is allowed
  let paused = false;
  let raf = 0;
  let lastFocus = null;
  let toastTimer = 0;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function tick() {
    if (video.duration) bars[current].style.width = (video.currentTime / video.duration) * 100 + "%";
    raf = requestAnimationFrame(tick);
  }

  function setPaused(state) {
    paused = state;
    popup.classList.toggle("paused", paused);
    toggleBtn.innerHTML = paused ? icons.play : icons.pause;
    toggleBtn.setAttribute("aria-label", paused ? "play" : "pause");
    if (paused) video.pause();
    else play();
  }

  function setMuted(state) {
    muted = state;
    video.muted = muted;
    muteBtn.classList.toggle("muted", muted);
    muteBtn.setAttribute("aria-label", muted ? "unmute" : "mute");
  }

  function play() {
    video.muted = muted;
    video.play().catch(() => {
      // autoplay with sound blocked → retry muted
      if (!muted) {
        setMuted(true);
        video.play().catch(() => {});
      }
    });
  }

  function renderLike() {
    const r = reviews[current];
    const liked = likedSet.has(current);
    likeBtn.classList.toggle("liked", liked);
    likeBtn.setAttribute("aria-pressed", liked);
    likeBtn.querySelector("span").textContent = compact(r.likes + (liked ? 1 : 0));
  }

  function goTo(index) {
    if (index < 0 || index >= reviews.length) return;
    current = index;
    const r = reviews[index];

    bars.forEach((bar, i) => (bar.style.width = i < index ? "100%" : "0%"));
    popup.classList.add("loading");
    video.poster = r.poster;
    video.src = r.video;
    paused = false;
    popup.classList.remove("paused");
    toggleBtn.innerHTML = icons.pause;
    play();

    // warm up the next video so swiping feels instant
    const next = reviews[index + 1];
    if (next && preloader.dataset.src !== next.video) {
      preloader.dataset.src = next.video;
      preloader.src = next.video;
    }

    $(".community-review-avatar").textContent = initials(r.reviewer);
    $(".community-review-reviewer-name b").textContent = r.reviewer;
    $(".community-review-popup-location").textContent = `Verified buyer · ${r.location}`;
    $(".community-review-popup-caption").innerHTML = highlight(r.caption);
    $(".community-review-popup-review").innerHTML = `${stars(r.rating)}<p>${esc(r.text)}</p>`;

    const p = r.product;
    popup.querySelectorAll(".community-review-popup-product-img, .community-review-popup-product-title, .community-review-popup-view-btn").forEach((a) => (a.href = p.url));
    $(".community-review-popup-product-img img").src = p.img;
    $(".community-review-popup-product-title").textContent = p.title;
    $(".community-review-popup-product-price .curr").textContent = money(p.price);
    $(".community-review-popup-product-price .prev").textContent = p.previousPrice ? money(p.previousPrice) : "";
    const off = discount(p);
    $(".community-review-popup-product-price .off").textContent = off ? `-${off}%` : "";
    addBtn.classList.remove("added");
    addBtn.textContent = "Add to cart";

    renderLike();
    navPrev.disabled = index === 0;
    navNext.disabled = index === reviews.length - 1;
    history.replaceState(null, "", `#review-${index + 1}`);
  }

  function openPopup(index) {
    lastFocus = document.activeElement;
    popupOpen = true;
    previews.forEach(pausePreview);
    document.body.classList.add("active");
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
    setMuted(muted);
    goTo(index);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
    $(".community-review-popup-close-btn").focus({ preventScroll: true });
  }

  function closePopup() {
    if (!popupOpen) return;
    popupOpen = false;
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("active");
    cancelAnimationFrame(raf);
    video.pause();
    video.removeAttribute("src");
    video.load();
    history.replaceState(null, "", location.pathname + location.search);
    visible.forEach(playPreview);
    lastFocus?.focus({ preventScroll: true });
  }

  // video events
  video.addEventListener("waiting", () => popup.classList.add("loading"));
  video.addEventListener("playing", () => popup.classList.remove("loading"));
  video.addEventListener("canplay", () => popup.classList.remove("loading"));
  video.addEventListener("ended", () => {
    bars[current].style.width = "100%";
    current < reviews.length - 1 ? goTo(current + 1) : closePopup();
  });

  // open from cards
  cards.forEach((card, i) => card.addEventListener("click", () => openPopup(i)));

  // buttons
  popup.querySelectorAll(".community-review-popup-close-window-btn, .community-review-popup-close-btn").forEach((el) => el.addEventListener("click", closePopup));
  navPrev.addEventListener("click", () => goTo(current - 1));
  navNext.addEventListener("click", () => goTo(current + 1));
  toggleBtn.addEventListener("click", () => setPaused(!paused));
  muteBtn.addEventListener("click", () => setMuted(!muted));

  likeBtn.addEventListener("click", () => {
    likedSet.has(current) ? likedSet.delete(current) : likedSet.add(current);
    saveLikes();
    renderLike();
    if (likedSet.has(current)) {
      likeBtn.classList.remove("pop");
      void likeBtn.offsetWidth;
      likeBtn.classList.add("pop");
    }
  });

  $(".community-review-popup-share-btn").addEventListener("click", async () => {
    const r = reviews[current];
    const url = `${location.origin}${location.pathname}#review-${current + 1}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: r.product.title, text: plain(r.caption), url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copied");
      }
    } catch (e) {}
  });

  addBtn.addEventListener("click", () => {
    if (addBtn.classList.contains("added")) return;
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = (parseInt(el.textContent, 10) || 0) + 1;
    });
    addBtn.classList.add("added");
    addBtn.textContent = "Added ✓";
    showToast("Added to cart");
  });

  // gestures: tap left/right, hold to pause, swipe to navigate, swipe down to close
  let startX = 0, startY = 0, holdTimer = 0, held = false, pointerActive = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;
    pointerActive = true;
    held = false;
    startX = e.clientX;
    startY = e.clientY;
    holdTimer = setTimeout(() => {
      held = true;
      video.pause();
      popup.classList.add("holding");
    }, 220);
  });
  const endPointer = (e) => {
    if (!pointerActive) return;
    pointerActive = false;
    clearTimeout(holdTimer);
    popup.classList.remove("holding");
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (held) {
      if (!paused) play();
      return;
    }
    if (dy > 90 && Math.abs(dy) > Math.abs(dx)) return closePopup();
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return goTo(current + (dx < 0 ? 1 : -1));
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const rect = stage.getBoundingClientRect();
      e.clientX - rect.left < rect.width * 0.35 ? goTo(current - 1) : goTo(current + 1);
    }
  };
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", () => {
    pointerActive = false;
    clearTimeout(holdTimer);
    popup.classList.remove("holding");
    if (held && !paused) play();
  });

  // keyboard + focus trap
  document.addEventListener("keydown", (e) => {
    if (!popupOpen) return;
    if (e.key === "Escape") closePopup();
    else if (e.key === "ArrowRight") goTo(current + 1);
    else if (e.key === "ArrowLeft") goTo(current - 1);
    else if (e.key === " " && !e.target.closest("button, a")) {
      e.preventDefault();
      setPaused(!paused);
    } else if (e.key.toLowerCase() === "m") setMuted(!muted);
    else if (e.key === "Tab") {
      const focusables = [...popup.querySelectorAll("button:not(:disabled), a[href]")];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // pause everything when the tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      video.pause();
      previews.forEach((v) => v.pause());
    } else if (popupOpen) {
      if (!paused) play();
    } else {
      visible.forEach(playPreview);
    }
  });

  // deep link: index.html#review-2 opens that review
  const match = location.hash.match(/^#review-(\d+)$/);
  if (match && reviews[match[1] - 1]) {
    muted = true; // no user gesture yet, so start muted
    openPopup(match[1] - 1);
  }
})();
// community-review-section js end--

// collection-category-slider js start--
var swiper = new Swiper(".collection-category-slider", {
  slidesPerView: "auto",
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  navigation: {
    nextEl: ".collection-category-button-next",
    prevEl: ".collection-category-button-prev",
  },
  breakpoints: {
    1: {
      spaceBetween: 10,
    },
    576: {
      spaceBetween: 20,
    },
  },
});
// collection-category-slider js end--

// collection filter js start---
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".collection-filter");

  // Filter sidebar
  document
    .querySelectorAll(
      ".filter-open-btn, .filter-window-close-btn, .filter-close-btn",
    )
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.classList.contains("filter-open-btn");

        sidebar?.classList.toggle("active", open);
        document.body.classList.toggle("active", open);
      });
    });

  // Accordion
  document.querySelectorAll(".accordion-toggle-btn").forEach((btn) => {
    const content = btn.nextElementSibling;

    content.style.maxHeight = `${content.scrollHeight}px`;
    btn.parentElement.classList.add("active");

    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("active");

      content.style.maxHeight = content.style.maxHeight
        ? null
        : `${content.scrollHeight}px`;
    });
  });
});
// collection filter js end---

// product-slider js start---
var swiper = new Swiper(".product-slider-thumb", {
  direction: "vertical",
  loop: false,
  spaceBetween: 8,
  slidesPerView: "auto",
  freeMode: true,
  mousewheel: true,
  watchSlidesProgress: true,
  breakpoints: {
    // when window width is >= 320px
    1: {
      direction: "horizontal",
      spaceBetween: 8,
    },
    // when window width is >= 768px
    768: {
      direction: "vertical",
      spaceBetween: 8,
    },
  },
});
var swiper2 = new Swiper(".product-slider", {
  loop: true,
  autoHeight: true,
  spaceBetween: 10,
  pagination: {
    el: ".product-slider-pagination",
    clickable: true,
  },
  thumbs: {
    swiper: swiper,
  },
});
// product-slider js end---

// Product Slider Modal
const productModal = document.querySelector(".product-slider-modal");

document
  .querySelector(".product-slider .swiper-wrapper")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.add("active");
  });

document
  .querySelector(".product-slider-modal-close")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.remove("active");
  });

productModal?.addEventListener("click", () => {
  productModal.classList.remove("active");
});

// Size Chart Sidebar
const sizeSidebar = document.querySelector(".size-chart-sidebar");
const sizeSidebarInner = document.querySelector(".size-chart-sidebar-inner");

const toggleSizeChart = (open, e) => {
  e?.stopPropagation();

  sizeSidebar?.classList.toggle("active", open);
  sizeSidebarInner?.classList.toggle("active", open);
  document.body.classList.toggle("active", open);
};

document
  .querySelector(".size-sidebar-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(true, e));

document
  .querySelector(".size-chart-sidebar-close-window-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

document
  .querySelector(".size-chart-close-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

// product accordion--
document.addEventListener("click", ({ target }) => {
  const btn = target.closest(".product-accordion-toggle-btn");
  if (!btn) return;

  const item = btn.closest(".product-accordion-item");
  const content = btn.nextElementSibling;
  const isOpen = item.classList.contains("active");

  document.querySelectorAll(".product-accordion-item.active").forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".product-accordion-item-content").style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});

// open first product-accordion-item by default--
document.querySelectorAll(".product-accordion-items").forEach((group) => {
  const firstItem = group.querySelector(".product-accordion-item");
  if (!firstItem) return;

  firstItem.classList.add("active");
  const content = firstItem.querySelector(".product-accordion-item-content");
  content.style.maxHeight = `${content.scrollHeight}px`;
});

// product price format js start--
const formatPrice = (price) =>
  "Tk " +
  Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
// product price format js end--

// product-stock js start--
(() => {
  const productSection = document.querySelector(".product-section");
  const stockBar = document.querySelector(".product-stock-bar");
  if (!productSection || !stockBar) return;

  const stock = Number(productSection.dataset.stock);
  const stockMax = Number(productSection.dataset.stockMax) || stock;

  stockBar.style.setProperty("--stock", `${Math.min(100, (stock / stockMax) * 100)}%`);
})();
// product-stock js end--

// product bundle js start--
(() => {
  const productSection = document.querySelector(".product-section");
  if (!productSection?.dataset.price) return;

  const price = Number(productSection.dataset.price);

  document.querySelectorAll(".bundle-item").forEach((item) => {
    const input = item.querySelector("input");
    const quantity = Number(input.value);
    const discount = Number(input.dataset.discount) || 0;
    const fullPrice = price * quantity;
    const totalPrice = fullPrice * (1 - discount / 100);

    item.querySelector(".bundle-total-price").textContent = formatPrice(totalPrice);

    const previousPrice = item.querySelector(".bundle-previous-price");
    if (previousPrice && discount) previousPrice.textContent = formatPrice(fullPrice);

    const singlePrice = item.querySelector(".bundle-single-price");
    if (singlePrice && quantity > 1) singlePrice.textContent = `${formatPrice(totalPrice / quantity)}/Pcs`;
  });
})();

// selected bundle quantity
const getBundleQuantity = () =>
  Number(document.querySelector(".bundle-item input:checked")?.value) || 1;

// bundle offer for any quantity (biggest bundle not above quantity)
const getBundleOffer = (quantity) => {
  const offers = [...document.querySelectorAll(".bundle-item input")]
    .map((input) => ({
      quantity: Number(input.value),
      discount: Number(input.dataset.discount) || 0,
      freeDelivery: input.hasAttribute("data-free-delivery"),
    }))
    .filter((offer) => offer.quantity <= quantity)
    .sort((a, b) => b.quantity - a.quantity);

  return offers[0] || { discount: 0, freeDelivery: false };
};
// product bundle js end--

// product add-to-cart js start--
const addToCart = (btn, event) => {
  if (btn.classList.contains("loading")) return;

  const btnText = btn.innerHTML;
  btn.classList.add("loading");

  setTimeout(() => {
    document.querySelectorAll(".cart-count").forEach((count) => {
      count.textContent = (parseInt(count.textContent, 10) || 0) + getBundleQuantity();
    });

    btn.classList.remove("loading");
    btn.classList.add("added");
    btn.textContent = "Added ✓";
    openCartDrawer(event);

    setTimeout(() => {
      btn.classList.remove("added");
      btn.innerHTML = btnText;
    }, 1800);
  }, 500);
};

document
  .querySelectorAll(".product-add-to-cart-btn, .sticky-add-to-cart-section .btn")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => addToCart(btn, event));
  });
// product add-to-cart js end--

// product-delivery-countdown js start--
(() => {
  const countdownTimer = document.querySelector(".order-countdown-timer");
  const shippingDay = document.querySelector(".order-shipping-day");
  if (!countdownTimer || !shippingDay) return;

  const resetHour = 24; // countdown resets at midnight
  const leadDays = 2; // delivery after 2 days

  const getNextResetTime = () => {
    const reset = new Date();
    reset.setHours(resetHour, 0, 0, 0);
    if (reset <= new Date()) reset.setDate(reset.getDate() + 1);
    return reset;
  };

  const updateShippingDay = () => {
    const date = new Date();
    date.setDate(date.getDate() + leadDays);
    shippingDay.textContent = date.toLocaleDateString("en-US", { weekday: "long" });
  };

  let deadline = getNextResetTime();

  const updateCountdown = () => {
    let diff = deadline - new Date();

    if (diff <= 0) {
      deadline = getNextResetTime();
      diff = deadline - new Date();
      updateShippingDay();
    }

    const pad = (time) => String(Math.floor(time)).padStart(2, "0");
    countdownTimer.textContent = `${pad(diff / 3600000)} : ${pad((diff / 60000) % 60)} : ${pad((diff / 1000) % 60)}`;
  };

  updateShippingDay();
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
// product-delivery-countdown js end--

// product-tab js start--
document.addEventListener("click", ({ target }) => {
  const tab = target.closest(".product-tab-nav-item");
  if (!tab) return;

  const targetId = tab.dataset.productTab;

  document
    .querySelectorAll(".product-tab-nav-item, .product-tab-panel")
    .forEach((el) =>
      el.classList.toggle("active", el === tab || el.id === targetId),
    );
});
// product-tab js end--

// buy-now-popup js start--
(() => {
  const popup = document.querySelector(".buy-now-popup");
  const productSection = document.querySelector(".product-section");
  if (!popup || !productSection?.dataset.price) return;

  const price = Number(productSection.dataset.price);
  const form = popup.querySelector(".buy-now-popup-form");
  const quantityCount = popup.querySelector(".buy-now-popup-quantity-count");
  const quantityBadge = popup.querySelector(".buy-now-popup-qty-badge");
  const formSummary = form.querySelector(".buy-now-popup-summary");
  const successSummary = popup.querySelector(".buy-now-popup-success .buy-now-popup-summary");

  let quantity = 1;

  const getTotals = () => {
    const offer = getBundleOffer(quantity);
    const shippingInput = form.querySelector("input[name=shipping]:checked");
    const subtotal = price * quantity;
    const discount = subtotal * (offer.discount / 100);
    const shipping = offer.freeDelivery ? 0 : Number(shippingInput.value);

    return {
      offer,
      subtotal,
      discount,
      shipping,
      shippingLabel: shippingInput.dataset.label,
      total: subtotal - discount + shipping,
    };
  };

  const summaryHTML = (totals) => `
    <p><span>Subtotal</span><span>${formatPrice(totals.subtotal)}</span></p>
    <p><span>Discount</span><span>- ${formatPrice(totals.discount)}</span></p>
    <p><span>Shipping (${totals.shippingLabel})</span><span>${totals.shipping ? formatPrice(totals.shipping) : "Free"}</span></p>
    <p class="total"><span>Total</span><span>${formatPrice(totals.total)}</span></p>`;

  const updatePopup = () => {
    const totals = getTotals();
    const offerText = [];

    if (totals.offer.discount) offerText.push(`Bundle offer · Save ${totals.offer.discount}%`);
    if (totals.offer.freeDelivery) offerText.push("Free Delivery 🚚");

    quantityCount.textContent = quantity;
    quantityBadge.textContent = quantity;
    popup.querySelector(".buy-now-popup-product-offer").textContent = offerText.join(" + ");
    popup.querySelector(".buy-now-popup-product-price").textContent = formatPrice(totals.subtotal - totals.discount);
    formSummary.innerHTML = summaryHTML(totals);
  };

  const openPopup = () => {
    quantity = getBundleQuantity();
    popup.classList.remove("success");
    updatePopup();
    popup.classList.add("active");
    document.body.classList.add("active");
    setTimeout(() => form.elements.phone.focus(), 100);
  };

  const closePopup = () => {
    if (popup.classList.contains("success")) form.reset();
    popup.classList.remove("active");
    document.body.classList.remove("active");
  };

  document.querySelectorAll(".buy-now-popup-open").forEach((btn) => {
    btn.addEventListener("click", openPopup);
  });

  popup
    .querySelectorAll(".buy-now-popup-close-window-btn, .buy-now-popup-close-btn, .buy-now-popup-continue-btn")
    .forEach((btn) => {
      btn.addEventListener("click", closePopup);
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) closePopup();
  });

  popup.querySelector(".buy-now-popup-quantity-increase").addEventListener("click", () => {
    quantity = Math.min(99, quantity + 1);
    updatePopup();
  });

  popup.querySelector(".buy-now-popup-quantity-decrease").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    updatePopup();
  });

  form.querySelectorAll("input[name=shipping]").forEach((input) => {
    input.addEventListener("change", updatePopup);
  });

  // form validation (bangla digits and +88 allowed)
  const toEnglishDigit = (value) => value.replace(/[০-৯]/g, (digit) => "০১২৩৪৫৬৭৮৯".indexOf(digit));
  const formatPhone = (value) => toEnglishDigit(value).replace(/[\s-]/g, "").replace(/^\+?88/, "");

  const rules = {
    phone: (value) => /^01[3-9]\d{8}$/.test(formatPhone(value)),
    address: (value) => value.trim().length >= 8,
    name: (value) => value.trim().length >= 2,
  };

  const validateField = (input) => {
    const isValid = rules[input.name](input.value);
    input.closest(".buy-now-popup-field").classList.toggle("invalid", !isValid);
    return isValid;
  };

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => input.value && validateField(input));
    input.addEventListener("input", () => input.closest(".invalid") && validateField(input));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const invalidFields = Object.keys(rules)
      .map((name) => form.elements[name])
      .filter((input) => !validateField(input));

    if (invalidFields.length) return invalidFields[0].focus();

    const submitBtn = form.querySelector(".buy-now-popup-submit-btn");
    const totals = getTotals();
    const order = {
      id: "EM" + Date.now().toString().slice(-7),
      name: form.elements.name.value.trim(),
      phone: formatPhone(form.elements.phone.value),
      address: form.elements.address.value.trim(),
      note: form.elements.note.value.trim(),
      product: document.querySelector(".product-title").textContent.trim(),
      quantity,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      shippingArea: totals.shippingLabel,
      total: totals.total,
    };

    // send this order to your server / google sheet here
    document.dispatchEvent(new CustomEvent("buy-now-order", { detail: order }));

    submitBtn.classList.add("loading");

    setTimeout(() => {
      submitBtn.classList.remove("loading");
      popup.querySelector(".buy-now-popup-customer-name").textContent = order.name;
      popup.querySelector(".buy-now-popup-customer-phone").textContent = order.phone;
      popup.querySelector(".buy-now-popup-order-id strong").textContent = order.id;
      successSummary.innerHTML = summaryHTML(totals);
      popup.classList.add("success");
    }, 700);
  });
})();
// buy-now-popup js end--

// make it short, dinamic and production ready

// review-tab-section js start--
document.addEventListener("click", ({ target }) => {
  const tab = target.closest(".review-tab-nav-item");
  if (!tab) return;

  const targetId = tab.dataset.reviewTab;

  document
    .querySelectorAll(".review-tab-nav-item, .review-tab-panel")
    .forEach((el) =>
      el.classList.toggle("active", el === tab || el.id === targetId),
    );
});
// review-tab-section js end--

// Sticky Add to Cart
(() => {
  const stickyCart = document.querySelector(".sticky-add-to-cart-section");
  if (!stickyCart) return;

  const updateStickyCart = () => {
    stickyCart.classList.toggle("fixed", window.scrollY > 300);
  };

  updateStickyCart();
  window.addEventListener("scroll", updateStickyCart, { passive: true });
})();

// Footer dropdown responsive accordion js start --
document.addEventListener("DOMContentLoaded", () => {
  const breakpoint = window.matchMedia("(max-width: 992px)");
  const items = document.querySelectorAll(".footer-item");

  const closeItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.remove("active");
    content.style.maxHeight = "0px";
  };

  const openItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const setupAccordion = () => {
    items.forEach((item) => {
      const title = item.querySelector(".footer-item-title");
      const content = item.querySelector(".footer-content");

      if (!title || !content) return;

      // Remove previous inline state
      title.onclick = null;

      if (!breakpoint.matches) {
        item.classList.remove("active");
        content.style.maxHeight = "";
        return;
      }

      // Mobile: close initially
      closeItem(item);

      title.onclick = () => {
        const isActive = item.classList.contains("active");

        // Close others
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        // Toggle current
        isActive ? closeItem(item) : openItem(item);
      };
    });
  };

  setupAccordion();

  // Handle responsive resize
  breakpoint.addEventListener("change", setupAccordion);
});
// Footer dropdown responsive accordion js end --
