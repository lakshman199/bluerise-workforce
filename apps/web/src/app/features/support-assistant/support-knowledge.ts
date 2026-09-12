/**
 * Approved BlueRise Support Assistant knowledge.
 *
 * Answers are limited to verified public-site copy. Do not add capabilities,
 * customers, live integrations, portals, certifications, or statistics here.
 */

export interface SupportKnowledgeLink {
  readonly href: string;
  readonly label: string;
}

export interface SupportKnowledgeEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly keywords: readonly string[];
  readonly link?: SupportKnowledgeLink;
}

export const SUPPORT_FALLBACK_ANSWER =
  "I don't have enough information to answer that confidently. Would you like to raise a support ticket?";

export const SUPPORT_KNOWLEDGE: readonly SupportKnowledgeEntry[] = [
  {
    id: 'what-is-bluerise',
    question: 'What is BlueRise?',
    answer:
      'BlueRise Workforce is a coordinated workforce platform. Its public purpose is building stronger workforces and creating brighter futures. BlueRise believes work is more than employment—it is a pathway to dignity, stability, growth, and opportunity. The platform sits between the organizations that employ people and the specialist providers that handle payroll, benefits, HR and compliance, timekeeping, and workers’ compensation, and is designed to give each audience one place to work.',
    keywords: [
      'what is bluerise',
      'who are you',
      'about bluerise',
      'workforce platform',
      'coordinated workforce',
    ],
    link: { href: '/about', label: 'About Us' },
  },
  {
    id: 'who-is-bluerise-for',
    question: 'Who is BlueRise for?',
    answer:
      'BlueRise Workforce is designed for employers and the people they employ, and for people looking for meaningful work, career development, and support. Employers, job seekers, and community partners are invited to connect. The public site currently focuses on restaurants and grocery stores.',
    keywords: [
      'who is bluerise for',
      'who is it for',
      'audience',
      'employers and employees',
      'job seekers',
      'community partners',
    ],
    link: { href: '/employers', label: 'Employers' },
  },
  {
    id: 'services',
    question: 'What services does BlueRise support?',
    answer:
      'BlueRise is designed to coordinate payroll, benefits, HR and compliance, timekeeping, workers’ compensation, employee support, and workforce management in one experience. Specialist providers may still perform the underlying services. BlueRise is not an insurance carrier, and no specific provider is presented on this site as a live connection.',
    keywords: [
      'services',
      'solution areas',
      'what do you support',
      'workforce operations',
      'modules',
      'platform areas',
    ],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'industries',
    question: 'What industries does BlueRise serve?',
    answer:
      'BlueRise Workforce currently focuses on restaurants and grocery stores—workplaces where people keep daily operations moving.',
    keywords: [
      'industries',
      'industry',
      'restaurants',
      'grocery',
      'grocery stores',
      'which industries',
    ],
    link: { href: '/employers', label: 'Employers' },
  },
  {
    id: 'employer-contact',
    question: 'How can employers contact BlueRise?',
    answer:
      'Employers can reach BlueRise Workforce through the Contact Us form or by emailing info@blueriseworkforce.com. The public site does not list a phone number.',
    keywords: [
      'employers contact',
      'employer contact',
      'contact employers',
      'reach employers',
      'talk to employers',
    ],
    link: { href: '/contact', label: 'Contact Us' },
  },
  {
    id: 'job-seeker-help',
    question: 'How can job seekers get help?',
    answer:
      'Job seekers can reach BlueRise through Contact Us or by emailing info@blueriseworkforce.com. BlueRise is designed to support people looking for meaningful work, career development, training, and inclusive employment pathways. A live job board and resume processing are not available on this site yet.',
    keywords: [
      'job seekers',
      'job seeker',
      'looking for work',
      'find a job',
      'resume',
      'career help',
    ],
    link: { href: '/job-seekers', label: 'Job Seekers' },
  },
  {
    id: 'payroll',
    question: 'How does BlueRise support payroll?',
    answer:
      'Payroll is one of the platform areas BlueRise is designed to coordinate. The site describes payroll connectivity as connecting workforce services so pay information can sit alongside specialist payroll providers. BlueRise does not present itself as processing payroll on this site, and no payroll provider is listed as a live integration.',
    keywords: ['payroll', 'pay information', 'payroll connectivity', 'pay'],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'benefits',
    question: 'How does BlueRise support benefits?',
    answer:
      'BlueRise Workforce is designed to coordinate benefits information as part of the workforce experience. It is not an insurance carrier and does not publish plan pricing or coverage guarantees on this site. Categories the platform is designed to coordinate include medical, dental, vision, life, disability, retirement, and other workforce benefits. Those categories are platform concepts—not active plans or enrollments.',
    keywords: [
      'benefits',
      'insurance',
      'medical',
      'dental',
      'vision',
      'retirement',
      'coverage',
    ],
    link: { href: '/benefits', label: 'Benefits' },
  },
  {
    id: 'timekeeping',
    question: 'How does BlueRise support timekeeping?',
    answer:
      'Timekeeping is part of the coordinated experience BlueRise is designed to provide. The site says BlueRise coordinates hours and time information with payroll and the rest of the workforce record. It does not describe a live time-clock or POS integration on this site.',
    keywords: ['timekeeping', 'hours', 'time information', 'time clock'],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'hr-compliance',
    question: 'How does BlueRise support HR and compliance?',
    answer:
      'HR and compliance are solution areas BlueRise is designed to support. The site says BlueRise supports HR and compliance workflows so documents, requirements, and acknowledgements can sit with employment records. Specialist providers may still perform underlying services.',
    keywords: ['hr', 'compliance', 'acknowledgements', 'employment records'],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'workers-comp',
    question: 'How does BlueRise support workers’ compensation?',
    answer:
      'Workers’ compensation is one of the coordinated workforce operations BlueRise is designed to support. The site describes coordinating workers’ compensation information as part of workforce operations, not as a live claims system on this site.',
    keywords: [
      'workers compensation',
      'workers’ compensation',
      "workers' compensation",
      'workers comp',
    ],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'employee-support',
    question: 'What employee support does BlueRise describe?',
    answer:
      'BlueRise is designed to give people one place to see employment, pay, benefits, hours, documents, and requests for help—so support does not disappear after hiring. That describes the intended coordinated experience, not a completed employee portal on this public site.',
    keywords: ['employee support', 'help requests', 'documents', 'after hiring'],
    link: { href: '/our-solutions', label: 'Our Solutions' },
  },
  {
    id: 'mission',
    question: 'What is BlueRise’s mission?',
    answer:
      'The published mission is to empower individuals through meaningful employment opportunities, comprehensive employee support, and career development programs that safeguard and protect their future. The published vision is to become a globally recognized workforce organization dedicated to serving humanity through employment, inclusion, education, and opportunity.',
    keywords: ['mission', 'vision', 'purpose', 'talent meets purpose'],
    link: { href: '/about', label: 'About Us' },
  },
  {
    id: 'inclusion',
    question: 'What is BlueRise’s inclusion commitment?',
    answer:
      'At BlueRise Workforce, inclusion is not a program—it is a commitment. The site says BlueRise supports training, development, and employment pathways for individuals with special needs, including those on the autism spectrum, and for neurodiverse talent.',
    keywords: [
      'inclusion',
      'inclusive',
      'autism',
      'neurodiverse',
      'special needs',
      'accessibility',
    ],
    link: { href: '/inclusion', label: 'Inclusion' },
  },
  {
    id: 'contact-email',
    question: 'What is the BlueRise contact email?',
    answer:
      'The verified public contact email is info@blueriseworkforce.com. You can also use the Contact Us form. This site does not publish a phone number or street address.',
    keywords: [
      'email',
      'info@blueriseworkforce.com',
      'contact email',
      'contact bluerise',
      'contact you',
    ],
    link: { href: '/contact', label: 'Contact Us' },
  },
  {
    id: 'job-board',
    question: 'Is there a live job board?',
    answer:
      'A live job board and resume processing are not available on this site yet. Find Jobs, Career Resources, Training Programs, and Submit Resume are service areas BlueRise Workforce intends to support. No openings are listed here, and a resume cannot be submitted through the Job Seekers page.',
    keywords: ['job board', 'openings', 'apply', 'submit resume', 'find jobs'],
    link: { href: '/job-seekers', label: 'Job Seekers' },
  },
  {
    id: 'resources',
    question: 'Where can I find BlueRise resources?',
    answer:
      'The Resources page collects resource areas BlueRise Workforce intends to support. Published articles, downloadable guides, and news stories are not listed there yet. Resources will be added as programs and materials become available.',
    keywords: ['resources', 'guides', 'articles', 'news'],
    link: { href: '/resources', label: 'Resources' },
  },
  {
    id: 'community',
    question: 'Does BlueRise have community or scholarship programs?',
    answer:
      'BlueRise Workforce says it aspires to establish programs and partnerships toward workforce development, career training, scholarships, skills workshops, autism and special-needs workforce programs, and community employment projects. Those are intended pathways, not claimed program results on this site.',
    keywords: ['community', 'scholarship', 'giving back', 'workshops', 'programs'],
    link: { href: '/', label: 'Home' },
  },
] as const;

