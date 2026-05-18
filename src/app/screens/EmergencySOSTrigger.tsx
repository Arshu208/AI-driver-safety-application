import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Phone, MapPin, Clock, X } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function EmergencySOSTrigger() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [activated, setActivated] = useState(false);

  const handleActivateSOS = () => {
    setActivated(true);
    // Countdown logic would go here
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-b from-background to-destructive/10">
      <div className="w-full max-w-md">
        {!activated ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard glow="danger" className="mb-6 pulse-danger border-2 border-destructive">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center glow-danger mb-6"
                >
                  <AlertOctagon className="w-12 h-12 text-destructive" />
                </motion.div>

                <h1 className="text-destructive mb-4">Emergency SOS</h1>
                <p className="text-muted-foreground mb-6">
                  Activating SOS will alert emergency services and your emergency contacts with your current location.
                </p>

                <div className="space-y-3 mb-6">
                  <GlassCard className="bg-destructive/5">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-destructive" />
                      <span>Call 911</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-destructive/5">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-destructive" />
                      <span>Share live location</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-destructive/5">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-destructive" />
                      <span>Notify emergency contacts</span>
                    </div>
                  </GlassCard>
                </div>

                <div className="space-y-3">
                  <Button fullWidth variant="danger" onClick={handleActivateSOS}>
                    Activate SOS
                  </Button>
                  <Button fullWidth variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard glow="danger" className="pulse-danger border-2 border-destructive">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center glow-danger mb-6"
                >
                  <AlertOctagon className="w-12 h-12 text-destructive" />
                </motion.div>

                <h1 className="text-destructive mb-4">SOS ACTIVATED</h1>
                <p className="text-muted-foreground mb-6">
                  Emergency services have been notified. Help is on the way.
                </p>

                <div className="space-y-3 mb-6">
                  <GlassCard className="bg-success/5 border border-success/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm text-success">Location shared</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-success/5 border border-success/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm text-success">Emergency contacts notified</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="bg-primary/5 border border-primary/30">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm">Estimated arrival: 8 minutes</span>
                    </div>
                  </GlassCard>
                </div>

                <Button fullWidth variant="ghost" onClick={() => navigate('/home')}>
                  <span className="flex items-center justify-center gap-2">
                    <X className="w-5 h-5" />
                    Cancel SOS
                  </span>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
