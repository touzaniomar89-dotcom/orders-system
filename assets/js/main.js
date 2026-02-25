const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwx9gjWsmMO_YaqBr8PqXv5h0Y-IJOOU1b1V1xFZTUEepNbbBFuNhkMaVIEoKIahlv-5A/exec";
const CART_KEY = "wdz_cart";

/* Cart Functions */

function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCount();
}

function clearCart(){
  localStorage.removeItem(CART_KEY);
}

function updateCount(){
  const count = getCart().reduce((s,i)=>s+i.quantity,0);
  const el = document.getElementById("cart-count");
  if(el) el.textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCount);

/* Add to Cart */

const addBtn = document.getElementById("add-to-cart");
if(addBtn){
addBtn.onclick = function(){
  const product = document.getElementById("product-name").textContent;
  const price = parseFloat(document.querySelector(".price").dataset.price);
  const size = document.getElementById("size").value;
  const color = document.getElementById("color").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  const cart = getCart();
  cart.push({product,price,size,color,quantity});
  saveCart(cart);

  window.location.href = "checkout.html";
}
}

/* Render Checkout */

function renderCheckout(){
  const summary = document.getElementById("summary");
  if(!summary) return;

  const cart = getCart();
  let total = 0;
  summary.innerHTML = "";

  cart.forEach(item=>{
    const t = item.price * item.quantity;
    total += t;
    summary.innerHTML += `<p>${item.product} - ${item.quantity} × ${item.price}</p>`;
  });

  summary.innerHTML += `<h3>المجموع: ${total} درهم</h3>`;
}
renderCheckout();

/* Send Order */

const form = document.getElementById("order-form");
if(form){
form.onsubmit = function(e){
e.preventDefault();

const cart = getCart();
if(cart.length === 0) return;

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

fetch(SCRIPT_URL,{
  method:"POST",
  body:JSON.stringify(data)
})
.then(res=>res.json())
.then(()=>{
  clearCart();
  window.location.href="thankyou.html";
});
}
}
