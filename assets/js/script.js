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
  slidesPerView: 4,
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
  const unitPrice = Number(productSection.dataset.price) * (1 - offer.discount / 100);
  const title = document.querySelector(".product-title").textContent.trim();
  const img = document.querySelector(".product-slider .swiper-slide:not(.swiper-slide-duplicate) img");

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
  .querySelectorAll(".product-add-to-cart-btn, .sticky-add-to-cart-section .btn")
  .forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const { item, quantity } = getProductPageItem();
      addToCart(btn, event, item, quantity);
    });
  });

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
    url: card.querySelector(".card-title")?.getAttribute("href") || "product.html",
  });
});

// community review popup add to cart
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".community-review-popup-btn-wrap .btn");
  if (!btn) return;
  event.preventDefault();

  const popup = btn.closest(".community-review-popup");
  const title = popup.querySelector(".community-review-popup-product-title")?.textContent.trim() || "";
  const img = popup.querySelector(".community-review-popup-product-img img")?.getAttribute("src") || "";

  addItemToCart({
    id: img || title,
    title,
    img,
    price: parsePrice(popup.querySelector(".community-review-popup-product-price .curr")?.textContent),
    url: "product.html",
  });

  // close popup, then show cart
  popup.querySelector(".community-review-popup-close-btn")?.click();
  openCartDrawer(event);
});

renderCart();
// cart js end--

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
    const comparePrice = parsePrice(document.querySelector(".product-price-wrap .previous-price")?.textContent) * quantity;

    latestPrice.textContent = formatPrice(fullPrice * (1 - offer.discount / 100));
    if (previousPrice) previousPrice.textContent = formatPrice(offer.discount ? fullPrice : comparePrice);
  };

  updateStickyPrice();
  document.querySelectorAll(".bundle-item input").forEach((input) => {
    input.addEventListener("change", updateStickyPrice);
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
