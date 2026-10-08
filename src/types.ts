/** Pilihan layanan dan status menggunakan nilai tetap agar tidak salah ketik. */
export type ServiceId = 'potong' | 'cuci' | 'combo';

export type CustomerStatus = 'waiting' | 'in_service' | 'completed' | 'cancelled';

export type QueueFilter = 'all' | CustomerStatus;

export interface Service {
  id: ServiceId;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Customer {
  id: string;
  ticketNumber: number;
  name: string;
  serviceId: ServiceId;
  status: CustomerStatus;
  /** Timestamp disimpan sebagai angka agar mudah disimpan ke JSON. */
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  cancelledAt?: number;
}

export interface QueueState {
  customers: Customer[];
  /** Tidak dikurangi ketika pelanggan dibatalkan atau selesai. */
  nextTicket: number;
}

export type QueueErrorCode =
  | 'invalid_name'
  | 'invalid_service'
  | 'invalid_time'
  | 'ticket_limit'
  | 'already_serving'
  | 'no_waiting_customer'
  | 'no_active_customer'
  | 'customer_not_waiting';

export type QueueActionResult =
  | { ok: true; state: QueueState; customer: Customer }
  | { ok: false; code: QueueErrorCode; error: string };

export interface QueueSummary {
  total: number;
  waiting: number;
  inService: number;
  completed: number;
  cancelled: number;
  /** Total estimasi pelayanan aktif dan semua pelanggan yang menunggu. */
  estimatedQueueMinutes: number;
  currentCustomer: Customer | null;
  nextCustomer: Customer | null;
}
