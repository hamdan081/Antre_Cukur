import { SERVICE_BY_ID } from './data';
import type {
  Customer,
  CustomerStatus,
  QueueActionResult,
  QueueFilter,
  QueueState,
  QueueSummary,
  Service,
  ServiceId,
} from './types';

export const MAX_CUSTOMER_NAME_LENGTH = 40;
export const MAX_BARBER_NAME_LENGTH = 40;

export function isServiceId(value: unknown): value is ServiceId {
  return value === 'potong' || value === 'cuci' || value === 'combo';
}

export function getService(serviceId: ServiceId): Service {
  return SERVICE_BY_ID[serviceId];
}

export function formatTicket(ticketNumber: number): string {
  return `A-${String(ticketNumber).padStart(3, '0')}`;
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function sortByTicket(customers: Customer[]): Customer[] {
  return [...customers].sort((first, second) => first.ticketNumber - second.ticketNumber);
}

export function filterCustomers(state: QueueState, filter: QueueFilter = 'all'): Customer[] {
  const customers = filter === 'all'
    ? state.customers
    : state.customers.filter((customer) => customer.status === filter);

  return sortByTicket(customers);
}

export function getCurrentCustomers(state: QueueState): Customer[] {
  return sortByTicket(state.customers.filter((customer) => customer.status === 'in_service'));
}

export function getCurrentCustomer(state: QueueState, barberId: number): Customer | null {
  return state.customers.find((customer) => customer.status === 'in_service' && customer.barberId === barberId) ?? null;
}

export function getNextCustomer(state: QueueState, barberId: number): Customer | null {
  return filterCustomers(state, 'waiting').find((customer) => customer.barberId === barberId) ?? null;
}

export function addCustomer(
  state: QueueState,
  name: string,
  serviceId: string,
  barberId: number,
  barberName: string,
  now: number = Date.now(),
): QueueActionResult {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  const cleanBarberName = barberName.trim().replace(/\s+/g, ' ');

  if (cleanName.length === 0 || cleanName.length > MAX_CUSTOMER_NAME_LENGTH) {
    return {
      ok: false,
      code: 'invalid_name',
      error: `Isi nama pelanggan dengan 1–${MAX_CUSTOMER_NAME_LENGTH} karakter.`,
    };
  }

  if (!isServiceId(serviceId)) {
    return { ok: false, code: 'invalid_service', error: 'Pilih layanan yang tersedia.' };
  }

  if (!Number.isSafeInteger(barberId) || barberId < 1 || cleanBarberName.length === 0 || cleanBarberName.length > MAX_BARBER_NAME_LENGTH) {
    return { ok: false, code: 'invalid_barber', error: 'Pilih kapster yang tersedia.' };
  }

  if (!isTimestamp(now)) {
    return { ok: false, code: 'invalid_time', error: 'Waktu pencatatan tidak valid.' };
  }

  if (!Number.isSafeInteger(state.nextTicket) || state.nextTicket >= Number.MAX_SAFE_INTEGER) {
    return { ok: false, code: 'ticket_limit', error: 'Nomor antrean sudah mencapai batas.' };
  }

  const customer: Customer = {
    id: `antre-${state.nextTicket}`,
    ticketNumber: state.nextTicket,
    name: cleanName,
    serviceId,
    barberId,
    barberName: cleanBarberName,
    status: 'waiting',
    createdAt: now,
  };

  return {
    ok: true,
    customer,
    state: { customers: [...state.customers, customer], nextTicket: state.nextTicket + 1 },
  };
}

/** Satu kapster hanya dapat menangani satu pelanggan aktif dalam satu waktu. */
export function callNextCustomer(state: QueueState, barberId: number, now: number = Date.now()): QueueActionResult {
  if (getCurrentCustomer(state, barberId)) {
    return {
      ok: false,
      code: 'already_serving',
      error: 'Kapster ini masih melayani pelanggan. Selesaikan layanan sebelum memanggil antrean berikutnya.',
    };
  }

  const nextCustomer = getNextCustomer(state, barberId);
  if (!nextCustomer) {
    return { ok: false, code: 'no_waiting_customer', error: 'Belum ada pelanggan yang menunggu untuk kapster ini.' };
  }

  if (!isTimestamp(now) || now < nextCustomer.createdAt) {
    return { ok: false, code: 'invalid_time', error: 'Waktu mulai pelayanan tidak valid.' };
  }

  const customer: Customer = { ...nextCustomer, status: 'in_service', startedAt: now };
  return replaceCustomer(state, customer);
}

export function finishCurrentCustomer(state: QueueState, barberId: number, now: number = Date.now()): QueueActionResult {
  const currentCustomer = getCurrentCustomer(state, barberId);
  if (!currentCustomer) {
    return { ok: false, code: 'no_active_customer', error: 'Kapster ini belum memiliki pelanggan yang sedang dilayani.' };
  }

  if (!isTimestamp(now) || now < (currentCustomer.startedAt ?? currentCustomer.createdAt)) {
    return { ok: false, code: 'invalid_time', error: 'Waktu selesai pelayanan tidak valid.' };
  }

  const customer: Customer = { ...currentCustomer, status: 'completed', completedAt: now };
  return replaceCustomer(state, customer);
}

export function cancelWaitingCustomer(
  state: QueueState,
  customerId: string,
  now: number = Date.now(),
): QueueActionResult {
  const waitingCustomer = state.customers.find((customer) => customer.id === customerId);
  if (!waitingCustomer || waitingCustomer.status !== 'waiting') {
    return {
      ok: false,
      code: 'customer_not_waiting',
      error: 'Hanya pelanggan yang masih menunggu yang dapat dibatalkan.',
    };
  }

  if (!isTimestamp(now) || now < waitingCustomer.createdAt) {
    return { ok: false, code: 'invalid_time', error: 'Waktu pembatalan tidak valid.' };
  }

  const customer: Customer = { ...waitingCustomer, status: 'cancelled', cancelledAt: now };
  return replaceCustomer(state, customer);
}

function replaceCustomer(state: QueueState, customer: Customer): QueueActionResult {
  return {
    ok: true,
    customer,
    state: {
      ...state,
      customers: state.customers.map((item) => item.id === customer.id ? customer : item),
    },
  };
}

/** Estimasi sisa durasi pelanggan aktif berdasarkan layanan yang dipilih. */
export function getRemainingServiceMinutes(customer: Customer, now: number = Date.now()): number {
  const duration = getService(customer.serviceId).durationMinutes;
  if (customer.status !== 'in_service' || customer.startedAt === undefined) return duration;

  const elapsedMinutes = Math.max(0, now - customer.startedAt) / 60_000;
  return Math.max(0, Math.ceil(duration - elapsedMinutes));
}

/** Estimasi waktu tunggu dihitung hanya dari antrean kapster yang dipilih. */
export function getEstimatedWaitMinutes(
  state: QueueState,
  customerId: string,
  now: number = Date.now(),
): number | null {
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer || customer.status === 'completed' || customer.status === 'cancelled') return null;
  if (customer.status === 'in_service') return 0;

  const currentCustomer = getCurrentCustomer(state, customer.barberId);
  let minutes = currentCustomer ? getRemainingServiceMinutes(currentCustomer, now) : 0;

  for (const waitingCustomer of filterCustomers(state, 'waiting')) {
    if (waitingCustomer.barberId !== customer.barberId) continue;
    if (waitingCustomer.id === customerId) break;
    minutes += getService(waitingCustomer.serviceId).durationMinutes;
  }

  return minutes;
}

