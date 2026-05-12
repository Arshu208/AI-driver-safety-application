import { Calendar, TrendingUp, Award, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function MonthlyPerformanceDashboard() {
  const monthData = [
    { week: 'Week 1', score: 88 },
    { week: 'Week 2', score: 90 },
    { week: 'Week 3', score: 92 },
    { week: 'Week 4', score: 91 },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Monthly Dashboard</h1>
        <p className="text-muted-foreground text-sm">May 2026</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-5xl text-primary mb-2">90</h2>
          <p className="text-sm text-muted-foreground">Monthly Average Score</p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs uppercase">
            Grade: A-
          </div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthData}>
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[80, 100]} />
              <Line type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Weekly progression</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Monthly Stats</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard>
          <div className="text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl mb-1">28</p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl mb-1">3,248</p>
            <p className="text-xs text-muted-foreground">Total Miles</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <Award className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl mb-1">12</p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-center">
            <Target className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl mb-1">68</p>
            <p className="text-xs text-muted-foreground">Total Alerts</p>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Monthly Highlights</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-success/5 border border-success/30">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏆</div>
            <div className="flex-1">
              <p className="text-sm mb-1 text-success">Top 10% Driver</p>
              <p className="text-xs text-muted-foreground">
                You're in the top 10% of safest drivers this month!
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-sm">Longest Trip</span>
            <span className="text-sm text-primary">248 miles</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-sm">Safest Week</span>
            <span className="text-sm text-success">Week 3 (92)</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-sm">Most Common Alert</span>
            <span className="text-sm text-warning">Drowsiness (42%)</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
