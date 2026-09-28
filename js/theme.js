try {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.dataset.theme = 'dark';
    }
} catch {
    document.documentElement.dataset.theme = 'light';
}
