# personal page

If you like the setup, feel free to fork it and make it yours. No license gymnastics — just swap the copy, photos, and content.

## What's on the site

**Wall** — A waterfall of floating photos from my travels (sailing, running, rafting, backpacking, etc.). Hover for captions.

**Blogs** — Shorter stuff: race reports, essays, random thoughts.

**White Papers** — Topics I've gone deep on and wrote up — ops lessons, project retros, that kind of thing.

**Resume** — You know what this is.

## How it's built

Single-page shell in `index.html` with a sidebar that swaps between four panels. No framework, no bundler — just fetch + DOM.

```
index.html          Home — tabs, wall animation, loaders
style.css           Everything visual (light/dark theme too)
blogs/              Blog detail pages
white-papers/       White paper detail pages
resume/             Resume (embedded into the home page)
wall/images/        Wall photo pool
assets/             Shared favicon, icons, post-interactions.js
```

**Wall** — Inline script in `index.html` (`about-floating-wall`). Photos drift down, respawn from the top, captions on hover. Image list is just an array in that script.

**Blogs** — Each post is a standalone HTML file. The home page fetches them and builds the list from a `postFiles` array in `index.html` (title, date, tag, hero image pulled from each file).

**White papers** — Same detail-page pattern as blogs, but listed as project cards in `index.html`. Dates on cards are fetched from each page at load time.

**Resume** — `resume/resume.html` is fetched and inlined into the resume panel so one file works both embedded and standalone.

**Detail pages** (`blogs/*.html`, `white-papers/*.html`) — Copy an existing one. Shared layout: `body.post-detail`, header, article body, optional likes/comments footer. Styles live under `.post-detail` in `style.css`.

**Theme** — `#theme-toggle` flips `theme-dark` on `body`/`html`, saved to `localStorage`. Avatar swaps with the theme.

**Likes & comments** — `assets/post-interactions.js` on detail pages only. Stored in `localStorage` per URL — no backend.

**Mobile** — Sidebar collapses to a hamburger flyout under 800px.

### Adding content

- **New blog post:** copy a `blogs/*.html`, edit it, add the path to `postFiles` in `index.html`.
- **New white paper:** copy a `white-papers/*.html`, add a card in the projects panel in `index.html`.
- **New wall photo:** drop it in `wall/images/` and add an entry to the image array in the wall script.

## Run locally

```bash
python3 -m http.server 8000
```

Needs a local server (the fetch loaders won't work if you just double-click `index.html`).

Push to main and GitHub Pages handles the rest.
