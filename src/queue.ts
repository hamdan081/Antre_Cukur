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
  // Salin array sebelum sort supaya state semula tidak berubah.
  return [...customers].sort((first, second) => first.ticketNumber - second.ticketNumber);
}

export function filterCustomers(state: QueueState, filter: QueueFilter = 'all'): Customer[] {
  const customers = filter === 'all'
    ? state.customers
    : state.customers.filter((customer) => customer.status === filter);

  return sortByTicket(customers);
}

export function getCurrentCustomer(state: QueueState): Customer | null {
  return state.customers.find((customer) => customer.status === 'in_service') ?? null;
}

export function getNextCustomer(state: QueueState): Customer | null {
  return filterCustomers(state, 'waiting')[0] ?? null;
}

export function addCustomer(
  state: QueueState,
  name: string,
  serviceId: string,
  now: number = Date.now(),
): QueueActionResult {
  const cleanName = name.trim().replace(/\s+/g, ' ');

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
    status: 'waiting',
    createdAt: now,
  };

  return {
    ok: true,
    customer,
    state: { customers: [...state.customers, customer], nextTicket: state.nextTicket + 1 },
  };
}

export function callNextCustomer(state: QueueState, now: number = Date.now()): QueueActionResult {
  if (getCurrentCustomer(state)) {
    return {
      ok: false,
      code: 'already_serving',
      error: 'Selesaikan pelanggan yang sedang dilayani sebelum memanggil antrean berikutnya.',
    };
  }

  const nextCustomer = getNextCustomer(state);
  if (!nextCustomer) {
    return { ok: false, code: 'no_waiting_customer', error: 'Belum ada pelanggan yang menunggu.' };
  }

  if (!isTimestamp(now) || now < nextCustomer.createdAt) {
    return { ok: false, code: 'invalid_time', error: 'Waktu mulai pelayanan tidak valid.' };
  }

  const customer: Customer = { ...nextCustomer, status: 'in_service', startedAt: now };
  return replaceCustomer(state, customer);
}

export function finishCurrentCustomer(state: QueueState, now: number = Date.now()): QueueActionResult {
  const currentCustomer = getCurrentCustomer(state);
  if (!currentCustomer) {
    return { ok: false, code: 'no_active_customer', error: 'Belum ada pelanggan yang sedang dilayani.' };
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

/** Estimasi pelanggan aktif memakai sisa durasi layanan, dibulatkan ke atas. */
export function getRemainingServiceMinutes(customer: Customer, now: number = Date.now()): number {
  const duration = getService(customer.serviceId).durationMinutes;
  if (customer.status !== 'in_service' || customer.startedAt === undefined) return duration;

  const elapsedMinutes = Math.max(0, now - customer.startedAt) / 60_000;
  return Math.max(0, Math.ceil(duration - elapsedMinutes));
}

/** Waktu tunggu tidak memasukkan durasi layanan pelanggan itu sendiri. */
export function getEstimatedWaitMinutes(
  state: QueueState,
  customerId: string,
  now: number = Date.now(),
): number | null {
  const customer = state.customers.find((item) => item.id === customerId);
  if (!customer || customer.status === 'completed' || customer.status === 'cancelled') return null;
  if (customer.status === 'in_service') return 0;

  const currentCustomer = getCurrentCustomer(state);
  let minutes = currentCustomer ? getRemainingServiceMinutes(currentCustomer, now) : 0;

  for (const waitingCustomer of filterCustomers(state, 'waiting')) {
    if (waitingCustomer.id === customerId) break;
    minutes += getService(waitingCustomer.serviceId).durationMinutes;
  }

  return minutes;
}

export function getQueueSummary(state: QueueState, now: number = Date.now()): QueueSummary {
  const currentCustomer = getCurrentCustomer(state);
  const waitingCustomers = filterCustomers(state, 'waiting');
  let estimatedQueueMinutes = currentCustomer ? getRemainingServiceMinutes(currentCustomer, now) : 0;

  // Loop ini juga menjadi contoh custom function dan perulangan untuk demo.
  for (const customer of waitingCustomers) {
    estimatedQueueMinutes += getService(customer.serviceId).durationMinutes;
  }

  return {
    total: state.customers.length,
    waiting: waitingCustomers.length,
    inService: currentCustomer ? 1 : 0,
    completed: state.customers.filter((customer) => customer.status === 'completed').length,
    cancelled: state.customers.filter((customer) => customer.status === 'cancelled').length,
    estimatedQueueMinutes,
    currentCustomer,
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

  for (const key of ['startedAt', 'completedAt', 'cancelledAt']) {
    if (item[key] !== undefined && (!isTimestamp(item[key]) || item[key] < item.createdAt)) return false;
  }

  if (item.status === 'waiting') {
    return item.startedAt === undefined && item.completedAt === undefined && item.cancelledAt === undefined;
  }
  if (item.status === 'in_service') {
    return isTimestamp(item.startedAt) && item.completedAt === undefined && item.cancelledAt === undefined;
  }
  if (item.status === 'completed') {
    return isTimestamp(item.startedAt) && isTimestamp(item.completedAt) &&
      item.completedAt >= item.startedAt && item.cancelledAt === undefined;
  }
  return isTimestamp(item.cancelledAt) && item.startedAt === undefined && item.completedAt === undefined;
}

/** Data penyimpanan diperiksa sebelum dipakai; null berarti gunakan data awal. */
export function restoreQueueState(value: unknown): QueueState | null {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (
    !Array.isArray(candidate.customers) || !candidate.customers.every(isCustomer) ||
    !Number.isSafeInteger(candidate.nextTicket) || (candidate.nextTicket as number) < 1
  ) return null;

  const customers = candidate.customers as Customer[];
  const tickets = new Set<number>();
  let activeCount = 0;

  for (const customer of customers) {
    if (tickets.has(customer.ticketNumber) || customer.ticketNumber >= (candidate.nextTicket as number)) return null;
    tickets.add(customer.ticketNumber);
    if (customer.status === 'in_service') activeCount += 1;
  }

  if (activeCount > 1) return null;
  return {
    customers: sortByTicket(customers.map((customer) => ({ ...customer }))),
    nextTicket: candidate.nextTicket as number,
  };
}
