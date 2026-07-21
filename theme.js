// Apply saved theme immediately (before render) to avoid flash of wrong theme.
// Site defaults to dark mode. Only switch to light if the user explicitly chose it.
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
});
