import { EyeOff, Smartphone, AlertTriangle, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';

export default function UnsafeDistractionDetection() {
  const distractions = [
    { type: 'Phone Usage', duration: '12s', severity: 'high', time: '14:32' },
    { type: 'Looking Away', duration: '8s', severity: 'medium', time: '14:15' },
    { type: 'Eyes Off Road', duration: '5s', severity: 'medium', time: '13:58' },
    { type: 'Phone Usage', duration: '18s', severity: 'high', time: '13:42' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Distraction Detection</h1>
        <p className="text-muted-foreground text-sm">AI monitoring of driver attention</p>
      </div>

      <GlassCard glow="danger" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Current Status</h3>
          <StatusBadge status="warning" label="Distractions Detected" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-lg bg-destructive/5">
            <div className="flex items-center gap-2 mb-1">
              <EyeOff className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Total Today</span>
            </div>
            <p className="text-2xl text-destructive">12</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-warning/5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <p className="text-2xl text-warning">43s</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Recent Distractions</h3>
      </div>

      <div className="space-y-3 mb-6">
        {distractions.map((item, index) => (
          <GlassCard key={index} className={item.severity === 'high' ? 'border-destructive/30' : 'border-warning/30'}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.severity === 'high' ? 'bg-destructive/20' : 'bg-warning/20'}`}>
                  {item.type === 'Phone Usage' ? (
                    <Smartphone className={`w-5 h-5 ${item.severity === 'high' ? 'text-destructive' : 'text-warning'}`} />
                  ) : (
                    <EyeOff className={`w-5 h-5 ${item.severity === 'high' ? 'text-destructive' : 'text-warning'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1">{item.type}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm ${item.severity === 'high' ? 'text-destructive' : 'text-warning'}`}>{item.duration}</p>
                <span className={`text-xs uppercase ${item.severity === 'high' ? 'text-destructive' : 'text-warning'}`}>
                  {item.severity}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Safety Insights</h3>
      </div>

      <div className="space-y-3">
        <GlassCard className="bg-destructive/5 border border-destructive/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-destructive">High-Risk Behavior Detected</p>
              <p className="text-xs text-muted-foreground">
                Phone usage while driving increased by 60% today. This significantly increases accident risk.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Eyes on Road</span>
            <span className="text-sm text-warning">87%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-warning w-[87%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Below safety threshold (95%)</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Longest Distraction</span>
            <span className="text-sm text-destructive">18 seconds</span>
          </div>
          <p className="text-xs text-muted-foreground">At 55mph, you traveled 440 feet blind</p>
        </GlassCard>

        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Tip</p>
              <p className="text-xs text-muted-foreground">
                Enable Do Not Disturb mode while driving. Use voice commands for essential tasks only.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
