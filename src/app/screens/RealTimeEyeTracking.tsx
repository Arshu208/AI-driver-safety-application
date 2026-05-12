import { Eye, Scan, Activity, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import { motion } from 'motion/react';

export default function RealTimeEyeTracking() {
  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Eye Tracking</h1>
        <p className="text-muted-foreground text-sm">Real-time eye movement analysis</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status="active" label="Tracking Active" />
          <div className="flex items-center gap-2 text-xs text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            REAL-TIME
          </div>
        </div>

        <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-24 rounded-full border-2 border-primary glow-primary"
            />

            <motion.div
              animate={{ x: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-12 h-12 rounded-full bg-accent/30 border-2 border-accent blur-sm"
            />

            <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-lg">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" />
                <span className="text-xs">Left Eye</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-lg">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-primary" />
                <span className="text-xs">Right Eye</span>
              </div>
            </div>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute"
            >
              <Target className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Gaze Direction</span>
            </div>
            <p className="text-success">Forward</p>
          </div>

          <div className="glass-card p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Pupil Size</span>
            </div>
            <p className="text-primary">4.2mm</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Eye Metrics</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Blink Rate</span>
            <span className="text-sm text-success">18 per min</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[70%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Normal range: 15-20/min</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Eye Openness</span>
            <span className="text-sm text-success">95%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[95%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Fully alert</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Closure Duration</span>
            <span className="text-sm text-success">0.18s</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[20%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Normal blink pattern</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Fixation Stability</span>
            <span className="text-sm text-success">High</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[85%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Steady gaze on road</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Saccade Frequency</span>
            <span className="text-sm text-primary">Normal</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[60%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Appropriate eye movement</p>
        </GlassCard>
      </div>
    </div>
  );
}
