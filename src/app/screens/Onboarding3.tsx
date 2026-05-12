import { useNavigate } from 'react-router';
import { Bell, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'motion/react';

export default function Onboarding3() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 rounded-full bg-warning/20 flex items-center justify-center glow-warning mb-8"
        >
          <Bell className="w-16 h-16 text-warning" />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mb-4">Smart Alerts</h2>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Receive instant voice and visual alerts when signs of drowsiness are detected, helping you stay alert and safe.
          </p>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-8 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>

        <Button fullWidth onClick={() => navigate('/onboarding-4')}>
          <span className="flex items-center justify-center gap-2">
            Next
            <ChevronRight className="w-5 h-5" />
          </span>
        </Button>

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-muted-foreground text-sm py-2"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
