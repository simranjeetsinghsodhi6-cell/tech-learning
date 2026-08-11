# Tech Learning

Tech Learning is a responsive GitHub Pages learning platform for beginners to learn, build projects, earn certificates, and explore ethical freelancing and affiliate-marketing opportunities.

## GitHub Pages

The site remains a static HTML/CSS/JavaScript app and is deployed as a project site at:

<https://simranjeetsinghsodhi6-cell.github.io/tech-learning/>

Asset references use relative paths so the project continues to work from the `/tech-learning/` GitHub Pages base path.

## Secure authentication and authorization

The previous client-side admin passcode has been removed. The website now expects Supabase Auth plus Row Level Security (RLS):

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Enable email/password authentication in Supabase Auth.
4. Add this configuration before `script.js` in `index.html` or inject it through your Pages build process:

```html
<script>
  window.TECH_LEARNING_SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  window.TECH_LEARNING_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

The anon key is safe for browser use only when RLS is enabled. Never expose a service-role key, admin password, API secret, or database password in frontend files.

## Creating the admin account

Students and admins use the same Login/Register page. New accounts are students by default. After creating the trusted admin user in Supabase Auth, promote that user from a trusted SQL session:

```sql
update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
```

The frontend reads the authenticated user's role from `public.profiles`. Admin routes and admin database writes are protected by RLS policies in `supabase-schema.sql`; hiding links is not used as the security boundary.

## Admin-managed content

The schema includes tables and admin-only policies for:

- courses and lessons
- students/profiles and enrollments
- certificates
- freelancing opportunities
- affiliate offers
- announcements
- projects
- learning paths
- course locks and prices

Published content is readable by the student-facing website. Student-specific records such as enrollments and certificates are scoped to the authenticated user.