export function getQueueSummary(state: QueueState, now: number = Date.now()): QueueSummary {
  const currentCustomers = getCurrentCustomers(state);
  const waitingCustomers = filterCustomers(state, 'waiting');
  const barberIds = new Set(state.customers.map((customer) => customer.barberId));
  let estimatedQueueMinutes = 0;

  // Beban antrean ditampilkan sebagai estimasi terlama dari seluruh kapster.
  for (const barberId of barberIds) {
    const current = getCurrentCustomer(state, barberId);
    let workload = current ? getRemainingServiceMinutes(current, now) : 0;
    for (const customer of waitingCustomers) {
      if (customer.barberId === barberId) workload += getService(customer.serviceId).durationMinutes;
    }
    estimatedQueueMinutes = Math.max(estimatedQueueMinutes, workload);
  }

  return {
    total: state.customers.length,
    waiting: waitingCustomers.length,
    inService: currentCustomers.length,
    completed: state.customers.filter((customer) => customer.status === 'completed').length,
    cancelled: state.customers.filter((customer) => customer.status === 'cancelled').length,
    estimatedQueueMinutes,
    currentCustomers,
    nextCustomer: waitingCustomers[0] ?? null,
  };
}

function isCustomerStatus(value: unknown): value is CustomerStatus {
  return value === 'waiting' || value === 'in_service' || value === 'completed' || value === 'cancelled';
}

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;

  if (
    !Number.isSafeInteger(item.ticketNumber) || (item.ticketNumber as number) < 1 ||
    item.id !== `antre-${item.ticketNumber}` ||
    typeof item.name !== 'string' || item.name.trim() !== item.name ||
    item.name.length === 0 || item.name.length > MAX_CUSTOMER_NAME_LENGTH ||
    !isServiceId(item.serviceId) || !isCustomerStatus(item.status) || !isTimestamp(item.createdAt)
  ) return false;

  // barberId/barberName boleh kosong pada data versi 1; akan dimigrasikan saat restore.
  if (item.barberId !== undefined && (!Number.isSafeInteger(item.barberId) || (item.barberId as number) < 1)) return false;
  if (item.barberName !== undefined && (typeof item.barberName !== 'string' || item.barberName.trim().length === 0 || item.barberName.length > MAX_BARBER_NAME_LENGTH)) return false;

  for (const key of ['startedAt', 'completedAt', 'cancelledAt']) {
    if (item[key] !== undefined && (!isTimestamp(item[key]) || (item[key] as number) < (item.createdAt as number))) return false;
  }

  if (item.status === 'waiting') {
    return item.startedAt === undefined && item.completedAt === undefined && item.cancelledAt === undefined;
  }
  if (item.status === 'in_service') {
    return isTimestamp(item.startedAt) && item.completedAt === undefined && item.cancelledAt === undefined;
  }
  if (item.status === 'completed') {
    return isTimestamp(item.startedAt) && isTimestamp(item.completedAt) &&
      (item.completedAt as number) >= (item.startedAt as number) && item.cancelledAt === undefined;
  }
  return isTimestamp(item.cancelledAt) && item.startedAt === undefined && item.completedAt === undefined;
}

/** Data versi lama dimigrasikan ke Kapster 1; state baru mendukung satu layanan aktif per kapster. */
export function restoreQueueState(value: unknown): QueueState | null {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (
    !Array.isArray(candidate.customers) || !candidate.customers.every(isCustomer) ||
    !Number.isSafeInteger(candidate.nextTicket) || (candidate.nextTicket as number) < 1
  ) return null;

  const customers = (candidate.customers as (Customer & { barberId?: number; barberName?: string })[]).map((customer) => ({
    ...customer,
    barberId: customer.barberId ?? 1,
    barberName: customer.barberName ?? `Kapster ${customer.barberId ?? 1}`,
  }));
  const tickets = new Set<number>();
  const activeBarbers = new Set<number>();

  for (const customer of customers) {
    if (tickets.has(customer.ticketNumber) || customer.ticketNumber >= (candidate.nextTicket as number)) return null;
    tickets.add(customer.ticketNumber);
    if (customer.status === 'in_service') {
      if (activeBarbers.has(customer.barberId)) return null;
      activeBarbers.add(customer.barberId);
    }
  }

  return {
    customers: sortByTicket(customers.map((customer) => ({ ...customer }))),
    nextTicket: candidate.nextTicket as number,
  };
}
