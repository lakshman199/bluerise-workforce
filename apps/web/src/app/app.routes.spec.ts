import { routes } from './app.routes';

describe('public route SEO', () => {
  function seoFor(path: string) {
    const route = routes.find((entry) => entry.path === path);
    return route?.data?.['seo'] as
      { title?: string; description?: string; noIndex?: boolean } | undefined;
  }

  it('gives public marketing pages unique titles and descriptions', () => {
    const paths = [
      '',
      'about',
      'inclusion',
      'employers',
      'job-seekers',
      'our-solutions',
      'benefits',
      'industries',
      'resources',
      'contact',
    ];
    const titles = paths.map((path) => seoFor(path)?.title);
    const descriptions = paths.map((path) => seoFor(path)?.description);

    expect(titles.every(Boolean)).toBe(true);
    expect(descriptions.every((value) => (value?.length ?? 0) > 40)).toBe(true);
    expect(new Set(titles).size).toBe(paths.length);
    expect(new Set(descriptions).size).toBe(paths.length);
  });

  it('keeps the design system and 404 out of the public index', () => {
    expect(seoFor('design-system')?.noIndex).toBe(true);
    expect(seoFor('**')?.noIndex).toBe(true);
  });
});
