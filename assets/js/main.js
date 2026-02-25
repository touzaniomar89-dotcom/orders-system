/**************************************
 * WDZ ORDER SYSTEM - FINAL VERSION
 **************************************/

const API_URL = "https://script.google.com/macros/s/AKfycbxyCmZ7W1k-xW361TttJ2SZT1QoYjA16TGy4Negnq2VkVBKS25E-pbTF1tTBuPefXvDcg/exec";

/* ===============================
   BUY PRODUCT (Product Page)
=================================*/
function buyNow() {
  const product = {
    name: "WDZ Hoodie",
    price: 299,
    size: document.getElementById("size").value,
    color: document.getElementById("color").value,
    quantity: parseInt(document.getElementById("quantity").value)
  };

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "checkout.html";
}


/* ===============================
   WHEN PAGE LOADS
=================================*/
document.addEventListener("DOMContentLoaded", function () {

  const order = JSON.parse(localStorage.getItem("selectedProduct"));

  /* ===============================
     SHOW ORDER SUMMARY
  =================================*/
  if (document.getElementById("summaryBox") && order) {
    document.getElementById("summaryBox").innerHTML = `
      <p>المنتج: ${order.name}</p>
      <p>المقاس: ${order.size}</p>
      <p>اللون: ${order.color}</p>
      <p>الكمية: ${order.quantity}</p>
      <p><strong>المجموع: ${order.price * order.quantity} MAD</strong></p>
    `;
  }

  /* ===============================
     CHECKOUT FORM SUBMIT
  =================================*/
  const form = document.getElementById("checkoutForm");

  if (form && order) {

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        city: document.getElementById("city").value.trim(),
        address: document.getElementById("address").value.trim(),
        product: order.name,
        size: order.size,
        color: order.color,
        quantity: order.quantity,
        total: order.price * order.quantity
      };

      // Simple validation
      if (!data.name || !data.phone || !data.city || !data.address) {
        alert("يرجى ملء جميع المعلومات");
        return;
      }

      try {

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.result === "success") {

          localStorage.removeItem("selectedProduct");

          alert("تم إرسال الطلب بنجاح ✅");

          window.location.href = "thankyou.html";

        } else {

          alert("حدث خطأ أثناء الإرسال ❌");

        }

      } catch (error) {

        console.error("Error:", error);
        alert("فشل الاتصال بالخادم ❌");

      }

    });
  }

});
