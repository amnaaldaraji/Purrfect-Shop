let selectedCat = null;

document.addEventListener('DOMContentLoaded', function() {
    try {
        selectedCat = JSON.parse(localStorage.getItem('purrfect_selected_cat') || 'null');
    } catch (e) {}

    if (!selectedCat) {
        document.getElementById('catDetailContent').innerHTML =
            '<p style="text-align:center;color:#c4607c;">Cat not found. <a href="cats.html" style="color:#9a3f5e;">Go back to cats</a></p>';
        return;
    }

    renderCatDetail(selectedCat);
});

function renderCatDetail(cat) {
    let imgHtml = cat.image && cat.image.url
        ? '<img src="' + cat.image.url + '" alt="' + cat.name + '" class="detail-img">'
        : '<div class="detail-no-img">no image</div>';

    document.getElementById('catDetailContent').innerHTML =
        '<div class="cat-detail-card">' +
            imgHtml +
            '<div class="cat-detail-info">' +
                '<h2>' + cat.name + '</h2>' +
                '<p class="detail-origin">' + (cat.origin || '') + '</p>' +
                (cat.temperament ? '<div class="detail-section"><span class="detail-label">Temperament</span><p>' + cat.temperament + '</p></div>' : '') +
                (cat.description ? '<div class="detail-section"><span class="detail-label">About</span><p>' + cat.description + '</p></div>' : '') +
                (cat.life_span ? '<div class="detail-section"><span class="detail-label">Lifespan</span><p>' + cat.life_span + ' years</p></div>' : '') +
                (cat.weight ? '<div class="detail-section"><span class="detail-label">Weight</span><p>' + cat.weight.metric + ' kg</p></div>' : '') +
                '<button class="pink-btn" id="addToCartBtn">Add to cart ♡</button>' +
            '</div>' +
        '</div>';

    document.getElementById('addToCartBtn').onclick = function() {
        addCatToCart(selectedCat);
    };
}
