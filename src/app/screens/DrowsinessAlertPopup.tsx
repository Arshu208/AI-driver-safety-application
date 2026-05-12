import { useNavigate } from 'react-router';
import { AlertTriangle, Coffee, Volume2, X } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function DrowsinessAlertPopup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-background to-warning/10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard glow="warning" className="mb-6 pulse-danger border-2 border-warning">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-full bg-warning/20 flex items-center justify-center glow-warning mb-6"
            >
              <AlertTriangle className="w-12 h-12 text-warning" />
            </motion.div>

            <h1 className="text-warning mb-3">Drowsiness Detected</h1>
            <p className="text-muted-foreground mb-6">
              Signs of fatigue detected. Please pull over and take a break for your safety.
            </p>

            <GlassCard className="mb-6 bg-warning/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Fatigue Level</span>
                <span className="text-warning">High (78%)</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-warning"
                />
              </div>
            </GlassCard>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-warning">
                <Volume2 className="w-4 h-4" />
                <span>Voice alert activated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coffee className="w-4 h-4" />
                <span>Nearest rest stop: 2.4 miles</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button fullWidth variant="warning" onClick={() => navigate('/nearby-hospitals')}>
                Find Rest Stop
              </Button>
              <Button fullWidth variant="ghost" onClick={() => navigate('/active-session')}>
                I'm Alert - Continue
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
