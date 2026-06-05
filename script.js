// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun');
    if (window.lucide) lucide.createIcons();
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Language Toggle
const langToggle = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const html = document.documentElement;

function setLanguage(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langText.textContent = lang === 'ar' ? 'EN' : 'AR';
    localStorage.setItem('lang', lang);
    
    // Update text content for elements with data-en/data-ar
    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });
    
    if (window.lucide) lucide.createIcons();
}

langToggle.addEventListener('click', () => {
    const currentLang = html.getAttribute('lang') || 'en';
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
});

// Load saved preferences
const savedTheme = localStorage.getItem('theme') || 'dark';
const savedLang = localStorage.getItem('lang') || 'en';
setTheme(savedTheme);
setLanguage(savedLang);

// Smooth Scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.padding = '1rem 10%';
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        nav.style.padding = '1.5rem 10%';
        nav.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

// Simple Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.program-card, .section-title, .hero-content, #creations, #ai-tools').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Re-initialize Lucide icons just in case
if (window.lucide) {
    lucide.createIcons();
}
