# academy-agents.org

Source for the Academy website, built with [Jekyll](https://jekyllrb.com/) and
deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`.

## Local preview

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. The server rebuilds on save.

Analytics is only injected when `JEKYLL_ENV=production`, so local previews and
pull-request checkouts do not report traffic.

## Adding a news or blog item

Every item on `/blog/` is a file in `_posts/`, named `YYYY-MM-DD-slug.md`.
There are two kinds.

**A link item** points at a PDF, an event page, or another site. It has no body:

```yaml
---
title: "Talk at Some Conference"
date: 2026-09-01
kind: Talk          # shown as a tag: Event, Talk, Tutorial, Slides, Article
icon: "🎓"           # optional emoji shown on the card
external_url: https://example.org/the-event
link_text: "Event page"
summary: >-
  One or two sentences. This is the card text on the blog index, so keep it
  short — long summaries make every card in the row taller.
---
```

**A full post** omits `external_url` and has a Markdown body:

```yaml
---
title: "Post title"
date: 2026-09-01
kind: Article
author: Your Name
summary: >-
  Card text for the blog index.
---

## First heading

Body text. Fenced code blocks get syntax highlighting automatically.
```

New posts get the URL `/blog/<year>/<month>/<slug>/`. Three posts migrated from
the old hand-written site pin their original URL with an explicit `permalink:`
so existing links keep working — don't change those.

### The featured slot

`/blog/` leads with one featured post, then lists everything else as dense dated
rows. The feed deliberately mixes long articles with pointers to slides and
event pages, and a uniform grid gave a two-line PDF link the same weight as a
3,000-word write-up.

Set `featured: true` on whichever post should lead. Only the first one found is
used, so move the flag rather than adding a second. With no post flagged, the
most recent post that has a body of its own is used automatically.

Type filters were considered and deliberately left out at eight items — the
`kind` tags already make the list scannable. Worth revisiting around 25 entries;
every post already carries the `kind` field the filters would need.

## Editing site content

Most content lives in data files rather than templates:

| File | Contents |
| --- | --- |
| `_data/navigation.yml` | Header and footer links |
| `_data/features.yml` | "What Academy gives you" list on the home page |
| `_data/case_studies.yml` | "Where Academy is being used" — see the rule below |
| `_data/agent_kinds.yml` | "What can be an agent?" tiles |
| `_data/publications.yml` | `/publications/` list, citation strip, and BibTeX |
| `_data/team.yml` | `/team/` cards |
| `_config.yml` | Site description, all external URLs, install command |

External URLs (docs, GitHub, Slack, the arXiv paper) are defined once under
`links:` in `_config.yml` and referenced as `{{ site.links.docs }}`, so they only
ever need changing in one place.

## Code samples

Every Python snippet on the home page and `/start/` is copied from the official
sources — the [academy README](https://github.com/academy-agents/academy) and
[docs.academy-agents.org](https://docs.academy-agents.org/latest/get-started).

**Copy, then run it.** An earlier version of this site copied faithfully but
never executed anything, and shipped three snippets that did not work: a
module-level `async with` (a `SyntaxError`), `exchange=` where the parameter is
`factory=`, and `ProcessPoolExecutor(max_processes=...)` where the argument is
`max_workers`. Two of those are still wrong upstream. Copying from an
authoritative source is not the same as checking it.

Before publishing:

```sh
python3 bin/check-code-samples.py
```

That compiles every embedded block and flags the known-bad signatures. It does
not execute them, so run genuinely new samples against a live install.

## Outstanding placeholders

Anything still awaiting real content is marked in the rendered page with a
dashed callout. To find them all:

```sh
grep -rn "placeholder" _data/ *.md index.html
```

Currently:

- `/team/` — all six entries are scaffolding. Names, roles and affiliations were
  deliberately left blank rather than guessed; `_data/team.yml` lists the people
  who already appear in published content here as a starting point.
- `/start/#exchanges` — the exchange prerequisites table is inferred from package
  metadata and module layout, not from a prerequisites list in the docs. Confirm
  each row before publishing.

## Case studies

`_data/case_studies.yml` has one rule at the top and it matters:

> An entry appears only if a **public** source describes the application, and
> that source is linked in `source`.

Every figure currently in the file was read out of the linked abstract. Four
entries (PDX, chelator design, AISAC, electrolyte design) have no public source
yet and therefore show no link; each carries a commented-out `source:` block —
uncomment it and fill in the arXiv ID when the experiences paper posts. The
bottom of the file is a **staged block** — applications from the FGCS submission
that are commented out with their release conditions recorded next to each. It is
the checklist for when that preprint lands, not something to reconstruct later.

Two conditions must both hold before uncommenting any of them: the preprint is
public, **and** the team that owns the application has approved the wording. Most
belong to other research groups, and several are marked In-Progress in the
paper's own table. One entry (PDX) carries a recommendation not to publish it at
all; read the comment before overriding that.

### Figures

Any case study with a `figure` becomes a slide in the carousel above the
application grid. Figures are converted from the paper's PDFs:

```sh
pdftocairo -png -r 150 -singlefile figures/<name>.pdf out
magick out.png -resize 1100x1100\> -strip -quality 86 \
  assets/images/case-studies/<name>.webp
```

`figure_alt` is required and must describe the diagram's flow in words.

**Check what a figure actually depicts before using it.** The StructBioReasoner
figure was nearly published as a Production case study, but both `structbio_v1`
and `structbio_v2` in the paper are draft iterations of the *same* diagram, and
it shows the In-Progress v2 architecture — five nodes, a commercial coding
harness — not the v1 design the site describes. The paper's own caption says
"SBR2". That entry now has no figure, on purpose.

The carousel is a CSS scroll-snap track, not a scripted slider: it scrolls
natively, takes keyboard arrows because the track is focusable, and works with
JavaScript disabled. `site.js` only injects the previous/next buttons, and
nothing auto-advances.

## Events

Posts about events carry `event_date` alongside `date`. The blog list shows
`event_date` (so a July announcement of a September summit displays September)
and mutes rows whose event has passed. Without it, a list of "Join us at…" for
things that already happened makes the project look dormant.

## Layout notes

- `assets/css/main.css` defines light and dark palettes as custom properties.
  Dark is declared twice on purpose — once for `prefers-color-scheme` and once
  for an explicit `data-theme="dark"` — so the toggle wins in both directions.
- The theme is applied by an inline script in `_includes/head.html` before first
  paint. Keep it inline and ahead of the stylesheet or the page will flash.
- Pages that lay out grids instead of prose set `wide: true` in front matter.
