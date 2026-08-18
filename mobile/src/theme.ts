import { StyleSheet } from 'react-native';

export const colors = {
  background: '#f5f8fc',
  surface: '#ffffff',
  ink: '#172033',
  muted: '#64748b',
  border: '#d9e2ef',
  primary: '#0ea5e9',
  primarySoft: '#e0f2fe',
  accent: '#facc15',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f97316',
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 18, shadowColor: '#1e293b', shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, padding: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, color: colors.ink, fontSize: 16, padding: 15 },
});
