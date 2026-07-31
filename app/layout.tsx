import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { siteUrl } from '@/lib/utils';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: { default: 'Tech Learning | Production-ready developer courses', template: '%s | Tech Learning' }, description: 'Learn Next.js, TypeScript, Tailwind CSS, Supabase, GitHub, and Vercel through practical production workflows.', openGraph: { title: 'Tech Learning', description: 'Practical developer learning paths for shipping real applications.', url: siteUrl, siteName: 'Tech Learning', type: 'website' }, twitter: { card: 'summary_large_image', title: 'Tech Learning', description: 'Practical developer learning paths for shipping real applications.' } };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en" suppressHydrationWarning><body className={inter.className}><ThemeProvider><div className="min-h-screen gradient-shell"><Header />{children}<Footer /></div></ThemeProvider></body></html>; }
