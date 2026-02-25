const CART_KEY = "wdz_cart";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzH9B-vHsSakvfwCKVDPjvq0U7CRz8AMkWY-5Xjj9ypRf3hCwdGwSij9UnYKhUsBNLx2w/exec";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

document.addEventListener("click", function(e){
  if (e.target.classList.contains("add-to-cart")) {
    const card = e.target.closest(".product-card");
    const product = card.querySelector("h2").textContent;
    const price = parseFloat(card.querySelector(".price").dataset.price);
    const size = card.querySelector(".size").value;
    const color = card.querySelector(".color").value;
    const quantity = parseInt(card.querySelector(".quantity").value);

    const cart = getCart();
    cart.push({ product, price, size, color, quantity });
    saveCart(cart);

    window.location.href = "checkout.html";
  }
});

function renderCheckout() {
  const summary = document.getElementById("order-summary");
  if (!summary) return;

  const cart = getCart();
  let total = 0;

  summary.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.quantity;
    summary.innerHTML += `<p>${item.product} - ${item.quantity} x ${item.price} MAD</p>`;
  });

  summary.innerHTML += `<h3>Total: ${total} MAD</h3>`;
}

document.addEventListener("submit", function(e){
  if (e.target.id === "checkout-form") {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) return;

    const item = cart[0];
    const total = item.price * item.quantity;

    const data = {
      date: new Date().toISOString(),
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      city: document.getElementById("city").value,
      address: document.getElementById("address").value,
      product: item.product,
      status: "Pending",
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      total: total
    };

    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem(CART_KEY);
      window.location.href = "thankyou.html";
    });
  }
});

updateCartCount();
renderCheckout();
