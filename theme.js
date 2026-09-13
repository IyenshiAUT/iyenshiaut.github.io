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
});

