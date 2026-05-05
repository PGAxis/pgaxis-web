const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});