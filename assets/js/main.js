const API_URL = "https://script.google.com/macros/s/AKfycbxyCmZ7W1k-xW361TttJ2SZT1QoYjA16TGy4Negnq2VkVBKS25E-pbTF1tTBuPefXvDcg/exec";

document.addEventListener("DOMContentLoaded", function () {

  const order = JSON.parse(localStorage.getItem("selectedProduct"));

  // عرض ملخص الطلب
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
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.result === "success") {
          localStorage.removeItem("selectedProduct");
          window.location.href = "thankyou.html";
        } else {
          alert("حدث خطأ أثناء الإرسال");
        }

      } catch (error) {
        alert("فشل الاتصال بالخادم");
        console.error(error);
      }
    });
  }

});
