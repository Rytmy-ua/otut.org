// Single source of truth for all site content.
//
//   src/content/pages/<id>/meta.json   – route, titles, descriptions per language
//   src/content/pages/<id>/<lang>.html – page body for that language
//   src/content/news/<slug>/meta.json  – date, cover image, card text per language
//   src/content/news/<slug>/<lang>.html – article body for that language
//
// Adding a news item = adding one folder. No code changes needed.
import languages from '../i18n/languages.json';
import ui from '../i18n/ui.json';

export type Lang = 'en' | 'uk' | 'nl' | 'fr' | 'es' | 'de' | 'it' | 'pl' | 'pt' | 'cs' | 'ro';
export const LANGS = languages.map((l) => l.code) as Lang[];
export const DEFAULT_LANG: Lang = 'en';
export { languages };
export const t = (lang: Lang) => (ui as Record<string, typeof ui.en>)[lang] ?? ui.en;

type PerLang<T> = Partial<Record<Lang, T>>;
export interface PageMeta { route: string; bodyClass: string; title: PerLang<string>; description: PerLang<string> }
export interface NewsMeta {
  date: string;
  variant: string;
  cover: { src: string; width: number; height: number; figureStyle: string | null; imgStyle: string | null };
  title: PerLang<string>;
  description: PerLang<string>;
  card: PerLang<{ label: string; title: string; alt: string }>;
}

const bodies = import.meta.glob('../content/**/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const metas = import.meta.glob('../content/**/meta.json', { import: 'default', eager: true }) as Record<string, unknown>;

const folderOf = (file: string) => file.replace(/^\.\.\/content\//, '').replace(/\/[^/]+$/, '');

function body(folder: string, lang: Lang): string {
  return bodies[`../content/${folder}/${lang}.html`] ?? bodies[`../content/${folder}/${DEFAULT_LANG}.html`] ?? '';
}
export const pick = <T>(v: PerLang<T>, lang: Lang): T => (v[lang] ?? v[DEFAULT_LANG]) as T;

/** URL of a route in a language: /about → /uk/about, / → /uk */
export function localize(route: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return route;
  return route === '/' ? `/${lang}` : `/${lang}${route}`;
}

export interface Entry { kind: 'page' | 'news'; id: string; route: string; bodyClass: string; meta: PageMeta | NewsMeta; html: (lang: Lang) => string }

export const news = Object.entries(metas)
  .filter(([f]) => f.startsWith('../content/news/'))
  .map(([f, m]) => ({ slug: folderOf(f).replace(/^news\//, ''), meta: m as NewsMeta }))
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export const entries: Entry[] = [
  ...Object.entries(metas)
    .filter(([f]) => f.startsWith('../content/pages/'))
    .map(([f, m]) => {
      const folder = folderOf(f); const meta = m as PageMeta;
      return { kind: 'page' as const, id: folder.replace(/^pages\//, ''), route: meta.route, bodyClass: meta.bodyClass, meta, html: (l: Lang) => body(folder, l) };
    }),
  ...news.map(({ slug, meta }) => ({
    kind: 'news' as const, id: slug, route: `/news/${slug}`, bodyClass: '', meta, html: (l: Lang) => body(`news/${slug}`, l),
  })),
];
