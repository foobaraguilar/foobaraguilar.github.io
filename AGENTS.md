# Working on Ruben's website

Read `README.md` for the site structure and local development instructions. Keep changes focused on the user's request and preserve unrelated work already in the working tree.

## Browser access

- Do not open, inspect, navigate, or control the user's browser unless Ruben explicitly requests browser use for the task.
- A request to edit the website, write a post, or verify a change does not by itself authorize browser access.
- Use file inspection and command-line checks by default. Do not launch a preview server or open a preview automatically for routine content edits.
- When browser use is explicitly authorized, stay within that scope.

## Writing and editing

- Write personal posts in Ruben's first-person voice: conversational, direct, and grounded in the notes he provides.
- Clean up spelling and grammar while preserving his meaning and distinctive phrasing. Use requested titles and subtitles exactly.
- Do not invent autobiographical events, dialogue, dates, achievements, other people's motives, or personal details. Ask a short question when a missing detail materially affects the draft; continue with the parts that are clear.
- Avoid corporate language, generic motivational conclusions, and turning every experience into a lesson about productivity or execution.
- When asked to get started, produce an editable first draft in the site's existing format. Keep later edits focused on the requested passage or change.

## Adding a blog post

- Posts are standalone HTML files in `blogs/`; use a comparable existing post as the structural reference.
- Store the supplied artwork in `blogs/images/` with a descriptive filename. Preserve the original image unless an edit is requested, and add descriptive alt text and accurate dimensions.
- Use the existing shared layout and classes in `style.css`, including the header, hero image, article body, and theme toggle. Reuse the engagement footer when appropriate.
- Keep the HTML title, visible heading, Open Graph title, and Twitter title consistent. Set descriptions, image paths, and article URLs for the new post.
- Use a supplied article date when provided; otherwise use the drafting date for a new post. Preserve existing dates during routine revisions.
- Add the post path to `postFiles` in `index.html` when integrating it into the blog list. The array determines display order, and the loader reads metadata and the hero image from the post itself.
- Preserve deliberately hidden posts and existing list order unless the requested change requires otherwise.

## Implementation and checks

- This is a static HTML, CSS, and JavaScript site. Follow its existing patterns and keep dependencies and tooling minimal.
- Avoid unrelated refactors or global styling changes for a content-only request.
- For routine edits, inspect the changed files, run `git diff --check`, and verify relevant local links, assets, metadata, and list entries. Check new untracked files too; ordinary `git diff` does not include them.
- Do not introduce a test framework for a prose edit or repeat checks without a relevant change or unresolved issue.
- Keep temporary files and operating-system artifacts such as `.DS_Store` out of commits.

## Publishing and handoff

- A request to draft, edit, or save a post authorizes local changes. Pushes to `main` deploy the site through GitHub Pages, so push or trigger a deployment only when publishing is requested.
- Once the user has authorized publishing for the task, carry it through without asking for the same permission again.
- Report the result briefly, link to the edited file, and distinguish local work from a published change. State which checks were actually performed.
