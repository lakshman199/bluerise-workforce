import { PUBLIC_SITEMAP_PATHS } from './public-sitemap';

describe('PUBLIC_SITEMAP_PATHS', () => {
  it('includes Resources and Contact among the indexable public routes', () => {
    expect(PUBLIC_SITEMAP_PATHS).toContain('/industries');
    expect(PUBLIC_SITEMAP_PATHS).toContain('/resources');
    expect(PUBLIC_SITEMAP_PATHS).toContain('/contact');
    expect(PUBLIC_SITEMAP_PATHS).not.toContain('/design-system');
    expect(PUBLIC_SITEMAP_PATHS).not.toContain('/portal');
  });
});
