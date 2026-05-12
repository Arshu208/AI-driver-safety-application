import { Frown, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function YawningDetectionAnalysis() {
  const yawnData = [
    { hour: '10:00', count: 0 },
    { hour: '11:00', count: 1 },
    { hour: '12:00', count: 0 },
    { hour: '13:00', count: 2 },
    { hour: '14:00', count: 5 },
    { hour: '15:00', count: 3 },
  ];

  const totalYawns = yawnData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Yawn Detection</h1>
        <p className="text-muted-foreground text-sm">AI-powered fatigue analysis</p>
      </div>

      <GlassCard glow="warning" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center glow-warning">
            <Frown className="w-8 h-8 text-warning" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl text-warning">{totalYawns}</h2>
            <p className="text-sm text-muted-foreground">Yawns detected today</p>
          </div>
        </div>

        <div className="glass-card p-3 rounded-lg bg-warning/5">
          <div className="flex items-center gap-2 text-sm text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span>Increased yawning frequency detected in last hour</span>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Yawn Frequency</h3>
      </div>

      <GlassCard className="mb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yawnData}>
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {yawnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count >= 3 ? '#ff6b00' : '#00d4ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Yawns per hour</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Analysis</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm mb-1">Peak Yawning Period</p>
              <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM (5 yawns)</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm mb-1">Average Duration</p>
              <p className="text-xs text-muted-foreground">2.8 seconds per yawn</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm mb-1">Consecutive Yawns</p>
              <p className="text-xs text-muted-foreground">3 detected in 10-minute window</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <Frown className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-warning">Recommendation</p>
              <p className="text-xs text-muted-foreground">
                Your yawning frequency suggests moderate fatigue. Consider taking a 15-20 minute break at the next rest stop.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
