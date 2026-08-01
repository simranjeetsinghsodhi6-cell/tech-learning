-- Supabase schema for Tech Learning course data.
-- Run this in the Supabase SQL editor, then expose the anon key and project URL
-- through window.TECH_LEARNING_SUPABASE_URL and window.TECH_LEARNING_SUPABASE_ANON_KEY.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  title text not null,
  description text not null,
  instructor text not null,
  duration text not null,
  difficulty text not null,
  price text not null default 'Free',
  thumbnail text not null default '📚',
  outcomes text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  learner_email text not null,
  learner_name text,
  status text not null default 'enrolled' check (status in ('enrolled', 'completed', 'cancelled')),
  enrolled_at timestamptz not null default now(),
  unique (course_id, learner_email)
);

alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

create policy "Public can read categories" on public.categories for select using (true);
create policy "Public can read published courses" on public.courses for select using (is_published = true);
create policy "Learners can create enrollments" on public.enrollments for insert with check (true);

insert into public.categories (name, slug, description) values
  ('Web', 'web', 'HTML, CSS, accessibility, and responsive layouts.'),
  ('JavaScript', 'javascript', 'Interactive browser programming and UI state.'),
  ('GitHub', 'github', 'Git, pull requests, and deployment workflows.'),
  ('Projects', 'projects', 'Portfolio-ready practical builds.')
on conflict (slug) do nothing;

insert into public.courses (category_id, slug, title, description, instructor, duration, difficulty, price, thumbnail, outcomes)
select c.id, seed.slug, seed.title, seed.description, seed.instructor, seed.duration, seed.difficulty, seed.price, seed.thumbnail, seed.outcomes
from (
  values
    ('web', 'web-fundamentals-bootcamp', 'Web Fundamentals Bootcamp', 'Build accessible pages with semantic HTML, modern CSS, and responsive layouts.', 'Maya Chen', '6 hours', 'Beginner', 'Free', '🌐', array['Structure pages with semantic HTML', 'Create responsive CSS layouts', 'Publish a polished landing page']),
    ('javascript', 'javascript-ui-essentials', 'JavaScript UI Essentials', 'Practice DOM events, state, browser debugging, and delightful interactive patterns.', 'Jordan Lee', '8 hours', 'Beginner', '$29', '⚡', array['Handle user events confidently', 'Update UI from reusable data', 'Debug common browser issues']),
    ('github', 'github-pages-launch', 'GitHub Pages Launch', 'Learn commits, branches, pull requests, and a repeatable GitHub Pages workflow.', 'Priya Sharma', '5 hours', 'Beginner', 'Free', '🚀', array['Track work with Git commits', 'Collaborate with pull requests', 'Deploy a project site']),
    ('projects', 'portfolio-project-lab', 'Portfolio Project Lab', 'Turn lessons into a professional portfolio piece with copy, polish, and launch checks.', 'Alex Rivera', '10 hours', 'Intermediate', '$49', '💼', array['Plan a portfolio-ready project', 'Polish interactions and content', 'Prepare a launch checklist'])
) as seed(category_slug, slug, title, description, instructor, duration, difficulty, price, thumbnail, outcomes)
join public.categories c on c.slug = seed.category_slug
on conflict (slug) do nothing;
