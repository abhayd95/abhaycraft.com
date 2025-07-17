// ========== Preloader ==========
window.addEventListener('load', function () {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600);
  }
});

// ========== Theme Light & Dark Mode ==========
const dayNightToggle = document.querySelector('.day-night');

function updateIcon() {
  const icon = document.querySelector('.day-night i');
  if (!icon) return;
  icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
}

function themeMode() {
  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  updateIcon();
}

if (dayNightToggle) {
  dayNightToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateIcon();
  });
}

// Initialize theme
themeMode();

// ========== Navigation Menu ==========
const navMenu = document.querySelector('.nav-menu');
const navMenuToggler = document.querySelector('.hamburger-btn');
const navCloseBtn = document.querySelector('.close-nav-menu');
const fadeOutEffect = document.querySelector('.fade-out-effect');

function toggleMenu() {
  navMenu.classList.toggle('open');
  fadeOutEffect.classList.toggle('active');
  document.body.classList.toggle('hidden-scrolling');
}

function closeMenu() {
  navMenu.classList.remove('open');
  fadeOutEffect.classList.remove('active');
  document.body.classList.remove('hidden-scrolling');
}

if (navMenuToggler) {
  navMenuToggler.addEventListener('click', toggleMenu);
}

if (navCloseBtn) {
  navCloseBtn.addEventListener('click', closeMenu);
}

if (fadeOutEffect) {
  fadeOutEffect.addEventListener('click', closeMenu);
}

// Close menu when clicking on nav links
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('link-item') && e.target.hash !== '') {
    // Delay closing to allow hash change to happen
    setTimeout(closeMenu, 300);
  }
});

// ========== Active Menu Item on Scroll ==========
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-menu .link-item');

function setActiveMenuItem() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
}

// Set active item on initial load
setActiveMenuItem();

window.addEventListener('scroll', setActiveMenuItem);

// ========== About Tabs ==========
const tabContainer = document.querySelector('.about-tabs');

if (tabContainer) {
  const tabItems = tabContainer.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');

  tabContainer.addEventListener('click', (e) => {
    const clickedTab = e.target.closest('.tab-item');
    if (!clickedTab) return;

    // Remove active class from all tabs and contents
    tabItems.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab
    clickedTab.classList.add('active');
    
    // Get the target content selector and activate it
    const target = clickedTab.getAttribute('data-target');
    if (target) {
      document.querySelector(target).classList.add('active');
    }
  });
}

// Rest of your JavaScript code...