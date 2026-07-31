# Tech Learning

Tech Learning is a production-ready learning platform built with Next.js, TypeScript, Tailwind CSS, Supabase authentication, GitHub-based collaboration, and Vercel deployment.

## Features

- App Router structure with landing, courses, course detail, dashboard, profile, settings, login, and signup pages.
- Responsive Tailwind CSS interface with dark/light mode support.
- SEO metadata, sitemap, and robots configuration.
- Supabase client integration for email/password authentication.
- Vercel-ready build scripts and environment variable template.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set the following variables in `.env.local` and in Vercel project settings:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```
