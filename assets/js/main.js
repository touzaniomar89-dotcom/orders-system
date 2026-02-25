const API_URL = 'https://script.google.com/macros/s/AKfycbzH9B-vHsSakvfwCKVDPjvq0U7CRz8AMkWY-5Xjj9ypRf3hCwdGwSij9UnYKhUsBNLx2w/exec'; // Replace with your deployed URL

// Cart functions
function getCart() {
    const cart = localStorage.getItem('wdz_cart');
    return cart ? JSON.parse(cart) : null;
}

function saveCart(cart) {
    localStorage.setItem('wdz_cart', JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem('wdz_cart');
}

// Product page
if (document.querySelector('.product-page')) {
    document.getElementById('checkout-btn').addEventListener('click', () => {
        const size = document.getElementById('size').value;
        const color = document.getElementById('color').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const price = 49.99; // Example price
        const total = price * quantity;

        const cart = {
            product: 'تيشيرت WDZ',
            size,
            color,
            quantity,
            price,
            total: total.toFixed(2)
        };
        saveCart(cart);
        window.location.href = 'checkout.html';
    });
}

// Checkout page
if (document.querySelector('.checkout-page')) {
    const cart = getCart();
    if (!cart) {
        window.location.href = 'product.html';
    } else {
        renderSummary(cart);
    }

    function renderSummary(cart) {
        const summary = document.getElementById('order-summary');
        summary.innerHTML = `
            <p><strong>المنتج:</strong> ${cart.product}</p>
            <p><strong>المقاس:</strong> ${cart.size}</p>
            <p><strong>اللون:</strong> ${cart.color}</p>
            <p><strong>الكمية:</strong> ${cart.quantity}</p>
            <p><strong>السعر:</strong> ${cart.price} ر.س</p>
            <p><strong>الإجمالي:</strong> ${cart.total} ر.س</p>
        `;
    }

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cart = getCart();
        if (!cart) return;

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            product: cart.product,
            size: cart.size,
            color: cart.color,
            quantity: cart.quantity,
            total: cart.total
        };

        const errorDiv = document.getElementById('form-error');
        errorDiv.style.display = 'none';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'فشل إرسال الطلب');

            clearCart();
            window.location.href = 'thankyou.html';
        } catch (err) {
            errorDiv.textContent = err.message || 'حدث خطأ. حاول مرة أخرى.';
            errorDiv.style.display = 'block';
        }
    });
}
