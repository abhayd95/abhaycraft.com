< script >
    /* ========= UTILITIES ========= */
    const $ = (s, r = document) => {
        try { return r.querySelector(s); } catch (e) { console.warn('Query selector error:', e); return null; }
    };
const $$ = (s, r = document) => {
    try { return Array.from(r.querySelectorAll(s)); } catch (e) { console.warn('Query selector all error:', e); return []; }
};

/* ========= PRELOADER ========= */
window.addEventListener('load', () => {
    try {
        const pre = $('.preloader');
        if (pre) {
            pre.classList.add('fade-out'); // let CSS animate it
            setTimeout(() => { pre.style.display = 'none'; }, 350); // match your CSS transition
        }
        // Ensure images are lazy if not declared in HTML
        $$('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });
    } catch (e) { console.warn('Preloader error:', e); }
});
// Fallback preloader removal after 3 seconds
setTimeout(() => {
    const pre = $('.preloader');
    if (pre) {
        pre.classList.add('fade-out');
        setTimeout(() => { pre.style.display = 'none'; }, 350);
    }
}, 3000);

/* ========= MOBILE NAV ========= */
(() => {
    const nav = $('.nav-menu');
    const openBtn = $('.hamburger-btn');
    const closeBtn = $('.close-nav-menu');
    const fade = $('.fade-out-effect');

    const open = () => {
        if (!nav) return;
        nav.classList.add('open');
        document.body.classList.add('stop-scrolling');
    };
    const close = () => {
        if (!nav) return;
        nav.classList.remove('open');
        document.body.classList.remove('stop-scrolling');
        if (fade) {
            fade.classList.add('active');
            setTimeout(() => fade.classList.remove('active'), 300);
        }
    };
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // close on outside click
    document.addEventListener('click', (e) => {
        if (!nav || !nav.classList.contains('open')) return;
        const inside = e.target.closest('.nav-menu-inner') || e.target.closest('.hamburger-btn');
        if (!inside) close();
    });
})();

/* ========= SMOOTH SCROLL + ACTIVE LINK ========= */
(() => {
    try {
        const header = $('.header');
        const menuLinks = $$('.nav-menu .link-item');

        const smoothTo = (hash) => {
            const el = hash ? $(hash) : null;
            if (!el) return;
            const headerH = (header ? .offsetHeight || 0);
            const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
            window.scrollTo({ top: y, behavior: 'smooth' });
        };

        // Handle all in-page anchors once
        $$('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const href = a.getAttribute('href');
                if (href ? .length > 1) {
                    e.preventDefault();
                    smoothTo(href);

                    // close nav if open (mobile) when clicking links inside nav/home-cta
                    const inNav = a.closest('.nav-menu') || a.closest('.home-text');
                    const nav = $('.nav-menu');
                    if (inNav && nav ? .classList.contains('open')) $('.close-nav-menu') ? .click();
                }
            });
        });

        // highlight as you scroll
        const sections = $$('.section, .about-section, .service-section, .portfolio-section');
        if (sections.length && menuLinks.length && 'IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = '#' + (entry.target.id || '');
                    if (entry.isIntersecting && id !== '#') {
                        menuLinks.forEach(a => a.classList.remove('active'));
                        const active = document.querySelector(`.nav-menu .link-item[href="${id}"]`);
                        active ? .classList.add('active');
                    }
                });
            }, { threshold: 0.6 });
            sections.forEach(sec => obs.observe(sec));
        }
    } catch (e) { console.warn('Smooth scroll error:', e); }
})();

/* ========= STICKY HEADER SHADOW ========= */
(() => {
    const header = $('.header');
    const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ========= THEME (DARK/LIGHT) ========= */
(() => {
    const btn = $('#themeToggle');
    const root = document.documentElement;
    const KEY = 'theme-preference';

    const apply = (mode) => {
        root.setAttribute('data-theme', mode);
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) icon.className = mode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    };

    try {
        const saved = localStorage.getItem(KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(saved || (prefersDark ? 'dark' : 'light'));
    } catch (_) { /* localStorage may fail in private mode */ }

    btn ? .addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (_) {}
    });
})();

/* ========= BACK TO TOP ========= */
(() => {
    const btn = $('#backToTop');
    const toggle = () => { if (btn) btn.style.display = window.scrollY > 400 ? 'grid' : 'none'; };
    btn ? .addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.addEventListener('scroll', toggle, { passive: true });
    toggle();
})();

