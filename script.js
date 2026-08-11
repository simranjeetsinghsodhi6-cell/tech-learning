// Tech Learning frontend: Supabase Auth, role-aware dashboards, dynamic content, and graceful static fallbacks.
document.documentElement.classList.add('js-enabled');

const CONFIG = {
  supabaseUrl: window.TECH_LEARNING_SUPABASE_URL || '',
  supabaseAnonKey: window.TECH_LEARNING_SUPABASE_ANON_KEY || '',
};
const supabase = CONFIG.supabaseUrl && CONFIG.supabaseAnonKey && window.supabase
  ? window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey)
  : null;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const externalAttrs = 'target="_blank" rel="noopener noreferrer"';

const state = {
  user: null,
  role: 'guest',
  profile: null,
  courses: [],
  certificates: [],
  opportunities: [],
  affiliateOffers: [],
  announcements: [],
  projects: [
    { title: 'Personal portfolio', description: 'A responsive homepage with a refined visual system.' },
    { title: 'Interactive quiz app', description: 'DOM events, scoring logic, and feedback states.' },
    { title: 'Docs site', description: 'GitHub Pages deployment with clean navigation.' },
    { title: 'Product landing page', description: 'Conversion-focused sections and FAQ patterns.' },
  ],
};

const defaultOpportunities = [
  { id: 'web-dev-starter', category: 'Web Development', title: 'Landing page build', description: 'Create responsive one-page websites for small businesses.', skills: 'HTML, CSS, responsive design, GitHub Pages', level: 'Beginner', earning_range: '$50-$300 per project estimate', getting_started: 'Build 2 demo pages, publish them, and apply with a clear portfolio link.', course: 'Web Fundamentals Bootcamp', url: 'https://www.upwork.com/' },
  { id: 'frontend-fixes', category: 'Frontend Development', title: 'Frontend bug fixes', description: 'Fix layout, navigation, and small JavaScript issues on existing websites.', skills: 'CSS Grid/Flexbox, JavaScript basics, browser DevTools', level: 'Intermediate', earning_range: '$15-$50/hour estimate', getting_started: 'Document before/after fixes and offer small scoped improvements.', course: 'JavaScript UI Essentials', url: 'https://www.freelancer.com/' },
  { id: 'wordpress-pages', category: 'WordPress', title: 'WordPress page setup', description: 'Set up pages, menus, forms, and content updates for clients.', skills: 'WordPress admin, themes, plugins, basic SEO', level: 'Beginner', earning_range: '$75-$500 per project estimate', getting_started: 'Practice on a local/demo WordPress site and create a checklist.', course: 'Digital Marketing', url: 'https://www.fiverr.com/' },
  { id: 'graphic-social', category: 'Graphic Design', title: 'Social media design pack', description: 'Design reusable post templates for small creators and businesses.', skills: 'Canva/Figma, typography, brand consistency', level: 'Beginner', earning_range: '$25-$150 per pack estimate', getting_started: 'Create sample template packs and explain usage rights clearly.', course: 'Portfolio Project Lab', url: 'https://www.behance.net/' },
  { id: 'video-shorts', category: 'Video Editing', title: 'Short-form video editing', description: 'Edit captions, cuts, hooks, and simple motion for reels or shorts.', skills: 'CapCut/Premiere, storytelling, captions', level: 'Intermediate', earning_range: '$10-$75 per video estimate', getting_started: 'Make 3 sample edits from your own footage and share a portfolio.', course: 'AI-Powered Digital Marketing', url: 'https://www.fiverr.com/categories/video-animation' },
  { id: 'content-writing', category: 'Content Writing', title: 'SEO blog draft', description: 'Research and write useful beginner-friendly articles.', skills: 'Research, outlines, SEO basics, editing', level: 'Beginner', earning_range: '$20-$150 per article estimate', getting_started: 'Publish sample articles and disclose AI assistance if used.', course: 'Digital Marketing', url: 'https://www.problogger.com/jobs/' },
  { id: 'ui-ux-audit', category: 'UI/UX', title: 'Website UX audit', description: 'Review navigation, readability, mobile issues, and conversion blockers.', skills: 'Heuristics, accessibility, Figma, clear reporting', level: 'Intermediate', earning_range: '$50-$400 per audit estimate', getting_started: 'Create a sample audit PDF for a demo website.', course: 'Portfolio Project Lab', url: 'https://www.upwork.com/' },
  { id: 'virtual-assistant', category: 'Virtual Assistant', title: 'Technical VA support', description: 'Help with uploads, formatting, email tools, spreadsheets, and site updates.', skills: 'Organization, Excel, CMS basics, communication', level: 'Beginner', earning_range: '$5-$25/hour estimate', getting_started: 'List tools you can operate and offer a trial task.', course: 'MS Excel', url: 'https://www.peopleperhour.com/' },
  { id: 'python-automation', category: 'Python/Automation', title: 'Spreadsheet automation', description: 'Automate repetitive CSV, Excel, or file organization tasks.', skills: 'Python, pandas basics, file handling, testing', level: 'Advanced', earning_range: '$50-$500 per automation estimate', getting_started: 'Build scripts that clean sample data and document inputs/outputs.', course: 'Python Programming', url: 'https://www.upwork.com/' },
];
const defaultAffiliateOffers = [
  { id: 'hosting-tools', product: 'Web hosting or domain tools', category: 'Web', description: 'Research official partner programs for reputable hosting/domain services before applying.', commission: 'Use official program terms only; rates vary.', website: 'https://www.namecheap.com/affiliates/', affiliate_link: '', disclosure: 'Disclose that you may earn a commission from qualified purchases.', course: 'GitHub Pages Launch' },
];

