# JKVM website redesign

Static, no-build site (HTML/CSS/JS) implementing the layout, typography, color-system and interaction redesign of jkvm.in.

## About the images

This environment has no network access to jkvm.in, so the real logo and photos (hero, event photos, headshots, gallery) could not be pulled in. Every image is a labeled placeholder SVG in `assets/img/`, sized and positioned to match where the real file should go — swap in the real file **using the exact same filename** and the layout requires no changes.

| Placeholder | Replace with |
|---|---|
| `assets/img/logo.svg`, `logo-white.svg` | The real JKVM logo (light/dark variants) |
| `assets/img/hero-bg.jpg.svg` | Hero background photo (1920×1080) |
| `assets/img/about-inline.jpg.svg` | "Our Story" inline photo |
| `assets/img/highlight-*.jpg.svg` | Shivratri / Balidan Diwas / Gaashtaarukh photos |
| `assets/img/gallery-*.jpg.svg` | Gallery photos |
| `assets/img/team-*.jpg.svg` | Executive team headshots |
| `assets/img/video-thumb-*.jpg.svg` | Video series thumbnails |

Video cards (`.video-card[data-video-id]`) are empty — add each real YouTube video ID to open a proper embed instead of the placeholder note.

## Structure

- `index.html` — homepage (hero, announcement bar, mission grid, our story, photo highlights, gallery preview, executive team, video series, footer)
- `pages/about.html` — Vision & Mission, Objective, Yuva Shakti
- `pages/events.html`, `pages/gallery.html`, `pages/contact.html`, `pages/donate.html`
- `css/style.css` — design system (tokens, components)
- `js/main.js` — interactions (nav drawer, reveal-on-scroll, carousels, lightbox, filters, modals)

## Preview locally

```
python3 -m http.server 8000
```
then open `http://localhost:8000/`.
