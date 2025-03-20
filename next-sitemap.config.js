/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://salsabeelaljanoobimpexp.com',
  generateRobotsTxt: true,
  // Exclude admin and login routes
  exclude: ['/admin', '/admin/*', '/login'],
  // Manually add pages that next-sitemap might miss
  additionalPaths: async (config) => {
    return [
      await config.transform(config, '/about'),
      await config.transform(config, '/all-waste-management'),
      await config.transform(config, '/careers'),
      await config.transform(config, '/chemical-waste-management'),
      await config.transform(config, '/civil-contracts'),
      await config.transform(config, '/contact'),
      await config.transform(config, '/drug-addiction-counseling'),
      await config.transform(config, '/educational-&-career-guidance'),
      await config.transform(config, '/foreign-language-learning-centers'),
      await config.transform(config, '/laundry-services'),
      await config.transform(config, '/marriage-&-family-counselling'),
      await config.transform(config, '/privacy-policy'),
      await config.transform(config, '/retail-consultancy'),
      await config.transform(config, '/terms-of-service'),
      await config.transform(config, '/vasthu-consultancy'),
    ];
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/login'],
      },
    ],
  },
};

module.exports = config;