function showMessage(text, isError = false) { const box = $('#auth-message'); if (box) { box.textContent = text; box.style.color = isError ? '#ef4444' : ''; } }
function renderThumb(value) { return String(value || '').startsWith('http') ? `<img src="${escapeHtml(value)}" alt="">` : escapeHtml(value || '📚'); }

async function dbSelect(table, query = '*') {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select(query);
  if (error) { console.warn(error); return null; }
  return data || [];
}
async function loadData() {
  const courseRows = await dbSelect('courses', '*, categories(name)');
  state.courses = courseRows?.map((c) => ({ ...c, category: c.categories?.name || c.category || 'General' })) || await fetch('./courses.json').then((r) => r.json()).catch(() => []);
  state.opportunities = await dbSelect('freelancing_opportunities') || defaultOpportunities;
  state.affiliateOffers = await dbSelect('affiliate_offers') || defaultAffiliateOffers;
  state.announcements = await dbSelect('announcements') || [{ title: 'Welcome to Tech Learning', body: 'Start with the roadmap and complete small projects every week.' }];
  state.certificates = await dbSelect('certificates') || [];
  renderAll();
}

function renderCourses() {
  const list = $('#course-list'); if (!list) return;
  list.innerHTML = state.courses.map((c) => `<article class="card course-card"><div class="course-thumb">${renderThumb(c.thumbnail)}</div><div class="course-meta"><span>${escapeHtml(c.category)}</span><span>${escapeHtml(c.difficulty)}</span><span>${escapeHtml(c.duration)}</span></div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p><p class="course-instructor">${escapeHtml(c.instructor || '')}</p><div class="course-card-footer"><span class="course-price">${escapeHtml(c.price || 'Free')}</span><a class="button secondary" href="#login">Enroll / Continue</a></div></article>`).join('');
  const filters = $('#course-filters'); if (filters) filters.innerHTML = [...new Set(state.courses.map((c) => c.category))].map((cat) => `<button class="course-filter" type="button">${escapeHtml(cat)}</button>`).join('');
}
function renderOpportunities() { const box = $('#freelance-list'); if (box) box.innerHTML = state.opportunities.map((o) => `<article class="card"><p class="eyebrow">${escapeHtml(o.category)}</p><h3>${escapeHtml(o.title)}</h3><p>${escapeHtml(o.description)}</p><p><strong>Skills:</strong> ${escapeHtml(o.skills)}</p><p><strong>Level:</strong> ${escapeHtml(o.level)} • <strong>Estimated earning:</strong> ${escapeHtml(o.earning_range)}</p><p>${escapeHtml(o.getting_started)}</p><p><strong>Relevant course:</strong> ${escapeHtml(o.course || '')}</p><a class="button secondary" href="${escapeHtml(o.url || '#')}" ${externalAttrs}>Open platform</a></article>`).join(''); }
function renderAffiliate() { const box = $('#affiliate-list'); if (box) box.innerHTML = state.affiliateOffers.map((o) => `<article class="card"><p class="eyebrow">${escapeHtml(o.category)}</p><h3>${escapeHtml(o.product)}</h3><p>${escapeHtml(o.description)}</p><p><strong>Commission:</strong> ${escapeHtml(o.commission)}</p><p><strong>Disclosure:</strong> ${escapeHtml(o.disclosure)}</p><p><strong>Recommended course:</strong> ${escapeHtml(o.course || '')}</p><a class="button secondary" href="${escapeHtml(o.affiliate_link || o.website || '#')}" ${externalAttrs}>Official link</a></article>`).join(''); }
function renderStudentDashboard() { const box = $('#student-dashboard-content'); if (!box) return; const name = state.profile?.full_name || state.user?.email || 'student'; $('#student-welcome').textContent = `Welcome, ${name}.`; const mine = state.certificates.filter((c) => c.student_id === state.user?.id || c.student_email === state.user?.email); box.innerHTML = ['My Courses', 'Course Progress', 'My Certificates', 'Projects', 'Learning Roadmap', 'Freelancing', 'Affiliate Marketing', 'Announcements', 'Profile'].map((title) => `<article class="card"><h3>${title}</h3><p>${title === 'My Certificates' ? `${mine.length} certificate(s) assigned to your account.` : title === 'Announcements' ? state.announcements.map((a) => a.title).join(', ') : 'Available after enrollment and admin updates.'}</p></article>`).join(''); }
function renderCertificates() { const grid = $('#student-certificate-grid'); if (!grid) return; if (!state.user) { grid.innerHTML = '<p class="empty-state">Please login to view your certificates.</p>'; return; } const mine = state.certificates.filter((c) => c.student_id === state.user.id || c.student_email === state.user.email); grid.innerHTML = mine.length ? mine.map((c) => `<article class="card certificate-card"><h3>${escapeHtml(c.course_name || 'Course')} Certificate</h3><p>${escapeHtml(c.student_name || state.user.email)}</p><p>ID: ${escapeHtml(c.id)}</p></article>`).join('') : '<p class="empty-state">No certificates are assigned to this account yet.</p>'; }

