import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, EmptyState, formatRupiah, formatTime, Icon, Screen } from '../../components';
import { STATUS_LABELS } from '../../data';
import { formatTicket, getEstimatedWaitMinutes, getService } from '../../queue';
import { useQueue } from '../../QueueContext';
import { colors, styles as s } from '../../styles';

/** Modul 2: route dinamis /pelanggan/[id] membaca parameter route. */
export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { queue } = useQueue();
  const [now, setNow] = useState(() => Date.now());

  // useEffect: mengaktifkan jam saat halaman dibuka dan membersihkannya saat ditutup.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // useMemo: hitung kembali detail bila id atau daftar pelanggan berubah.
  const customer = useMemo(() => queue.customers.find((item) => item.id === id), [queue.customers, id]);

  function goBack() {
    // router.back() mengembalikan ke halaman asal; replace dipakai jika tidak ada riwayat.
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  if (!customer) return <Screen>
    <BrandHeader />
    <EmptyState title="Pelanggan tidak ditemukan" text="Nomor antrean ini mungkin sudah dihapus saat data direset." />
    <ActionButton title="Kembali ke antrean" icon="arrow-back-outline" onPress={goBack} />
  </Screen>;

  const service = getService(customer.serviceId);
  const waitMinutes = getEstimatedWaitMinutes(queue, customer.id, now);
  const finishedAt = customer.completedAt ?? customer.cancelledAt;

  return <Screen>
    <BrandHeader />
    <View style={{ gap: 6 }}>
      <Text style={s.eyebrow}>DETAIL PELANGGAN</Text>
      <Text style={s.title}>{formatTicket(customer.ticketNumber)}</Text>
      <Text style={s.subtitle}>Halaman ini mengambil parameter id menggunakan useLocalSearchParams().</Text>
    </View>
    <View style={s.serviceCard}>
      <View style={s.between}>
        <View style={[s.ticketBox, { width: 66, height: 66 }]}><Icon name="person-outline" size={30} /></View>
        <View style={[s.badge, { backgroundColor: customer.status === 'cancelled' ? colors.redBg : colors.pale }]}>
          <Text style={[s.badgeText, customer.status === 'cancelled' && { color: colors.red }]}>{STATUS_LABELS[customer.status]}</Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>{customer.name}</Text>
      <View style={s.between}><Text style={s.customerMeta}>Layanan</Text><Text style={s.amount}>{service.name}</Text></View>
      <View style={s.between}><Text style={s.customerMeta}>Harga</Text><Text style={s.amount}>{formatRupiah(service.price)}</Text></View>
      <View style={s.between}><Text style={s.customerMeta}>Durasi layanan</Text><Text style={s.amount}>{service.durationMinutes} menit</Text></View>
      <View style={s.between}><Text style={s.customerMeta}>Masuk antrean</Text><Text style={s.amount}>{formatTime(customer.createdAt)}</Text></View>
      {customer.startedAt !== undefined && <View style={s.between}><Text style={s.customerMeta}>Mulai dicukur</Text><Text style={s.amount}>{formatTime(customer.startedAt)}</Text></View>}
      {finishedAt !== undefined && <View style={s.between}><Text style={s.customerMeta}>Waktu akhir</Text><Text style={s.amount}>{formatTime(finishedAt)}</Text></View>}
      {waitMinutes !== null && <View style={s.note}><View style={s.row}><Icon name="time-outline" /><Text style={s.noteText}>Perkiraan tunggu: {waitMinutes} menit. Diperbarui setiap 30 detik oleh useEffect.</Text></View></View>}
    </View>
    <View style={{ gap: 11 }}>
      <ActionButton title="Kembali (router.back)" icon="arrow-back-outline" onPress={goBack} />
      {/* router.replace mengganti halaman detail dengan halaman antrean saat ini. */}
      <ActionButton title="Ke Antrean (router.replace)" icon="home-outline" outline onPress={() => router.replace('/')} />
    </View>
  </Screen>;
}
