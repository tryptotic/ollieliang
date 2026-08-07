# Engineering Portfolio — Starter Template

A blueprint/technical-drawing themed portfolio site: dark navy background, grid backdrop,
dimension-line accents, and a footer styled like a drawing title block. Built with plain
HTML/CSS/JS — no build step required.

## What's inside
- `index.html` — page structure (hero, projects, skills, contact)
- `styles.css` — all styling and the color/type system
- `script.js` — scroll-reveal animations + expandable project cards

## Customize it
1. **Your info**: edit the hero name/role/tagline, the three project cards (title, summary,
   spec list, links), the skills table, and the title-block footer (email, GitHub, LinkedIn) in `index.html`.
2. **Add more projects**: copy one `<article class="project-card">...</article>` block and
   change the letter in `data-index` and `<span class="card-index">`.
3. **Colors**: all colors are CSS variables at the top of `styles.css` under `:root` —
   change `--ink-deep`, `--amber`, etc. to re-theme the whole site in one place.
4. **Fonts**: currently Space Grotesk (headings), Inter (body), JetBrains Mono (labels/data),
   loaded from Google Fonts in `index.html`.

## Put it on GitHub Pages
1. Create a repo on GitHub named exactly `yourusername.github.io`.
2. Put these three files (plus any images you add) at the repo root.
3. Push:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```
4. In the repo, go to **Settings → Pages**, set source to the `main` branch / root folder.
5. Your site goes live at `https://yourusername.github.io` within a minute or two.

## Notes
- Respects `prefers-reduced-motion` — animations are disabled for users who request it.
- Fully responsive down to mobile (nav collapses, grid stacks to one column).
- Keyboard-focusable with visible focus states on links and buttons.
