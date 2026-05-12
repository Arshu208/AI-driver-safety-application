import { TrendingUp, Clock, Shield, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function WeeklySafetyAnalytics() {
  const weekData = [
    { day: 'Mon', score: 92, alerts: 2 },
    { day: 'Tue', score: 88, alerts: 4 },
    { day: 'Wed', score: 95, alerts: 1 },
    { day: 'Thu', score: 85, alerts: 6 },
    { day: 'Fri', score: 91, alerts: 3 },
    { day: 'Sat', score: 96, alerts: 1 },
    { day: 'Sun', score: 93, alerts: 2 },
  ];

  const avgScore = Math.round(weekData.reduce((acc, curr) => acc + curr.score, 0) / weekData.length);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Weekly Analytics</h1>
        <p className="text-muted-foreground text-sm">May 5 - May 11, 2026</p>
      </div>

      <GlassCard glow="success" className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-5xl text-success mb-2">{avgScore}</h2>
          <p className="text-sm text-muted-foreground">Average Safety Score</p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-success/20 text-success text-xs uppercase">
            +5% from last week
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[70, 100]} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {weekData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 85 ? '#00d4ff' : '#ff6b00'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Daily safety scores</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Week Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl mb-1">32.5h</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xl mb-1">842</p>
              <p className="text-xs text-muted-foreground">Miles</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl mb-1">19</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl mb-1">5</p>
              <p className="text-xs text-muted-foreground">Safe Days</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Performance Trends</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-success/5 border border-success/30">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-success">Improved Performance</p>
              <p className="text-xs text-muted-foreground">
                Your safety score increased by 5% compared to last week. Keep up the good work!
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Best Day</span>
            <span className="text-sm text-success">Saturday (96)</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Most Alerts</span>
            <span className="text-sm text-warning">Thursday (6)</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Average Fatigue</span>
            <span className="text-sm text-primary">24%</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
