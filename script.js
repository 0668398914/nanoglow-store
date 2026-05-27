/* ===== STATE ===== */
let selectedColor = 'blue';
let qty = 1;
let cartItems = [];

const prices = {
  blue: { old: '$39.99', current: 19.99, label: 'Blue' },
  pink: { old: '$44.99', current: 24.99, label: 'Pink' },
};

/* ===== COLOR SELECT ===== */
function selectColor(color) {
  selectedColor = color;

  // Swatches
  document.getElementById('swatchBlue').classList.toggle('active', color === 'blue');
  document.getElementById('swatchPink').classList.toggle('active', color === 'pink');

  // Label
  document.getElementById('colorName').textContent = prices[color].label;

  // Price
  document.getElementById('priceOld').textContent = prices[color].old;
  document.getElementById('priceNew').textContent = '$' + prices[color].current.toFixed(2);

  // Main image
  const src = color === 'blue' ? 'images/blue.png' : 'images/pink.png';
  const mainImg = document.getElementById('mainImg');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = '1';
  }, 180);
}

/* ===== GALLERY THUMBS ===== */
function setThumb(el, src) {
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const mainImg = document.getElementById('mainImg');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = '1';
  }, 180);
}

/* ===== QTY ===== */
function changeQty(delta) {
  qty = Math.max(1, Math.min(10, qty + delta));
  document.getElementById('qtyDisplay').textContent = qty;
}

/* ===== CART ===== */
function addToCart() {
  const color = selectedColor;
  const price = prices[color].current;
  const existing = cartItems.find(i => i.color === color);
  if (existing) {
    existing.qty += qty;
  } else {
    cartItems.push({ color, qty, price, label: prices[color].label });
  }
  updateCart();
  openCart();
}

function updateCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const countEl = document.getElementById('cartCount');

  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  countEl.textContent = totalQty;

  if (cartItems.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  document.getElementById('cartTotal').textContent = '$' + totalPrice.toFixed(2);

  container.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item">
      <img class="cart-item__img" src="images/${item.color}.png" alt="${item.label}" />
      <div class="cart-item__info">
        <div class="cart-item__name">NanoGlow Spray Pro</div>
        <div class="cart-item__meta">Color: ${item.label} &bull; Qty: ${item.qty}</div>
        <div class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <button class="cart-item__remove" onclick="removeItem(${idx})">✕</button>
    </div>
  `).join('');
}

function removeItem(idx) {
  cartItems.splice(idx, 1);
  updateCart();
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelector('.cart-btn').addEventListener('click', openCart);

function checkout() {
  closeCart();
  document.getElementById('modal').classList.add('open');
  cartItems = [];
  updateCart();
}

/* ===== MODAL ===== */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ===== ACCORDION ===== */
function toggleAccordion(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}
