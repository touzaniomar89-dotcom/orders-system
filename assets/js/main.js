const CART_KEY="wdz_cart";
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbzH9B-vHsSakvfwCKVDPjvq0U7CRz8AMkWY-5Xjj9ypRf3hCwdGwSij9UnYKhUsBNLx2w/exec";

function getCart(){return JSON.parse(localStorage.getItem(CART_KEY))||[]}
function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCount()}
function clearCart(){localStorage.removeItem(CART_KEY);updateCount()}
function updateCount(){
let count=getCart().reduce((s,i)=>s+i.quantity,0);
let el=document.getElementById("cart-count");
if(el)el.textContent=count;
}

document.addEventListener("DOMContentLoaded",updateCount);

const addBtn=document.getElementById("add-to-cart");
if(addBtn){
addBtn.onclick=()=>{
let product="WDZ Premium Hoodie";
let price=599;
let size=document.getElementById("size").value;
let color=document.getElementById("color").value;
let quantity=parseInt(document.getElementById("quantity").value);

let cart=getCart();
cart.push({product,price,size,color,quantity});
saveCart(cart);
window.location.href="checkout.html";
}
}

function renderCheckout(){
let summary=document.getElementById("order-summary");
if(!summary)return;
let cart=getCart();
let total=0;
summary.innerHTML="";
cart.forEach(item=>{
let itemTotal=item.price*item.quantity;
total+=itemTotal;
summary.innerHTML+=`<p>${item.product} - ${item.quantity} x ${item.price} MAD</p>`;
});
summary.innerHTML+=`<h3>Total: ${total} MAD</h3>`;
}
renderCheckout();

const form=document.getElementById("checkout-form");
if(form){
form.onsubmit=e=>{
e.preventDefault();
let cart=getCart();
if(cart.length===0)return;

let item=cart[0];
let total=item.price*item.quantity;

let data={
date:new Date().toISOString(),
name:document.getElementById("name").value,
phone:document.getElementById("phone").value,
city:document.getElementById("city").value,
address:document.getElementById("address").value,
product:item.product,
status:"Pending",
size:item.size,
color:item.color,
quantity:item.quantity,
total:total
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
