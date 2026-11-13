import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useBarbers } from '../BarberContext';
import { ActionButton, BrandHeader, EmptyState, FilterTabs, Icon, Screen, formatTime } from '../components';
import { AddCustomerDialog, ConfirmDialog } from '../dialogs';
import { STATUS_LABELS } from '../data';
import {
  callNextCustomer,
  cancelWaitingCustomer,
  filterCustomers,
  finishCurrentCustomer,
  formatTicket,
  getCurrentCustomer,
  getEstimatedWaitMinutes,
  getNextCustomer,
  getQueueSummary,
  getService,
} from '../queue';
import { useQueue } from '../QueueContext';
import { colors, styles as s } from '../styles';
import type { Customer } from '../types';

export default function QueueScreen() {
  const router = useRouter();
  const { queue, runAction, ready } = useQueue();
  const { barbers } = useBarbers();
  const [filter, setFilter] = useState<'all' | 'waiting'>('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Customer | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const summary = getQueueSummary(queue, now);
  const waitingCustomers = filterCustomers(queue, 'waiting');
  const nextWaitValues = waitingCustomers
    .map((customer) => getEstimatedWaitMinutes(queue, customer.id, now) ?? Number.POSITIVE_INFINITY);
  const nearestWait = nextWaitValues.length > 0 ? Math.min(...nextWaitValues) : 0;
  const customers = filterCustomers(queue, filter).filter((customer) =>
    (customer.status === 'waiting' || customer.status === 'in_service') &&
    `${customer.name} ${formatTicket(customer.ticketNumber)} ${customer.barberName}`.toLowerCase().includes(search.trim().toLowerCase()));

  return <View style={s.root}>
    <Screen>
      <BrandHeader />
      <View style={{ gap: 6 }}>
        <Text style={s.eyebrow}>{new Date(now).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Text>
        <Text style={s.title}>Giliran rapi.{"\n"}Cukur nyaman.</Text>
        <Text style={s.subtitle}>Pilih kapster saat mendaftar. Setiap kapster memiliki antrean dan giliran layanan masing-masing.</Text>
      </View>

      <View style={s.stats}>
        <View style={s.stat}><Icon name="people-outline" size={18} /><Text style={s.statNumber}>{summary.waiting}</Text><Text style={s.statLabel}>Menunggu</Text></View>
        <View style={s.stat}><Icon name="cut-outline" size={18} /><Text style={s.statNumber}>{summary.inService}</Text><Text style={s.statLabel}>Sedang dilayani</Text></View>
        <View style={s.stat}><Icon name="time-outline" size={18} /><Text style={s.statNumber}>{nearestWait}<Text style={{ fontSize: 11, fontWeight: '500' }}> mnt</Text></Text><Text style={s.statLabel}>Tunggu terdekat</Text></View>
      </View>

      <View style={{ gap: 12 }}>
        <View style={s.between}>
          <Text style={s.sectionTitle}>Meja kerja kapster</Text>
          <View style={s.badge}><Text style={s.badgeText}>{barbers.length} kapster</Text></View>
        </View>
        {barbers.map((barber) => {
          const current = getCurrentCustomer(queue, barber.id);
          const next = getNextCustomer(queue, barber.id);
          const waitingCount = waitingCustomers.filter((customer) => customer.barberId === barber.id).length;
          const isServing = current !== null;
          return <View key={barber.id} style={s.serviceCard}>
            <View style={s.between}>
              <View style={s.grow}>
                <Text style={s.customerName}>{barber.name}</Text>
                <Text style={s.customerMeta}>{waitingCount} pelanggan menunggu</Text>
              </View>
              <View style={[s.badge, { backgroundColor: isServing ? colors.amberBg : colors.pale }]}>
                <Text style={[s.badgeText, { color: isServing ? colors.amber : colors.green }]}>{isServing ? 'Sedang melayani' : 'Siap melayani'}</Text>
              </View>
            </View>
            {current ? <View style={{ gap: 3, paddingVertical: 8 }}>
              <Text style={s.eyebrow}>PELANGGAN SAAT INI · {formatTicket(current.ticketNumber)}</Text>
              <Text style={s.sectionTitle}>{current.name}</Text>
              <Text style={s.customerMeta}>{getService(current.serviceId).name} · Mulai {formatTime(current.startedAt ?? current.createdAt)}</Text>
            </View> : <View style={{ gap: 3, paddingVertical: 8 }}>
              <Text style={s.eyebrow}>GILIRAN BERIKUTNYA</Text>
              <Text style={s.sectionTitle}>{next ? `${formatTicket(next.ticketNumber)} · ${next.name}` : 'Belum ada pelanggan'}</Text>
              <Text style={s.customerMeta}>{next ? `${getService(next.serviceId).name} · ${getService(next.serviceId).durationMinutes} menit` : 'Antrean kapster ini masih kosong.'}</Text>
            </View>}
            <ActionButton
              title={current ? 'Selesaikan layanan' : 'Panggil pelanggan berikutnya'}
              icon={current ? 'checkmark-circle-outline' : 'megaphone-outline'}
              outline={!current}
              light={!!current}
              disabled={!ready || (!current && !next)}
              onPress={() => current
                ? runAction((state) => finishCurrentCustomer(state, barber.id), `Layanan ${current.name} oleh ${barber.name} selesai.`)
                : runAction((state) => callNextCustomer(state, barber.id), `${next?.name ?? 'Pelanggan'} mulai dilayani ${barber.name}.`)}
            />
          </View>;
        })}
      </View>

      <View style={{ gap: 13 }}>
        <View style={s.between}><Text style={s.sectionTitle}>Daftar antrean</Text><View style={s.badge}><Text style={s.badgeText}>{summary.waiting + summary.inService} pelanggan aktif</Text></View></View>
        <View style={s.search}>
          <Icon name="search-outline" color={colors.muted} size={18} />
          <TextInput accessibilityLabel="Cari pelanggan, nomor antrean, atau kapster" style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Cari nama, nomor, atau kapster" placeholderTextColor={colors.muted} />
          {!!search && <Pressable accessibilityRole="button" accessibilityLabel="Hapus pencarian" onPress={() => setSearch('')} hitSlop={8}><Icon name="close-circle" color={colors.muted} size={18} /></Pressable>}
        </View>
        <FilterTabs options={[{ value: 'all', label: 'Semua antrean' }, { value: 'waiting', label: `Menunggu (${summary.waiting})` }]} value={filter} onChange={setFilter} />
        <View style={s.queueList}>
          {customers.map((customer) => {
            const service = getService(customer.serviceId);
            const waiting = customer.status === 'waiting';
            const waitMinutes = getEstimatedWaitMinutes(queue, customer.id, now);
            return <View key={customer.id} style={s.customer}>
              <View style={s.row}>
                <View style={s.ticketBox}><Text style={s.ticketSmall}>{formatTicket(customer.ticketNumber)}</Text></View>
                <View style={s.grow}>
                  <Text style={s.customerName}>{customer.name}</Text>
                  <Text style={s.customerMeta}>{service.name} · {service.durationMinutes} menit</Text>
                  <Text style={s.smallText}>{customer.barberName}</Text>
                </View>
                <View style={[s.badge, { backgroundColor: waiting ? colors.amberBg : colors.pale }]}>
                  <Text style={[s.badgeText, { color: waiting ? colors.amber : colors.green }]}>{waiting ? STATUS_LABELS.waiting : STATUS_LABELS.in_service}</Text>
                </View>
              </View>
              <View style={s.cardFooter}>
                <View style={[s.row, { flex: 1, flexWrap: 'wrap' }]}>
                  <Icon name={waiting ? 'time-outline' : 'cut-outline'} color={colors.muted} size={13} />
                  <Text style={s.smallText}>{waiting ? `Perkiraan tunggu ${waitMinutes ?? 0} menit` : 'Pelanggan sedang dilayani'}</Text>
                </View>
                <View style={s.row}>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Detail pelanggan ${customer.name}`} hitSlop={6}
                    style={s.cancelButton} onPress={() => router.push({ pathname: '/pelanggan/[id]', params: { id: customer.id } })}>
                    <Text style={[s.cancelText, { color: colors.green }]}>Detail ›</Text>
                  </Pressable>
                  {waiting && <Pressable accessibilityRole="button" accessibilityLabel={`Batalkan antrean ${customer.name}`} hitSlop={4} style={s.cancelButton} onPress={() => setCancelTarget(customer)}><Text style={s.cancelText}>Batalkan</Text></Pressable>}
                </View>
              </View>
            </View>;
          })}
          {customers.length === 0 && <EmptyState title={search ? 'Pelanggan tidak ditemukan' : filter === 'waiting' ? 'Belum ada yang menunggu' : 'Antrean masih kosong'} text={search ? 'Coba nama, nomor antrean, atau kapster lain.' : 'Tambahkan pelanggan baru lewat tombol di bawah.'} />}
        </View>
      </View>

      <View style={s.note}><View style={s.row}><Icon name="information-circle-outline" size={17} /><Text style={s.noteText}>Setiap kapster dapat melayani satu pelanggan pada satu waktu. Estimasi tunggu dihitung dari durasi layanan pada antrean kapster yang dipilih.</Text></View></View>
    </Screen>
    <View style={s.bottomAction}><ActionButton title="Tambah pelanggan" icon="add-outline" onPress={() => setShowAdd(true)} disabled={!ready} /></View>
    <AddCustomerDialog visible={showAdd} onClose={() => setShowAdd(false)} />
    <ConfirmDialog visible={!!cancelTarget} title="Batalkan antrean?" text={cancelTarget ? `${cancelTarget.name} (${formatTicket(cancelTarget.ticketNumber)}) untuk ${cancelTarget.barberName} akan dipindahkan ke riwayat pembatalan.` : ''}
      confirmTitle="Ya, batalkan antrean" onClose={() => setCancelTarget(null)} onConfirm={() => {
        if (cancelTarget) runAction((state) => cancelWaitingCustomer(state, cancelTarget.id), `Antrean ${cancelTarget.name} dibatalkan.`);
        setCancelTarget(null);
      }} />
  </View>;
}
