import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const base = siteUrl ? siteUrl.replace(/\/$/, "") : "";

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin', 
          '/api', 
          '/cart', 
          '/account', 
          '/_next/', 
          '/static/'
        ],
        // @ts-ignore
        crawlDelay: 10,
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}