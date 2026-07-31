import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Profile' };
export default function ProfilePage() { return <main className="mx-auto max-w-4xl px-4 py-16"><h1 className="text-4xl font-black md:text-6xl">Profile</h1><div className="mt-8 rounded-3xl border border-border bg-card p-6"><h2 className="text-2xl font-black">Learner profile</h2><p className="mt-3 text-muted-foreground">Connect this page to a Supabase <code>profiles</code> table to store name, role, goals, and portfolio links for each authenticated user.</p></div></main>; }
