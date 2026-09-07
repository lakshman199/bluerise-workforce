import { emphasize } from './emphasize';

describe('emphasize', () => {
  it('wraps the selected phrase without changing the sentence', () => {
    expect(emphasize('One coordinated workforce experience.', 'coordinated')).toBe(
      'One <em>coordinated</em> workforce experience.',
    );
  });

  it('returns the original text when the phrase is absent', () => {
    expect(emphasize('Our Values', 'missing')).toBe('Our Values');
  });
});
