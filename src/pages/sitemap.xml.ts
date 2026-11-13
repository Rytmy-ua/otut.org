import { entries, news, LANGS, DEFAULT_LANG, localize } from '../lib/content';

const SITE = 'https://otut.org';
const newsDate = new Map(news.map((n) => [`/news/${n.slug}`, n.meta.date]));

export function GET() {
  const urls = entries.flatMap((e) =>
    LANGS.map((lang) => {
      const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${localize(e.route, l)}"/>`).join('')
        + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${localize(e.route, DEFAULT_LANG)}"/>`;
      const lastmod = newsDate.get(e.route);
      return `<url><loc>${SITE}${localize(e.route, lang)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alts}</url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
