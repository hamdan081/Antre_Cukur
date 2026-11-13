import type { Barber, QueueState, Service, ServiceId } from './types';

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
  in_service: 'Sedang Dilayani',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
} as const;

/** Roster lokal agar antrean tetap bisa dipakai ketika perangkat tidak terhubung ke internet. */
export const LOCAL_BARBERS: Barber[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: `Kapster ${index + 1}`,
  profileName: 'Profil lokal cadangan',
  email: '',
  phone: 'Belum tersedia',
  avatar: '',
  hairProfile: 'Informasi profil belum tersedia',
  source: 'local',
}));

/** Data contoh hanya dimuat jika pengguna memilihnya dari bagian Pemeriksaan aplikasi. */
export function createDemoState(now: number = Date.now()): QueueState {
  const minute = 60_000;

  return {
    nextTicket: 8,
    customers: [
      {
        id: 'antre-1', ticketNumber: 1, name: 'Rizky', serviceId: 'potong',
        barberId: 1, barberName: 'Kapster 1', status: 'completed',
        createdAt: now - 50 * minute, startedAt: now - 40 * minute, completedAt: now - 20 * minute,
      },
      {
        id: 'antre-2', ticketNumber: 2, name: 'Andi', serviceId: 'potong',
        barberId: 1, barberName: 'Kapster 1', status: 'in_service',
        createdAt: now - 35 * minute, startedAt: now - 5 * minute,
      },
      {
        id: 'antre-3', ticketNumber: 3, name: 'Budi', serviceId: 'combo',
        barberId: 1, barberName: 'Kapster 1', status: 'waiting', createdAt: now - 25 * minute,
      },
      {
        id: 'antre-4', ticketNumber: 4, name: 'Dimas', serviceId: 'potong',
        barberId: 2, barberName: 'Kapster 2', status: 'waiting', createdAt: now - 15 * minute,
      },
      {
        id: 'antre-5', ticketNumber: 5, name: 'Fajar', serviceId: 'cuci',
        barberId: 2, barberName: 'Kapster 2', status: 'waiting', createdAt: now - 10 * minute,
      },
      {
        id: 'antre-6', ticketNumber: 6, name: 'Alip', serviceId: 'combo',
        barberId: 3, barberName: 'Kapster 3', status: 'waiting', createdAt: now - 13 * minute,
      },
      {
        id: 'antre-7', ticketNumber: 7, name: 'Herman', serviceId: 'cuci',
        barberId: 3, barberName: 'Kapster 3', status: 'waiting', createdAt: now - 10 * minute,
      },
    ],
  };
}

export function createEmptyState(): QueueState {
  return { customers: [], nextTicket: 1 };
}
