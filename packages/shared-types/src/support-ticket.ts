export const SUPPORT_TICKET_STATUSES = [
  'open',
  'in_progress',
  'resolved',
  'closed',
] as const;

export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

export const SUPPORT_TICKET_SOURCES = ['support_assistant'] as const;

export type SupportTicketSource = (typeof SUPPORT_TICKET_SOURCES)[number];

export interface SupportTicketRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  consent: boolean;
}

/**
 * What the API returns after a valid support ticket is stored.
 *
 * Delivery is never claimed here. Until a mail provider is configured the record is
 * persisted only.
 */
export interface SupportTicketReceipt {
  id: string;
  receivedAt: string;
  stored: true;
  emailed: false;
  status: 'open';
}
