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
  /** Kapster yang dipilih ketika pelanggan didaftarkan. */
  barberId: number;
  /** Nama disimpan sebagai snapshot agar riwayat tetap terbaca jika profil API berubah. */
  barberName: string;
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
  | 'invalid_barber'
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
  /** Perkiraan beban antrean terlama di antara semua kapster. */
  estimatedQueueMinutes: number;
  currentCustomers: Customer[];
  nextCustomer: Customer | null;
}

// ==========================================
// MODUL 3: ASYNCHRONOUS & API CALL INTERFACES
// ==========================================

/** Struktur data mentah dari External API DummyJSON. */
export interface ExternalUserApiResponse {
  users: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    hair: {
      color: string;
      type: string;
    };
  }[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Profil kapster untuk aplikasi demo.
 * Nama operasional "Kapster n" dibuat lokal; profileName dan detail profil berasal dari API.
 * Data DummyJSON bukan data pegawai atau data keahlian profesional yang terverifikasi.
 */
export interface Barber {
  id: number;
  name: string;
  profileName: string;
  email: string;
  phone: string;
  avatar: string;
  hairProfile: string;
  source: 'api' | 'local';
}

/** Hasil pengecekan ketersediaan kapster, bukan bukti reservasi server. */
export interface AvailabilityCheckResult {
  barberId: number;
  barberName: string;
  available: boolean;
  message: string;
  checkedAt: number;
}
