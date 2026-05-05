let allCats = [];
let filteredCats = [];
let currentPage = 1;
let catsPerPage = 10;
let activeTags = [];
let activeAgeFilter = 'all';

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
        buildFilters();
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

        let imgHtml = cat.image && cat.image.url
            ? '<img src="' + cat.image.url + '" alt="' + cat.name + '">'
            : '<div class="no-img">no image</div>';

        let temperament = cat.temperament ? cat.temperament.split(',').slice(0, 3).join(', ') : '';
        let lifespan = cat.life_span ? cat.life_span + ' years' : '';
        let description = cat.description ? cat.description.substring(0, 90) + '...' : '';

        card.innerHTML = imgHtml +
            '<div class="cat-card-body">' +
                '<h3>' + cat.name + '</h3>' +
                '<p>' + (cat.origin || 'Unknown origin') + '</p>' +
                '<div class="cat-card-btns">' +
                    '<button class="about-btn" onclick="showCatDetail(\'' + cat.id + '\')">About me</button>' +
                    '<button onclick="addToCart(\'' + cat.id + '\')">Add to cart ♡</button>' +
                '</div>' +
            '</div>' +
            '<div class="cat-hover-info">' +
                '<h4>' + cat.name + '</h4>' +
                (temperament ? '<p class="hover-tag">' + temperament + '</p>' : '') +
                (lifespan ? '<p class="hover-detail">Lifespan: ' + lifespan + '</p>' : '') +
                (description ? '<p class="hover-desc">' + description + '</p>' : '') +
                '<div class="hover-btns">' +
                    '<button onclick="showCatDetail(\'' + cat.id + '\')" class="hover-about-btn">About me</button>' +
                    '<button onclick="addToCart(\'' + cat.id + '\')" class="hover-btn">Add to cart ♡</button>' +
                '</div>' +
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
        if (currentPage > 1) { currentPage--; showCats(); }
    };
    if (currentPage === 1) prevBtn.disabled = true;
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.onclick = (function(page) {
            return function() { currentPage = page; showCats(); };
        })(i);
        pagination.appendChild(btn);
    }

    let nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next >';
    nextBtn.onclick = function() {
        if (currentPage < totalPages) { currentPage++; showCats(); }
    };
    if (currentPage === totalPages) nextBtn.disabled = true;
    pagination.appendChild(nextBtn);
}

function showCatDetail(catId) {
    let cat = allCats.find(function(c) { return c.id === catId; });
    if (cat) localStorage.setItem('purrfect_selected_cat', JSON.stringify(cat));
    window.location.href = 'catdetail.html';
}

function addToCart(catId) {
    let cat = allCats.find(function(c) { return c.id === catId; });
    if (cat) addCatToCart(cat);
}

function buildFilters() {
    let allTraits = new Set();
    allCats.forEach(function(cat) {
        if (cat.temperament) {
            cat.temperament.split(',').forEach(function(t) {
                allTraits.add(t.trim());
            });
        }
    });

    let tagRow = document.getElementById('tagFilters');
    tagRow.innerHTML = '';
    Array.from(allTraits).sort().forEach(function(trait) {
        let btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.textContent = trait;
        btn.onclick = function() { toggleTag(trait, btn); };
        tagRow.appendChild(btn);
    });
}

function toggleTag(trait, btn) {
    if (activeTags.includes(trait)) {
        activeTags = activeTags.filter(function(t) { return t !== trait; });
        btn.classList.remove('active');
    } else {
        activeTags.push(trait);
        btn.classList.add('active');
    }
    currentPage = 1;
    applyFilters();
}

function setAgeFilter(range, btn) {
    activeAgeFilter = range;
    document.querySelectorAll('.age-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    currentPage = 1;
    applyFilters();
}

function applyFilters() {
    let searchText = document.getElementById('searchInput').value.toLowerCase();

    filteredCats = allCats.filter(function(cat) {
        if (searchText && !cat.name.toLowerCase().includes(searchText)) return false;

        if (activeTags.length > 0) {
            let catTraits = cat.temperament
                ? cat.temperament.split(',').map(function(t) { return t.trim(); })
                : [];
            if (!activeTags.every(function(tag) { return catTraits.includes(tag); })) return false;
        }

        if (activeAgeFilter !== 'all' && cat.life_span) {
            let parts = cat.life_span.split('-').map(function(p) { return parseInt(p.trim()); });
            let avgAge = parts.length === 2 ? (parts[0] + parts[1]) / 2 : parts[0];
            if (activeAgeFilter === 'short' && avgAge >= 12) return false;
            if (activeAgeFilter === 'medium' && (avgAge < 12 || avgAge >= 15)) return false;
            if (activeAgeFilter === 'long' && avgAge < 15) return false;
        }

        return true;
    });

    currentPage = 1;
    showCats();
}

document.addEventListener('DOMContentLoaded', getCats);
