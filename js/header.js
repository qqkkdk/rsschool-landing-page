const page = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.setAttribute('aria-pressed', page.dataset.theme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = page.dataset.theme !== 'dark';

    page.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', isDark);

    try {
        localStorage.setItem('theme', page.dataset.theme);
    } catch {
        return;
    }
});