/* ========= PORTFOLIO LIGHTBOX ========= */
(() => {
    const items = $$('.portfolio-item .portfolio-img img');
    if (!items.length) return;

    // create modal once
    const modal = document.createElement('div');
    modal.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.8);
    display:none;align-items:center;justify-content:center;z-index:9998;padding:24px;
  `;
    const img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.5)';
    modal.appendChild(img);
    document.body.appendChild(modal);

    const close = () => (modal.style.display = 'none');
    modal.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    items.forEach(i => {
        i.style.cursor = 'zoom-in';
        i.addEventListener('click', () => {
            img.src = i.currentSrc || i.src;
            modal.style.display = 'flex';
        });
    });
})();

/* ========= COPY EMAIL (click to copy) ========= */
(() => {
    const els = $$('[data-copy]');
    if (!els.length) return;
    els.forEach(el => {
        el.addEventListener('click', (e) => {
            const txt = el.getAttribute('data-copy');
            if (!txt) return;
            e.preventDefault();
            navigator.clipboard.writeText(txt).then(() => {
                const prev = el.textContent;
                el.textContent = 'Copied!';
                setTimeout(() => (el.textContent = prev), 1200);
            }).catch(() => console.log('Clipboard blocked'));
        });
    });
})();

/* ========= TRACK RESUME DOWNLOAD (gtag if available) ========= */
(() => {
    const resume = document.querySelector('a[href$=".pdf"]');
    if (!resume) return;
    resume.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'resume_download', { file: resume.getAttribute('href') });
        } else {
            console.log('[analytics] resume_download:', resume.getAttribute('href'));
        }
    });
})();

/* ========= REVEAL ON SCROLL (simple) ========= */
(() => {
    const revealables = $$('.service-item, .portfolio-item, .about-img, .about-info, .home-text, .home-img, .testimonial-item, .blog-item');
    revealables.forEach(el => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('reveal-in');
                obs.unobserve(en.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(el => obs.observe(el));
})();

/* ========= SCROLL PROGRESS BAR ========= */
(() => {
    const progressBar = $('.progress-bar');
    if (!progressBar) return;
    const updateProgress = () => {
        const scrollTop = window.pageYOffset;
        const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        progressBar.style.width = scrollPercent + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
})();

/* ========= SKILL PROGRESS BARS ANIMATION ========= */
(() => {
    const progressBars = $$('.progress-fill');
    if (!progressBars.length || !('IntersectionObserver' in window)) return;

    const animateProgress = (bar) => { const width = bar.getAttribute('data-width'); if (width) bar.style.width = width; };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
})();

/* ========= TYPING ANIMATION ========= */
(() => {
    try {
        const typingText = $('.typing-text');
        if (!typingText) return;
        const text = typingText.textContent || '';
        typingText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i++);
                setTimeout(typeWriter, 100);
            }
        };
        setTimeout(typeWriter, 1000);
    } catch (e) { console.warn('Typing animation error:', e); }
})();

/* ========= PARALLAX SCROLL EFFECTS ========= */
(() => {
    const parallaxElements = $$('.floating-icon, .scroll-indicator');
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    };
    window.addEventListener('scroll', updateParallax, { passive: true });
})();

/* ========= ENHANCED SCROLL REVEAL ========= */
(() => {
    const revealElements = $$('.reveal');
    if (!revealElements.length || !('IntersectionObserver' in window)) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Add staggered animation for grouped elements
                const group = entry.target.closest('[data-reveal-group]');
                if (group) {
                    const siblings = group.querySelectorAll('.reveal');
                    siblings.forEach((sibling, index) => {
                        if (sibling === entry.target) {
                            setTimeout(() => {
                                sibling.style.opacity = '1';
                                sibling.style.transform = 'translateY(0)';
                            }, index * 100);
                        }
                    });
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
})();

/* ========= HEADER SCROLL EFFECT ========= */
(() => {
    const header = $('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const updateHeader = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        // Hide/show header on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
})();

/* ========= COUNTER ANIMATION ========= */
(() => {
    const counters = $$('.skill-percentage');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const animateCounter = (counter) => {
        const target = parseInt((counter.textContent || '0').replace(/\D+/g, ''), 10) || 0;
        let current = 0;
        const increment = Math.max(1, target / 50);

        const step = () => {
            if (current < target) {
                current = Math.min(target, current + increment);
                counter.textContent = Math.ceil(current) + '%';
                requestAnimationFrame(step);
            } else {
                counter.textContent = target + '%';
            }
        };
        step();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
})();

/* ========= MOBILE TOUCH ENHANCEMENTS ========= */
(() => {
    const touchElements = $$('.btn-1, .tab-item, .service-item-inner, .portfolio-item');
    touchElements.forEach(el => {
        el.addEventListener('touchstart', () => { el.style.transform = 'scale(0.95)'; }, { passive: true });
        el.addEventListener('touchend', () => { el.style.transform = 'scale(1)'; }, { passive: true });
    });
})();

/* ========= PERFORMANCE OPTIMIZATION ========= */
(() => {
    // Lazy load images with data-src
    const images = $$('img[data-src]');
    if (!images.length || !('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });

    images.forEach(img => imageObserver.observe(img));
})(); <
/script>