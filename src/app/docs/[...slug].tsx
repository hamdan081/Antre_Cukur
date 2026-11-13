import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, EmptyState, Screen } from '../../components';
import { colors, styles as s } from '../../styles';

const MATERIAL: Record<string, { title: string; description: string; example: string }> = {
  'queue/manage': {
    title: 'Mengelola antrean',
    description: 'Tambahkan pelanggan dengan mengisi nama, memilih layanan, lalu menentukan kapster. Aplikasi akan memberikan nomor antrean berikutnya secara otomatis.',
    example: 'Nama pelanggan → layanan → kapster → masukkan antrean',
  },
  'queue/status': {
    title: 'Status pelayanan',
    description: 'Setiap pelanggan memiliki status agar petugas mudah mengetahui tahap pelayanan: menunggu, sedang dilayani, selesai, atau dibatalkan.',
    example: 'Menunggu → Sedang dilayani → Selesai',
  },
  'app/navigation': {
    title: 'Navigasi aplikasi',
    description: 'Gunakan menu Antrean untuk mengelola pelanggan yang sedang menunggu, Riwayat untuk melihat pelayanan sebelumnya, dan Layanan untuk melihat pilihan perawatan serta pengaturan.',
    example: 'Antrean | Riwayat | Layanan',
  },
  'app/storage': {
    title: 'Penyimpanan data',
    description: 'Data antrean disimpan secara lokal pada perangkat. Data tersebut tidak otomatis tersinkron ke perangkat lain atau server.',
    example: 'Penyimpanan lokal pada perangkat',
  },
};

/** Codelab 2: [...slug] menangkap satu atau banyak segmen URL sebagai array. */
export default function DocsSlug() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  const segments = Array.isArray(slug) ? slug : typeof slug === 'string' ? [slug] : [];
  const path = segments.join('/');
  const page = MATERIAL[path];

  return <Screen>
    <BrandHeader />
    <Text style={s.eyebrow}>PUSAT BANTUAN</Text>
    {page ? <>
      <Text style={s.title}>{page.title}</Text>
      <Text style={s.subtitle}>{page.description}</Text>
      <View style={s.serviceCard}>
        <Text style={s.label}>Ringkasan</Text>
        <Text selectable style={{ color: colors.green, lineHeight: 21 }}>{page.example}</Text>
      </View>
    </> : <EmptyState title="Topik belum tersedia" text="Topik ini belum memiliki panduan. Silakan kembali ke daftar panduan." />}
    
    <View style={{ gap: 12 }}>
      <ActionButton title="Kembali ke panduan" icon="arrow-back-outline" onPress={() => router.canGoBack() ? router.back() : router.replace('/docs')} />
      <ActionButton title="Daftar topik bantuan" icon="book-outline" outline onPress={() => router.replace('/docs')} />
    </View>
  </Screen>;
}
