// Premium interactivity: theme persistence, motion, reveals, counters, roadmap tabs, and tactile UI.
document.documentElement.classList.add('js-enabled');
document.body.classList.add('is-transitioning');

const storageKey = 'tech-learning-theme';
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const loader = document.querySelector('.loader');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const getPreferredTheme = () => localStorage.getItem(storageKey) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
  if (themeToggle) themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

applyTheme(getPreferredTheme());

window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('loaded'), motionQuery.matches ? 0 : 520);
});

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
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    navMenu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (!target || motionQuery.matches) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const counters = document.querySelectorAll('[data-counter]');
function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progressValue = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    counter.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progressValue < 1) requestAnimationFrame(update);
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

let ticking = false;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;

function updateFrame() {
  ticking = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty('--scroll-progress', ratio.toFixed(4));

  if (!motionQuery.matches) {
    document.documentElement.style.setProperty('--mouse-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${pointerY}px`);
    document.documentElement.style.setProperty('--cursor-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${pointerY}px`);

    document.querySelectorAll('[data-parallax]').forEach((element) => {
      const speed = Number(element.dataset.parallax || 0);
      element.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    });
  }
}

function requestFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateFrame);
}

window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame);
window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  document.body.classList.add('pointer-active');
  requestFrame();
}, { passive: true });
requestFrame();

if (canHover && !motionQuery.matches) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -9;
      card.style.transform = `perspective(950px) rotateY(${x}deg) rotateX(${y}deg) translate3d(0,-7px,0)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate3d(${x}px, ${y - 2}px, 0)`;
    });
    button.addEventListener('pointerleave', () => {
      button.style.transform = '';
    });
  });
}

document.querySelectorAll('.button, .timeline-item, summary, .theme-toggle, .menu-toggle, .nav-links a, .social-links a').forEach((element) => {
  element.addEventListener('click', (event) => {
    if (motionQuery.matches) return;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    element.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});
