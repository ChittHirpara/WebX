/* =====================================================
   Lumière — Interactive Image Showcase
   JavaScript: Cursor, Loader, Entrance, Pop-out
   ===================================================== */

/* Cursor Glow */
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => {
    requestAnimationFrame(() => {
        cur.style.left = e.clientX + 'px';
        cur.style.top = e.clientY + 'px';
    });
});

/* Loader */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('off');
        setTimeout(reveal, 350);
    }, 500);
});

/* Staggered Entrance Animation */
function reveal() {
    [
        { el: document.getElementById('hdr'), d: 0 },
        { el: document.getElementById('mosaic'), d: 200 },
        { el: document.getElementById('hint'), d: 600 },
        { el: document.getElementById('ftr'), d: 750 }
    ].forEach(({ el, d }) => {
        setTimeout(() => {
            el.style.transition = 'opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, d);
    });
}

/* Full-screen Pop-out Overlay */
const pop = document.getElementById('pop');
const popImg = document.getElementById('popImg');
const popT = document.getElementById('popT');
const popD = document.getElementById('popD');
const popX = document.getElementById('popX');

document.querySelectorAll('.cell').forEach(c => {
    c.addEventListener('click', () => {
        popImg.src = c.dataset.hi;
        popT.textContent = c.dataset.t;
        popD.textContent = c.dataset.d;
        pop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closePop() {
    pop.classList.remove('open');
    document.body.style.overflow = '';
}

popX.addEventListener('click', e => { e.stopPropagation(); closePop(); });
pop.addEventListener('click', e => { if (e.target === pop) closePop(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });

/* Preload Hi-res Images */
document.querySelectorAll('.cell').forEach(c => {
    const p = new Image();
    p.src = c.dataset.hi;
});
