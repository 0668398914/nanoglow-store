/* ===== STATE ===== */
let selectedColor = 'blue';
let selectedBundle = 1;
let cartItems = [];

const bundles = {
  1: { qty: 1, price: 19.99, old: 39.99 },
  2: { qty: 2, price: 34.99, old: 79.98 },
  3: { qty: 3, price: 47.99, old: 119.97 },
};

const colorLabels = { blue: 'Blue', pink: 'Pink' };

/* ===== BUNDLE ===== */
function selectBundle(n) {
  selectedBundle = n;
  const b = bundles[n];
  const saved = (b.old - b.price).toFixed(2);
  const pct = Math.round((saved / b.old) * 100);

  document.getElementById('pdNew').textContent = '$' + b.price.toFixed(2);
  document.getElementById('pdOld').textContent = '$' + b.old.toFixed(2);
  document.getElementById('pdSave').textContent = `You Save $${saved} (${pct}%)`;
  document.getElementById('ctaPrice').textContent = '$' + b.price.toFixed(2);
  document.getElementById('stickyPrice').textContent = '$' + b.price.toFixed(2);
}

/* ===== COLOR ===== */
function pickColor(color) {
  selectedColor = color;
  document.getElementById('swBlue').classList.toggle('active', color === 'blue');
  document.getElementById('swPink').classList.toggle('active', color === 'pink');
  document.getElementById('colorLabel').textContent = colorLabels[color];

  const src = `images/${color}.png`;
  const img = document.getElementById('mainImg');
  img.style.opacity = '0';
  setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200);
}

/* ===== GALLERY THUMBS ===== */
function setImg(el, src) {
  document.querySelectorAll('.strip-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const img = document.getElementById('mainImg');
  img.style.opacity = '0';
  setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200);
}

/* ===== STRIP SCROLL ===== */
function slideStrip(dir) {
  const strip = document.getElementById('strip');
  strip.scrollBy({ left: dir * 160, behavior: 'smooth' });
}

/* ===== TABS ===== */
function switchTab(btn, panelId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

/* ===== CART ===== */
function addToCart() {
  const b = bundles[selectedBundle];
  const key = `${selectedColor}-${selectedBundle}`;
  const existing = cartItems.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({
      key, color: selectedColor, bundle: selectedBundle,
      qty: 1, price: b.price,
      label: `${colorLabels[selectedColor]} × ${b.qty} device${b.qty > 1 ? 's' : ''}`
    });
  }
  renderCart();
  openCart();
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const count = cartItems.reduce((s, i) => s + i.qty, 0);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = count;

  if (!cartItems.length) {
    body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    foot.style.display = 'none';
    return;
  }

  foot.style.display = 'block';
  document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);

  body.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item">
      <img src="images/${item.color}.png" alt="${item.label}"/>
      <div class="cart-item__info">
        <div class="cart-item__name">NanoGlow Spray Pro</div>
        <div class="cart-item__meta">${item.label} &bull; Qty: ${item.qty}</div>
        <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <button class="cart-item__rm" onclick="removeItem(${idx})">✕</button>
    </div>
  `).join('');
}

function removeItem(idx) {
  cartItems.splice(idx, 1);
  renderCart();
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);

function checkout() {
  closeCart();
  document.getElementById('modal').classList.add('open');
  cartItems = [];
  renderCart();
}

/* ===== MODAL ===== */
function closeModal() { document.getElementById('modal').classList.remove('open'); }
document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

/* ===== ACCORDION ===== */
function toggleAcc(btn) {
  const body = btn.nextElementSibling;
  const open = body.classList.contains('open');
  btn.classList.toggle('open', !open);
  body.classList.toggle('open', !open);
}

/* ===== STICKY CTA ===== */
const stickyCta = document.getElementById('stickyCta');
const ctaBtn = document.querySelector('.cta-btn');
const observer = new IntersectionObserver(([e]) => {
  stickyCta.classList.toggle('show', !e.isIntersecting);
}, { threshold: 0 });
observer.observe(ctaBtn);

/* ===== MOBILE NAV ===== */
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

/* ===== SCROLL REVEAL ===== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.benefit-card, .review-card, .timeline-card, .how-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  revealObs.observe(el);
});
