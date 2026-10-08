import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueue } from './QueueContext';
import { colors, styles as s } from './styles';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, color = colors.green, size = 20 }: { name: IconName; color?: ColorValue; size?: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function ActionButton({ title, onPress, icon, light = false, outline = false, disabled = false }: {
  title: string; onPress: () => void; icon?: IconName; light?: boolean; outline?: boolean; disabled?: boolean;
}) {
  const foreground = light ? colors.green : outline ? colors.ink : 'white';
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} onPress={onPress} disabled={disabled}
    style={({ pressed }) => [s.button, light && s.buttonLight, outline && s.buttonOutline, disabled && s.disabled, pressed && s.pressed]}>
    {icon && <Icon name={icon} color={foreground} size={18} />}
    <Text style={[s.buttonText, light && s.buttonLightText, outline && s.buttonOutlineText]}>{title}</Text>
  </Pressable>;
}

export function BrandHeader() {
  return <View style={s.header}>
    <View style={s.logo}><Icon name="cut-outline" color={colors.mint} size={25} /></View>
    <View style={s.grow}><Text style={s.brand}>AntreCukur</Text><Text style={[s.eyebrow, { marginTop: 3 }]}>BARBERSHOP QUEUE</Text></View>
    <View style={s.dateChip}><Text style={s.dateText}>Offline</Text></View>
  </View>;
}

export function Screen({ children }: PropsWithChildren) {
  const { ready, storageError, notice } = useQueue();
  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
    {ready ? <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{children}
      <View style={s.storageNote}><Icon name={storageError ? 'warning-outline' : 'phone-portrait-outline'} size={13} color={storageError ? colors.red : colors.muted} />
        <Text style={[s.smallText, storageError && { color: colors.red }]}>{storageError ? 'Penyimpanan belum tersedia' : 'Antrean tersimpan di perangkat ini'}</Text></View>
    </ScrollView> : <View style={[s.grow, { alignItems: 'center', justifyContent: 'center', gap: 10 }]}><ActivityIndicator color={colors.green} /><Text style={s.subtitle}>Membuka antrean…</Text></View>}
    {!!notice && <View style={s.toast} accessibilityLiveRegion="polite"><Text style={s.toastText}>{notice}</Text></View>}
  </SafeAreaView>;
}

export function EmptyState({ title, text, icon = 'people-outline' }: { title: string; text: string; icon?: IconName }) {
  return <View style={s.empty}><Icon name={icon} size={32} color={colors.muted} /><Text style={s.emptyTitle}>{title}</Text><Text style={s.emptyText}>{text}</Text></View>;
}

export function FilterTabs<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return <View style={s.filters}>{options.map((option) => <Pressable key={option.value} accessibilityRole="button" accessibilityLabel={option.label} accessibilityState={{ selected: value === option.value }}
    onPress={() => onChange(option.value)} style={[s.filter, value === option.value && s.filterActive]}>
    <Text style={[s.filterText, value === option.value && s.filterTextActive]}>{option.label}</Text>
  </Pressable>)}</View>;
}

export function formatRupiah(amount: number): string { return `Rp${amount.toLocaleString('id-ID')}`; }
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
