import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';
export const metadata: Metadata = { title: 'Sign in' };
export default function LoginPage() { return <main className="px-4 py-16"><AuthForm mode="login" /></main>; }
