import { useState } from 'react';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, formatRupiah, Icon, Screen } from '../components';
import { ConfirmDialog } from '../dialogs';
import { SERVICES } from '../data';
import { useQueue } from '../QueueContext';
import { colors, styles as s } from '../styles';

export default function ServicesScreen() {
  const { resetQueue } = useQueue();
  const [resetMode, setResetMode] = useState<'demo' | 'empty' | null>(null);
  return <Screen>
    <BrandHeader />
    <View style={{ gap: 6 }}><Text style={s.eyebrow}>PILIHAN PERAWATAN</Text><Text style={s.title}>Rapi dari kepala.{"\n"}Ringkas di antrean.</Text><Text style={s.subtitle}>Tiga layanan untuk tampilan yang lebih segar.</Text></View>
    {SERVICES.map((service) => <View key={service.id} style={s.serviceCard}>
      <View style={s.row}><View style={s.serviceIcon}><Icon name={service.id === 'cuci' ? 'water-outline' : service.id === 'combo' ? 'sparkles-outline' : 'cut-outline'} size={25} /></View>
        <View style={s.grow}><Text style={[s.customerName, { fontSize: 17 }]}>{service.name}</Text><Text style={s.customerMeta}>{service.id === 'potong' ? 'Potongan rapi sesuai gaya pilihan.' : service.id === 'cuci' ? 'Bersih, segar, dan siap beraktivitas.' : 'Potong rambut dan cuci dalam satu giliran.'}</Text></View>
      </View><View style={[s.between, { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }]}><Text style={[s.amount, { fontSize: 20 }]}>{formatRupiah(service.price)}</Text><View style={s.row}><Icon name="time-outline" size={15} color={colors.muted} /><Text style={s.smallText}>± {service.durationMinutes} menit</Text></View></View>
    </View>)}
    <View style={s.note}><View style={s.row}><Icon name="information-circle-outline" /><Text style={s.noteText}>Satu pelanggan dilayani pada satu waktu. Durasi layanan adalah perkiraan untuk membantu menghitung waktu tunggu.</Text></View></View>
    <View style={{ gap: 12, marginTop: 5 }}><Text style={s.sectionTitle}>Kelola data antrean</Text><Text style={s.subtitle}>Mulai antrean baru atau kembalikan lima pelanggan contoh.</Text>
      <ActionButton title="Mulai antrean kosong" icon="refresh-outline" outline onPress={() => setResetMode('empty')} />
      <ActionButton title="Muat data contoh" icon="people-outline" outline onPress={() => setResetMode('demo')} />
    </View>
    <ConfirmDialog visible={resetMode !== null} title={resetMode === 'demo' ? 'Muat data contoh?' : 'Mulai antrean baru?'}
      text={resetMode === 'demo' ? 'Seluruh antrean dan riwayat yang tersimpan akan diganti dengan lima pelanggan contoh.' : 'Seluruh antrean dan riwayat yang tersimpan akan dihapus. Nomor antrean dimulai kembali dari A-001.'}
      confirmTitle={resetMode === 'demo' ? 'Ya, muat data contoh' : 'Ya, mulai antrean baru'} onClose={() => setResetMode(null)} onConfirm={() => { if (resetMode) resetQueue(resetMode); setResetMode(null); }} />
  </Screen>;
}
