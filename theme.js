// Apply saved theme immediately (before render) to avoid flash of wrong theme.
// Site defaults to dark mode. Only switch to light if the user explicitly chose it.
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // 2. Interactive Category Filter (for Achievements page)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const awardCards = document.querySelectorAll('.award-card[data-category]');

    if (filterBtns.length > 0 && awardCards.length > 0) {
        filterBtns.forEach(filterBtn => {
            filterBtn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                filterBtn.classList.add('active');

                const filterValue = filterBtn.getAttribute('data-filter');

                awardCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInCard 0.35s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 3. Global Lightbox Modal for Award Images
    const awardImages = document.querySelectorAll('.award-media img, .lightbox-trigger');
    if (awardImages.length > 0) {
        // Create lightbox modal elements once
        const modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Close image lightbox">&times;</button>
                <img class="lightbox-img" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector('.lightbox-img');
        const modalCaption = modal.querySelector('.lightbox-caption');
        const closeBtn = modal.querySelector('.lightbox-close');
        const backdrop = modal.querySelector('.lightbox-backdrop');

        function openModal(imgSrc, imgAlt) {
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt || '';
            modalCaption.textContent = imgAlt || '';
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        awardImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(img.src, img.alt);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 4. Ambient Cyber Constellation Background Canvas
    initCyberCanvas();

    // 5. Scroll-Triggered Reveal Animations
    initScrollReveal();
});

// Interactive Ambient Floating Glowing 3D Bubbles & Constellation Canvas
function initCyberCanvas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let canvas = document.getElementById('cyber-bg-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'cyber-bg-canvas';
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    let particles = [];
    const particleCount = Math.min(Math.floor(width * 0.065), 75);

    class GlowingBubble {
        constructor() {
            this.reset(true);
        }
        reset(randomY = false) {
            this.x = Math.random() * width;
            this.y = randomY ? Math.random() * height : height + Math.random() * 50;
            // Radius ranging from 7px to 23px (large, highly visible spheres)
            this.radius = Math.random() * 16 + 7;
            this.baseRadius = this.radius;
            this.vx = (Math.random() - 0.5) * 0.55;
            this.vy = - (Math.random() * 0.5 + 0.3); // Float upwards gently
            this.pulseSpeed = Math.random() * 0.035 + 0.015;
            this.pulseAngle = Math.random() * Math.PI * 2;
            this.sineAngle = Math.random() * Math.PI * 2;
            this.sineSpeed = Math.random() * 0.02 + 0.008;
            this.opacity = Math.random() * 0.35 + 0.55; // 0.55 to 0.90 high visibility opacity
            
            // Rich vibrant color palette
            const colors = [
                { r: 56, g: 189, b: 248 },   // Vibrant Cyan
                { r: 168, g: 85, b: 247 },   // Electric Purple
                { r: 99, g: 102, b: 241 },   // Deep Indigo
                { r: 52, g: 211, b: 153 },   // Emerald Green
                { r: 244, g: 63, b: 94 }     // Magenta Accent
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.sineAngle += this.sineSpeed;
            this.pulseAngle += this.pulseSpeed;
            
            this.x += this.vx + Math.sin(this.sineAngle) * 0.4;
            this.y += this.vy;
            
            // Pulse size gently
            this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 2.5;

            // Interactive mouse repulsion force
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - dist) / 150;
                this.x -= Math.cos(angle) * force * 3.5;
                this.y -= Math.sin(angle) * force * 3.5;
            }

            // Wrap around screen top & sides
            if (this.y < -50 || this.x < -60 || this.x > width + 60) {
                this.reset(false);
            }
        }
        draw() {
            const isLight = document.documentElement.classList.contains('light-mode');
            const alphaMultiplier = isLight ? 0.9 : 1.0;

            ctx.save();
            const r = this.color.r;
            const g = this.color.g;
            const b = this.color.b;
            const op = this.opacity * alphaMultiplier;

            // 1. Outer Glow Blur Halo
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
            ctx.shadowBlur = this.radius * 2.2;

            // 2. Main 3D Radial Sphere Fill
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);

            const grad = ctx.createRadialGradient(
                this.x - this.radius * 0.35,
                this.y - this.radius * 0.35,
                this.radius * 0.05,
                this.x,
                this.y,
                this.radius
            );

            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${Math.min(1, op + 0.35)})`);
            grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${op * 0.7})`);
            grad.addColorStop(0.95, `rgba(${r}, ${g}, ${b}, ${op * 0.95})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = grad;
            ctx.fill();

            // 3. Glossy 3D Highlight Arc (Soap Bubble Reflection)
            ctx.beginPath();
            ctx.arc(
                this.x - this.radius * 0.28,
                this.y - this.radius * 0.28,
                Math.max(0.5, this.radius * 0.35),
                0,
                Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.85, op + 0.25)})`;
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new GlowingBubble());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.documentElement.classList.contains('light-mode');
        const lineColor = isLight ? 'rgba(2, 132, 199,' : 'rgba(56, 189, 248,';

        // Draw connecting threads and bubbles
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    const alpha = (1 - dist / 160) * (isLight ? 0.4 : 0.5);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `${lineColor} ${alpha})`;
                    ctx.lineWidth = 1.4;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// Scroll Reveal Observer
function initScrollReveal() {
    const targets = document.querySelectorAll('.main-section, .interest-card, .project-card, .award-card, .project-list-item, .skills-group, .news-item, .cv-card-banner');
    
    targets.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        if (index % 3 === 1) el.classList.add('reveal-delay-1');
        if (index % 3 === 2) el.classList.add('reveal-delay-2');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(el => observer.observe(el));
}

