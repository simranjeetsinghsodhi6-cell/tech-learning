'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
export function ThemeToggle() { const { theme, setTheme } = useTheme(); const isDark = theme === 'dark'; return <button aria-label="Toggle dark mode" className="rounded-full border border-border p-2 hover:bg-muted" onClick={() => setTheme(isDark ? 'light' : 'dark')} type="button">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>; }
