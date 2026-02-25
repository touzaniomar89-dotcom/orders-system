const API_URL = "https://script.google.com/macros/s/AKfycbxyCmZ7W1k-xW361TttJ2SZT1QoYjA16TGy4Negnq2VkVBKS25E-pbTF1tTBuPefXvDcg/exec";

// شراء المنتج
function buyNow() {
  const product = {
    name: "WDZ Hoodie",
    price: 299,
    size: document.getElementById("size").value,
    color: document.getElementById("color").value,
    quantity: document.getElementById("quantity").value
  };

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "checkout.html";
}

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {

  const order = JSON.parse(localStorage.getItem("selectedProduct"));

  // عرض الملخص
  if (document.getElementById("summaryBox") && order) {
    document.getElementById("summaryBox").innerHTML = `
      <p>المنتج: ${order.name}</p>
      <p>المقاس: ${order.size}</p>
      <p>اللون: ${order.color}</p>
      <p>الكمية: ${order.quantity}</p>
      <p>المجموع: ${order.price * order.quantity} MAD</p>
    `;
  }

  const form = document.getElementById("checkoutForm");

  if (form && order) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value,
        product: order.name,
        size: order.size,
        color: order.color,
        quantity: order.quantity,
        total: order.price * order.quantity
      };

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(data)
        });

        const result = await response.text();

        if (result === "success") {
          localStorage.removeItem("selectedProduct");
          window.location.href = "thankyou.html";
        } else {
          alert("حدث خطأ أثناء الإرسال");
        }

      } catch (error) {
        alert("فشل الاتصال بالخادم");
      }
    });
  }

});
