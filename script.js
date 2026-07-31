// Lightweight interactivity: theme persistence, scroll reveals, counters, and roadmap tabs.
document.documentElement.classList.add('js-enabled');

const storageKey = 'tech-learning-theme';
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');

const getPreferredTheme = () => localStorage.getItem(storageKey) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

applyTheme(getPreferredTheme());

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open') || false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const counters = document.querySelectorAll('[data-counter]');
function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.matches('[data-counter]')) animateCounter(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal, [data-counter]').forEach((element) => revealObserver.observe(element));

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineDetail = document.querySelector('.timeline-detail');
timelineItems.forEach((item) => {
  item.addEventListener('click', () => {
    timelineItems.forEach((button) => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
    });
    item.classList.add('active');
    item.setAttribute('aria-selected', 'true');
    if (timelineDetail) timelineDetail.textContent = item.dataset.detail || '';
  });
});

// Subtle pointer-aware tilt for premium cards on devices that support hover.
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.hero-card, .project-card, .card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
