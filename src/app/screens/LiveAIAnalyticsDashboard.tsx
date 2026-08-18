import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Eye, Activity, Shield, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';

export default function LiveAIAnalyticsDashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [fatigueData, setFatigueData] = useState([
    { time: '10:00', level: 5 },
    { time: '10:30', level: 8 },
    { time: '11:00', level: 12 },
    { time: '11:30', level: 15 },
    { time: '12:00', level: 18 },
    { time: '12:30', level: 22 },
  ]);

  useEffect(() => {
    // Connect to backend socket
    const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:5000`;
    const socket = io(SOCKET_URL);

    socket.on('fatigue-alert', (data) => {
      console.log('Received real-time alert:', data);
      setAlerts((prev) => [data, ...prev].slice(0, 3)); // Keep last 3 alerts
      
      // Update graph dynamically
      setFatigueData(prev => {
        const newData = [...prev.slice(1), { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          level: data.fatigueLevel || 30 
        }];
        return newData;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold gradient-text">Live AI Analytics</h1>
        <p className="text-muted-foreground text-sm">Real-time performance insights & active monitoring</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3>AI Analysis Active</h3>
            <p className="text-xs text-muted-foreground">Monitoring 68 facial landmarks</p>
          </div>
        </div>

        <div className="h-32 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fatigueData}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Line type="monotone" dataKey="level" stroke="#00d4ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-muted-foreground">Fatigue progression</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Current Metrics</h3>
      </div>

      <div className="space-y-3 mb-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm">Safety Score</span>
            </div>
            <span className="text-xl text-success">96</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[96%]" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-sm">Attention Level</span>
            </div>
            <span className="text-xl text-primary">92%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[92%]" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-success" />
              <span className="text-sm">Alertness</span>
            </div>
            <span className="text-xl text-success">High</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[88%]" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              <span className="text-sm">Fatigue Trend</span>
            </div>
            <span className="text-xl text-warning">Rising</span>
          </div>
          <p className="text-xs text-muted-foreground">+17% in last hour</p>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">AI Insights</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Performance Analysis</p>
              <p className="text-xs text-muted-foreground">
                Your driving performance is excellent. Maintain current alertness levels.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-warning">Fatigue Prediction</p>
              <p className="text-xs text-muted-foreground">
                Based on current trends, you may reach moderate fatigue in approximately 45 minutes.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {alerts.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3">Live Emergency Feed</h3>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <GlassCard key={idx} className="bg-destructive/10 border-destructive/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                  <div>
                    <p className="text-sm font-bold text-destructive">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
