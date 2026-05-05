function getCart() {
    try { return JSON.parse(localStorage.getItem('purrfect_cart') || '[]'); }
    catch (e) { return []; }
}

function saveCart(cart) {
    localStorage.setItem('purrfect_cart', JSON.stringify(cart));
}

function updateCartCount() {
    let cart = getCart();
    let total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    let el = document.getElementById('cartCount');
    if (el) el.textContent = total;
}

document.addEventListener('DOMContentLoaded', updateCartCount);
