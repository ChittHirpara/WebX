document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // LENIS SMOOTH SCROLL
    // =============================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);

    // =============================================
    // PARTICLE SYSTEM (Canvas)
    // =============================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.7 ? 72 : (Math.random() > 0.5 ? 190 : 280);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Gentle mouse attraction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                this.x += dx * 0.0005;
                this.y += dy * 0.0005;
                this.opacity = Math.min(0.8, this.opacity + 0.01);
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const PARTICLE_COUNT = 120;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(206, 241, 68, ${0.04 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // =============================================
    // CURSOR GLOW (Mouse Follow)
    // =============================================
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // =============================================
    // SCENE 1: COSMIC HERO
    // =============================================
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });

    heroTl
        .to("#hero-line-1", { y: -80, opacity: 0, scale: 0.8, duration: 1 }, 0)
        .to("#hero-line-2", { y: -60, opacity: 0, scale: 0.9, duration: 1 }, 0.1)
        .to(".hero-tag", { y: -40, opacity: 0, duration: 0.5 }, 0)
        .to("#hero-sub", { y: -30, opacity: 0, duration: 0.6 }, 0.15)
        .to("#hero-cta", { y: -20, opacity: 0, duration: 0.4 }, 0.1)
        .to(".hero-bg-gradient", { opacity: 0, duration: 0.5 }, 0.3);


    // =============================================
    // SCENE 2: THE REVEAL
    // =============================================
    const revealTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-reveal",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        }
    });

    revealTl
        // Phase 1: Image materializes (glitch + scale up)
        .to("#reveal-frame", { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" }, 0)
        .to("#reveal-glitch", { opacity: 0.6, duration: 0.5 }, 0)
        .to("#reveal-glitch", { opacity: 0, duration: 1 }, 1.5)
        // Scanline sweep
        .to(".reveal-scanline", { opacity: 1, duration: 0.3 }, 0.3)
        .to(".reveal-scanline", { top: "100%", duration: 1.5, ease: "power1.in" }, 0.3)
        .to(".reveal-scanline", { opacity: 0, duration: 0.3 }, 1.5)
        // Caption
        .to("#reveal-caption", { opacity: 1, y: 0, duration: 1 }, 2)
        // Phase 2: Deep zoom into the image
        .to("#reveal-frame", { scale: 2.5, y: "15vh", x: "-10vw", duration: 4, ease: "power1.inOut" }, 3)
        .to("#reveal-caption", { opacity: 0, duration: 0.5 }, 3)
        // Phase 3: Zoom back out (prepare for next scene)
        .to("#reveal-frame", { scale: 1, y: 0, x: 0, opacity: 0, duration: 2 }, 7);


    // =============================================
    // SCENE 3: COLLABORATION (Deep Zoom + Avatars)
    // =============================================
    const collabTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-collab",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        }
    });

    collabTl
        // Zoom in
        .fromTo("#collab-viewport", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 }, 0)
        .to("#collab-viewport", { scale: 3.5, y: "25vh", x: "-30vw", duration: 4, ease: "power1.inOut" }, 1.5)
        // Avatars pop in with elastic bounce
        .to("#av-1", { scale: 1, duration: 0.4, ease: "back.out(2)" }, 2)
        .to("#av-1 .avatar-cursor", { opacity: 1, x: 0, y: 0, duration: 0.3 }, 2.2)
        .to("#av-2", { scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.4)
        .to("#av-2 .avatar-cursor", { opacity: 1, x: 0, y: 0, duration: 0.3 }, 2.6)
        .to("#av-3", { scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.8)
        .to("#av-3 .avatar-cursor", { opacity: 1, x: 0, y: 0, duration: 0.3 }, 3)
        // Caption
        .to("#collab-caption", { opacity: 1, duration: 0.5 }, 3)
        // Zoom back
        .to("#collab-viewport", { scale: 1, x: 0, y: 0, duration: 2.5 }, 4.5)
        // Fade out
        .to("#collab-viewport", { opacity: 0, scale: 0.8, duration: 1.5 }, 6)
        .to("#collab-caption", { opacity: 0, duration: 0.5 }, 6);


    // =============================================
    // SCENE 4: SAME PAGE (Branching)
    // =============================================
    const branchTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-branch",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        }
    });

    branchTl
        // Phase 1: Main screen fades in, scaled up, positioned right
        .fromTo("#branch-main", { opacity: 0, scale: 3 }, { opacity: 1, scale: 1, duration: 1.5 }, 0)
        .set("#branch-main", { x: "50%" }, 0)

        // Show avatar on main screen
        .to("#branch-avatar", { opacity: 1, duration: 0.5 }, 1)

        // Show text-1 (left side)
        .fromTo("#branch-text-1",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6 }, 1.2)
        .to("#branch-text-1", { opacity: 0, y: -40, duration: 0.5 }, 2.2)

        // Pan to left
        .to("#branch-main", { x: "-50%", duration: 2 }, 2.5)

        // Show text-2 (right side)
        .fromTo("#branch-text-2",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6 }, 2.8)
        .to("#branch-text-2", { opacity: 0, y: -40, duration: 0.5 }, 3.8)

        // Pan back to center
        .to("#branch-main", { x: "0%", duration: 1.5 }, 4.2)

        // Phase 2: Loading screen appears
        .fromTo("#branch-feature", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 4.8)

        // Phase 3: Split into branches
        .to("#branch-main", { x: "-27%", scale: 0.5, duration: 2 }, 5.5)
        .to("#branch-feature", { x: "27%", scale: 0.5, duration: 2 }, 5.5)
        .to("#branch-avatar", { opacity: 0, duration: 0.5 }, 5.5)

        // Reveal loaded content
        .to("#branch-revealed-img", { opacity: 1, duration: 1 }, 7)

        // Show labels
        .to("#branch-main-label", { opacity: 1, duration: 0.6 }, 7.5)
        .to("#branch-feature-label", { opacity: 1, duration: 0.6 }, 7.5)

        // Show final text
        .fromTo("#branch-text-3",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 }, 8)

        // Fade all out
        .to("#branch-main", { opacity: 0, duration: 1 }, 9)
        .to("#branch-feature", { opacity: 0, duration: 1 }, 9)
        .to("#branch-text-3", { opacity: 0, duration: 0.5 }, 9.5)
        .to("#branch-main-label", { opacity: 0, duration: 0.3 }, 9)
        .to("#branch-feature-label", { opacity: 0, duration: 0.3 }, 9);


    // =============================================
    // SCENE 5: FEATURES STACK (Image swap + text)
    // =============================================
    const featTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-features",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        }
    });

    featTl
        // Start position: image slides in from right
        .fromTo("#features-visual", { x: "50%", scale: 0.8, opacity: 0 }, { x: "50%", scale: 0.8, opacity: 1, duration: 1 }, 0)

        // Text 1 in
        .fromTo("#feat-text-1",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 }, 1)
        .to("#feat-text-1", { opacity: 0, y: -30, duration: 0.5 }, 2)

        // Swap to command palette
        .to("#feat-layer-1", { opacity: 0.4, duration: 0.5 }, 2.5)
        .to("#feat-layer-2", { opacity: 1, duration: 0.5 }, 2.5)
        .to("#features-visual", { x: "0%", duration: 1 }, 2.5)

        // Text 2 in
        .fromTo("#feat-text-2",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 }, 3)
        .to("#feat-text-2", { opacity: 0, y: -30, duration: 0.5 }, 4)

        // Swap to devtools
        .to("#feat-layer-2", { opacity: 0, duration: 0.5 }, 4.5)
        .to("#feat-layer-3", { opacity: 1, duration: 0.5 }, 4.5)

        // Text 3 in
        .fromTo("#feat-text-3",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8 }, 5)

        // Final: scale to full
        .to("#features-visual", { scale: 1, duration: 1.5 }, 6)

        // Fade out
        .to("#features-visual", { opacity: 0, duration: 1 }, 7.5)
        .to("#feat-text-3", { opacity: 0, duration: 0.5 }, 7.5);


    // =============================================
    // SCENE 6: STREAMLINED (Cinema crop text)
    // =============================================
    const streamTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-stream",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        }
    });

    // Calculate dynamic positions for border right
    const streamBox = document.getElementById('stream-box');

    streamTl
        // Scroll giant text across
        .fromTo("#stream-text-1", { x: "100%" }, { x: "-100%", duration: 7 }, 0)
        .fromTo("#stream-text-2", { x: "80%" }, { x: "-120%", duration: 7 }, 0)

        // Scale box down
        .fromTo("#stream-box", { scale: 1 }, { scale: 0.7, duration: 5 }, 0)

        // Border visibility
        .fromTo("#stream-border", { opacity: 1 }, { opacity: 1, duration: 5 }, 0)
        .to("#stream-border", { opacity: 0, duration: 0.2 }, 5.3)

        // Mask right
        .fromTo("#stream-mask-right",
            { opacity: 1 },
            { opacity: 1, duration: 5 }, 0)
        .to("#stream-mask-right", { opacity: 0, duration: 0.2 }, 5.3)

        // Show center text after "crop" reveals
        .to("#stream-center", { opacity: 1, duration: 1 }, 5.5)
        .fromTo("#stream-center", { scale: 1 }, { scale: 0.8, duration: 2 }, 6)

        // Fade all out
        .to("#stream-center", { opacity: 0, duration: 1 }, 8)
        .to("#stream-box", { opacity: 0, duration: 1 }, 8);


    // =============================================
    // SCENE 7: FINALE
    // =============================================
    const finaleTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-finale",
            start: "top 60%",
        }
    });

    finaleTl
        .to(".finale-card", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.4)"
        }, 0)
        .to("#finale-title", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.5)
        .to("#finale-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.7);
});
