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

// smart sticky header js start ---
// scroll down → announce bar + header hide
// scroll up a little → only header shows
// at the very top → announce bar + header show
(() => {
  const header = document.querySelector(".header");
  if (!header) return;

  const announce = document.querySelector(".announcebar-section");

  // header uses transform, so fixed popups inside it would be trapped in the header box.
  // move them to body so they cover the full screen and sit above the announce bar
  header
    .querySelectorAll(".search-bar-wrap, .mobile-menu-wrap")
    .forEach((popup) => document.body.appendChild(popup));
  const root = document.documentElement;
  const showAfterUp = 10; // px of upward scroll before header shows
  const topZone = 5; // px from top that counts as "at top"

  // body has `transition: all 2s` in main.css, padding must apply instantly
  document.body.style.transition = "all ease 2s, padding-top 0s";

  // both bars are fixed, so give the page the same space on top
  const setSizes = () => {
    const announceH = announce ? announce.offsetHeight : 0;
    root.style.setProperty("--announce-h", `${announceH}px`);
    root.style.setProperty("--header-h", `${header.offsetHeight}px`);
    document.body.style.paddingTop = `${announceH + header.offsetHeight}px`;
  };

  setSizes();
  window.addEventListener("resize", setSizes, { passive: true });
  window.addEventListener("load", setSizes);

  let lastY = window.scrollY;
  let upDistance = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const diff = y - lastY;
    lastY = y;

    // keep bars as they are while a popup / drawer is open
    if (document.body.classList.contains("active")) return;

    if (y <= topZone) {
      root.classList.remove("page-scroll-down", "page-scroll-up");
      upDistance = 0;
    } else if (diff > 0) {
      root.classList.add("page-scroll-down");
      root.classList.remove("page-scroll-up");
      upDistance = 0;
    } else if (diff < 0) {
      upDistance -= diff;
      if (upDistance >= showAfterUp) {
        root.classList.add("page-scroll-up");
        root.classList.remove("page-scroll-down");
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
})();
// smart sticky header js end ---

// navbar search open js start ---
// product list used by search (bangla title + english tags for english search)
const searchProducts = [
  { id: 286, title: "কিউট বেবি ক্যাপ", category: "Baby Care", price: 600, oldPrice: 0, tags: "baby cap hat" },
  { id: 243, title: "শিশুর মাথার সুরক্ষায় বেবি সেফটি হেলমেট", category: "Baby Care", price: 350, oldPrice: 590, tags: "baby safety helmet head" },
  { id: 244, title: "শিশু কোলে নেওয়ার আরামদায়ক মাল্টি-ফাংশনাল কেরিয়ার ব্যাগ", category: "Baby Care", price: 750, oldPrice: 1100, tags: "baby carrier sling bag" },
  { id: 251, title: "শিশুদের রোদ থেকে রক্ষার সান হ্যাট (টুপি)", category: "Baby Care", price: 450, oldPrice: 990, tags: "kids sun hat cap" },
  { id: 252, title: "বাচ্চাদের নিরাপদ ভ্রমণের জন্য বেবি রাইডিং সেফটি বেল্ট", category: "Baby Care", price: 890, oldPrice: 990, tags: "baby riding safety belt harness" },
  { id: 253, title: "বাচ্চাদের প্রিমিয়াম কোয়ালিটির টিফিন বক্স", category: "Baby Care", price: 1250, oldPrice: 1800, tags: "kids tiffin lunch box" },
  { id: 277, title: "গাছের ডালপালা কাটিং টুল", category: "Garden & Outdoor", price: 240, oldPrice: 350, tags: "garden branch cutter pruner tool scissor" },
  { id: 296, title: "প্রিমিয়াম মাউস ট্র্যাপ", category: "Home & Kitchen", price: 480, oldPrice: 0, tags: "mouse trap rat" },
  { id: 290, title: "সুপার ক্লিনিং ন্যানো ম্যাজিক ইরেজার", category: "Home & Kitchen", price: 350, oldPrice: 0, tags: "magic eraser cleaning sponge" },
  { id: 269, title: "কিচেন ফেস প্রোটেকশন মাস্ক", category: "Home & Kitchen", price: 450, oldPrice: 780, tags: "kitchen face mask shield" },
  { id: 255, title: "ডোর ফোম - বাতাস, শব্দ ও পোকামাকড় প্রতিরোধক", category: "Home & Kitchen", price: 100, oldPrice: 220, tags: "door foam draft stopper" },
  { id: 292, title: "বি-ওয়াক্স ফার্নিচার পলিস", category: "Home & Kitchen", price: 480, oldPrice: 0, tags: "beewax furniture polish wax wood" },
  { id: 256, title: "আটোমেটিক দরজা বা জানালা বন্ধ করার ডিভাইস", category: "Home & Kitchen", price: 480, oldPrice: 790, tags: "automatic door closer" },
  { id: 267, title: "প্রিমিয়াম রেফ্রিজারেটর চাইল্ড লক", category: "Home & Kitchen", price: 350, oldPrice: 550, tags: "fridge refrigerator child lock" },
  { id: 287, title: "রেগুলার কিচেন এপ্রোন", category: "Home & Kitchen", price: 280, oldPrice: 400, tags: "kitchen apron" },
  { id: 264, title: "ফ্রিজ ধুলোমুক্ত রাখার কভার", category: "Home & Kitchen", price: 250, oldPrice: 500, tags: "fridge cover dust" },
  { id: 274, title: "প্রিমিয়াম কিচেন এপ্রোন", category: "Home & Kitchen", price: 500, oldPrice: 1250, tags: "premium kitchen apron" },
  { id: 293, title: "২ ইন ১ স্মার্ট অয়েল ডিসপেনসার বোতল", category: "Home & Kitchen", price: 450, oldPrice: 650, tags: "oil dispenser bottle spray" },
  { id: 260, title: "দাগ ও তেল দূরকারী শক্তিশালী কিচেন ফোম স্প্রে", category: "Home & Kitchen", price: 530, oldPrice: 790, tags: "kitchen foam cleaner spray" },
  { id: 263, title: "(6Pcs) ড্রয়ার গুছানোর প্লাস্টিক স্টোরেজ পার্টিশন", category: "Home & Kitchen", price: 450, oldPrice: 890, tags: "drawer organizer partition storage" },
  { id: 271, title: "মাল্টি-ফাংশনাল ক্যাবিনেট ও রেফ্রিজারেটর লক", category: "Home & Kitchen", price: 450, oldPrice: 900, tags: "cabinet fridge lock" },
  { id: 273, title: "পিভিসি কিচেন সিলিকন ডিশ ওয়াশিং হ্যান্ড গ্লাভস", category: "Home & Kitchen", price: 290, oldPrice: 490, tags: "kitchen gloves dish washing" },
  { id: 284, title: "সাদা চুল ঢাকার সহজ সমাধান", category: "Man’s Essentials", price: 380, oldPrice: 650, tags: "hair color white hair cover" },
  { id: 298, title: "V-Shape ফেস মাস্ক", category: "Women’s Essentials", price: 380, oldPrice: 0, tags: "v shape face mask lifting" },
  { id: 272, title: "ফেসিয়াল কটন থ্রেড হেয়ার রিমুভার", category: "Women’s Essentials", price: 480, oldPrice: 1200, tags: "facial thread hair remover" },
  { id: 283, title: "লিলি ফুল প্রিন্সেস বো হেয়ার ক্লিপ", category: "Women’s Essentials", price: 550, oldPrice: 650, tags: "lily bow hair clip" },
  { id: 294, title: "কানের দুলের সাপোর্ট স্টিকার", category: "Women’s Essentials", price: 350, oldPrice: 0, tags: "earring support sticker" },
  { id: 285, title: "হেয়ার অয়েল অ্যাপ্লিকেটর চিরুনি", category: "Women’s Essentials", price: 380, oldPrice: 650, tags: "hair oil applicator comb" },
  { id: 278, title: "লাল টিউলিপ বো হেয়ার ক্লিপ", category: "Women’s Essentials", price: 600, oldPrice: 750, tags: "red tulip bow hair clip" },
  { id: 268, title: "সেফটিপিন বিহীন প্রিমিয়াম কাপড় ক্লিপিং গান", category: "Women’s Essentials", price: 980, oldPrice: 1650, tags: "clothing tag gun" },
  { id: 279, title: "লাভ বো স্প্রিং ক্লিপ", category: "Women’s Essentials", price: 430, oldPrice: 550, tags: "love bow spring clip" },
  { id: 280, title: "ক্রিস্টাল বাটারফ্লাই ট্যাসেল হেয়ারপিন", category: "Women’s Essentials", price: 650, oldPrice: 850, tags: "butterfly crystal tassel hairpin" },
  { id: 281, title: "বাটারফ্লাই ফেয়ারি হেয়ার ক্লিপ", category: "Women’s Essentials", price: 550, oldPrice: 850, tags: "butterfly fairy hair clip" },
];

const searchCategories = [
  ["Baby Care", "baby-care"],
  ["Home & Kitchen", "home-kitchen"],
  ["Garden & Outdoor", "garden-outdoor"],
  ["Tools", "tools"],
  ["Lifestyle", "lifestyle"],
  ["Women’s Essentials", "womens-essentials"],
  ["Man’s Essentials", "mens-essentials"],
  ["Hair Accessories", "hair-accessories"],
];

const searchPopular = ["apron", "hair clip", "fridge", "baby safety", "kitchen", "face mask"];

(() => {
  const wrap = document.querySelector(".search-bar-wrap");
  if (!wrap) return;

  const input = wrap.querySelector(".search-input");
  const clearBtn = wrap.querySelector(".search-input-clear");
  const form = wrap.querySelector(".search-form");
  const defaultView = wrap.querySelector(".search-default");
  const resultsView = wrap.querySelector(".search-results");
  const emptyView = wrap.querySelector(".search-empty");
  const resultItems = wrap.querySelector(".search-result-items");
  const resultCount = wrap.querySelector(".search-results-count");
  const recentBlock = wrap.querySelector(".search-recent");
  const recentTags = wrap.querySelector(".search-recent-tags");
  const recentKey = "ehans-mart-recent-search";
  const maxResults = 6;

  const esc = (text) =>
    String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const money = (n) =>
    "Tk " +
    Number(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const normalize = (text) => String(text).toLowerCase().trim();
  const imgOf = (p) => `./assets/images/ehans-product-${p.id}-1.jpg`;

  const tagIcon =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M7.3 12.7a5.3 5.3 0 1 0 0-10.7 5.3 5.3 0 0 0 0 10.7ZM14 14l-2.9-2.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const clockIcon =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.2" stroke="currentColor" stroke-width="1.4"/><path d="M8 4.8V8l2.2 1.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const cartIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"/></svg>';

  const tagButtons = (list, icon) =>
    list
      .map((t) => `<button type="button" data-search="${esc(t)}">${icon}${esc(t)}</button>`)
      .join("");

  // recent searches (saved in browser)
  const getRecent = () => {
    try {
      return JSON.parse(localStorage.getItem(recentKey)) || [];
    } catch (e) {
      return [];
    }
  };

  const saveRecent = (term) => {
    term = term.trim();
    if (term.length < 2) return;
    const list = [term, ...getRecent().filter((t) => normalize(t) !== normalize(term))].slice(0, 6);
    try {
      localStorage.setItem(recentKey, JSON.stringify(list));
    } catch (e) {}
  };

  const renderRecent = () => {
    const list = getRecent();
    recentBlock.hidden = list.length === 0;
    recentTags.innerHTML = tagButtons(list, clockIcon);
  };

  // default view content
  wrap.querySelector(".search-popular-tags").innerHTML = tagButtons(searchPopular, tagIcon);
  wrap.querySelector(".search-empty-tags").innerHTML = tagButtons(searchPopular, tagIcon);
  wrap.querySelector(".search-categories").innerHTML = searchCategories
    .map(
      ([name, file]) => `
      <a href="collections.html" class="search-category" data-search="${esc(name)}">
        <div class="search-category-img"><img src="./assets/images/category-${file}.jpg" alt="${esc(name)}" loading="lazy"></div>
        <div class="search-category-content"><p class="title">${esc(name)}</p></div>
      </a>`,
    )
    .join("");

  // every typed word must match title / category / tags
  const findProducts = (query) => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return searchProducts
      .map((p) => {
        const title = normalize(p.title);
        const text = `${title} ${normalize(p.category)} ${normalize(p.tags)}`;
        if (!words.every((w) => text.includes(w))) return null;
        const score = words.reduce((s, w) => s + (title.includes(w) ? 2 : 1), 0);
        return { p, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.p);
  };

  const highlight = (title, query) => {
    let html = esc(title);
    normalize(query)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => {
        const safe = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        html = html.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
      });
    return html;
  };

  let focusIndex = -1;

  const showView = (view) => {
    defaultView.hidden = view !== "default";
    resultsView.hidden = view !== "results";
    emptyView.hidden = view !== "empty";
  };

  const render = () => {
    const query = input.value.trim();
    clearBtn.hidden = query.length === 0;
    focusIndex = -1;

    if (!query) {
      renderRecent();
      showView("default");
      return;
    }

    const found = findProducts(query);
    if (!found.length) {
      showView("empty");
      return;
    }

    resultCount.innerHTML = `<strong>${found.length}</strong> product${found.length > 1 ? "s" : ""} found for “${esc(query)}”`;
    resultItems.innerHTML = found
      .slice(0, maxResults)
      .map((p) => {
        const off = p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
        return `
        <a href="product.html" class="search-result-item" role="option" data-id="${p.id}">
          <div class="search-result-img"><img src="${imgOf(p)}" alt="${esc(p.title)}" loading="lazy"></div>
          <div class="search-result-content">
            <p class="search-result-category">${esc(p.category)}</p>
            <p class="search-result-title">${highlight(p.title, query)}</p>
            <div class="search-result-price">
              <span class="curr">${money(p.price)}</span>
              ${off ? `<span class="prev">${money(p.oldPrice)}</span><span class="off">-${off}%</span>` : ""}
            </div>
          </div>
          <button class="search-result-add" type="button" aria-label="add to cart">${cartIcon}</button>
        </a>`;
      })
      .join("");
    showView("results");
  };

  // debounce typing
  let typingTimer = 0;
  input.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(render, 120);
  });

  const setQuery = (term) => {
    input.value = term;
    render();
    input.focus();
  };

  clearBtn.addEventListener("click", () => setQuery(""));

  wrap.querySelector(".search-recent-clear").addEventListener("click", () => {
    try {
      localStorage.removeItem(recentKey);
    } catch (e) {}
    renderRecent();
  });

  // tags & categories fill the search box
  wrap.addEventListener("click", (e) => {
    const tag = e.target.closest("[data-search]");
    if (!tag || !wrap.contains(tag)) return;
    e.preventDefault();
    setQuery(tag.dataset.search);
  });

  // result: cart button adds to cart, item click saves recent search
  resultItems.addEventListener("click", (e) => {
    const item = e.target.closest(".search-result-item");
    if (!item) return;
    const addBtn = e.target.closest(".search-result-add");
    saveRecent(input.value);

    if (addBtn) {
      e.preventDefault();
      const p = searchProducts.find((x) => String(x.id) === item.dataset.id);
      addItemToCart({
        id: `ehans-${p.id}`,
        title: p.title,
        img: imgOf(p),
        price: p.price,
        url: "product.html",
      });
      addBtn.classList.add("added");
      setTimeout(() => addBtn.classList.remove("added"), 1200);
    }
  });

  // keyboard: ↑ ↓ to move, Enter to open
  input.addEventListener("keydown", (e) => {
    const items = [...resultItems.querySelectorAll(".search-result-item")];
    if (resultsView.hidden || !items.length) return;
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

    e.preventDefault();
    focusIndex = (focusIndex + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items.forEach((el, i) => el.classList.toggle("focused", i === focusIndex));
    items[focusIndex].scrollIntoView({ block: "nearest" });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const items = [...resultItems.querySelectorAll(".search-result-item")];
    if (resultsView.hidden || !items.length) return;
    saveRecent(input.value);
    window.location.href = items[Math.max(focusIndex, 0)].getAttribute("href");
  });

  // open / close
  const openSearch = () => {
    wrap.classList.add("active");
    document.body.classList.add("active");
    render();
    setTimeout(() => input.focus(), 150);
  };

  const closeSearch = () => {
    wrap.classList.remove("active");
    document.body.classList.remove("active");
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".search-bar-close") || e.target.closest(".search-bar-window-cls-btn")) {
      closeSearch();
      return;
    }
    if (e.target.closest(".navbar-search-open-btn")) openSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && wrap.classList.contains("active")) closeSearch();
  });
})();
// navbar search open js end ---