async function requireRole(role) { if (!supabase || !state.user) return false; const { data } = await supabase.from('profiles').select('role, full_name').eq('id', state.user.id).single(); state.profile = data; state.role = data?.role || 'student'; return role ? state.role === role : true; }
async function refreshSession() { if (!supabase) { route(); return; } const { data } = await supabase.auth.getSession(); state.user = data.session?.user || null; if (state.user) await requireRole(); updateAuthUi(); route(); }
function updateAuthUi() { $('#nav-login-link').hidden = !!state.user; $('#nav-student-link').hidden = !state.user || state.role === 'admin'; renderStudentDashboard(); renderCertificates(); route(); }
async function handleAuth(type, event) { event.preventDefault(); if (!supabase) return showMessage('Supabase is not configured yet. Add project URL/anon key and run supabase-schema.sql.', true); const form = event.currentTarget; const email = form.querySelector('[type=email]').value; const password = form.querySelector('[type=password]').value; const opts = type === 'signUp' ? { options: { data: { full_name: $('#register-name').value } } } : {}; const { data, error } = type === 'signUp' ? await supabase.auth.signUp({ email, password, ...opts }) : await supabase.auth.signInWithPassword({ email, password }); if (error) return showMessage(error.message, true); state.user = data.user; await requireRole(); showMessage(`Authenticated as ${state.role}. Redirecting...`); location.hash = state.role === 'admin' ? '#admin' : '#student-dashboard'; updateAuthUi(); }
async function logout() { if (supabase) await supabase.auth.signOut(); state.user = null; state.role = 'guest'; state.profile = null; updateAuthUi(); location.hash = '#home'; }
function route() { const hash = location.hash || '#home'; ['#admin', '#student-dashboard', '#certificates'].forEach((id) => { const el = $(id); if (el) el.hidden = true; }); if (hash === '#admin' && state.role === 'admin') $('#admin').hidden = false; if (hash === '#student-dashboard' && state.user && state.role !== 'admin') $('#student-dashboard').hidden = false; if (hash === '#certificates') $('#certificates').hidden = false; }
function protectRoutes() { if (location.hash === '#admin' && state.role !== 'admin') { location.hash = state.user ? '#student-dashboard' : '#login'; showMessage('Admin access requires a verified backend admin role.', true); } if (location.hash === '#student-dashboard' && !state.user) location.hash = '#login'; route(); }

