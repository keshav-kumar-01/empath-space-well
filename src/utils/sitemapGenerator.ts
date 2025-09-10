
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
    <mobile:mobile/>
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
      loc: `${baseUrl}/psych-tests/gad7`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/psych-tests/phq9`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/psych-tests/bai`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/psych-tests/bdi2`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
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

// Function to generate sitemap for blog posts
export const generateBlogSitemap = async (blogPosts: any[]) => {
  const baseUrl = 'https://chetna.life';
  
  const blogUrls: SitemapUrl[] = blogPosts.map(post => ({
    loc: `${baseUrl}/blog/post/${post.id}`,
    lastmod: post.updated_at || post.created_at,
    changefreq: 'monthly' as const,
    priority: 0.6
  }));
  
  return blogUrls;
};
