import type { MetadataRoute } from 'next';
import { courses } from '@/lib/courses';
import { siteUrl } from '@/lib/utils';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/courses', '/dashboard', '/profile', '/settings', '/login', '/signup', ...courses.map((c)=>`/courses/${c.slug}`)].map((route)=>({ url: `${siteUrl}${route}`, lastModified: new Date() })); }