const adminTableMap = {
  courses: { table: 'courses', fields: { title: '', description: '', slug: '', instructor: '', duration: '', difficulty: 'Beginner', price: 'Free', thumbnail: '📚', is_published: true } },
  lessons: { table: 'lessons', fields: { course_id: '', title: '', description: '', video_url: '', notes_url: '', sort_order: 0, is_published: true } },
  students: { table: 'profiles', fields: { id: '', full_name: '', role: 'student' } },
  enrollments: { table: 'enrollments', fields: { course_id: '', student_id: '', status: 'enrolled', progress: 0 } },
  certificates: { table: 'certificates', fields: { student_id: '', student_email: '', student_name: '', course_name: '', status: 'Issued', file_url: '' } },
  freelancing: { table: 'freelancing_opportunities', fields: { category: '', title: '', description: '', skills: '', level: 'Beginner', earning_range: '', getting_started: '', course: '', url: '', is_published: true } },
  affiliate: { table: 'affiliate_offers', fields: { product: '', description: '', category: '', commission: '', website: '', affiliate_link: '', disclosure: '', course: '', is_published: true } },
  announcements: { table: 'announcements', fields: { title: '', body: '', is_published: true } },
  projects: { table: 'projects', fields: { title: '', description: '', url: '', is_published: true } },
  learning_paths: { table: 'learning_paths', fields: { title: '', description: '', sort_order: 0, is_published: true } },
};
let activeAdminTab = 'courses';
function adminRowsFor(tab) {
  return ({ courses: state.courses, certificates: state.certificates, freelancing: state.opportunities, affiliate: state.affiliateOffers, announcements: state.announcements, projects: state.projects }[tab]) || [];
}
async function adminSave(tab, payload) {
  if (!supabase || state.role !== 'admin') throw new Error('Supabase admin session required.');
  const { table } = adminTableMap[tab];
  const { error } = await supabase.from(table).upsert(payload);
  if (error) throw error;
  await loadData();
}
async function adminDelete(tab, id) {
  if (!supabase || state.role !== 'admin') throw new Error('Supabase admin session required.');
  const { table } = adminTableMap[tab];
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  await loadData();
}
function renderAdminWorkspace(tab = activeAdminTab) {
  activeAdminTab = tab;
  const work = $('#admin-workspace'); if (!work) return;
  const config = adminTableMap[tab];
  const rows = adminRowsFor(tab);
  work.innerHTML = `<form class="card admin-editor" id="admin-json-form"><h3>Manage ${tab.replace('_',' ')}</h3><p>Paste JSON for this table. RLS allows writes only for authenticated admins.</p><textarea id="admin-json" rows="10">${escapeHtml(JSON.stringify(config.fields, null, 2))}</textarea><button class="button primary" type="submit">Add / update</button><p class="admin-message" id="admin-save-status"></p></form><div class="card admin-list"><h3>Current records</h3><div>${rows.map((row) => `<div class="admin-list-item"><span class="admin-thumb">${renderThumb(row.thumbnail || 'TL')}</span><div><strong>${escapeHtml(row.title || row.product || row.full_name || row.student_name || row.student_email || row.id)}</strong><small>${escapeHtml(row.description || row.body || row.category || row.status || '')}</small></div><button class="button secondary" type="button" data-edit-json='${escapeHtml(JSON.stringify(row))}'>Edit</button><button class="button secondary" type="button" data-delete-id="${escapeHtml(row.id || '')}">Delete</button></div>`).join('') || '<p class="empty-state">No records loaded yet.</p>'}</div></div>`;
  $('#admin-json-form')?.addEventListener('submit', async (event) => { event.preventDefault(); try { await adminSave(tab, JSON.parse($('#admin-json').value)); $('#admin-save-status').textContent = 'Saved securely through Supabase.'; } catch (error) { $('#admin-save-status').textContent = error.message; } });
  $$('[data-edit-json]', work).forEach((button) => button.addEventListener('click', () => { $('#admin-json').value = JSON.stringify(JSON.parse(button.dataset.editJson), null, 2); }));
  $$('[data-delete-id]', work).forEach((button) => button.addEventListener('click', async () => { try { await adminDelete(tab, button.dataset.deleteId); } catch (error) { $('#admin-save-status').textContent = error.message; } }));
}
function renderAdmin() { const tabs = $('#admin-tabs'); if (!tabs) return; const names = Object.keys(adminTableMap); tabs.innerHTML = names.map((n)=>`<button class="button ${n === activeAdminTab ? 'primary' : 'secondary'}" data-admin-tab="${n}">${n.replace('_',' ')}</button>`).join(''); $$('[data-admin-tab]', tabs).forEach((b) => b.addEventListener('click', () => { activeAdminTab = b.dataset.adminTab; renderAdmin(); })); renderAdminWorkspace(activeAdminTab); }
function renderAll() { renderCourses(); renderOpportunities(); renderAffiliate(); renderStudentDashboard(); renderCertificates(); renderAdmin(); }

function initUi() {
  $('.loader')?.classList.add('loaded');
  $('.menu-toggle')?.addEventListener('click', () => $('#nav-menu')?.classList.toggle('open'));
  $('.theme-toggle')?.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('tech-learning-theme', dark ? 'dark' : 'light'); });
  document.documentElement.dataset.theme = localStorage.getItem('tech-learning-theme') || 'light';
  $('#login-form')?.addEventListener('submit', (e) => handleAuth('signIn', e));
  $('#register-form')?.addEventListener('submit', (e) => handleAuth('signUp', e));
  $$('[data-logout]').forEach((b) => b.addEventListener('click', logout));
  window.addEventListener('hashchange', protectRoutes);
}

initUi();
refreshSession().then(loadData).then(protectRoutes);
