/* =====================================================
   IRONCORE — Gym Product Catalog
   JavaScript: Header scroll, Scroll-reveal, Cart, Toast
   ===================================================== */

/* ----- Header scroll effect ----- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ----- Scroll-Reveal for product cards ----- */
const revealCards = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger by index within the current batch
            const card = entry.target;
            const delay = Array.from(revealCards).indexOf(card) % 4;
            setTimeout(() => {
                card.style.transition = 'opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
                card.classList.add('revealed');
            }, delay * 120);
            revealObserver.unobserve(card);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealCards.forEach(card => revealObserver.observe(card));

/* ----- Cart counter ----- */
let cartTotal = 0;
const cartCount = document.getElementById('cartCount');

function updateCart() {
    cartTotal++;
    cartCount.textContent = cartTotal;
    cartCount.classList.add('show');

    // Bounce animation
    cartCount.style.animation = 'none';
    cartCount.offsetHeight; // trigger reflow
    cartCount.style.animation = '';
}

/* ----- Toast notification ----- */
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
let toastTimer = null;

function showToast(name) {
    toastText.textContent = `${name} added to cart!`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ----- Add to Cart buttons with ripple ----- */
document.querySelectorAll('.card__btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        // Button state
        this.classList.add('added');
        setTimeout(() => this.classList.remove('added'), 1800);

        // Get product name from the card
        const card = this.closest('.card');
        const name = card.querySelector('.card__name').textContent;

        // Update cart + toast
        updateCart();
        showToast(name);
    });
});
