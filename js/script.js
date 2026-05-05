let allCats = [];
let filteredCats = [];
let cart = [];
let currentPage = 1;
let catsPerPage = 10;

// ---- music ----

let audio = document.getElementById('bgMusic');
let musicPlaying = false;
let progressInterval = null;

function toggleMusic() {
    if (musicPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
}

audio.addEventListener('play', function() {
    musicPlaying = true;
    document.getElementById('musicBtn').innerHTML = '⏸';
    startProgressUpdate();
});

audio.addEventListener('pause', function() {
    musicPlaying = false;
    document.getElementById('musicBtn').innerHTML = '&#9654;';
    stopProgressUpdate();
});

function seekBack() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
}

function seekForward() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

function seekToClick(event) {
    let rect = event.currentTarget.getBoundingClientRect();
    let percent = (event.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (secs < 10) secs = '0' + secs;
    return mins + ':' + secs;
}

function startProgressUpdate() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(function() {
        let percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('musicProgress').style.width = percent + '%';
        document.getElementById('musicTime').textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }, 500);
}

function stopProgressUpdate() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// ---- navigation ----

function showPage(pageName) {
    let pages = document.querySelectorAll('.page');
    pages.forEach(function(p) {
        p.style.display = 'none';
    });
    document.getElementById(pageName).style.display = 'block';

    let navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(function(btn) {
        btn.classList.remove('active');
    });
    let activeBtn = document.getElementById('nav-' + pageName);
    if (activeBtn) activeBtn.classList.add('active');

    if (pageName === 'cats' && allCats.length === 0) {
        getCats();
    }
    if (pageName === 'cart') {
        showCart();
    }
}

// ---- cats ----

async function getCats() {
    document.getElementById('catList').innerHTML = '<p style="text-align:center; color:#c4607c;">Loading cats...</p>';

    try {
        let response = await fetch('https://api.thecatapi.com/v1/breeds?limit=30');
        let data = await response.json();

        let imagePromises = data.map(async function(cat) {
            if (!cat.image && cat.reference_image_id) {
                try {
                    let imgResponse = await fetch('https://api.thecatapi.com/v1/images/' + cat.reference_image_id);
                    let imgData = await imgResponse.json();
                    cat.image = imgData;
                } catch (e) {}
            }
            return cat;
        });

        data = await Promise.all(imagePromises);
        allCats = data;
        filteredCats = data;
        currentPage = 1;
        showCats();
    } catch (error) {
        document.getElementById('catList').innerHTML = '<p style="text-align:center; color:red;">Could not load cats, please try again.</p>';
    }
}

function showCats() {
    let catList = document.getElementById('catList');
    catList.innerHTML = '';

    if (filteredCats.length === 0) {
        catList.innerHTML = '<p style="text-align:center; color:#a0527a;">No cats found.</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    let start = (currentPage - 1) * catsPerPage;
    let end = start + catsPerPage;
    let catsToShow = filteredCats.slice(start, end);

    catsToShow.forEach(function(cat) {
        let card = document.createElement('div');
        card.className = 'cat-card';

        let imgHtml = '';
        if (cat.image && cat.image.url) {
            imgHtml = '<img src="' + cat.image.url + '" alt="' + cat.name + '">';
        } else {
            imgHtml = '<div class="no-img">no image</div>';
        }

        card.innerHTML = imgHtml +
            '<div class="cat-card-body">' +
                '<h3>' + cat.name + '</h3>' +
                '<p>' + (cat.origin || 'Unknown origin') + '</p>' +
                '<button onclick="addToCart(\'' + cat.id + '\')">Add to cart ♡</button>' +
            '</div>';

        catList.appendChild(card);
    });

    showPagination();
}

function showPagination() {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    let totalPages = Math.ceil(filteredCats.length / catsPerPage);
    if (totalPages <= 1) return;

    let prevBtn = document.createElement('button');
    prevBtn.textContent = '< Prev';
    prevBtn.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            showCats();
        }
    };
    if (currentPage === 1) prevBtn.disabled = true;
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = function() {
            currentPage = i;
            showCats();
        };
        pagination.appendChild(btn);
    }

    let nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next >';
    nextBtn.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            showCats();
        }
    };
    if (currentPage === totalPages) nextBtn.disabled = true;
    pagination.appendChild(nextBtn);
}

function searchCats() {
    let searchText = document.getElementById('searchInput').value.toLowerCase();
    filteredCats = allCats.filter(function(cat) {
        return cat.name.toLowerCase().includes(searchText);
    });
    currentPage = 1;
    showCats();
}

// ---- cart ----

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
        item.innerHTML =
            '<span>' + cat.name + ' — ' + (cat.origin || 'Unknown') + '</span>' +
            '<button onclick="removeFromCart(' + index + ')">Remove</button>';
        cartDiv.appendChild(item);
    });

    orderForm.style.display = 'block';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cartCount').textContent = cart.length;
    showCart();
}

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

    cart = [];
    document.getElementById('cartCount').textContent = 0;
    document.getElementById('customerName').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerAddress').value = '';
    showCart();
}
