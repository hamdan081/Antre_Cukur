import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoState, createEmptyState } from '../src/data';
import {
  addCustomer,
  callNextCustomer,
  cancelWaitingCustomer,
  filterCustomers,
  finishCurrentCustomer,
  formatTicket,
  getEstimatedWaitMinutes,
  getQueueSummary,
  restoreQueueState,
} from '../src/queue';
import type { QueueActionResult, QueueState } from '../src/types';

const NOW = Date.UTC(2026, 9, 8, 6, 0);

function successState(result: QueueActionResult): QueueState {
  if (!result.ok) throw new Error(result.error);
  assert.equal(result.ok, true);
  return result.state;
}

test('lima pelanggan demo dan estimasi mempertimbangkan sisa layanan aktif', () => {
  const state = createDemoState(NOW);
  const summary = getQueueSummary(state, NOW);
  assert.equal(summary.total, 5);
  assert.equal(summary.waiting, 3);
  assert.equal(summary.inService, 1);
  assert.equal(summary.completed, 1);
  assert.equal(summary.cancelled, 0);
  assert.equal(summary.estimatedQueueMinutes, 75);
  assert.equal(summary.currentCustomer?.name, 'Andi');
  assert.equal(summary.nextCustomer?.name, 'Budi');
  assert.equal(getEstimatedWaitMinutes(state, 'antre-3', NOW), 15);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-4', NOW), 45);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-5', NOW), 65);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-2', NOW), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-1', NOW), null);
});

test('penambahan memvalidasi nama/layanan dan tidak mengubah state awal', () => {
  const state = createEmptyState();
  const result = addCustomer(state, '  Agus   Setiawan  ', 'cuci', NOW);
  const newState = successState(result);
  assert.equal(newState.customers[0].name, 'Agus Setiawan');
  assert.equal(newState.customers[0].id, 'antre-1');
  assert.equal(newState.nextTicket, 2);
  assert.equal(state.customers.length, 0);
  assert.equal(addCustomer(state, '   ', 'potong', NOW).ok, false);
  assert.equal(addCustomer(state, 'a'.repeat(41), 'potong', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'invalid', NOW).ok, false);
  assert.equal(addCustomer(state, 'Agus', 'potong', Number.NaN).ok, false);
});

test('nomor yang dibatalkan tidak dipakai lagi dan pelanggan aktif tidak dapat dibatalkan', () => {
  let state = createEmptyState();
  state = successState(addCustomer(state, 'Agus', 'potong', NOW));
  state = successState(cancelWaitingCustomer(state, 'antre-1', NOW));
  state = successState(addCustomer(state, 'Bayu', 'cuci', NOW));
  assert.equal(state.customers[1].ticketNumber, 2);
  assert.equal(state.nextTicket, 3);
  state = successState(callNextCustomer(state, NOW));
  assert.equal(cancelWaitingCustomer(state, 'antre-2', NOW).ok, false);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-1', NOW), null);
});

test('panggilan selalu mengikuti nomor terkecil meski array tersimpan tidak berurutan', () => {
  const demo = createDemoState(NOW);
  const reversed = { ...demo, customers: [...demo.customers].reverse() };
  assert.equal(callNextCustomer(reversed, NOW).ok, false);
  const finished = successState(finishCurrentCustomer(reversed, NOW));
  const next = callNextCustomer(finished, NOW);
  if (!next.ok) throw new Error(next.error);
  assert.equal(next.ok, true);
  assert.equal(next.customer.ticketNumber, 3);
  assert.equal(getQueueSummary(next.state, NOW).inService, 1);
  assert.equal(reversed.customers[3].status, 'in_service');
  assert.deepEqual(filterCustomers(reversed, 'waiting').map((item) => item.ticketNumber), [3, 4, 5]);
});

test('alur tambah-panggil-selesai memberikan status dan waktu yang benar', () => {
  let state = successState(addCustomer(createEmptyState(), 'Agus', 'combo', NOW));
  state = successState(callNextCustomer(state, NOW + 60_000));
  assert.equal(state.customers[0].startedAt, NOW + 60_000);
  state = successState(finishCurrentCustomer(state, NOW + 31 * 60_000));
  assert.equal(state.customers[0].status, 'completed');
  assert.equal(state.customers[0].completedAt, NOW + 31 * 60_000);
  assert.equal(callNextCustomer(state, NOW).ok, false);
  assert.equal(finishCurrentCustomer(state, NOW).ok, false);
});

test('estimasi tidak negatif ketika layanan aktif melewati estimasi durasi', () => {
  const state = createDemoState(NOW);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-3', NOW + 60 * 60_000), 0);
  assert.equal(getEstimatedWaitMinutes(state, 'antre-4', NOW + 60 * 60_000), 30);
  assert.equal(getQueueSummary(state, NOW + 60 * 60_000).estimatedQueueMinutes, 60);
});

test('pemulihan menerima JSON valid dan menolak nomor/status/waktu yang rusak', () => {
  const state = createDemoState(NOW);
  assert.deepEqual(restoreQueueState(JSON.parse(JSON.stringify(state))), state);
  assert.deepEqual(restoreQueueState(createEmptyState()), createEmptyState());
  assert.equal(restoreQueueState(null), null);
  assert.equal(restoreQueueState({ ...state, nextTicket: 5 }), null);
  assert.equal(restoreQueueState({ ...state, customers: [...state.customers, state.customers[0]] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[2], serviceId: 'wrong' }] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[2], name: '' }] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[2], status: 'in_service' }] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [state.customers[1], { ...state.customers[2], status: 'in_service', startedAt: NOW }] }), null);
  assert.equal(restoreQueueState({ ...state, customers: [{ ...state.customers[0], completedAt: state.customers[0].createdAt - 1 }] }), null);
});

test('label nomor tetap bertambah saat melewati tiga digit', () => {
  assert.equal(formatTicket(1), 'A-001');
  assert.equal(formatTicket(1000), 'A-1000');
});
