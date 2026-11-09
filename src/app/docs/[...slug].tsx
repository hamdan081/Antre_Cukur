import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ActionButton, BrandHeader, EmptyState, Screen } from '../../components';
import { colors, styles as s } from '../../styles';

const MATERIAL: Record<string, { title: string; description: string; example: string }> = {
  'react/state': {
    title: 'State · useState',
    description: 'State menyimpan nilai yang dapat berubah; komponen dirender ulang ketika setter mengubahnya.',
    example: "const [search, setSearch] = useState('');",
  },
  'react/hooks': {
    title: 'Hooks · useEffect',
    description: 'useEffect menjalankan efek setelah render dan dapat membersihkan timer ketika layar ditutup.',
    example: 'useEffect(() => { const id = setInterval(refresh, 30000); return () => clearInterval(id); }, []);',
  },
  'routing/dynamic': {
    title: 'Routing · Dynamic Route',
    description: 'File pelanggan/[id].tsx dapat dibuka untuk banyak pelanggan melalui parameter id.',
    example: 'const { id } = useLocalSearchParams<{ id: string }>();',
  },
  'routing/stack': {
    title: 'Routing · Stack',
    description: 'Stack memegang urutan layar. push menambah layar, back kembali, sedangkan replace mengganti layar.',
    example: "router.push('/docs/react/state');  router.back();",
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
    <Text style={s.eyebrow}>DYNAMIC · CATCH-ALL ROUTE</Text>
    {page ? <>
      <Text style={s.title}>{page.title}</Text>
      <Text style={s.subtitle}>{page.description}</Text>
      <View style={s.serviceCard}>
        <Text style={s.label}>Contoh kode</Text>
        <Text selectable style={{ color: colors.green, fontFamily: 'monospace', lineHeight: 21 }}>{page.example}</Text>
      </View>
    </> : <EmptyState title="Materi tidak tersedia" text="Path ini belum memiliki materi. Kembali ke daftar dokumentasi." />}
    <View style={s.note}><Text style={s.noteText}>Parameter slug: [{segments.map((part) => `"${part}"`).join(', ')}] {'\n'}Path gabungan: /docs/{path}</Text></View>
    <View style={{ gap: 12 }}>
      <ActionButton title="Kembali (back)" icon="arrow-back-outline" onPress={() => router.canGoBack() ? router.back() : router.replace('/docs')} />
      <ActionButton title="Daftar Materi (replace)" icon="book-outline" outline onPress={() => router.replace('/docs')} />
    </View>
  </Screen>;
}
