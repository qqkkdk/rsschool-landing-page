const page = document.documentElement;
const header = document.querySelector('.header');
const navigation = document.querySelector('.header-nav');
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const pageContent = document.querySelectorAll('main, .footer');
const mobileScreen = window.matchMedia('(max-width: 768px)');

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

function setMenuOpen(isOpen) {
    page.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    navigation.inert = mobileScreen.matches && !isOpen;

    pageContent.forEach((element) => {
        element.inert = isOpen;
    });
}

menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    setMenuOpen(!isOpen);

    if (!isOpen) {
        navigation.scrollTop = 0;
        navigation.querySelector('a').focus();
    }
});

navigation.addEventListener('click', (event) => {
    if (mobileScreen.matches && event.target.closest('a')) {
        setMenuOpen(false);
        menuToggle.focus({ preventScroll: true });
    }
});

document.addEventListener('keydown', (event) => {
    if (!page.classList.contains('menu-open')) {
        return;
    }

    if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggle.focus({ preventScroll: true });
    }

    if (event.key === 'Tab') {
        const linksAndButtons = header.querySelectorAll('a, button');
        const firstElement = linksAndButtons[0];
        const lastElement = linksAndButtons[linksAndButtons.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
});

mobileScreen.addEventListener('change', () => {
    setMenuOpen(false);

    if (mobileScreen.matches && navigation.contains(document.activeElement)) {
        menuToggle.focus({ preventScroll: true });
    } else if (!mobileScreen.matches && document.activeElement === menuToggle) {
        navigation.querySelector('a').focus({ preventScroll: true });
    }
});

setMenuOpen(false);
