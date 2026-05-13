import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const base = siteUrl ? siteUrl.replace(/\/$/, "") : "";

  // Block all crawlers on non-production deployments (preview, staging)
  // to prevent duplicate-content indexing of apspower.vercel.app etc.
  if (process.env.VERCEL_ENV !== 'production') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${base}/sitemap.xml`,
    };
  }

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
          '/static/',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}