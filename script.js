let cart = JSON.parse(localStorage.getItem('cart')) || [];
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}function updateCartCount() {
    const cartCount = document.querySelectorAll('#cart-count');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'inline' : 'none';
    });
}

// Add item to cart
function addItemToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${name} added to your cart!`);
}
function handleBuyNow(name, price) {
    addItemToCart(name, price);
    window.location.href = 'order.html';
}

// Render order items on order page
function renderOrderItems() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return; 

    orderItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('order-item');
        itemElement.innerHTML = `
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity">
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove" onclick="removeItem(${index})">Remove</button>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    updatePricing();
}

// Change quantity
function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        removeItem(index);
    } else {
        saveCart();
        renderOrderItems();
        updateCartCount();
    }
}


function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderOrderItems();
    updateCartCount();
}

// Update pricing on order page
function updatePricing() {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const deliveryFee = 4.99;

    if (!subtotalEl) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

   
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent.replace('$', '');
            addItemToCart(name, price);
        });
    });

    const buyButtons = document.querySelectorAll('.buy-now');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent.replace('$', '');
            handleBuyNow(name, price);
        });
    });

    // If on order page, render items
    renderOrderItems();
});

window.changeQuantity = changeQuantity;
window.removeItem = removeItem;