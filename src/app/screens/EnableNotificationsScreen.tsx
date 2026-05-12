import { useNavigate } from 'react-router';
import { Bell, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function EnableNotificationsScreen() {
  const navigate = useNavigate();

  const handleEnable = () => {
    navigate('/vehicle-setup');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 mx-auto rounded-full bg-warning/20 flex items-center justify-center glow-warning mb-8"
        >
          <Bell className="w-16 h-16 text-warning" />
        </motion.div>

        <h2 className="text-center mb-4">Enable Notifications</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xs mx-auto">
          Stay alert with instant notifications about your safety status and driving behavior.
        </p>

        <div className="space-y-3 mb-8">
          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Drowsiness alerts</p>
                <p className="text-xs text-muted-foreground">Get warned when signs of fatigue are detected</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Break reminders</p>
                <p className="text-xs text-muted-foreground">Receive suggestions to take rest stops</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Trip summaries</p>
                <p className="text-xs text-muted-foreground">Get notified about your driving performance</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleEnable}>
          Enable Notifications
        </Button>
        <button
          onClick={() => navigate('/vehicle-setup')}
          className="w-full text-center text-muted-foreground text-sm py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
