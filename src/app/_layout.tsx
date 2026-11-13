import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueueProvider } from '../QueueContext';
import { BarberProvider } from '../BarberContext';
import { colors, styles as s } from '../styles';

/** Modul 2: _layout.tsx mengatur Stack beserta judul setiap route. */
export default function RootLayout() {
  return <SafeAreaProvider><QueueProvider><BarberProvider><View style={s.root}><View style={s.appFrame}>
    <StatusBar style="dark" />
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.green,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: colors.background },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="barbers" options={{ title: 'Tim Kapster' }} />
      <Stack.Screen name="pelanggan/[id]" options={{ title: 'Detail Pelanggan' }} />
      <Stack.Screen name="usecontext_example" options={{ title: 'Pratinjau Tampilan' }} />
      <Stack.Screen name="docs/index" options={{ title: 'Panduan AntreCukur' }} />
      <Stack.Screen name="docs/[...slug]" options={{ title: 'Panduan AntreCukur' }} />
    </Stack>
  </View></View></BarberProvider></QueueProvider></SafeAreaProvider>;
}
