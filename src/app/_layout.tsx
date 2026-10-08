import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueueProvider } from '../QueueContext';
import { styles as s } from '../styles';

export default function RootLayout() {
  return <SafeAreaProvider><QueueProvider><View style={s.root}><View style={s.appFrame}>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }} />
  </View></View></QueueProvider></SafeAreaProvider>;
}