// mobile-menu sidebar js start---
const mobileMenu = document.querySelector(".mobile-menu-wrap");
const mobileMenuContainer = document.querySelector(".mobile-menu-container");

const hamburgers = document.querySelectorAll(".hamburger");

function openMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.add("active");
  mobileMenuContainer?.classList.add("active");
  hamburgers.forEach((btn) => btn.classList.add("active"));
}

function closeMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.remove("active");
  mobileMenuContainer?.classList.remove("active");
  hamburgers.forEach((btn) => btn.classList.remove("active"));
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
  loop: false,
  navigation: {
    nextEl: ".category-button-next",
    prevEl: ".category-button-prev",
  },
});
// category js end--

// card slider js start--
var swiper = new Swiper(".explore-slider", {
  slidesPerView: 5,
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
      slidesPerView: 4,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// community-review popup js start--
(function () {
  const items = document.querySelectorAll(".community-review-item");
  const popup = document.querySelector(".community-review-popup");

  if (!popup || !items.length) return;

  const slides = [...popup.querySelectorAll(".community-review-popup-slide")];
  const videos = slides.map((slide) =>
    slide.querySelector(".community-review-popup-video"),
  );
  const progressBars = [
    ...popup.querySelectorAll(".community-review-popup-progress-bar"),
  ];
  const prevBtn = popup.querySelector(".community-review-popup-nav-btn.prev");
  const nextBtn = popup.querySelector(".community-review-popup-nav-btn.next");
  const muteBtn = popup.querySelector(".community-review-popup-mute-btn");
  const productImg = popup.querySelector(
    ".community-review-popup-product-img img",
  );
  const productTitle = popup.querySelector(
    ".community-review-popup-product-title",
  );
  const productPrice = popup.querySelector(
    ".community-review-popup-product-price .curr",
  );
  const productPrevPrice = popup.querySelector(
    ".community-review-popup-product-price .prev",
  );

  let current = 0;
  let muted = true;

  function pauseAll() {
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;

    pauseAll();
    current = index;

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));

    progressBars.forEach((bar, i) => {
      bar.classList.toggle("completed", i < index);
      bar.querySelector("i").style.width = i < index ? "100%" : "0%";
    });

    const slide = slides[index];
    productImg.src = slide.dataset.productImg;
    productTitle.textContent = slide.dataset.productTitle;
    productPrice.textContent = slide.dataset.productPrice;
    productPrevPrice.textContent = slide.dataset.productPreviousPrice;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    const video = videos[index];
    video.muted = muted;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  function openPopup(index) {
    document.body.classList.add("active");
    popup.classList.add("active");
    goTo(index);
  }

  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("active");
    pauseAll();
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      openPopup(Number(item.dataset.reviewIndex) || 0);
    });
  });

  popup
    .querySelector(".community-review-popup-close-window-btn")
    .addEventListener("click", closePopup);
  popup
    .querySelector(".community-review-popup-close-btn")
    .addEventListener("click", closePopup);

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    videos[current].muted = muted;
    muteBtn.classList.toggle("unmuted", !muted);
  });

  popup.querySelectorAll(".community-review-popup-share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      }
    });
  });

  videos.forEach((video, i) => {
    video.addEventListener("timeupdate", () => {
      if (i !== current || !video.duration) return;
      progressBars[i].querySelector("i").style.width =
        (video.currentTime / video.duration) * 100 + "%";
    });

    video.addEventListener("ended", () => {
      if (i === current && current < slides.length - 1) {
        goTo(current + 1);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });
})();
// community-review popup js end--

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

  stockBar.style.setProperty(
    "--stock",
    `${Math.min(100, (stock / stockMax) * 100)}%`,
  );
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

    item.querySelector(".bundle-total-price").textContent =
      formatPrice(totalPrice);

    const previousPrice = item.querySelector(".bundle-previous-price");
    if (previousPrice && discount)
      previousPrice.textContent = formatPrice(fullPrice);

    const singlePrice = item.querySelector(".bundle-single-price");
    if (singlePrice && quantity > 1)
      singlePrice.textContent = `${formatPrice(totalPrice / quantity)}/Pcs`;
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

// cart js start--
// cart is saved in localStorage, so it stays same on every page
const cartKey = "ehans-mart-cart";
const cartItemsWrap = document.querySelector(".cart-drawer-items");

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch (e) {
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (e) {}
  renderCart(cart);
};

const parsePrice = (text) => Number(String(text).replace(/[^0-9.]/g, "")) || 0;

const escapeHTML = (text) =>
  String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const trashIcon = `<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.375 2H0.375C0.275544 2 0.180161 2.03951 0.109835 2.10983C0.0395088 2.18016 0 2.27554 0 2.375C0 2.47446 0.0395088 2.56984 0.109835 2.64017C0.180161 2.71049 0.275544 2.75 0.375 2.75H1V11.875C1 12.1071 1.09219 12.3296 1.25628 12.4937C1.42038 12.6578 1.64294 12.75 1.875 12.75H9.875C10.1071 12.75 10.3296 12.6578 10.4937 12.4937C10.6578 12.3296 10.75 12.1071 10.75 11.875V2.75H11.375C11.4745 2.75 11.5698 2.71049 11.6402 2.64017C11.7105 2.56984 11.75 2.47446 11.75 2.375C11.75 2.27554 11.7105 2.18016 11.6402 2.10983C11.5698 2.03951 11.4745 2 11.375 2ZM10 11.875C10 11.9082 9.98683 11.9399 9.96339 11.9634C9.93995 11.9868 9.90815 12 9.875 12H1.875C1.84185 12 1.81005 11.9868 1.78661 11.9634C1.76317 11.9399 1.75 11.9082 1.75 11.875V2.75H10V11.875ZM3 0.375C3 0.275544 3.03951 0.180161 3.10984 0.109835C3.18016 0.0395088 3.27554 0 3.375 0H8.375C8.47446 0 8.56984 0.0395088 8.64017 0.109835C8.71049 0.180161 8.75 0.275544 8.75 0.375C8.75 0.474456 8.71049 0.569839 8.64017 0.640165C8.56984 0.710491 8.47446 0.75 8.375 0.75H3.375C3.27554 0.75 3.18016 0.710491 3.10984 0.640165C3.03951 0.569839 3 0.474456 3 0.375Z" fill="black" /></svg>`;

function renderCart(cart = getCart()) {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });

  cartDrawer?.classList.toggle("blank", cart.length === 0);

  const title = document.querySelector(".cart-drawer-title span");
  if (title) title.textContent = `(${count} ${count === 1 ? "item" : "items"})`;

  const totalPrice = document.querySelector(".cart-drawer-total-price");
  if (totalPrice) totalPrice.textContent = formatPrice(total);

  if (!cartItemsWrap) return;

  cartItemsWrap.innerHTML = cart
    .map(
      (item, index) => `
      <div class="cart-drawer-item" data-index="${index}">
        <div class="cart-drawer-item-img">
          <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.title)}">
        </div>
        <div class="cart-drawer-item-content-wrap">
          <div class="cart-drawer-item-content-inner">
            <div class="cart-drawer-item-content">
              <a href="${escapeHTML(item.url)}" class="cart-drawer-item-title">${escapeHTML(item.title)}</a>
              <div class="content-btm">
                <div class="cart-drawer-item-qty-btn-wrap">
                  <button class="cart-drawer-item-qty-btn" type="button" data-cart-action="minus" aria-label="decrease quantity">-</button>
                  <input type="text" class="cart-drawer-item-qty-input" value="${item.qty}" readonly>
                  <button class="cart-drawer-item-qty-btn" type="button" data-cart-action="plus" aria-label="increase quantity">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-drawer-item-remove-btn-wrap">
            <button class="cart-drawer-item-remove-btn" type="button" data-cart-action="remove" aria-label="remove item">${trashIcon}</button>
            <p class="cart-drawer-item-price">${formatPrice(item.price * item.qty)}</p>
          </div>
        </div>
      </div>`,
    )
    .join("");
}

