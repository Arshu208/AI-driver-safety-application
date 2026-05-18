import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Shield, TrendingUp, Clock, MapPin, Zap, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import AIStatusIndicator from '../components/AIStatusIndicator';
import Button from '../components/Button';
import { useMonitoringStore } from '../../store/monitoringStore';
import { useTripStore } from '../../store/tripStore';
import { api } from '../../services/api';

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

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error("Failed to load dashboard data", err));
  }, []);

  const handleStartTrip = async () => {
    try {
      const res = await api.post('/trips/start', { userId: 'demo-user-id' });
      startTrip(res.data.id);
      navigate('/ai-monitoring-live');
    } catch (error) {
      console.error("Failed to start trip", error);
      startTrip('demo-trip-id');
      navigate('/ai-monitoring-live');
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Welcome back, Driver</h1>
        <p className="text-muted-foreground text-sm">Stay safe on your journey</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Quick Start</h3>
          <StatusBadge status="safe" label="Ready" />
        </div>
        <Button fullWidth onClick={handleStartTrip}>
          <span className="flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Start Driving Session
          </span>
        </Button>
      </GlassCard>

      <div className="mb-6">
        <AIStatusIndicator fatigueLevel={Math.round(fatigueLevel)} eyeStatus={eyeStatus.includes('Open') ? 'open' : 'closed'} aiActive={true} />
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
