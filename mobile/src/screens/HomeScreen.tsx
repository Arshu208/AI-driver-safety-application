import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/analytics';
import { colors, styles } from '../theme';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        const response = await getDashboard();
        if (mounted) setDashboard(response.data);
      } catch (error) {
        console.warn('Dashboard load failed', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadDashboard();
    return () => { mounted = false; };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ backgroundColor: colors.primary, borderRadius: 20, padding: 18, marginBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>Welcome back{user?.name ? `, ${user.name}` : ''}</Text>
        <Text style={{ color: '#fff', marginTop: 8, fontSize: 16 }}>{user?.vehicleNumber ? `Vehicle: ${user.vehicleNumber}` : 'No vehicle configured'}</Text>
        <Text style={{ color: '#fff', marginTop: 12, fontSize: 36, fontWeight: '900' }}>Safety Score: {user?.safetyScore ?? '—'}</Text>
      </View>

      <View style={[styles.card]}> 
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Live safety summary</Text>
        <Text style={{ color: colors.muted }}>Active trips: {dashboard?.activeDrivers ?? '—'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Critical alerts: {dashboard?.criticalAlertsToday ?? '—'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>High alerts: {dashboard?.highAlertsToday ?? '—'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Total alerts: {dashboard?.totalAlertsToday ?? '—'}</Text>
      </View>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Road safety overview</Text>
        <Text style={{ color: colors.muted }}>• Real-time blink monitoring</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>• Navigation assistance</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>• Rest stop and emergency support</Text>
      </View>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Quick actions</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 6 }]} onPress={() => navigation.navigate('Monitor')}>
            <Text style={styles.buttonText}>Live Monitoring</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 6 }]} onPress={() => navigation.navigate('Navigation')}>
            <Text style={styles.buttonText}>Navigation</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => navigation.navigate('Support')}>
          <Text style={styles.buttonText}>Rest & Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.buttonText}>Safety Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
