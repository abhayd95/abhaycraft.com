/* ========= UTILITIES ========= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ========= PRELOADER ========= */
window.addEventListener('load', () => {
  const pre = $('.preloader');
  if (pre) pre.style.display = 'none';

  // Ensure images are lazy if not declared in HTML
  $$('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
});

/* ========= MOBILE NAV ========= */
(() => {
  const nav = $('.nav-menu');
  const openBtn = $('.hamburger-btn');
  const closeBtn = $('.close-nav-menu');
  const fade = $('.fade-out-effect');

  const open = () => {
    nav.classList.add('open');
    document.body.classList.add('stop-scrolling');
  };
  const close = () => {
    nav.classList.remove('open');
    document.body.classList.remove('stop-scrolling');
    if (fade) {
      fade.classList.add('active');
      setTimeout(() => fade.classList.remove('active'), 300);
    }
  };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('open')) return;
    const inside = e.target.closest('.nav-menu-inner') || e.target.closest('.hamburger-btn');
    if (!inside) close();
  });
})();

/* ========= SMOOTH SCROLL + ACTIVE LINK ========= */
(() => {
  const links = $$('.nav-menu .link-item, .home-text a.link-item');
  const header = $('.header');

  function smoothTo(id) {
    const el = id ? $(id) : null;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 0) - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        smoothTo(href);
        // close nav if open (mobile)
        const nav = $('.nav-menu');
        if (nav?.classList.contains('open')) $('.close-nav-menu')?.click();
      }
    });
  });

  // highlight as you scroll
  const sections = $$('.section, .about-section, .service-section, .portfolio-section');
  const menuLinks = $$('.nav-menu .link-item');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + (entry.target.id || '');
      if (entry.isIntersecting) {
        menuLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-menu .link-item[href="${id}"]`);
        active?.classList.add('active');
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => obs.observe(sec));
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

  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(KEY, next);
  });
})();

/* ========= BACK TO TOP ========= */
(() => {
  const btn = $('#backToTop');
  const toggle = () => {
    if (!btn) return;
    btn.style.display = window.scrollY > 400 ? 'grid' : 'none';
  };
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
      img.src = i.src;
      modal.style.display = 'flex';
    });
  });
})();

/* ========= COPY EMAIL (click to copy) ========= */
(() => {
  const el = document.querySelector('[data-copy]');
  if (!el) return;
  el.addEventListener('click', (e) => {
    const txt = el.getAttribute('data-copy');
    if (!txt) return;
    e.preventDefault();
    navigator.clipboard.writeText(txt).then(() => {
      const prev = el.textContent;
      el.textContent = 'Copied!';
      setTimeout(() => (el.textContent = prev), 1200);
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
  // add .reveal to blocks you want animated via CSS
  const revealables = $$(
    '.service-item, .portfolio-item, .about-img, .about-info, .home-text, .home-img'
  );
  revealables.forEach(el => el.classList.add('reveal'));

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
