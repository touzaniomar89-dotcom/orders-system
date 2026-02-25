async function submitOrder() {

  const orderData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    address: document.getElementById("address").value,
    product: localStorage.getItem("selectedProduct") || "WDZ Product",
    size: "Default",
    color: "Default",
    quantity: 1,
    total: localStorage.getItem("totalPrice") || 0
  };

  try {

    const response = await fetch("https://script.google.com/macros/s/AKfycbzH9B-vHsSakvfwCKVDPjvq0U7CRz8AMkWY-5Xjj9ypRf3hCwdGwSij9UnYKhUsBNLx2w/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = "thankyou.html";
    } else {
      alert("Error sending order");
    }

  } catch (error) {
    alert("Connection error");
  }
}
