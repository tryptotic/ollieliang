# Engineering Portfolio — Nebula Theme

A midnight violet/black portfolio site: near-black background with slow-drifting, blurred
purple-to-pink gradient blobs, glassy rounded cards, a gradient hero name, and soft purple
glow on hover instead of hard edges. Space Grotesk carries both headings and body text;
JetBrains Mono is used for labels, tags, and technical details. Same multi-page structure
as before — each project gets its own page, like Google Sites, but it's just plain files.

## Structure
```
index.html              → home page (hero, project grid, skills, contact)
styles.css               → all styling / theme — this is where the nebula look lives
script.js                 → scroll reveal, nav dropdown, filter pills, lightbox (unchanged)
projects/
  vex-robotics.html       → existing project pages — will pick up the new theme automatically
  me164-cad.html            since they link to the same styles.css
  railside-robotics.html
  esap-bb8.html
  nvhs-edd.html
  engr133.html
  ece-555timer.html
  starkhacks.html
```

## Important — updating your existing repo
This zip only contains the 4 root files (`index.html`, `styles.css`, `script.js`,
`README.md`). Your 8 project pages already on GitHub don't need to be re-uploaded — because
they all link to the same `styles.css`, re-uploading just this styles.css instantly reskins
every project page too, no per-page edits needed for the color/shape changes.

**One manual step per project page:** each project page's `<head>` currently loads the old
Rajdhani + Inter fonts. Open each project page on GitHub, find this line:
```html
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
and replace it with:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```
Without this swap the project pages will still get the nebula colors/glow/rounded corners
(all pure CSS), just with the old fonts instead of Space Grotesk.

## What changed visually
- **Background** — the carbon-weave texture is replaced by two large, blurred gradient
  blobs (purple + pink-violet) that drift slowly behind the content.
- **Cards** — sharp corner brackets are gone; cards are now glassy (frosted, semi-transparent)
  with soft rounded corners and a purple glow on hover instead of a hard red border.
- **Hero name** — "Jordan Reyes" is now a purple-to-pink gradient instead of solid white.
- **Buttons / pills** — fully rounded (pill-shaped), with the primary button using a
  purple-to-pink gradient fill.
- **Dividers** — the yellow hazard stripe is replaced with a soft gradient line.

## Re-theming further
All colors live as CSS variables at the top of `styles.css` under `:root` — change
`--accent`, `--accent-2`, `--bg-black`, etc. to adjust the palette from one place. `--radius`
controls how rounded cards/panels are; `--glow` / `--glow-soft` control the hover glow
intensity.

## The nav dropdown
Hovering "Projects" in the nav reveals a dropdown of all 8 project pages (click also works,
for touch devices). It's defined once per page in the `<div class="nav-dropdown">` block —
if you add a new project page, add a matching link there on **every** page (home + all
project pages) so the dropdown stays in sync.

## Adding a 3D CAD model (like the ME 164 page)
1. Export your CAD model as `.glb` or `.gltf`. SolidWorks/Fusion 360/NX don't export this
   directly — the common free path is: export as `.STEP` or `.OBJ` from your CAD tool, then
   open in **Blender** (free) and export as `.glb`.
2. Upload the `.glb` file to your repo (e.g. `/projects/models/your-model.glb`).
3. In `me164-cad.html`, change the `src` attribute on `<model-viewer>` to that path.
4. `camera-controls` already enables drag-to-rotate and scroll-to-zoom.

## Embedding a YouTube video
Find your video's ID (the part after `watch?v=` in the URL) and replace `VIDEO_ID_HERE` in
the `<iframe>` `src` on `vex-robotics.html` or any other page's video-embed section.

## Filter pills
The "All / Robotics / Code / Coursework / Hackathon" buttons on the home page filter the
project grid by each card's `data-category` attribute. To recategorize a project, change its
`data-category="..."` value on the `<a class="project-card">` element in `index.html`.

## Put it on GitHub Pages
1. Your repo `tryptotic/ollieliang` should be renamed to `tryptotic.github.io` if you want
   it live at the root domain — otherwise it stays at `tryptotic.github.io/ollieliang`.
2. Upload `index.html`, `styles.css`, `script.js` to the repo root, overwriting the old
   copies (GitHub will warn they already exist — confirm the overwrite).
3. In the repo: **Settings → Pages** → Source: `main` branch, `/` (root) → Save.
4. Hard-refresh (or use an incognito window) to bypass browser caching if you don't see the
   new theme right away.

## Notes
- Respects `prefers-reduced-motion` (blob drift and reveal animations pause).
- Fully responsive; nav dropdown repositions on small screens.
- Keyboard-focusable with visible focus states.
