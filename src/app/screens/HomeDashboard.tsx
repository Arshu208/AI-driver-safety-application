import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shield, TrendingUp, Clock, MapPin, Zap, Activity, Navigation, Coffee } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import AIStatusIndicator from '../components/AIStatusIndicator';
import Button from '../components/Button';
import { useMonitoringStore } from '../../store/monitoringStore';
import { useTripStore } from '../../store/tripStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { cleanupAlertAudio, getAlertAudioStatus, initializeAlertAudio } from '../../services/alertAudio';

const mockChartData = [
  { time: '10:00', score: 95 },
  { time: '10:15', score: 92 },
  { time: '10:30', score: 88 },
  { time: '10:45', score: 94 },
  { time: '11:00', score: 98 },
];

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { fatigueLevel, eyeStatus, isDrowsy } = useMonitoringStore();
  const startTrip = useTripStore((s) => s.startTrip);
  
  const [dashboardData, setDashboardData] = useState({
    activeDrivers: 1,
    criticalAlertsToday: 0,
    avgFleetSafetyScore: 100,
    fleetTrend: 'stable'
  });
  const [alertAudioStatus, setAlertAudioStatus] = useState(getAlertAudioStatus());
  const user = useAuthStore((s) => s.user) || JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Optionally connect socket.io here for real-time fatigue-alert
  }, []);

  const handleStartTrip = async () => {
    const audioInitialized = await initializeAlertAudio();
    setAlertAudioStatus(audioInitialized ? 'Alert Sound: Ready' : 'Alert Sound: Not Ready');
    try {
      const res = await api.post('/trips/start', { userId: user?.id });
      startTrip(res.data._id || res.data.id);
      navigate('/ai-monitoring-live');
    } catch (error) {
      console.error("Failed to start trip", error);
      cleanupAlertAudio();
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold gradient-text">Welcome back, {user?.name || 'Driver'}</h1>
          <p className="text-muted-foreground text-sm">Vehicle: {user?.vehicleNumber || 'Tesla Model 3'} | Safety Score: {user?.safetyScore || 100}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
          <span className="font-bold text-primary">{user?.name ? user.name.charAt(0).toUpperCase() : 'D'}</span>
        </div>
      </div>

      <GlassCard glow="primary" className="mb-6 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold">Live AI Detection Ready</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> GPS Online • Camera Active</p>
          </div>
          <StatusBadge status="safe" label="Ready" />
        </div>
        <Button fullWidth onClick={handleStartTrip}>
          <span className="flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Start Driving Session
          </span>
        </Button>
        <p className={`mt-3 text-center text-xs ${alertAudioStatus === 'Alert Sound: Ready' ? 'text-success' : 'text-destructive'}`} aria-live="polite">
          {alertAudioStatus}
        </p>
      </GlassCard>

      <div className="mb-6">
        <AIStatusIndicator fatigueLevel={Math.round(fatigueLevel)} eyeStatus={eyeStatus.includes('Open') ? 'open' : 'closed'} aiActive={true} />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <GlassCard className="border-primary/20 bg-primary/5">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary"><Navigation className="h-5 w-5" /></div>
            <div><h3 className="font-bold">Navigate safely</h3><p className="mt-1 text-xs text-muted-foreground">Plan a destination and keep route hazards visible.</p></div>
          </div>
          <Button fullWidth variant="secondary" onClick={() => navigate('/smart-navigation')}>Open navigation</Button>
        </GlassCard>
        <GlassCard className="border-accent/30 bg-accent/10">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground"><Coffee className="h-5 w-5" /></div>
            <div><h3 className="font-bold">Find a rest stop</h3><p className="mt-1 text-xs text-muted-foreground">Discover cafes, hotels, fuel stops, and nearby help.</p></div>
          </div>
          <Button fullWidth variant="ghost" onClick={() => navigate('/nearby-hospitals')}>Find rest places</Button>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Global Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl mb-1">{dashboardData.criticalAlertsToday}</p>
              <p className="text-xs text-muted-foreground">Critical Alerts</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl mb-1">{dashboardData.avgFleetSafetyScore}%</p>
              <p className="text-xs text-muted-foreground">Fleet Score</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-6">
        <GlassCard>
          <h4 className="mb-4 text-sm">Recent Safety Score Trend</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px'}} />
                <Line type="monotone" dataKey="score" stroke="#4ade80" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <div>
                <p className="text-sm">Safe trip completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
