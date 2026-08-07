# Engineering Portfolio — Nebula (Night Mode) Theme

A deeper, more vibrant take on the nebula theme: near-black violet background, a more
saturated purple accent, and minimal neon-orange shard streaks drifting behind the content
for contrast. Cards stay glassy and rounded with a purple glow on hover. Same multi-page
structure as before — every project keeps its own page.

## What changed in this pass
- **Much darker background** — `--bg-black` is now `#020103`, close to true black.
- **Purple-to-darker-purple gradient blobs** — the two background blobs are no longer a
  single hue fading to transparent; each is a gradient from `--accent`/`--accent-2` down to
  a darker `--accent-deep` (`#2e1065`) before fading out, so they read as more vibrant and
  dimensional rather than flat glows.
- **Icy blue-white shards** — the shard streaks swapped from orange to `--ice-blue`
  (`#d6ecff`), still kept minimal — low opacity, blurred, three thin lines.
- **Real drifting motion** — both the blobs and the shards now animate through multi-point
  paths (several keyframe stops, not just a single back-and-forth), so they visibly wander
  around the background over their 38–58s cycles instead of pulsing in place.
- Header and lightbox overlays were updated to match the new darker base so nothing looks
  lighter than the page behind it.

## Structure
```
index.html
styles.css               → all styling / theme tokens live at the top under :root
script.js                 → scroll reveal, nav dropdown, filter pills, lightbox (unchanged)
projects/
  vex-robotics.html
  me164-cad.html
  railside-robotics.html
  esap-bb8.html
  nvhs-edd.html
  engr133.html
  ece-555timer.html
  starkhacks.html
```
All 8 project pages are included this time, already updated with the Space Grotesk font
link and the shard markup — just upload the whole zip contents to your repo root
(overwriting existing files) and everything matches.

## About the shards — easy to re-color or adjust
Everything about the shards lives in two places in `styles.css`:
1. `--ice-blue: #d6ecff;` in `:root` — change this one line to re-color all three shards at
   once.
2. The `.shard`, `.shard-1/2/3` rules just below `.grid-backdrop`, plus the
   `shard-drift-1/2/3` keyframes right after — control position, angle, width, opacity, and
   how far each streak travels if you want them more or less visible/active.

## Re-theming further
All colors are CSS variables at the top of `styles.css` under `:root` — `--accent`,
`--accent-2`, `--accent-deep`, `--bg-black`, `--neon-orange`. `--radius` controls corner
roundness; `--glow` / `--glow-soft` / `--glow-orange` control hover and ambient glow
intensity.

## The nav dropdown
Hovering "Projects" in the nav reveals a dropdown of all 8 project pages (click also works
for touch devices). If you add a new project page, add a matching link to the
`<div class="nav-dropdown">` block on **every** page so the dropdown stays in sync.

## Adding a 3D CAD model (ME 164 page)
1. Export your CAD model as `.glb` or `.gltf` — SolidWorks/Fusion 360/NX don't export this
   directly, so the common free path is: export `.STEP`/`.OBJ`, open in **Blender** (free),
   export `.glb`.
2. Upload the `.glb` to your repo (e.g. `/projects/models/your-model.glb`).
3. In `me164-cad.html`, change the `src` on `<model-viewer>` to that path.

## Embedding a YouTube video
Replace `VIDEO_ID_HERE` in the `<iframe>` `src` on `vex-robotics.html` with your video's ID
(the part after `watch?v=` in the URL).

## Filter pills
The "All / Robotics / Code / Coursework / Hackathon" buttons filter the home grid by each
card's `data-category` attribute — change it on the `<a class="project-card">` element in
`index.html` to recategorize.

## Put it on GitHub Pages
1. Upload everything in this zip to your repo root, keeping the `projects/` folder —
   overwrite the existing files when GitHub prompts.
2. **Settings → Pages** → Source: `main` branch, `/` (root) → Save.
3. Hard-refresh (or use an incognito window) if you don't see the new theme right away —
   that's almost always browser caching, not a deploy issue.

## Notes
- Respects `prefers-reduced-motion` (blob drift, shard drift, and reveal animations pause).
- Fully responsive; nav dropdown repositions on small screens.
- Keyboard-focusable with visible focus states.