// add product (same product again = quantity up)
function addItemToCart(item, qty = 1) {
  const cart = getCart();
  const existing = cart.find((cartItem) => cartItem.id === item.id);

  if (existing) existing.qty += qty;
  else cart.push({ ...item, qty });

  saveCart(cart);
}

// plus / minus / remove inside cart drawer
cartItemsWrap?.addEventListener("click", ({ target }) => {
  const btn = target.closest("[data-cart-action]");
  if (!btn) return;

  const cart = getCart();
  const index = Number(btn.closest(".cart-drawer-item").dataset.index);
  const item = cart[index];
  if (!item) return;

  if (btn.dataset.cartAction === "plus") item.qty += 1;
  if (btn.dataset.cartAction === "minus") item.qty = Math.max(1, item.qty - 1);
  if (btn.dataset.cartAction === "remove") cart.splice(index, 1);

  saveCart(cart);
});

// button feedback: loading → Added ✓ → open cart drawer
const addToCart = (btn, event, item, qty = 1) => {
  if (btn.classList.contains("loading")) return;

  const btnText = btn.innerHTML;
  btn.classList.add("loading");

  setTimeout(() => {
    addItemToCart(item, qty);

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

// product page + sticky bar add to cart (selected bundle quantity & price)
const getProductPageItem = () => {
  const productSection = document.querySelector(".product-section");
  const quantity = getBundleQuantity();
  const offer = getBundleOffer(quantity);
  const unitPrice =
    Number(productSection.dataset.price) * (1 - offer.discount / 100);
  const title = document.querySelector(".product-title").textContent.trim();
  const img = document.querySelector(
    ".product-slider .swiper-slide:not(.swiper-slide-duplicate) img",
  );

  return {
    item: {
      id: `${title}-${unitPrice}`,
      title,
      img: img?.getAttribute("src") || "",
      price: unitPrice,
      url: "product.html",
    },
    quantity,
  };
};

document
  .querySelectorAll(".product-add-to-cart-btn")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const { item, quantity } = getProductPageItem();
      addToCart(btn, event, item, quantity);
      addBuyWithItems();
    });
  });

