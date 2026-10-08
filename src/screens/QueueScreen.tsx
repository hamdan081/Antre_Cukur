import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ActionButton, BrandHeader, EmptyState, FilterTabs, Icon, Screen, formatTime } from '../components';
import { AddCustomerDialog, ConfirmDialog } from '../dialogs';
import { STATUS_LABELS } from '../data';
import { callNextCustomer, cancelWaitingCustomer, filterCustomers, finishCurrentCustomer, formatTicket, getEstimatedWaitMinutes, getQueueSummary, getService } from '../queue';
import { useQueue } from '../QueueContext';
import { colors, styles as s } from '../styles';
import type { Customer } from '../types';

export default function QueueScreen() {
  const { queue, runAction, ready } = useQueue();
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
  const current = summary.currentCustomer;
  const customers = filterCustomers(queue, filter).filter((customer) =>
    (customer.status === 'waiting' || customer.status === 'in_service') &&
    `${customer.name} ${formatTicket(customer.ticketNumber)}`.toLowerCase().includes(search.trim().toLowerCase()));
  const nextWait = summary.nextCustomer ? getEstimatedWaitMinutes(queue, summary.nextCustomer.id, now) : 0;

  return <View style={s.root}>
    <Screen>
      <BrandHeader />
      <View style={{ gap: 6 }}><Text style={s.eyebrow}>{new Date(now).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Text>
        <Text style={s.title}>Giliran rapi.{"\n"}Cukur nyaman.</Text><Text style={s.subtitle}>Kelola pelanggan, satu giliran pada satu waktu.</Text></View>
      <View style={s.stats}>
        <View style={s.stat}><Icon name="people-outline" size={18} /><Text style={s.statNumber}>{summary.waiting}</Text><Text style={s.statLabel}>Menunggu</Text></View>
        <View style={s.stat}><Icon name="checkmark-circle-outline" size={18} /><Text style={s.statNumber}>{summary.completed}</Text><Text style={s.statLabel}>Selesai</Text></View>
        <View style={s.stat}><Icon name="time-outline" size={18} /><Text style={s.statNumber}>{nextWait ?? 0}<Text style={{ fontSize: 11, fontWeight: '500' }}> mnt</Text></Text><Text style={s.statLabel}>Giliran terdekat</Text></View>
      </View>
      <View style={s.hero}>
        <View style={[s.between, { flexWrap: 'wrap' }]}><Text style={s.heroEyebrow}>GILIRAN SAAT INI</Text><View style={s.heroBadge}><View style={s.dot} /><Text style={s.heroBadgeText}>{current ? 'Sedang dilayani' : 'Siap melayani'}</Text></View></View>
        {current ? <>
          <View style={s.between}><View style={s.grow}><Text style={s.heroTicket}>{formatTicket(current.ticketNumber)}</Text><Text style={s.heroName}>{current.name}</Text></View><View style={s.heroIcon}><Icon name="cut-outline" color={colors.mint} size={32} /></View></View>
          <Text style={s.heroMeta}>{getService(current.serviceId).name} · Mulai {formatTime(current.startedAt ?? current.createdAt)}</Text>
          <ActionButton title="Selesaikan layanan" icon="checkmark-circle-outline" light onPress={() => runAction(finishCurrentCustomer, `Layanan ${current.name} selesai.`)} disabled={!ready} />
        </> : <>
          <Text style={[s.heroName, { fontSize: 25 }]}>{summary.nextCustomer ? 'Kursi siap untuk giliran berikutnya.' : 'Semua sudah terlayani.'}</Text>
          <Text style={s.heroMeta}>{summary.nextCustomer ? `Berikutnya ${formatTicket(summary.nextCustomer.ticketNumber)} · ${summary.nextCustomer.name}` : 'Tambahkan pelanggan untuk memulai antrean.'}</Text>
          <ActionButton title="Panggil berikutnya" icon="megaphone-outline" light disabled={!ready || !summary.nextCustomer} onPress={() => runAction(callNextCustomer, 'Pelanggan berikutnya sedang dilayani.')} />
        </>}
      </View>
      <View style={{ gap: 13 }}>
        <View style={s.between}><Text style={s.sectionTitle}>Daftar antrean</Text><View style={s.badge}><Text style={s.badgeText}>{summary.waiting + summary.inService} pelanggan</Text></View></View>
        <View style={s.search}><Icon name="search-outline" color={colors.muted} size={18} /><TextInput accessibilityLabel="Cari pelanggan atau nomor antrean" style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Cari nama atau nomor antrean" placeholderTextColor={colors.muted} />
          {!!search && <Pressable accessibilityRole="button" accessibilityLabel="Hapus pencarian" onPress={() => setSearch('')} hitSlop={8}><Icon name="close-circle" color={colors.muted} size={18} /></Pressable>}</View>
        <FilterTabs options={[{ value: 'all', label: 'Semua antrean' }, { value: 'waiting', label: `Menunggu (${summary.waiting})` }]} value={filter} onChange={setFilter} />
        <View style={s.queueList}>
          {/* Array of objects ditampilkan memakai .map(): bagian loop untuk demo. */}
          {customers.map((customer) => {
            const service = getService(customer.serviceId);
            const waiting = customer.status === 'waiting';
            const waitMinutes = getEstimatedWaitMinutes(queue, customer.id, now);
            return <View key={customer.id} style={s.customer}>
              <View style={s.row}><View style={s.ticketBox}><Text style={s.ticketSmall}>{formatTicket(customer.ticketNumber)}</Text></View>
                <View style={s.grow}><Text style={s.customerName}>{customer.name}</Text><Text style={s.customerMeta}>{service.name} · {service.durationMinutes} menit</Text></View>
                {/* Inline style memberi warna berdasarkan status. */}
                <View style={[s.badge, { backgroundColor: waiting ? colors.amberBg : colors.pale }]}><Text style={[s.badgeText, { color: waiting ? colors.amber : colors.green }]}>{waiting ? STATUS_LABELS.waiting : 'Dilayani'}</Text></View>
              </View>
              <View style={s.cardFooter}><View style={s.row}><Icon name={waiting ? 'time-outline' : 'cut-outline'} color={colors.muted} size={13} /><Text style={s.smallText}>{waiting ? `Perkiraan tunggu ${waitMinutes} menit` : 'Pelanggan sedang dilayani'}</Text></View>
                {waiting && <Pressable accessibilityRole="button" accessibilityLabel={`Batalkan antrean ${customer.name}`} hitSlop={4} style={s.cancelButton} onPress={() => setCancelTarget(customer)}><Text style={s.cancelText}>Batalkan</Text></Pressable>}
              </View>
            </View>;
          })}
          {customers.length === 0 && <EmptyState title={search ? 'Pelanggan tidak ditemukan' : filter === 'waiting' ? 'Belum ada yang menunggu' : 'Antrean masih kosong'} text={search ? 'Coba nama atau nomor antrean lain.' : 'Tambahkan pelanggan baru lewat tombol di bawah.'} />}
        </View>
      </View>
      <View style={s.note}><View style={s.row}><Icon name="information-circle-outline" size={17} /><Text style={s.noteText}>Perkiraan tunggu mengikuti durasi layanan. Giliran tetap berurutan dan dipanggil oleh petugas.</Text></View></View>
    </Screen>
    <View style={s.bottomAction}><ActionButton title="Tambah pelanggan" icon="add-outline" onPress={() => setShowAdd(true)} disabled={!ready} /></View>
    <AddCustomerDialog visible={showAdd} onClose={() => setShowAdd(false)} />
    <ConfirmDialog visible={!!cancelTarget} title="Batalkan antrean?" text={cancelTarget ? `${cancelTarget.name} (${formatTicket(cancelTarget.ticketNumber)}) akan dipindahkan ke riwayat pembatalan.` : ''}
      confirmTitle="Ya, batalkan antrean" onClose={() => setCancelTarget(null)} onConfirm={() => {
        if (cancelTarget) runAction((state) => cancelWaitingCustomer(state, cancelTarget.id), `Antrean ${cancelTarget.name} dibatalkan.`);
        setCancelTarget(null);
      }} />
  </View>;
}