export const SUPPORT_STARTER_QUESTIONS = [
  'What is BlueRise?',
  'Who is BlueRise for?',
  'What services does BlueRise support?',
  'What industries does BlueRise serve?',
  'How can employers contact BlueRise?',
  'How can job seekers get help?',
] as const;

export type SupportKnowledgeMatch =
  | { readonly kind: 'known'; readonly entry: SupportKnowledgeEntry }
  | { readonly kind: 'unknown' };

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'can',
  'does',
  'do',
  'for',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'my',
  'of',
  'on',
  'or',
  'please',
  'the',
  'to',
  'we',
  'what',
  'who',
  'you',
  'your',
]);

const MIN_SCORE = 5;

export function normalizeSupportQuery(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[^a-z0-9'@.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchSupportKnowledge(query: string): SupportKnowledgeMatch {
  const normalized = normalizeSupportQuery(query);
  if (normalized.length < 2) {
    return { kind: 'unknown' };
  }

  const exact = SUPPORT_KNOWLEDGE.find(
    (entry) => normalizeSupportQuery(entry.question) === normalized,
  );
  if (exact) {
    return { kind: 'known', entry: exact };
  }

  const scored = SUPPORT_KNOWLEDGE.map((entry) => ({
    entry,
    score: scoreEntry(normalized, entry),
  })).sort((left, right) => right.score - left.score);

  const top = scored[0];
  const second = scored[1];
  if (!top || top.score < MIN_SCORE) {
    return { kind: 'unknown' };
  }
  if (second && second.score === top.score) {
    return { kind: 'unknown' };
  }
  if (second && top.score - second.score < 2 && top.score < 8) {
    return { kind: 'unknown' };
  }

  return { kind: 'known', entry: top.entry };
}

function scoreEntry(normalizedQuery: string, entry: SupportKnowledgeEntry): number {
  let score = 0;
  const queryTokens = tokens(normalizedQuery);

  for (const keyword of entry.keywords) {
    const needle = normalizeSupportQuery(keyword);
    if (!needle) {
      continue;
    }
    if (needle.includes(' ') || needle.includes('@')) {
      if (normalizedQuery.includes(needle)) {
        score += 4;
      }
      continue;
    }
    if (queryTokens.has(needle)) {
      score += needle.length >= 6 ? 5 : 2;
    }
  }

  for (const token of tokens(normalizeSupportQuery(entry.question))) {
    if (queryTokens.has(token)) {
      score += 1;
    }
  }

  return score;
}

function tokens(normalized: string): Set<string> {
  return new Set(
    normalized.split(' ').filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
  );
}
