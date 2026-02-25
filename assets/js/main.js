document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("orderForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      city: document.getElementById("city").value,
      address: document.getElementById("address").value,
      product: document.getElementById("product").value,
      size: document.getElementById("size").value,
      color: document.getElementById("color").value,
      quantity: document.getElementById("quantity").value,
      total: document.getElementById("total").value
    };

    fetch("https://script.google.com/macros/s/AKfycbxyCmZ7W1k-xW361TttJ2SZT1QoYjA16TGy4Negnq2VkVBKS25E-pbTF1tTBuPefXvDcg/exec", {
      method: "POST",
      body: new URLSearchParams({
        data: JSON.stringify(orderData)
      })
    })
    .then(res => res.text())
    .then(response => {
      if (response === "success") {
        alert("✅ تم إرسال الطلب بنجاح");
        form.reset();
      } else {
        alert("❌ وقع خطأ، حاول مرة أخرى");
      }
    })
    .catch(error => {
      alert("❌ خطأ في الاتصال بالسيرفر");
      console.error(error);
    });

  });

});
