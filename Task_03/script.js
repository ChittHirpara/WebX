// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initial Animation
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2
    })
    .to('.hero-subtitle', {
        opacity: 0.8,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=1');
});
