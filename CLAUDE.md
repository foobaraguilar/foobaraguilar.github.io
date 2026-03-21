# CLAUDE.md

Context for AI assistants (Claude Code, Qwen Coder, etc.) working on this repo.

## Stack

- **Static site** deployed with **GitHub Pages** (no build, no tests, no package manager).
- Edit HTML/CSS/JS **directly**; changes go live on push to the default branch.

## Entry points

| Area | Location |
|------|----------|
| Home / main shell | `index.html` (avatar, sidebar tabs, theme toggle, posts/projects loaders) |
| Global styles | `style.css` |
| Post & project **detail** pages | `posts/*.html`, `projects/*.html` |
| About Me photo captions (standalone) | `about_me/*.html`, `about_me/caption_template.html` |
| Resume | `resume/resume.html` |
| Shared scripts | `assets/post-interactions.js`, `assets/favicon.png`, etc. |

## Layout conventions

- **`index.html`**: Single-page app style: panels for About, Projects, Posts, Resume; JS loads post/project snippets for lists. **About Me “waterfall”** floating images are built in an **inline `<script>`** (not a separate file)—search for `about-floating-wall` or `About Me floating images`.
- **Post/project templates** share one pattern: `body.post-detail`, `header.simple-header`, `main.post-detail-main`, `article.post-detail-body`, optional `footer.post-detail-engagement` (likes + comments). Styles are scoped under `.post-detail` in `style.css`.
- **Theme**: `body` / `html` class `theme-dark`; toggle is `#theme-toggle`. Many pages duplicate a small inline script for theme + favicon—keep new pages consistent with an existing `posts/*.html` file.

## `assets/post-interactions.js`

- Loaded only on **post/project detail** pages (not `index.html`).
- **Likes + comments** are stored in **`localStorage`** per URL path (`sitePostEngagement:v1:` + `location.pathname`). Not in git; no server backend.
- Do not assume comments exist in repo files—they are browser-only unless you add a real backend or embed (e.g. Giscus).

## CSS notes

- **`style.css`** is large; use search for tokens like `post-detail`, `floating-`, `journal-`, `project-card`, `theme-dark`.
- Mobile: `@media (max-width: 800px)` hides inline sidebar and uses hamburger + **centered** flyout `.sidebar`.

## Images

- **About Me** source images: `about_me/images/` (referenced from `index.html` waterfall list).
- Prefer **relative paths** from the page that loads them (`../assets/`, `about_me/images/`, etc.).

## When adding a new post or project page

1. Copy an existing `posts/*.html` or `projects/*.html` and adjust title, meta, copy, and paths (`../` depth).
2. Link it from `index.html` if it should appear in the Posts or Projects panel (see existing `postFiles` / project list patterns in that file).
3. Include `<script src="../assets/post-interactions.js" defer></script>` if the engagement block is present.

## What to avoid

- Don’t introduce npm, bundlers, or frameworks unless the user explicitly asks.
- Don’t strip **`z-index` / animation** logic in the waterfall script without understanding the “depth lane” comments—behavior is subtle.
