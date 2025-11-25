// Simple product data (used on product page)
const product = {
  id: "SNK-001",
  name: "Minimal Sneakers",
  price: 5999, // INR
  image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
  thumbs: [
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
  ],
};

const currency = (v) => `₹${v.toLocaleString("en-IN")}`;

// LocalStorage cart utils
const CART_KEY = "shoplite_cart";
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function cartCount() {
  return readCart().reduce((acc, it) => acc + it.qty, 0);
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = String(cartCount());
}

function addToCart(item) {
  const cart = readCart();
  const key = `${item.id}_${item.size}`;
  const idx = cart.findIndex((c) => `${c.id}_${c.size}` === key);
  if (idx >= 0) {
    cart[idx].qty += item.qty;
  } else {
    cart.push(item);
  }
  writeCart(cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(key) {
  const cart = readCart().filter((c) => `${c.id}_${c.size}` !== key);
  writeCart(cart);
  updateCartCount();
  renderCart();
}

// Image thumbs (product page)
function initGallery() {
  const main = document.getElementById("main-image");
  const thumbs = document.querySelectorAll(".thumb");
  if (!main || !thumbs.length) return;
  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      thumbs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      main.src = t.src;
    });
  });
}

// Size select
function initSizes() {
  const sizeBtns = Array.from(document.querySelectorAll(".size"));
  if (!sizeBtns.length) return;
  sizeBtns.forEach((btn) => btn.addEventListener("click", () => {
    sizeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }));
}

// Quantity controls
function initQty() {
  const dec = document.getElementById("qty-dec");
  const inc = document.getElementById("qty-inc");
  const input = document.getElementById("qty-input");
  if (!dec || !inc || !input) return;
  dec.addEventListener("click", () => {
    const val = Math.max(1, parseInt(input.value || "1", 10) - 1);
    input.value = String(val);
  });
  inc.addEventListener("click", () => {
    const val = Math.min(99, parseInt(input.value || "1", 10) + 1);
    input.value = String(val);
  });
}

// Cart drawer
function openDrawer() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("drawer-backdrop").classList.add("show");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("drawer-backdrop").classList.remove("show");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
}

function initDrawer() {
  const openBtn = document.getElementById("open-cart");
  const closeBtn = document.getElementById("close-cart");
  const backdrop = document.getElementById("drawer-backdrop");
  if (openBtn) openBtn.addEventListener("click", (e) => { e.preventDefault(); openDrawer(); });
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);
}

// Render cart
function renderCart() {
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  const items = readCart();
  if (!list || !total) return;
  list.innerHTML = items.map((it) => `
    <div class="cart-item">
      <img src="${it.image}" alt="${it.name}">
      <div>
        <div class="cart-item-title">${it.name}</div>
        <div class="cart-item-meta">Size ${it.size} • Qty ${it.qty}</div>
        <button class="cart-remove" data-key="${it.id}_${it.size}">Remove</button>
      </div>
      <div>${currency(it.price * it.qty)}</div>
    </div>
  `).join("");
  const sum = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  total.textContent = currency(sum);
  list.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.key));
  });
}

// Add to cart action
function initATC() {
  const btnATC = document.getElementById("add-to-cart");
  const btnBuy = document.getElementById("buy-now");
  if (!btnATC || !btnBuy) return;
  btnATC.addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.getElementById("qty-input").value || "1", 10));
    const sizeBtn = document.querySelector(".size.active");
    const size = sizeBtn ? sizeBtn.dataset.size : "N/A";
    addToCart({ id: product.id, name: product.name, price: product.price, qty, size, image: document.getElementById("main-image").src });
    openDrawer();
  });
  btnBuy.addEventListener("click", () => {
    const qty = Math.max(1, parseInt(document.getElementById("qty-input").value || "1", 10));
    const sizeBtn = document.querySelector(".size.active");
    const size = sizeBtn ? sizeBtn.dataset.size : "N/A";
    writeCart([{ id: product.id, name: product.name, price: product.price, qty, size, image: document.getElementById("main-image").src }]);
    updateCartCount();
    renderCart();
    openDrawer();
  });
}

// ---------------- Home page helpers ----------------
const sampleProducts = [
  { id: "SNK-001", name: "Minimal Sneakers", price: 5999, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop", tag: "sneakers" },
  { id: "TSH-002", name: "Essential Tee", price: 1299, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop", tag: "apparel" },
  { id: "BAG-003", name: "City Backpack", price: 3499, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop", tag: "accessories" },
  { id: "SNK-004", name: "Runner Pro", price: 6999, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", tag: "sneakers" },
  { id: "CAP-005", name: "Classic Cap", price: 799, img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=800&auto=format&fit=crop", tag: "accessories" },
  { id: "HDY-006", name: "Soft Hoodie", price: 2399, img: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?q=80&w=800&auto=format&fit=crop", tag: "apparel" },
];

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="card reveal">
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-meta">
          <span class="price-sm">${currency(p.price)}</span>
          <a class="btn ghost" href="product.html">View</a>
        </div>
        <button class="btn primary" data-atc='${JSON.stringify({id:p.id,name:p.name,price:p.price,img:p.img})}'>Add to cart</button>
      </div>
    </div>
  `).join("");
  // Attach ATC listeners
  grid.querySelectorAll("[data-atc]").forEach(btn => {
    btn.addEventListener("click", () => {
      const data = JSON.parse(btn.getAttribute("data-atc"));
      addToCart({ id: data.id, name: data.name, price: data.price, qty: 1, size: "—", image: data.img });
      openDrawer();
    });
  });
}

function initCategoryFilters() {
  const cards = document.querySelectorAll(".category-card");
  const search = document.getElementById("search");
  if (!cards.length && !search) return;
  let currentFilter = "all";
  function apply() {
    const q = (search?.value || "").toLowerCase();
    const list = sampleProducts.filter(p => (currentFilter === "all" || p.tag === currentFilter) && p.name.toLowerCase().includes(q));
    renderProducts(list);
    triggerReveal();
  }
  cards.forEach(c => c.addEventListener("click", () => { currentFilter = c.dataset.filter || "all"; apply(); }));
  if (search) search.addEventListener("input", apply);
  apply();
}

function initHeroSlider() {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("hero-dots");
  if (!slides.length || !dotsWrap) return;
  let i = 0; let timer;
  function go(n){
    slides.forEach((s, idx) => s.classList.toggle("active", idx === n));
    dotsWrap.querySelectorAll("button").forEach((d, idx) => d.classList.toggle("active", idx === n));
    i = n;
  }
  function play(){ timer = setInterval(() => go((i+1)%slides.length), 4000); }
  function stop(){ clearInterval(timer); }
  dotsWrap.innerHTML = slides.map((_, idx) => `<button ${idx===0?"class=\"active\"":""}></button>`).join("");
  dotsWrap.querySelectorAll("button").forEach((d, idx) => d.addEventListener("click", () => { stop(); go(idx); play(); }));
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", play);
  go(0); play();
}

// Reveal on scroll
function triggerReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    if (email) alert('Thanks for subscribing!');
    form.reset();
  });
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  // Product page initializers (guarded)
  initGallery();
  initSizes();
  initQty();
  initATC();

  // Shared/cart
  initDrawer();
  updateCartCount();
  renderCart();

  // Home page initializers (guarded)
  initHeroSlider();
  initCategoryFilters();
  initNewsletter();
  triggerReveal();
});


