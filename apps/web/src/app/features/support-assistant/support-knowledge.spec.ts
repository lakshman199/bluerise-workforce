import {
  SUPPORT_FALLBACK_ANSWER,
  SUPPORT_KNOWLEDGE,
  SUPPORT_STARTER_QUESTIONS,
  matchSupportKnowledge,
} from './support-knowledge';

describe('matchSupportKnowledge', () => {
  it('returns the approved answer for every starter question', () => {
    for (const question of SUPPORT_STARTER_QUESTIONS) {
      const match = matchSupportKnowledge(question);
      expect(match.kind).toBe('known');
      if (match.kind === 'known') {
        expect(match.entry.question).toBe(question);
        expect(match.entry.answer.length).toBeGreaterThan(40);
      }
    }
  });

  it('answers a known payroll question without claiming BlueRise processes payroll', () => {
    const match = matchSupportKnowledge('How does BlueRise support payroll?');
    expect(match.kind).toBe('known');
    if (match.kind === 'known') {
      expect(match.entry.id).toBe('payroll');
      expect(match.entry.answer).toContain('specialist payroll providers');
      expect(match.entry.answer).not.toMatch(/processes payroll|live ADP|live Gusto/i);
    }
  });

  it('returns the fallback for questions outside approved content', () => {
    const unknown = [
      'Do you have a live ADP integration?',
      'Who founded BlueRise?',
      'What is your office address in Dubai?',
      'How much market share does BlueRise have?',
      'Can I log into the employee portal today?',
    ];

    for (const question of unknown) {
      expect(matchSupportKnowledge(question)).toEqual({ kind: 'unknown' });
    }
  });

  it('does not invent capabilities in any approved answer', () => {
    const joined = SUPPORT_KNOWLEDGE.map((entry) => entry.answer).join(' ');
    expect(joined).not.toMatch(/SOC 2|ISO 27001|HIPAA|PCI/);
    expect(joined).not.toMatch(/Gusto|ADP/);
    expect(joined).not.toMatch(/we process payroll/i);
    expect(SUPPORT_FALLBACK_ANSWER).toContain('raise a support ticket');
  });
});
