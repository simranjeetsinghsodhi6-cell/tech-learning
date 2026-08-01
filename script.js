// Premium interactivity: theme persistence, motion, reveals, counters, roadmap tabs, and tactile UI.
document.documentElement.classList.add('js-enabled');
document.body.classList.add('is-transitioning');

const storageKey = 'tech-learning-theme';
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const loader = document.querySelector('.loader');
const coursesSection = document.querySelector('#courses');
const courseDetailsSection = document.querySelector('#course-details');
const courseList = document.querySelector('#course-list');
const courseSearch = document.querySelector('#course-search');
const courseFilters = document.querySelector('#course-filters');
const courseEmpty = document.querySelector('#course-empty');
const courseDetailCard = document.querySelector('#course-detail-card');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const supabaseConfig = {
  url: window.TECH_LEARNING_SUPABASE_URL || '',
  anonKey: window.TECH_LEARNING_SUPABASE_ANON_KEY || '',
};

const fallbackCourses = [
  { id: 'web-fundamentals-bootcamp', category: 'Web', thumbnail: '🌐', title: 'Web Fundamentals Bootcamp', description: 'Build accessible pages with semantic HTML, modern CSS, and responsive layouts.', instructor: 'Maya Chen', duration: '6 hours', difficulty: 'Beginner', price: 'Free', outcomes: ['Structure pages with semantic HTML', 'Create responsive CSS layouts', 'Publish a polished landing page'] },
  { id: 'javascript-ui-essentials', category: 'JavaScript', thumbnail: '⚡', title: 'JavaScript UI Essentials', description: 'Practice DOM events, state, browser debugging, and delightful interactive patterns.', instructor: 'Jordan Lee', duration: '8 hours', difficulty: 'Beginner', price: '$29', outcomes: ['Handle user events confidently', 'Update UI from reusable data', 'Debug common browser issues'] },
  { id: 'github-pages-launch', category: 'GitHub', thumbnail: '🚀', title: 'GitHub Pages Launch', description: 'Learn commits, branches, pull requests, and a repeatable GitHub Pages workflow.', instructor: 'Priya Sharma', duration: '5 hours', difficulty: 'Beginner', price: 'Free', outcomes: ['Track work with Git commits', 'Collaborate with pull requests', 'Deploy a project site'] },
  { id: 'portfolio-project-lab', category: 'Projects', thumbnail: '💼', title: 'Portfolio Project Lab', description: 'Turn lessons into a professional portfolio piece with copy, polish, and launch checks.', instructor: 'Alex Rivera', duration: '10 hours', difficulty: 'Intermediate', price: '$49', outcomes: ['Plan a portfolio-ready project', 'Polish interactions and content', 'Prepare a launch checklist'] },
];
let courses = fallbackCourses;
let categories = [];
let activeCategory = 'All';

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
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#course/')) {
      navMenu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      return;
    }
    if (href === '#courses' && courseDetailsSection && !courseDetailsSection.hidden) {
      navMenu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      return;
    }
    const target = document.getElementById(href.slice(1));
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

function observeRevealElements(scope = document) {
  scope.querySelectorAll('.reveal, [data-counter]').forEach((element) => revealObserver.observe(element));
}
observeRevealElements();

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

function enableTilt(scope = document) {
  if (!canHover || motionQuery.matches) return;
  scope.querySelectorAll('.tilt-card').forEach((card) => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
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
}

if (canHover && !motionQuery.matches) {
  enableTilt();

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

function enableRipple(scope = document) {
  scope.querySelectorAll('.button, .timeline-item, summary, .theme-toggle, .menu-toggle, .nav-links a, .social-links a, .course-filter').forEach((element) => {
    if (element.dataset.rippleReady) return;
    element.dataset.rippleReady = 'true';
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
}
enableRipple();

function getCourseHref(course) {
  return `#course/${course.id}`;
}

function createCourseCard(course) {
  return `
    <article class="card course-card tilt-card reveal slide-up">
      <div class="course-thumb" aria-hidden="true">${course.thumbnail}</div>
      <div class="course-meta"><span>${course.category}</span><span>${course.duration}</span><span>${course.difficulty}</span></div>
      <div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p class="course-instructor">Instructor: ${course.instructor}</p>
      </div>
      <div class="course-card-footer">
        <span class="course-price">${course.price}</span>
        <a class="button primary magnetic" href="${getCourseHref(course)}">Enroll <span>→</span></a>
      </div>
    </article>
  `;
}

function renderCourseFilters() {
  if (!courseFilters) return;
  const categoryNames = categories.length > 0 ? categories.map((category) => category.name) : [...new Set(courses.map((course) => course.category))];
  const filterNames = ['All', ...categoryNames];
  courseFilters.innerHTML = filterNames.map((category) => `<button class="course-filter${category === activeCategory ? ' active' : ''}" type="button" data-category="${category}">${category}</button>`).join('');
  courseFilters.querySelectorAll('.course-filter').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category || 'All';
      renderCourseFilters();
      renderCourses();
    });
  });
  enableRipple(courseFilters);
}

