/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://chamcong.spit-husc.io.vn',
  outDir: './public',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/api'] },
    ],
    additionalSitemaps: ['https://chamcong.spit-husc.io.vn/sitemap.xml'],
  },
  exclude: ['/secret-page'], // nếu cần loại trang
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
}
