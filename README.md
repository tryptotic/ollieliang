# Engineering Portfolio — Carbon Fiber Theme

A dark, motorsport-inspired portfolio site: near-black background with a subtle carbon-weave
texture, racing red accents, a hazard-stripe divider, and Rajdhani (a condensed technical
font used a lot in racing HUDs) for headings. Multi-page structure — each project gets its
own page, like Google Sites, but it's just plain files.

## Structure
```
index.html              → home page (hero, project grid, skills, contact)
styles.css               → all styling / theme colors
script.js                 → scroll reveal, nav dropdown, filter pills, lightbox
projects/
  vex-robotics.html       → fully built example: photo gallery + notebook gallery + video embed
  me164-cad.html           → fully built example: drag-to-rotate 3D model viewer
  railside-robotics.html   → stub, ready to fill in
  esap-bb8.html             → stub, ready to fill in
  nvhs-edd.html              → stub, ready to fill in
  engr133.html                → stub, ready to fill in
  ece-555timer.html            → stub, ready to fill in
  starkhacks.html                → stub, ready to fill in
```

## The nav dropdown
Hovering "Projects" in the nav reveals a dropdown of all 8 project pages (click also works, for
touch devices). It's defined once per page in the `<div class="nav-dropdown">` block — if you
add a new project page, add a matching link there on **every** page (home + all project pages)
so the dropdown stays in sync.

## Filling in the stub pages
Each stub (`railside-robotics.html`, `esap-bb8.html`, `nvhs-edd.html`, `engr133.html`,
`ece-555timer.html`, `starkhacks.html`) has the same three sections to fill in:
1. **Overview** — replace the placeholder paragraph with your own writeup.
2. **Photos** — replace the `placehold.co` image URLs in the `.gallery` div with your own image
   files (upload images to the repo, e.g. into an `/images/` folder, and point `src` at them).
3. **Documents / Reports** — for NVHS EDD especially: in Google Docs, go to
   **File → Share → Publish to web**, copy the embed link, and paste it as the `src` of the
   `<iframe class="doc-embed">`. For a PDF instead, upload the PDF to the repo and point `src`
   at its path.

## Adding a 3D CAD model (like the ME 164 page)
1. Export your CAD model as `.glb` or `.gltf`. SolidWorks/Fusion 360/NX don't export this
   directly — the common free path is: export as `.STEP` or `.OBJ` from your CAD tool, then
   open in **Blender** (free) and export as `.glb`.
2. Upload the `.glb` file to your repo (e.g. `/projects/models/your-model.glb`).
3. In `me164-cad.html`, change the `src` attribute on `<model-viewer>` to that path.
4. Done — `camera-controls` already enables drag-to-rotate and scroll-to-zoom.

## Embedding a YouTube video
Find your video's ID (the part after `watch?v=` in the URL) and replace `VIDEO_ID_HERE` in the
`<iframe>` `src` on `vex-robotics.html` or any other page's video-embed section.

## Filter pills
The "All / Robotics / Code / Coursework / Hackathon" buttons on the home page filter the
project grid by each card's `data-category` attribute. To recategorize a project, change its
`data-category="..."` value on the `<a class="project-card">` element in `index.html`.

## Colors / theme
All colors are CSS variables at the top of `styles.css` under `:root` — change `--accent`,
`--bg-black`, etc. to re-theme the whole site from one place.

## Put it on GitHub Pages
1. Create a repo on GitHub named exactly `yourusername.github.io`.
2. Upload all files (keeping the `projects/` folder structure intact) to the repo root.
3. In the repo: **Settings → Pages** → Source: `main` branch, `/` (root) → Save.
4. Live at `https://yourusername.github.io` within a minute or two.

## Notes
- Respects `prefers-reduced-motion`.
- Fully responsive; nav dropdown repositions on small screens.
- Keyboard-focusable with visible focus states.
