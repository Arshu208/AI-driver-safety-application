import { Eye, Activity, TrendingDown, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function BlinkRateAnalysis() {
  const blinkData = [
    { time: '10:00', rate: 18 },
    { time: '10:30', rate: 17 },
    { time: '11:00', rate: 19 },
    { time: '11:30', rate: 16 },
    { time: '12:00', rate: 15 },
    { time: '12:30', rate: 14 },
    { time: '13:00', rate: 13 },
    { time: '13:30', rate: 12 },
    { time: '14:00', rate: 10 },
  ];

  const currentRate = blinkData[blinkData.length - 1].rate;
  const normalRange = { min: 15, max: 20 };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Blink Rate Analysis</h1>
        <p className="text-muted-foreground text-sm">Real-time eye blink monitoring</p>
      </div>

      <GlassCard glow="warning" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center glow-warning">
            <Eye className="w-8 h-8 text-warning" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl text-warning">{currentRate}</h2>
            <p className="text-sm text-muted-foreground">Blinks per minute</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Normal: {normalRange.min}-{normalRange.max}/min</span>
            <span className="text-warning">Below normal</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-warning w-[50%]" />
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Blink Rate Trend</h3>
      </div>

      <GlassCard className="mb-6">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={blinkData}>
              <defs>
                <linearGradient id="blinkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 25]} />
              <Area type="monotone" dataKey="rate" stroke="#ff6b00" fill="url(#blinkGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Blink rate over time</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Detailed Metrics</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Average Blink Rate</span>
            <span className="text-sm text-warning">14.3/min</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-warning w-[72%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">28% below normal</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Blink Duration</span>
            <span className="text-sm text-success">0.22s</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[85%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Normal range: 0.1-0.4s</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Incomplete Blinks</span>
            <span className="text-sm text-warning">8%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-warning w-[8%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Slightly elevated</p>
        </GlassCard>

        <GlassCard className="bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-warning">Alert</p>
              <p className="text-xs text-muted-foreground">
                Your blink rate has decreased by 44% in the last 4 hours. Reduced blinking is a strong indicator of drowsiness and eye strain.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Recommendation</p>
              <p className="text-xs text-muted-foreground">
                Take a break and rest your eyes. Perform the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
