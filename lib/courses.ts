import { BookOpen, Code2, GitBranch, Rocket, ShieldCheck, Workflow } from 'lucide-react';

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate';
  duration: string;
  outcomes: string[];
  modules: string[];
  icon: keyof typeof courseIcons;
};

export const courseIcons = { BookOpen, Code2, GitBranch, Rocket, ShieldCheck, Workflow };

export const courses: Course[] = [
  { slug: 'web-foundations', title: 'Web Foundations', description: 'Build accessible, responsive interfaces with semantic HTML, modern CSS, and practical design systems.', level: 'Beginner', duration: '4 weeks', icon: 'BookOpen', outcomes: ['Ship a standards-compliant landing page', 'Apply responsive layout patterns', 'Use accessibility and SEO fundamentals'], modules: ['Semantic page structure', 'Responsive Tailwind layouts', 'Forms, navigation, and accessibility', 'Performance and SEO release checklist'] },
  { slug: 'typescript-nextjs', title: 'TypeScript + Next.js', description: 'Create production-ready Next.js applications with typed routes, reusable components, and deployment hygiene.', level: 'Intermediate', duration: '6 weeks', icon: 'Code2', outcomes: ['Design a maintainable App Router structure', 'Model data safely with TypeScript', 'Deploy confidently on Vercel'], modules: ['App Router architecture', 'Server and client components', 'Reusable UI systems', 'Deployment, observability, and rollback'] },
  { slug: 'git-github-workflows', title: 'Git & GitHub Workflows', description: 'Practice professional version control with branches, pull requests, reviews, and release notes.', level: 'Beginner', duration: '3 weeks', icon: 'GitBranch', outcomes: ['Use branches and commits intentionally', 'Open clean pull requests', 'Collaborate with review-ready changes'], modules: ['Repository setup', 'Branching and commit strategy', 'Pull requests and code review', 'GitHub Pages and project documentation'] },
  { slug: 'supabase-auth-data', title: 'Supabase Auth & Data', description: 'Add secure authentication, profiles, and row-level-security-backed application data.', level: 'Intermediate', duration: '5 weeks', icon: 'ShieldCheck', outcomes: ['Configure Supabase auth flows', 'Protect user profile data with RLS', 'Connect server-rendered pages to Supabase'], modules: ['Project and schema setup', 'Email/password authentication', 'Profiles and policies', 'Server-side data loading'] },
];

export function getCourse(slug: string) { return courses.find((course) => course.slug === slug); }
