import { Zap, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function FatigueScoreDetail() {
  const fatigueScore = 22;
  const data = [
    { name: 'Alert', value: 78 },
    { name: 'Fatigued', value: 22 },
  ];

  const COLORS = ['#10b981', '#ff6b00'];

  const factors = [
    { name: 'Blink Rate', impact: 'Low', value: 15, color: 'success' },
    { name: 'Eye Closure', impact: 'Low', value: 18, color: 'success' },
    { name: 'Yawning', impact: 'Medium', value: 35, color: 'warning' },
    { name: 'Head Position', impact: 'Low', value: 12, color: 'success' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Fatigue Score</h1>
        <p className="text-muted-foreground text-sm">Detailed fatigue analysis</p>
      </div>

      <GlassCard glow="warning" className="mb-6">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <h2 className="text-4xl text-warning mb-2">{fatigueScore}%</h2>
            <p className="text-sm text-muted-foreground mb-2">Current fatigue level</p>
            <div className="inline-block px-3 py-1 rounded-full bg-warning/20 text-warning text-xs uppercase">
              Low-Medium
            </div>
          </div>
        </div>

        <div className="glass-card p-3 rounded-lg bg-warning/5">
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-warning" />
            <span>+8% increase in last 30 minutes</span>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Contributing Factors</h3>
      </div>

      <div className="space-y-3 mb-6">
        {factors.map((factor, index) => (
          <GlassCard key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{factor.name}</span>
              <span className={`text-sm text-${factor.color}`}>{factor.impact}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-${factor.color}`} style={{ width: `${factor.value}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{factor.value}% impact</p>
          </GlassCard>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Recommendations</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Take a break</p>
              <p className="text-xs text-muted-foreground">
                Consider stopping for 15-20 minutes at the next rest area
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-success/5 border border-success/30">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Stay hydrated</p>
              <p className="text-xs text-muted-foreground">
                Drink water to maintain alertness
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Monitor closely</p>
              <p className="text-xs text-muted-foreground">
                Your fatigue level is rising. Stay alert for any warning signs
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