// buy it with: checked products go to cart with main product, then unchecked
function addBuyWithItems() {
  document
    .querySelectorAll(".product-buy-with-checkbox:checked")
    .forEach((checkbox) => {
      addItemToCart({
        id: checkbox.dataset.id,
        title: checkbox.dataset.title,
        img: checkbox.dataset.img,
        price: Number(checkbox.dataset.price),
        url: "product.html",
      });
      checkbox.checked = false;
    });
}

// product card add to cart (any page)
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".product-card .card-btn .btn");
  if (!btn) return;
  event.preventDefault();

  const card = btn.closest(".product-card");
  const title = card.querySelector(".card-title")?.textContent.trim() || "";
  const img = card.querySelector(".card_img")?.getAttribute("src") || "";

  addToCart(btn, event, {
    id: img || title,
    title,
    img,
    price: parsePrice(card.querySelector(".latest-price")?.textContent),
    url:
      card.querySelector(".card-title")?.getAttribute("href") || "product.html",
  });
});

// community review popup add to cart
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".community-review-popup-btn-wrap .btn");
  if (!btn) return;
  event.preventDefault();

  const popup = btn.closest(".community-review-popup");
  const title =
    popup
      .querySelector(".community-review-popup-product-title")
      ?.textContent.trim() || "";
  const img =
    popup
      .querySelector(".community-review-popup-product-img img")
      ?.getAttribute("src") || "";

  addItemToCart({
    id: img || title,
    title,
    img,
    price: parsePrice(
      popup.querySelector(".community-review-popup-product-price .curr")
        ?.textContent,
    ),
    url: "product.html",
  });

  // close popup, then show cart
  popup.querySelector(".community-review-popup-close-btn")?.click();
  openCartDrawer(event);
});

