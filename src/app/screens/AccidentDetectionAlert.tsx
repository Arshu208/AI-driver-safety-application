import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Clock, Shield } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function AccidentDetectionAlert() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-background to-destructive/10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard glow="danger" className="mb-6 pulse-danger border-2 border-destructive">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center glow-danger mb-6"
            >
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </motion.div>

            <h1 className="text-destructive mb-3">Accident Detected!</h1>
            <p className="text-muted-foreground mb-6">
              Sudden impact detected. Are you okay?
            </p>

            <div className="glass-card p-4 rounded-lg bg-warning/5 border border-warning/30 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-warning" />
                <div className="flex-1 text-left">
                  <p className="text-sm">Auto SOS in 30 seconds</p>
                  <p className="text-xs text-muted-foreground">Emergency services will be notified</p>
                </div>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 30, ease: "linear" }}
                  className="h-full bg-destructive"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <GlassCard className="bg-primary/5">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <div className="flex-1 text-left">
                    <p className="mb-1">Location Recorded</p>
                    <p className="text-xs text-muted-foreground">123 Main St, San Francisco, CA</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-primary/5">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Emergency contacts notified</span>
                </div>
              </GlassCard>
            </div>

            <div className="space-y-3">
              <Button fullWidth variant="danger" onClick={() => navigate('/emergency-sos')}>
                <span className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call 911 Now
                </span>
              </Button>

              <Button fullWidth variant="ghost" onClick={() => navigate('/home')}>
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  I'm OK - Cancel Alert
                </span>
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
