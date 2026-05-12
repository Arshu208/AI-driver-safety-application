import { Gauge, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function DrivingBehaviorAnalysis() {
  const behaviorData = [
    { category: 'Speed', score: 92, color: '#10b981' },
    { category: 'Braking', score: 88, color: '#10b981' },
    { category: 'Turns', score: 85, color: '#22d3ee' },
    { category: 'Attention', score: 78, color: '#ff6b00' },
    { category: 'Distance', score: 95, color: '#10b981' },
  ];

  const overallScore = 88;

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Driving Behavior</h1>
        <p className="text-muted-foreground text-sm">Performance analysis</p>
      </div>

      <GlassCard glow="success" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center glow-success">
            <div className="text-center">
              <p className="text-2xl text-success">{overallScore}</p>
              <p className="text-[8px] text-success">SCORE</p>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="mb-1">Overall Performance</h3>
            <p className="text-sm text-muted-foreground mb-2">Excellent driving behavior</p>
            <div className="inline-block px-3 py-1 rounded-full bg-success/20 text-success text-xs uppercase">
              Grade: B+
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Behavior Breakdown</h3>
      </div>

      <GlassCard className="mb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
              <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={60} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {behaviorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Detailed Metrics</h3>
      </div>

      <div className="space-y-3 mb-6">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Speed Control</p>
                <span className="text-sm text-success">92/100</span>
              </div>
              <p className="text-xs text-muted-foreground">Maintains safe speeds, minimal violations</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Smooth Braking</p>
                <span className="text-sm text-success">88/100</span>
              </div>
              <p className="text-xs text-muted-foreground">Gradual stops, no hard braking</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Attention Level</p>
                <span className="text-sm text-warning">78/100</span>
              </div>
              <p className="text-xs text-muted-foreground">Occasional distractions detected</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">Following Distance</p>
                <span className="text-sm text-success">95/100</span>
              </div>
              <p className="text-xs text-muted-foreground">Maintains safe distance from other vehicles</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Areas for Improvement</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-warning">Minimize Distractions</p>
              <p className="text-xs text-muted-foreground">
                Reduce phone usage and maintain focus on the road to improve attention score
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
