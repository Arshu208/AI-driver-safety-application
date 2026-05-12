import { Calendar, Clock, MapPin, TrendingUp, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function DailyDrivingReport() {
  const tripData = [
    { time: '08:00', score: 95 },
    { time: '10:00', score: 92 },
    { time: '12:00', score: 88 },
    { time: '14:00', score: 85 },
    { time: '16:00', score: 90 },
    { time: '18:00', score: 93 },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Daily Report</h1>
        <p className="text-muted-foreground text-sm">May 11, 2026</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl">91</h2>
            <p className="text-sm text-muted-foreground">Average Safety Score</p>
          </div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tripData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} domain={[70, 100]} />
              <Area type="monotone" dataKey="score" stroke="#00d4ff" fill="url(#scoreGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">Safety score throughout the day</p>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Today's Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl mb-1">5.5h</p>
              <p className="text-xs text-muted-foreground">Driving Time</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xl mb-1">156</p>
              <p className="text-xs text-muted-foreground">Miles</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl mb-1">4</p>
              <p className="text-xs text-muted-foreground">Trips</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <span className="text-destructive">5</span>
            </div>
            <div>
              <p className="text-xl mb-1">5</p>
              <p className="text-xs text-muted-foreground">Alerts</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Trip Breakdown</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm mb-1">Morning Commute</p>
              <p className="text-xs text-muted-foreground">8:15 AM - 9:00 AM</p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mb-1">
                <span className="text-xs text-success">95</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>32 mi</span>
            <span>•</span>
            <span>45 min</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm mb-1">Lunch Trip</p>
              <p className="text-xs text-muted-foreground">12:30 PM - 1:15 PM</p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mb-1">
                <span className="text-xs text-success">88</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>15 mi</span>
            <span>•</span>
            <span>28 min</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm mb-1">Afternoon Errands</p>
              <p className="text-xs text-muted-foreground">3:00 PM - 4:30 PM</p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center mb-1">
                <span className="text-xs text-warning">85</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>42 mi</span>
            <span>•</span>
            <span>1h 12min</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm mb-1">Evening Commute</p>
              <p className="text-xs text-muted-foreground">6:00 PM - 7:15 PM</p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center mb-1">
                <span className="text-xs text-success">93</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>67 mi</span>
            <span>•</span>
            <span>1h 15min</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
