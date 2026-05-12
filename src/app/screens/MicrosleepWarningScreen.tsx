import { useNavigate } from 'react-router';
import { AlertOctagon, Volume2, Zap, Shield } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function MicrosleepWarningScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-background to-destructive/10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard glow="danger" className="mb-6 pulse-danger border-2 border-destructive">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center glow-danger mb-6"
            >
              <AlertOctagon className="w-12 h-12 text-destructive" />
            </motion.div>

            <h1 className="text-destructive mb-3">MICROSLEEP ALERT!</h1>
            <p className="text-muted-foreground mb-6">
              Critical! You just experienced a microsleep episode. Pull over immediately!
            </p>

            <GlassCard className="mb-6 bg-destructive/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duration</span>
                  <span className="text-destructive">3.2 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Eye Closure</span>
                  <span className="text-destructive">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk Level</span>
                  <span className="text-destructive">CRITICAL</span>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Maximum alert activated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-destructive">
                <Zap className="w-4 h-4 animate-pulse" />
                <span>Vibration alert enabled</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-warning">
                <Shield className="w-4 h-4" />
                <span>Emergency contact notified</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth variant="danger" onClick={() => navigate('/emergency-sos')}>
                Emergency SOS
              </Button>
              <Button fullWidth variant="warning" onClick={() => navigate('/nearby-hospitals')}>
                Find Rest Stop Now
              </Button>
              <Button fullWidth variant="ghost" onClick={() => navigate('/trip-summary')}>
                End Trip
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
