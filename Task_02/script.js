/* =====================================================
   IRONCORE — Hackathon-Level JS
   Particles, Custom Cursor, Loader, Scroll-Reveal,
   Counter, Magnetic Buttons, Detail Overlay, Cart/Toast
   ===================================================== */

/* ============ FLOATING PARTICLES ============ */
const cvs = document.getElementById('particles');
const ctx = cvs.getContext('2d');
let W, H;
const dots = [];

function resizeCanvas() {
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 50; i++) {
    dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.3 + 0.05
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 160, ${d.o})`;
        ctx.fill();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============ CUSTOM CURSOR ============ */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
});

function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state for interactive elements
document.querySelectorAll('a, button, .panel').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

/* ============ CINEMATIC LOADER ============ */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
const loaderBar = document.querySelector('.loader__bar');
let progress = 0;

const loaderInterval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;
    loaderFill.style.width = progress + '%';
    loaderBar.style.width = progress + '%';
    loaderPct.textContent = Math.round(progress) + '%';

    if (progress >= 100) {
        clearInterval(loaderInterval);
        setTimeout(() => {
            loader.classList.add('done');
            document.getElementById('header').classList.add('visible');
            startHeroAnimations();
        }, 400);
    }
}, 80);

/* ============ HERO ENTRANCE ANIMATIONS ============ */
function startHeroAnimations() {
    const delays = [0, 200, 400, 600, 800, 1200];
    const anims = document.querySelectorAll('[data-anim]');

    anims.forEach((el) => {
        const d = parseInt(el.dataset.delay || 0) * 200;
        const type = el.dataset.anim;

        setTimeout(() => {
            if (type === 'slide') {
                el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            } else {
                el.style.transition = 'opacity 0.8s ease';
                el.style.opacity = '1';
            }
        }, 200 + d);
    });
}

/* ============ HEADER SCROLL ============ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ============ SCROLL-REVEAL ============ */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);

            // If stats section, trigger counter
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ============ COUNTER ANIMATION ============ */
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            const val = eased * target;
            el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
    });
});

/* ============ PARALLAX ON PANEL IMAGES ============ */
document.querySelectorAll('.panel__visual').forEach(visual => {
    const img = visual.querySelector('.panel__img');

    visual.addEventListener('mousemove', (e) => {
        const rect = visual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `scale(1.08) translate(${x * -15}px, ${y * -15}px)`;
    });

    visual.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
});

/* ============ CART ============ */
let cartTotal = 0;
const cartCount = document.getElementById('cartCount');

function addToCart(name) {
    cartTotal++;
    cartCount.textContent = cartTotal;
    cartCount.classList.add('show');
    cartCount.classList.remove('bump');
    void cartCount.offsetHeight;
    cartCount.classList.add('bump');
    showToast(name);
}

/* ============ TOAST ============ */
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer = null;

function showToast(name) {
    toastMsg.textContent = `${name} added to cart!`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ============ PANEL CLICK → DETAIL ============ */
const allPanels = document.querySelectorAll('.panel[data-reveal]');

allPanels.forEach((panel, i) => {
    const detail = document.getElementById('detail-' + i);
    if (!detail) return;

    panel.addEventListener('click', (e) => {
        if (e.target.closest('.panel__btn')) return;
        detail.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    const closeBtn = detail.querySelector('.detail__close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        detail.classList.remove('open');
        document.body.style.overflow = '';
    });

    detail.addEventListener('click', (e) => {
        if (e.target === detail || e.target === detail.querySelector('.detail__inner')) {
            detail.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.panel__detail.open').forEach(d => {
            d.classList.remove('open');
        });
        document.body.style.overflow = '';
    }
});

/* ============ ALL ADD-TO-CART BUTTONS ============ */
document.querySelectorAll('.panel__btn, .detail__cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.dataset.product;
        addToCart(name);

        // Button bounce
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => { btn.style.transform = ''; }, 250);
    });
});

// ... existing code ...

/* ============ DYNAMIC BODY BACKGROUND ============ */
// Change body background based on visible panel
const bgColors = {
    'dark': '#0a0a0f',
    'orange': '#33150a', // Darkened version of orange
    'teal': '#00252b'    // Darkened version of teal
};

const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const type = entry.target.dataset.bg;
            const color = bgColors[type] || '#0a0a0f';

            // Smoothly change body background
            document.body.style.transition = 'background-color 1s ease';
            document.body.style.backgroundColor = color;

            // Also adjust header background if it's scrolled
            const header = document.getElementById('header');
            if (header.classList.contains('scrolled')) {
                header.style.background = `${color}E6`; // Add transparency
            }
        }
    });
}, { threshold: [0.5] }); // Trigger when 50% visible

document.querySelectorAll('.panel').forEach(panel => {
    panelObserver.observe(panel);
});

// ... existing code ...

// ... existing code ...

/* ============ KINETIC SCROLL SKEW - REMOVED FOR STABILITY ============ */
// Logic removed to restore solid layout.



/* ============ HOLOGRAPHIC 3D TILT & GLARE ============ */
document.querySelectorAll('.panel__visual').forEach(visual => {
    // Create glare element
    const glare = document.createElement('div');
    glare.className = 'panel__glare';
    visual.appendChild(glare);

    const img = visual.querySelector('.panel__img');

    visual.addEventListener('mousemove', (e) => {
        const rect = visual.getBoundingClientRect();
        // Mouse position relative to center (0.5 to -0.5)
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        // Tilt amounts
        const xTilt = yPct * 10; // RotateX based on Y axis
        const yTilt = xPct * -10; // RotateY based on X axis

        // Glare movement (opposite to mouse)
        const glareX = (e.clientX - rect.left);
        const glareY = (e.clientY - rect.top);

        // Apply transform
        img.style.transform = `scale(1.1) perspective(1000px) rotateX(${xTilt}deg) rotateY(${yTilt}deg)`;

        // Move glare
        glare.style.left = `${glareX}px`;
        glare.style.top = `${glareY}px`;
        glare.style.opacity = '0.4';
    });

    visual.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) perspective(1000px) rotateX(0) rotateY(0)';
        glare.style.opacity = '0';
    });
});

// ... existing code ...

/* ============ WOW FACTOR - REMOVED TO FIX BLANK PAGE ============ */

