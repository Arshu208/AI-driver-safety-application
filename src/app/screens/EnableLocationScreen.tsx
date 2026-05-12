import { useNavigate } from 'react-router';
import { MapPin, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function EnableLocationScreen() {
  const navigate = useNavigate();

  const handleEnable = () => {
    navigate('/enable-notifications');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 mx-auto rounded-full bg-accent/20 flex items-center justify-center glow-primary mb-8"
        >
          <MapPin className="w-16 h-16 text-accent" />
        </motion.div>

        <h2 className="text-center mb-4">Enable Location Access</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xs mx-auto">
          Location access helps us provide emergency assistance and track your driving routes.
        </p>

        <div className="space-y-3 mb-8">
          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Emergency SOS</p>
                <p className="text-xs text-muted-foreground">Share your location during emergencies</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Trip tracking</p>
                <p className="text-xs text-muted-foreground">Record and analyze your driving routes</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Nearby help</p>
                <p className="text-xs text-muted-foreground">Find hospitals and rest stops when needed</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleEnable}>
          Enable Location
        </Button>
        <button
          onClick={() => navigate('/enable-notifications')}
          className="w-full text-center text-muted-foreground text-sm py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