renderCart();
// cart js end--

// quick-view js start--
(() => {
  const quickView = document.querySelector(".quick-view");
  if (!quickView) return;

  const qvTitle = quickView.querySelector(".quick-view-title");
  const qvImages = quickView.querySelector(".quick-view-images");
  const qvPrevBtn = quickView.querySelector(".quick-view-images-btn.prev");
  const qvNextBtn = quickView.querySelector(".quick-view-images-btn.next");
  const qvLatest = quickView.querySelector(".quick-view-price .latest-price");
  const qvPrevious = quickView.querySelector(".quick-view-price .previous-price");
  const qvVariant = quickView.querySelector(".quick-view-variant");
  const qvVariantName = quickView.querySelector(".quick-view-variant-label .name");
  const qvVariantValue = quickView.querySelector(".quick-view-variant-label .value");
  const qvVariantOptions = quickView.querySelector(".quick-view-variant-options");
  const qvCount = quickView.querySelector(".quick-view-quantity-count");
  const qvAddBtn = quickView.querySelector(".quick-view-add-btn");
  const qvDetails = quickView.querySelector(".quick-view-details-btn");

  let product = null;
  let variants = [];
  let selected = null;
  let comparePrice = 0;
  let quantity = 1;

  // "1 Pc:450, 2 Pcs:860" → [{ label, price }]
  const parseVariants = (text = "") =>
    text
      .split(",")
      .map((part) => part.split(":").map((v) => v.trim()))
      .filter(([label, price]) => label && price)
      .map(([label, price]) => ({ label, price: Number(price) }));

  const selectVariant = (index) => {
    selected = variants[index];
    qvVariantValue.textContent = selected.label;
    qvLatest.textContent = formatPrice(selected.price);
    // old price follows pack size ("2 Pcs" → 2 × old price)
    const packCount = parseInt(selected.label, 10) || 1;
    qvPrevious.textContent = comparePrice ? formatPrice(comparePrice * packCount) : "";
    qvVariantOptions
      .querySelectorAll(".quick-view-variant-btn")
      .forEach((btn, i) => btn.classList.toggle("active", i === index));
  };

  // image slider arrows show/hide at the ends
  const updateImageArrows = () => {
    const max = qvImages.scrollWidth - qvImages.clientWidth - 2;
    qvPrevBtn.disabled = qvImages.scrollLeft <= 2;
    qvNextBtn.disabled = qvImages.scrollLeft >= max;
  };

  const slideImages = (dir) => {
    const img = qvImages.querySelector("img");
    const step = img ? img.getBoundingClientRect().width + 5 : qvImages.clientWidth;
    qvImages.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const openQuickView = (item) => {
    const images = item.dataset.images.split(",").map((src) => src.trim());

    product = {
      id: item.dataset.id,
      title: item.dataset.title,
      img: images[0],
      price: Number(item.dataset.price),
      url: item.dataset.url || "product.html",
    };
    quantity = 1;

    qvTitle.textContent = product.title;
    qvImages.innerHTML = images
      .map((src) => `<img src="${escapeHTML(src)}" alt="${escapeHTML(product.title)}" draggable="false">`)
      .join("");
    qvImages.scrollLeft = 0;
    qvLatest.textContent = formatPrice(product.price);
    comparePrice = Number(item.dataset.previousPrice) || 0;
    qvPrevious.textContent = comparePrice ? formatPrice(comparePrice) : "";

    // variants
    variants = parseVariants(item.dataset.variants);
    qvVariant.hidden = variants.length === 0;
    qvVariantName.textContent = item.dataset.variantName || "Option";
    qvVariantOptions.innerHTML = variants
      .map((v, i) => `<button class="btn quick-view-variant-btn" type="button" data-index="${i}">${escapeHTML(v.label)}</button>`)
      .join("");
    selected = null;
    if (variants.length) selectVariant(0);

    qvCount.textContent = quantity;
    qvDetails.href = product.url;

    quickView.classList.add("active");
    document.body.classList.add("active");
    requestAnimationFrame(updateImageArrows);
  };

  const closeQuickView = () => {
    quickView.classList.remove("active");
    document.body.classList.remove("active");
  };

  document.querySelectorAll(".quick-view-open").forEach((btn) => {
    btn.addEventListener("click", () => openQuickView(btn.closest("[data-images]")));
  });

  quickView
    .querySelectorAll(".quick-view-close-window-btn, .quick-view-close-btn")
    .forEach((btn) => btn.addEventListener("click", closeQuickView));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && quickView.classList.contains("active")) closeQuickView();
  });

  qvVariantOptions.addEventListener("click", ({ target }) => {
    const btn = target.closest(".quick-view-variant-btn");
    if (btn) selectVariant(Number(btn.dataset.index));
  });

  // image scroll: arrows, mouse wheel, drag
  qvPrevBtn.addEventListener("click", () => slideImages(-1));
  qvNextBtn.addEventListener("click", () => slideImages(1));
  qvImages.addEventListener("scroll", updateImageArrows, { passive: true });

  qvImages.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      qvImages.scrollLeft += e.deltaY;
    },
    { passive: false },
  );

  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragging = false;

  qvImages.addEventListener("mousedown", (e) => {
    dragging = true;
    dragStartX = e.pageX;
    dragStartScroll = qvImages.scrollLeft;
    qvImages.classList.add("dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    qvImages.scrollLeft = dragStartScroll - (e.pageX - dragStartX);
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    qvImages.classList.remove("dragging");
  });

  quickView.querySelector(".quick-view-quantity-increase").addEventListener("click", () => {
    quantity = Math.min(99, quantity + 1);
    qvCount.textContent = quantity;
  });

  quickView.querySelector(".quick-view-quantity-decrease").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    qvCount.textContent = quantity;
  });

  // add to cart (with selected variant) → close quick view → open cart drawer
  qvAddBtn.addEventListener("click", (event) => {
    if (!product) return;

    const item = selected
      ? {
          ...product,
          id: `${product.id}-${selected.label}`,
          title: `${product.title} (${selected.label})`,
          price: selected.price,
        }
      : product;

    addItemToCart(item, quantity);
    closeQuickView();
    openCartDrawer(event);
  });
})();
// quick-view js end--

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
  const successSummary = popup.querySelector(
    ".buy-now-popup-success .buy-now-popup-summary",
  );

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

    if (totals.offer.discount)
      offerText.push(`Bundle offer · Save ${totals.offer.discount}%`);
    if (totals.offer.freeDelivery) offerText.push("Free Delivery 🚚");

    quantityCount.textContent = quantity;
    quantityBadge.textContent = quantity;
    popup.querySelector(".buy-now-popup-product-offer").textContent =
      offerText.join(" + ");
    popup.querySelector(".buy-now-popup-product-price").textContent =
      formatPrice(totals.subtotal - totals.discount);
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
    .querySelectorAll(
      ".buy-now-popup-close-window-btn, .buy-now-popup-close-btn, .buy-now-popup-continue-btn",
    )
    .forEach((btn) => {
      btn.addEventListener("click", closePopup);
    });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) closePopup();
  });

  popup
    .querySelector(".buy-now-popup-quantity-increase")
    .addEventListener("click", () => {
      quantity = Math.min(99, quantity + 1);
      updatePopup();
    });

  popup
    .querySelector(".buy-now-popup-quantity-decrease")
    .addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      updatePopup();
    });

  form.querySelectorAll("input[name=shipping]").forEach((input) => {
    input.addEventListener("change", updatePopup);
  });

  // form validation (bangla digits and +88 allowed)
  const toEnglishDigit = (value) =>
    value.replace(/[০-৯]/g, (digit) => "০১২৩৪৫৬৭৮৯".indexOf(digit));
  const formatPhone = (value) =>
    toEnglishDigit(value)
      .replace(/[\s-]/g, "")
      .replace(/^\+?88/, "");

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
    input.addEventListener(
      "input",
      () => input.closest(".invalid") && validateField(input),
    );
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
      popup.querySelector(".buy-now-popup-customer-name").textContent =
        order.name;
      popup.querySelector(".buy-now-popup-customer-phone").textContent =
        order.phone;
      popup.querySelector(".buy-now-popup-order-id strong").textContent =
        order.id;
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

