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

// Interactive Background Neural Grid Canvas
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

    let particles = [];
    const particleCount = Math.min(Math.floor(width * 0.035), 45);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 1.5 + 0.8;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.documentElement.classList.contains('light-mode');
        const nodeColor = isLight ? 'rgba(2, 132, 199,' : 'rgba(56, 189, 248,';

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${nodeColor} 0.5)`;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 135) {
                    const alpha = (1 - dist / 135) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `${nodeColor} ${alpha})`;
                    ctx.lineWidth = 0.75;
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

