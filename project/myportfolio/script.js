/**
 * Portfolio — interactions: nav, scroll reveal, typing, skill bars, project filters, contact form
 */
(function () {
    'use strict';

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', () => {
        initNav();
        initReveal();
        initTyping();
        initSkillBars();
        initProjectFilters();
        initContactForm();
        initSmoothAnchors();
    });

    function initNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.querySelector('.navbar');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            navLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        try {
            const path = window.location.pathname;
            const currentFile = path.split('/').pop() || 'index.html';
            navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (!href) return;
                const target = href.split('/').pop();
                const match =
                    target === currentFile ||
                    (currentFile === '' && (target === 'index.html' || target === 'home.html')) ||
                    (currentFile === 'index.html' && target === 'home.html');
                if (match) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } catch (_) {
            /* no-op */
        }

        const updateNavbar = () => {
            if (!navbar) return;
            if (window.scrollY > 12) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    function initReveal() {
        const els = document.querySelectorAll('.reveal');
        if (!els.length || prefersReducedMotion()) {
            els.forEach((el) => el.classList.add('visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        );

        els.forEach((el) => io.observe(el));
    }

    function initTyping() {
        const el = document.getElementById('typed-role');
        if (!el || prefersReducedMotion()) {
            if (el) {
                const staticText = el.getAttribute('data-static');
                if (staticText) el.textContent = staticText;
            }
            return;
        }

        const phrases = (el.getAttribute('data-phrases') || '')
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean);
        if (!phrases.length) return;

        let pi = 0;
        let ci = 0;
        let deleting = false;
        const typeSpeed = 48;
        const deleteSpeed = 32;
        const pauseEnd = 2200;
        const pauseStart = 400;

        el.innerHTML = '<span class="typed-text"></span><span class="typed-cursor" aria-hidden="true"></span>';
        const textSpan = el.querySelector('.typed-text');

        function tick() {
            const full = phrases[pi];
            if (deleting) {
                ci--;
                if (ci < 0) {
                    deleting = false;
                    pi = (pi + 1) % phrases.length;
                    ci = 0;
                    setTimeout(tick, pauseStart);
                    return;
                }
            } else {
                ci++;
                if (ci > full.length) {
                    deleting = true;
                    setTimeout(tick, pauseEnd);
                    return;
                }
            }
            textSpan.textContent = full.slice(0, ci);
            setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
        }

        setTimeout(tick, pauseStart);
    }

    function initSkillBars() {
        const fills = document.querySelectorAll('.skill-fill[data-w]');
        if (!fills.length || prefersReducedMotion()) {
            fills.forEach((f) => {
                f.style.width = f.getAttribute('data-w') || '0%';
            });
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const w = bar.getAttribute('data-w') || '0%';
                        bar.style.width = w;
                        io.unobserve(bar);
                    }
                });
            },
            { threshold: 0.2 }
        );

        fills.forEach((f) => io.observe(f));
    }

    function initProjectFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.project-card[data-category]');
        if (!buttons.length || !cards.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter') || 'all';

                buttons.forEach((b) => b.classList.toggle('active', b === btn));

                cards.forEach((card) => {
                    const raw = card.getAttribute('data-category') || '';
                    const cats = raw.split(/\s+/).filter(Boolean);
                    const show = filter === 'all' || cats.includes(filter);
                    card.classList.toggle('hidden', !show);
                });
            });
        });
    }

    function initContactForm() {
        const form = document.querySelector('.contact-form');
        const status = document.querySelector('.form-status');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fd = new FormData(form);
            const name = String(fd.get('name') || '').trim();
            const email = String(fd.get('email') || '').trim();
            const message = String(fd.get('message') || '').trim();

            if (status) {
                status.textContent = '';
                status.className = 'form-status';
            }

            if (!name || !email || !message) {
                if (status) {
                    status.textContent = 'Please fill in your name, email, and message.';
                    status.classList.add('error');
                } else {
                    alert('Please fill in your name, email, and message.');
                }
                return;
            }

            if (status) {
                status.textContent =
                    'Thanks — your message is ready to send. Connect your form to EmailJS, Formspree, or Netlify Forms for delivery.';
                status.classList.add('success');
            } else {
                alert('Thank you! Your message has been noted.');
            }
            form.reset();
        });
    }

    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            const id = a.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            a.addEventListener('click', (e) => {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
                }
            });
        });
    }
})();