// sticky-add-to-cart js start--
(() => {
  const stickyCart = document.querySelector(".sticky-add-to-cart-section");
  if (!stickyCart) return;

  // show only after the main add to cart button is scrolled out of view
  const mainBtn = document.querySelector(".product-add-to-cart-btn");

  const updateStickyCart = () => {
    const passed = mainBtn
      ? mainBtn.getBoundingClientRect().bottom < 0
      : window.scrollY > 300;
    stickyCart.classList.toggle("show", passed);
  };

  updateStickyCart();
  window.addEventListener("scroll", updateStickyCart, { passive: true });
  window.addEventListener("resize", updateStickyCart, { passive: true });

  // sticky price follows the selected bundle
  const productSection = document.querySelector(".product-section");
  const latestPrice = stickyCart.querySelector(".latest-price");
  const previousPrice = stickyCart.querySelector(".previous-price");
  if (!productSection?.dataset.price || !latestPrice) return;

  const updateStickyPrice = () => {
    const quantity = getBundleQuantity();
    const offer = getBundleOffer(quantity);
    const fullPrice = Number(productSection.dataset.price) * quantity;
    const comparePrice =
      parsePrice(
        document.querySelector(".product-price-wrap .previous-price")
          ?.textContent,
      ) * quantity;

    latestPrice.textContent = formatPrice(
      fullPrice * (1 - offer.discount / 100),
    );
    if (previousPrice)
      previousPrice.textContent = formatPrice(
        offer.discount ? fullPrice : comparePrice,
      );
  };

  // selected bundle shown under title (coral variant line)
  const variantText = stickyCart.querySelector(".sticky-add-to-cart-variant");
  const updateStickyVariant = () => {
    const label = document.querySelector(
      ".bundle-item input:checked + .bundle-label .bundle-title",
    );
    if (variantText)
      variantText.textContent = label?.firstChild?.textContent.trim() || "";
  };

  updateStickyPrice();
  updateStickyVariant();
  document.querySelectorAll(".bundle-item input").forEach((input) => {
    input.addEventListener("change", () => {
      updateStickyPrice();
      updateStickyVariant();
    });
  });

  // sticky quantity (- 1 +)
  const qtyInput = stickyCart.querySelector(".sticky-quantity-input");
  const getStickyQty = () =>
    Math.min(99, Math.max(1, parseInt(qtyInput?.value, 10) || 1));

  stickyCart
    .querySelector(".sticky-quantity-decrease")
    ?.addEventListener("click", () => (qtyInput.value = Math.max(1, getStickyQty() - 1)));
  stickyCart
    .querySelector(".sticky-quantity-increase")
    ?.addEventListener("click", () => (qtyInput.value = Math.min(99, getStickyQty() + 1)));
  qtyInput?.addEventListener("change", () => (qtyInput.value = getStickyQty()));

  // sticky add to cart: selected bundle × sticky quantity
  const stickyBtn = stickyCart.querySelector(".sticky-add-to-cart-btn");
  stickyBtn?.addEventListener("click", (event) => {
    const { item, quantity } = getProductPageItem();
    addToCart(stickyBtn, event, item, quantity * getStickyQty());
    addBuyWithItems();
    qtyInput.value = 1;
  });
})();
// sticky-add-to-cart js end--

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
