
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return sitemapContent;
};

export const getStaticSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://chetna.live';
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      loc: baseUrl,
      lastmod: today,
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/community`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/journal`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/mood-tracker`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/appointments`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/resources`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/crisis-support`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/quiz`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/feedback`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];
};
