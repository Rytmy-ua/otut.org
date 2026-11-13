# OTUT.org

Static site for OTUT — Joy of Creation. Built with [Astro](https://astro.build), 11 languages, every language at its own URL.

| Language | URL pattern |
|---|---|
| English (default) | `/about`, `/news/<slug>` |
| Other languages | `/uk/about`, `/nl/news/<slug>`, … |

## Structure

```
src/
  content/
    pages/<page>/meta.json      titles + descriptions per language
    pages/<page>/<lang>.html    page body in that language
    news/<slug>/meta.json       date, cover image, card text per language
    news/<slug>/<lang>.html     article body in that language
  i18n/
    languages.json              language list (order = order in the picker)
    ui.json                     menu, footer, cookie banner texts per language
  layouts/Base.astro            header, footer, SEO tags, hreflang
  pages/[...path].astro         generates every page in every language
  pages/sitemap.xml.ts          sitemap with all language versions
  scripts/site.ts               language picker, cookie consent, logo effect
  styles/legacy.css             original design (unchanged)
  styles/fixes.css              small documented fixes on top
public/assets/                  images
```

## Everyday tasks

**Add a news item**
1. Copy a folder in `src/content/news/`, rename it to the new slug (it becomes the URL).
2. Edit `meta.json`: `date`, `cover`, and `title` / `description` / `card` for each language.
3. Edit `<lang>.html` files. A missing language falls back to English.
4. Put images in `public/assets/`.

The news list, sitemap and language links update automatically.

**Edit a text** — open the page's `<lang>.html` and change it.

**Add a language** — add it to `languages.json` and `ui.json`, add `<lang>.html` files where a translation exists, and add the code to `Lang` in `src/lib/content.ts`.

## Commands

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` writes the site to `dist/` and fails if any internal link or image is broken.

## Hosting (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22

Old links of the form `/about?lang=nl` are redirected in the browser to `/nl/about`.
Analytics (GA4 `G-YLJZQ0LRZP`) loads only after the visitor accepts cookies.
