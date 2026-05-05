function addCatToCart(cat) {
    let cart = getCart();
    let existing = cart.find(function(c) { return c.id === cat.id; });
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: cat.id,
            name: cat.name,
            origin: cat.origin || '',
            temperament: cat.temperament || '',
            life_span: cat.life_span || '',
            image: cat.image || null,
            qty: 1
        });
    }
    saveCart(cart);
    updateCartCount();
}

function showCart() {
    let cartDiv = document.getElementById('cartItems');
    let orderForm = document.getElementById('orderForm');
    let cart = getCart();
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p class="empty-cart">Your cart is empty. Add some cats from the cats page.</p>';
        orderForm.style.display = 'none';
        return;
    }

    cart.forEach(function(cat) {
        let item = document.createElement('div');
        item.className = 'cart-item';

        let imgHtml = cat.image && cat.image.url
            ? '<img src="' + cat.image.url + '" alt="' + cat.name + '" class="cart-item-img">'
            : '<div class="cart-item-no-img">no image</div>';

        let temperament = cat.temperament ? cat.temperament.split(',').slice(0, 3).join(', ') : '';
        let lifespan = cat.life_span ? cat.life_span + ' years' : '';

        item.innerHTML =
            imgHtml +
            '<div class="cart-item-info">' +
                '<h4>' + cat.name + '</h4>' +
                '<p class="cart-item-origin">' + (cat.origin || 'Unknown origin') + '</p>' +
                (temperament ? '<p class="cart-item-detail">' + temperament + '</p>' : '') +
                (lifespan ? '<p class="cart-item-detail">Lifespan: ' + lifespan + '</p>' : '') +
            '</div>' +
            '<div class="cart-qty">' +
                '<button class="qty-btn" onclick="updateQty(\'' + cat.id + '\', -1)">−</button>' +
                '<span class="qty-num">' + cat.qty + '</span>' +
                '<button class="qty-btn" onclick="updateQty(\'' + cat.id + '\', 1)">+</button>' +
            '</div>' +
            '<button class="remove-btn" onclick="removeFromCart(\'' + cat.id + '\')">Remove</button>';

        cartDiv.appendChild(item);
    });

    orderForm.style.display = 'block';
}

function updateQty(catId, delta) {
    let cart = getCart();
    let item = cart.find(function(c) { return c.id === catId; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(function(c) { return c.id !== catId; });
    }
    saveCart(cart);
    updateCartCount();
    showCart();
}

function removeFromCart(catId) {
    let cart = getCart().filter(function(c) { return c.id !== catId; });
    saveCart(cart);
    updateCartCount();
    showCart();
}

function sendOrder(event) {
    event.preventDefault();

    let cart = getCart();
    let name = document.getElementById('customerName').value;
    let email = document.getElementById('customerEmail').value;
    let address = document.getElementById('customerAddress').value;
    let catNames = cart.map(function(c) {
        return c.qty > 1 ? c.name + ' x' + c.qty : c.name;
    }).join(', ');

    let message = 'Thanks for your order, ' + name + '!\n\n';
    message += 'Cats ordered: ' + catNames + '\n';
    message += 'Delivering to: ' + address + '\n';
    message += 'Confirmation sent to: ' + email;

    alert(message);

    saveCart([]);
    updateCartCount();
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    showCart();
}

document.addEventListener('DOMContentLoaded', showCart);
