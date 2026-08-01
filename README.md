# Tech Learning

Tech Learning is a beginner-friendly platform to learn coding, GitHub, and practical tech skills step by step.

## GitHub Pages

This repository is deployed as a project site at:

<https://simranjeetsinghsodhi6-cell.github.io/tech-learning/>

The site is a static HTML/CSS/JavaScript application. Asset references in `index.html` use relative paths (`./styles.css` and `./script.js`) so they continue to work when GitHub Pages serves the repository from the `/tech-learning/` project base path.


## Supabase course storage

Course cards are loaded dynamically from Supabase when credentials are provided, with `courses.json` kept as a local fallback for GitHub Pages previews.

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor to create the `categories`, `courses`, and `enrollments` tables, seed starter data, and enable read policies for published courses.
3. Add a small config script before `script.js` in `index.html` or through your hosting platform:

```html
<script>
  window.TECH_LEARNING_SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  window.TECH_LEARNING_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

When those values are present, `script.js` fetches categories and courses from Supabase REST endpoints. If Supabase is unavailable, the static fallback course data is used.


## Admin dashboard

The dashboard is available at `#admin` and uses the existing visual system so the public frontend design remains unchanged. Set `window.TECH_LEARNING_ADMIN_PASSCODE` before `script.js` to customize the passcode; otherwise the local development default is `admin123`.

```html
<script>
  window.TECH_LEARNING_ADMIN_PASSCODE = 'replace-with-a-private-passcode';
</script>
```

The static GitHub Pages dashboard stores course, thumbnail, and enrollment edits in the browser's local storage. For production-grade protection and shared persistence, connect these controls to authenticated backend endpoints or Supabase policies that require a server-side admin role.
