// stores whatever cats the user has added
let cart = [];

// add a cat to the cart, but don't allow duplicates
function addToCart(catId) {
    let cat = allCats.find(function(c) {
        return c.id === catId;
    });
    if (!cat) return;

    let alreadyInCart = cart.find(function(c) {
        return c.id === catId;
    });
    if (alreadyInCart) {
        alert(cat.name + ' is already in your cart!');
        return;
    }

    cart.push(cat);
    document.getElementById('cartCount').textContent = cart.length;
    alert(cat.name + ' added to cart.');
}

// show everything currently in the cart
function showCart() {
    let cartDiv = document.getElementById('cartItems');
    let orderForm = document.getElementById('orderForm');
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p class="empty-cart">Your cart is empty. Add some cats from the cats page.</p>';
        orderForm.style.display = 'none';
        return;
    }

    cart.forEach(function(cat, index) {
        let item = document.createElement('div');
        item.className = 'cart-item';

        let imgHtml = '';
        if (cat.image && cat.image.url) {
            imgHtml = '<img src="' + cat.image.url + '" alt="' + cat.name + '" class="cart-item-img">';
        } else {
            imgHtml = '<div class="cart-item-no-img">no image</div>';
        }

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
            '<button onclick="removeFromCart(' + index + ')">Remove</button>';

        cartDiv.appendChild(item);
    });

    orderForm.style.display = 'block';
}

// remove one cat by its position in the array
function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cartCount').textContent = cart.length;
    showCart();
}

// when the order form is submitted, show a confirmation and clear the cart
function sendOrder(event) {
    event.preventDefault();

    let name = document.getElementById('customerName').value;
    let email = document.getElementById('customerEmail').value;
    let address = document.getElementById('customerAddress').value;
    let catNames = cart.map(function(c) { return c.name; }).join(', ');

    let message = 'Thanks for your order, ' + name + '!\n\n';
    message += 'Cats ordered: ' + catNames + '\n';
    message += 'Delivering to: ' + address + '\n';
    message += 'Confirmation sent to: ' + email;

    alert(message);

    // clear everything after the order goes through
    cart = [];
    document.getElementById('cartCount').textContent = 0;
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    showCart();
}
