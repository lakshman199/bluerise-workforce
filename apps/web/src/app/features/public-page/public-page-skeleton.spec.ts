import { PUBLIC_PAGE_SKELETONS } from './public-page-content';

describe('PublicPageSkeleton', () => {
  it('no longer stands in for Resources or Contact', () => {
    const paths = PUBLIC_PAGE_SKELETONS.map((page) => page.path);

    expect(paths).not.toContain('resources');
    expect(paths).not.toContain('contact');
  });
});
