// this function handles switching between pages
// i hide all pages first and then only show the one i clicked on
function showPage(pageName) {
    let pages = document.querySelectorAll('.page');
    pages.forEach(function(p) {
        p.style.display = 'none';
    });
    document.getElementById(pageName).style.display = 'block';

    // update which nav button looks active
    let navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(function(btn) {
        btn.classList.remove('active');
    });
    let activeBtn = document.getElementById('nav-' + pageName);
    if (activeBtn) activeBtn.classList.add('active');

    // only fetch cats if we haven't already
    if (pageName === 'cats' && allCats.length === 0) {
        getCats();
    }
    // refresh cart every time you open it
    if (pageName === 'cart') {
        showCart();
    }
}
