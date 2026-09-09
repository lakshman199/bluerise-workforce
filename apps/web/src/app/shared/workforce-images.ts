/**
 * Approved Phase 2.1 workforce photographs. Paths are public assets; object-position
 * is tuned per image so faces and primary work stay in frame when cropped.
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
  restaurantWorkforce: {
    id: 'restaurant-workforce',
    src: '/images/workforce/restaurant-workforce.jpg',
    alt: 'Restaurant employees working in a commercial kitchen.',
    width: 1448,
    height: 1086,
    objectPosition: '50% 38%',
  },
  restaurantOperations: {
    id: 'restaurant-operations',
    src: '/images/workforce/restaurant-operations.jpg',
    alt: 'Restaurant employees working near a service workstation.',
    width: 1448,
    height: 1086,
    objectPosition: '36% 48%',
  },
  groceryWorkforce: {
    id: 'grocery-workforce',
    src: '/images/workforce/grocery-workforce.jpg',
    alt: 'Grocery employee handling fresh produce.',
    width: 2400,
    height: 1350,
    objectPosition: '50% 22%',
  },
  groceryCheckout: {
    id: 'grocery-checkout',
    src: '/images/workforce/grocery-checkout.jpg',
    alt: 'Employee using a checkout workstation.',
    width: 2400,
    height: 1600,
    objectPosition: '58% 50%',
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
