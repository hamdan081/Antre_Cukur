import type { QueueState, Service, ServiceId } from './types';

export const SERVICES: Service[] = [
  { id: 'potong', name: 'Potong Rambut', durationMinutes: 20, price: 30000 },
  { id: 'cuci', name: 'Cuci Rambut', durationMinutes: 10, price: 15000 },
  { id: 'combo', name: 'Potong + Cuci', durationMinutes: 30, price: 40000 },
];

export const SERVICE_BY_ID: Record<ServiceId, Service> = {
  potong: SERVICES[0],
  cuci: SERVICES[1],
  combo: SERVICES[2],
};

export const STATUS_LABELS = {
  waiting: 'Menunggu',
  in_service: 'Sedang Dicukur',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
} as const;

/** Lima data contoh: 1 selesai, 1 dilayani, dan 3 menunggu. */
export function createDemoState(now: number = Date.now()): QueueState {
  const minute = 60_000;

  return {
    nextTicket: 6,
    customers: [
      {
        id: 'antre-1',
        ticketNumber: 1,
        name: 'Rizky',
        serviceId: 'potong',
        status: 'completed',
        createdAt: now - 50 * minute,
        startedAt: now - 40 * minute,
        completedAt: now - 20 * minute,
      },
      {
        id: 'antre-2',
        ticketNumber: 2,
        name: 'Andi',
        serviceId: 'potong',
        status: 'in_service',
        createdAt: now - 35 * minute,
        startedAt: now - 5 * minute,
      },
      {
        id: 'antre-3',
        ticketNumber: 3,
        name: 'Budi',
        serviceId: 'combo',
        status: 'waiting',
        createdAt: now - 25 * minute,
      },
      {
        id: 'antre-4',
        ticketNumber: 4,
        name: 'Dimas',
        serviceId: 'potong',
        status: 'waiting',
        createdAt: now - 15 * minute,
      },
      {
        id: 'antre-5',
        ticketNumber: 5,
        name: 'Fajar',
        serviceId: 'cuci',
        status: 'waiting',
        createdAt: now - 10 * minute,
      },
    ],
  };
}

export function createEmptyState(): QueueState {
  return { customers: [], nextTicket: 1 };
}
