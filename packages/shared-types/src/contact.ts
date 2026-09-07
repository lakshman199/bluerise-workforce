export const CONTACT_SUBJECTS = [
  'General Inquiry',
  'Employers',
  'Job Seekers',
  'Benefits',
  'Partnership',
  'Other',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_SUBMISSION_STATUSES = ['received'] as const;

export type ContactSubmissionStatus = (typeof CONTACT_SUBMISSION_STATUSES)[number];

export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
  consent: boolean;
}

/**
 * What the API returns after a valid submission is stored.
 *
 * Delivery is never claimed here. Until a mail provider is configured the record is
 * persisted only.
 */
export interface ContactSubmissionReceipt {
  id: string;
  receivedAt: string;
  stored: true;
  emailed: false;
}
