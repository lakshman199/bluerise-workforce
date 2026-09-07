import { routes } from './app.routes';

describe('public route SEO', () => {
  function seoFor(path: string) {
    const route = routes.find((entry) => entry.path === path);
    return route?.data?.['seo'] as { title?: string; description?: string } | undefined;
  }

  it('gives Employers, Job Seekers, Our Solutions, and Benefits unique titles and descriptions', () => {
    const employers = seoFor('employers');
    const seekers = seoFor('job-seekers');
    const solutions = seoFor('our-solutions');
    const benefits = seoFor('benefits');

    const titles = [employers?.title, seekers?.title, solutions?.title, benefits?.title];
    const descriptions = [
      employers?.description,
      seekers?.description,
      solutions?.description,
      benefits?.description,
    ];

    expect(titles.every(Boolean)).toBe(true);
    expect(descriptions.every((value) => (value?.length ?? 0) > 40)).toBe(true);
    expect(new Set(titles).size).toBe(4);
    expect(new Set(descriptions).size).toBe(4);
  });
});
