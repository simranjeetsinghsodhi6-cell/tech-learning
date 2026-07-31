import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';
export const metadata: Metadata = { title: 'Sign up' };
export default function SignupPage() { return <main className="px-4 py-16"><AuthForm mode="signup" /></main>; }
