// Portfolio site JavaScript
// Handles: mobile menu toggle, active nav link, basic form handling, navbar shadow on scroll

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked (useful on mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Highlight active nav link based on current page
    try {
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkFile = link.getAttribute('href');
            if (!linkFile) return;
            if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } catch (_) {
        // no-op
    }

    // Navbar shadow on scroll
    const updateNavbarShadow = () => {
        if (!navbar) return;
        if (window.scrollY > 8) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    updateNavbarShadow();
    window.addEventListener('scroll', updateNavbarShadow, { passive: true });

    // Basic contact form handling (front-end only)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const message = String(formData.get('message') || '').trim();

            if (!name || !email || !message) {
                alert('Please fill in your name, email, and message.');
                return;
            }

            // Simulate successful submission
            alert('Thank you! Your message has been sent.');
            contactForm.reset();
        });
    }
});


