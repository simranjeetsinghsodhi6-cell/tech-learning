-- Tech Learning Supabase schema with real Auth/RLS authorization.
-- Frontend code may expose only the Supabase anon key. Never expose service-role keys or admin passwords.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create table if not exists public.categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, description text, created_at timestamptz not null default now());
create table if not exists public.courses (id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id), slug text not null unique, title text not null, description text not null, instructor text, duration text, difficulty text, price text not null default 'Free', thumbnail text not null default '📚', outcomes text[] not null default '{}', is_published boolean not null default true, is_locked boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.lessons (id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade, title text not null, description text, video_url text, notes_url text, sort_order int not null default 0, is_published boolean not null default true);
create table if not exists public.enrollments (id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade, student_id uuid references public.profiles(id) on delete cascade, status text not null default 'enrolled' check (status in ('enrolled','completed','cancelled')), progress int not null default 0 check (progress between 0 and 100), enrolled_at timestamptz not null default now(), unique (course_id, student_id));
create table if not exists public.certificates (id uuid primary key default gen_random_uuid(), student_id uuid references public.profiles(id) on delete cascade, student_email text, student_name text, course_id uuid references public.courses(id) on delete set null, course_name text, completion_date date, issue_date date not null default current_date, status text not null default 'Issued' check (status in ('Issued','Pending','Revoked')), file_url text);
create table if not exists public.freelancing_opportunities (id uuid primary key default gen_random_uuid(), category text not null, title text not null, description text not null, skills text not null, level text not null check (level in ('Beginner','Intermediate','Advanced')), earning_range text not null, getting_started text not null, course text, url text, is_published boolean not null default true);
create table if not exists public.affiliate_offers (id uuid primary key default gen_random_uuid(), product text not null, description text not null, category text, commission text, website text, affiliate_link text, disclosure text not null, course text, is_published boolean not null default true);
create table if not exists public.announcements (id uuid primary key default gen_random_uuid(), title text not null, body text not null, is_published boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), title text not null, description text not null, url text, is_published boolean not null default true);
create table if not exists public.learning_paths (id uuid primary key default gen_random_uuid(), title text not null, description text not null, sort_order int not null default 0, is_published boolean not null default true);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.certificates enable row level security;
alter table public.freelancing_opportunities enable row level security;
alter table public.affiliate_offers enable row level security;
alter table public.announcements enable row level security;
alter table public.projects enable row level security;
alter table public.learning_paths enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'student');

create policy "published categories read" on public.categories for select using (true);
create policy "published courses read" on public.courses for select using (is_published or public.is_admin());
create policy "published lessons read" on public.lessons for select using (is_published and exists (select 1 from public.courses c where c.id = course_id and c.is_published) or public.is_admin());
create policy "published opportunities read" on public.freelancing_opportunities for select using (is_published or public.is_admin());
create policy "published affiliate read" on public.affiliate_offers for select using (is_published or public.is_admin());
create policy "published announcements read" on public.announcements for select using (is_published or public.is_admin());
create policy "published projects read" on public.projects for select using (is_published or public.is_admin());
create policy "published paths read" on public.learning_paths for select using (is_published or public.is_admin());

create policy "students read own enrollments" on public.enrollments for select using (student_id = auth.uid() or public.is_admin());
create policy "students read own certificates" on public.certificates for select using (student_id = auth.uid() or student_email = auth.email() or public.is_admin());

create policy "admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage enrollments" on public.enrollments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage certificates" on public.certificates for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage opportunities" on public.freelancing_opportunities for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage affiliate" on public.affiliate_offers for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage announcements" on public.announcements for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage paths" on public.learning_paths for all using (public.is_admin()) with check (public.is_admin());

insert into public.categories (name, slug, description) values ('Web','web','HTML, CSS, accessibility, and responsive layouts.'), ('JavaScript','javascript','Interactive browser programming and UI state.'), ('GitHub','github','Git, pull requests, and deployment workflows.'), ('Projects','projects','Portfolio-ready practical builds.') on conflict (slug) do nothing;
insert into public.freelancing_opportunities (category,title,description,skills,level,earning_range,getting_started,course,url) values
('Web Development','Landing page build','Create responsive one-page websites for small businesses.','HTML, CSS, responsive design, GitHub Pages','Beginner','$50-$300 per project estimate','Build two demo pages, publish them, and apply with a clear portfolio link.','Web Fundamentals Bootcamp','https://www.upwork.com/'),
('Python/Automation','Spreadsheet automation','Automate repetitive CSV, Excel, or file organization tasks.','Python, pandas basics, file handling, testing','Advanced','$50-$500 per automation estimate','Build scripts that clean sample data and document inputs/outputs.','Python Programming','https://www.upwork.com/')
on conflict do nothing;
insert into public.affiliate_offers (product,description,category,commission,website,affiliate_link,disclosure,course) values ('Web hosting or domain tools','Research official partner programs for reputable hosting/domain services before applying.','Web','Use official program terms only; rates vary.','https://www.namecheap.com/affiliates/','','Disclose that you may earn a commission from qualified purchases.','GitHub Pages Launch') on conflict do nothing;

-- To grant an admin role, run this manually with a trusted SQL session after creating the user:
-- update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
