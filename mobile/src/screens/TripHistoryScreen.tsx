import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getTripHistory } from '../services/trip';
import { colors, styles } from '../theme';

type TripReport = {
  id: string;
  startedAt: string;
  endedAt?: string;
  safetyScore?: number;
  fatigueLevel?: number;
  criticalAlerts?: number;
  highAlerts?: number;
};

export default function TripHistoryScreen() {
  const { user } = useAuth();
  const [reports, setReports] = useState<TripReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadReports = async () => {
      try {
        if (!user?.id) return;
        const response = await getTripHistory(user.id);
        if (mounted) {
          setReports(response.data?.trips ?? []);
          setError('');
        }
      } catch (error) {
        console.warn('Failed to load trip history', error);
        if (mounted) setError('Failed to load reports from backend API.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadReports();
    return () => { mounted = false; };
  }, [user?.id]);

  const recentReports = reports.slice(0, 5);
  const averageFatigue = reports.length ? Math.round(reports.reduce((sum, item) => sum + (item.fatigueLevel ?? 0), 0) / reports.length) : 0;
  const averageSafety = reports.length ? Math.round(reports.reduce((sum, item) => sum + (item.safetyScore ?? 0), 0) / reports.length) : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Safety Reports</Text>
        <Text style={styles.subtitle}>Driver-specific report cards and recent performance charts from the shared backend.</Text>

        {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />}
        {!!error && (
          <View style={[styles.card, { marginTop: 16 }]}> 
            <Text style={{ color: colors.danger }}>{error}</Text>
          </View>
        )}

        {reports.length > 0 && (
          <View style={[styles.card, { marginTop: 16 }]}> 
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Recent driver summary</Text>
            <Text style={{ color: colors.muted }}>Total reports: {reports.length}</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>Average fatigue: {averageFatigue}%</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>Average safety score: {averageSafety}</Text>
          </View>
        )}

        {recentReports.length > 0 && (
          <View style={[styles.card, { marginTop: 16 }]}> 
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Recent performance chart</Text>
            {recentReports.map((item, index) => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.muted, marginBottom: 4 }}>{new Date(item.startedAt).toLocaleDateString()} • Safety {item.safetyScore ?? '—'} • Fatigue {item.fatigueLevel ?? '—'}%</Text>
                <View style={{ height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                  <View style={{ width: `${Math.min(item.safetyScore ?? 0, 100)}%`, height: '100%', backgroundColor: colors.success }} />
                </View>
              </View>
            ))}
          </View>
        )}

        {!loading && reports.length === 0 ? (
          <View style={[styles.card, { marginTop: 20 }]}> 
            <Text style={{ color: colors.muted }}>No trip reports available yet.</Text>
          </View>
        ) : (
          <View style={{ marginTop: 14 }}>
            {reports.map((item) => (
              <View key={item.id} style={[styles.card, { marginBottom: 12 }]}> 
                <Text style={{ fontSize: 16, fontWeight: '700' }}>{new Date(item.startedAt).toLocaleString()}</Text>
                <Text style={{ color: colors.muted, marginTop: 6 }}>Fatigue: {item.fatigueLevel ?? '—'}%</Text>
                <Text style={{ color: colors.muted, marginTop: 6 }}>Critical alerts: {item.criticalAlerts ?? 0}</Text>
                <Text style={{ color: colors.muted, marginTop: 6 }}>Safety score: {item.safetyScore ?? '—'}</Text>
                <View style={{ height: 8, backgroundColor: '#e2e8f0', borderRadius: 8, overflow: 'hidden', marginTop: 12 }}>
                  <View style={{ width: `${Math.min(item.fatigueLevel ?? 0, 100)}%`, height: '100%', backgroundColor: item.fatigueLevel && item.fatigueLevel >= 80 ? colors.danger : colors.success }} />
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => { setLoading(true); setError(''); if (user?.id) { void getTripHistory(user.id).then((response) => setReports(response.data?.trips ?? [])).catch(() => setError('Failed to refresh reports from backend API.')).finally(() => setLoading(false)); } }}>
          <Text style={styles.buttonText}>{loading ? 'Refreshing...' : 'Refresh reports'}</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}