function getFilteredCourses() {
  const query = (courseSearch?.value || '').trim().toLowerCase();
  return courses.filter((course) => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const haystack = `${course.title} ${course.description} ${course.instructor} ${course.category} ${course.difficulty}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
}

function renderCourses() {
  if (!courseList) return;
  const filteredCourses = getFilteredCourses();
  courseList.innerHTML = filteredCourses.map(createCourseCard).join('');
  if (courseEmpty) courseEmpty.hidden = filteredCourses.length > 0;
  observeRevealElements(courseList);
  enableTilt(courseList);
  enableRipple(courseList);
}

function renderCourseDetail(courseId) {
  const course = courses.find((item) => item.id === courseId);
  if (!course || !courseDetailCard) return false;
  courseDetailCard.innerHTML = `
    <div class="course-thumb" aria-hidden="true">${course.thumbnail}</div>
    <div>
      <p class="eyebrow">${course.category} course</p>
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <div class="course-meta"><span>${course.instructor}</span><span>${course.duration}</span><span>${course.difficulty}</span><span>${course.price}</span></div>
      <ul class="course-outcomes">${course.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')}</ul>
      <a class="button primary magnetic" href="#courses">Enroll now <span>→</span></a>
    </div>
  `;
  courseDetailsSection.hidden = false;
  coursesSection.hidden = true;
  courseDetailsSection.scrollIntoView({ behavior: motionQuery.matches ? 'auto' : 'smooth', block: 'start' });
  observeRevealElements(courseDetailsSection);
  enableTilt(courseDetailsSection);
  enableRipple(courseDetailsSection);
  return true;
}

function handleCourseRoute() {
  const match = window.location.hash.match(/^#course\/(.+)$/);
  if (!match) {
    if (coursesSection) coursesSection.hidden = false;
    if (courseDetailsSection) courseDetailsSection.hidden = true;
    return;
  }
  if (!renderCourseDetail(match[1])) window.location.hash = '#courses';
}


function mapSupabaseCourse(course) {
  return {
    id: course.slug || course.id,
    category: course.categories?.name || course.category || 'General',
    thumbnail: course.thumbnail || '📚',
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    duration: course.duration,
    difficulty: course.difficulty,
    price: course.price,
    outcomes: Array.isArray(course.outcomes) ? course.outcomes : [],
  };
}

async function fetchSupabaseTable(table, query = 'select=*') {
  if (!supabaseConfig.url || !supabaseConfig.anonKey) return null;
  const endpoint = `${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/${table}?${query}`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
    },
  });
  if (!response.ok) throw new Error(`Unable to fetch ${table}`);
  return response.json();
}

async function loadCourses() {
  try {
    const [remoteCategories, remoteCourses] = await Promise.all([
      fetchSupabaseTable('categories', 'select=id,name,slug&order=name.asc'),
      fetchSupabaseTable('courses', 'select=id,slug,title,description,instructor,duration,difficulty,price,thumbnail,outcomes,categories(name)&order=created_at.desc'),
    ]);

    if (remoteCourses?.length) {
      categories = remoteCategories || [];
      courses = remoteCourses.map(mapSupabaseCourse);
    } else {
      const response = await fetch('./courses.json');
      if (response.ok) courses = await response.json();
    }
  } catch (error) {
    console.warn('Using bundled course data because the remote course store is unavailable.', error);
    courses = fallbackCourses;
  }
  renderCourseFilters();
  renderCourses();
  handleCourseRoute();
}


courseSearch?.addEventListener('input', renderCourses);
window.addEventListener('hashchange', handleCourseRoute);
loadCourses();
