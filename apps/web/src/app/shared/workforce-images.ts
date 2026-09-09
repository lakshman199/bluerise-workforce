/**
 * Generic workforce photographs. Paths are public assets under
 * `apps/web/public/images/workforce/`. Object-position is tuned per image so
 * primary work stays in frame when cropped.
 *
 * On-page assets (only files that exist in the repository):
 * - industrial-team.png — Employers; Industries We Serve examples
 * - body-shop-worker.png — Our Solutions; Industries We Serve examples
 * - woodworker.png — Industries We Serve hero; examples
 * - convenience-store-worker.png — Industries We Serve examples
 * - payroll.jpg — Our Solutions
 * - employee-support.jpg — Benefits
 */

export interface WorkforceImage {
  readonly id: string;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly objectPosition: string;
}

export const WORKFORCE_IMAGES = {
  industrialTeam: {
    id: 'industrial-team',
    src: '/images/workforce/industrial-team.png',
    alt: 'A group of industrial and frontline workers showing teamwork.',
    width: 1369,
    height: 769,
    objectPosition: '50% 42%',
  },
  bodyShopWorker: {
    id: 'body-shop-worker',
    src: '/images/workforce/body-shop-worker.png',
    alt: 'A skilled automotive worker working in a body shop.',
    width: 1156,
    height: 768,
    objectPosition: '48% 38%',
  },
  woodworker: {
    id: 'woodworker',
    src: '/images/workforce/woodworker.png',
    alt: 'A woodworker working in a small business workshop.',
    width: 1143,
    height: 768,
    objectPosition: '36% 42%',
  },
  convenienceStoreWorker: {
    id: 'convenience-store-worker',
    src: '/images/workforce/convenience-store-worker.png',
    alt: 'A frontline retail worker at a small business checkout counter.',
    width: 1153,
    height: 763,
    objectPosition: '52% 38%',
  },
  payroll: {
    id: 'payroll',
    src: '/images/workforce/payroll.jpg',
    alt: 'Calculator and documents used for payroll administration.',
    width: 2400,
    height: 1602,
    objectPosition: '50% 62%',
  },
  employeeSupport: {
    id: 'employee-support',
    src: '/images/workforce/employee-support.jpg',
    alt: 'People showing teamwork and workplace support.',
    width: 2400,
    height: 1350,
    objectPosition: '50% 42%',
  },
} as const satisfies Record<string, WorkforceImage>;
