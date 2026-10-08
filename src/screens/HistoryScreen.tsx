import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { BrandHeader, EmptyState, FilterTabs, Icon, Screen } from '../components';
import { STATUS_LABELS } from '../data';
import { filterCustomers, formatTicket, getQueueSummary, getService } from '../queue';
import { useQueue } from '../QueueContext';
import { colors, styles as s } from '../styles';

export default function HistoryScreen() {
  const { queue } = useQueue();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const summary = getQueueSummary(queue);
  const customers = filterCustomers(queue, filter).filter((customer) =>
    (customer.status === 'completed' || customer.status === 'cancelled') &&
    `${customer.name} ${formatTicket(customer.ticketNumber)}`.toLowerCase().includes(search.trim().toLowerCase())).reverse();

  return <Screen>
    <BrandHeader />
    <View style={{ gap: 6 }}><Text style={s.eyebrow}>CATATAN PELAYANAN</Text><Text style={s.title}>Setiap giliran,{"\n"}tercatat.</Text><Text style={s.subtitle}>Riwayat seluruh pelanggan yang sudah diproses.</Text></View>
    <View style={s.stats}><View style={s.stat}><Icon name="checkmark-circle-outline" /><Text style={s.statNumber}>{summary.completed}</Text><Text style={s.statLabel}>Layanan selesai</Text></View>
      <View style={s.stat}><Icon name="close-circle-outline" color={colors.red} /><Text style={s.statNumber}>{summary.cancelled}</Text><Text style={s.statLabel}>Antrean dibatalkan</Text></View></View>
    <View style={s.search}><Icon name="search-outline" color={colors.muted} size={18} /><TextInput accessibilityLabel="Cari riwayat pelanggan" style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Cari nama atau nomor antrean" placeholderTextColor={colors.muted} /></View>
    <FilterTabs options={[{ value: 'all', label: 'Semua' }, { value: 'completed', label: 'Selesai' }, { value: 'cancelled', label: 'Dibatalkan' }]} value={filter} onChange={setFilter} />
    <View style={s.queueList}>{customers.map((customer) => {
      const cancelled = customer.status === 'cancelled';
      const timestamp = customer.completedAt ?? customer.cancelledAt ?? customer.createdAt;
      return <View style={s.customer} key={customer.id}><View style={s.row}>
        <View style={s.ticketBox}><Text style={s.ticketSmall}>{formatTicket(customer.ticketNumber)}</Text></View>
        <View style={s.grow}><Text style={s.customerName}>{customer.name}</Text><Text style={s.customerMeta}>{getService(customer.serviceId).name}</Text></View>
        <View style={[s.badge, { backgroundColor: cancelled ? colors.redBg : colors.pale }]}><Text style={[s.badgeText, { color: cancelled ? colors.red : colors.green }]}>{STATUS_LABELS[customer.status]}</Text></View>
      </View><View style={s.cardFooter}><Text style={s.smallText}>{new Date(timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text><View style={s.row}><Icon name={cancelled ? 'close-circle-outline' : 'checkmark-circle-outline'} size={14} color={colors.muted} />
        <Text style={s.smallText}>{new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Text></View></View></View>;
    })}
      {customers.length === 0 && <EmptyState icon="receipt-outline" title={search ? 'Riwayat tidak ditemukan' : 'Belum ada riwayat'} text={search ? 'Coba kata pencarian yang lain.' : 'Pelanggan yang selesai atau dibatalkan akan muncul di sini.'} />}
    </View>
  </Screen>;
}
