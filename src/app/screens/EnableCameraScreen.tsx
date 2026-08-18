import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';

export default function EnableCameraScreen() {
  const navigate = useNavigate();

  const handleEnable = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      localStorage.setItem('ridesafe-camera-enabled', 'true');
    } catch {
      localStorage.removeItem('ridesafe-camera-enabled');
    }
    navigate('/enable-location');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-primary mb-8"
        >
          <Camera className="w-16 h-16 text-primary" />
        </motion.div>

        <h2 className="text-center mb-4">Enable Camera Access</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xs mx-auto">
          We need camera access to monitor your facial features and detect drowsiness in real-time.
        </p>

        <div className="space-y-3 mb-8">
          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Real-time face tracking</p>
                <p className="text-xs text-muted-foreground">Monitor facial movements and expressions</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Eye movement analysis</p>
                <p className="text-xs text-muted-foreground">Detect blink rate and eye closure duration</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <p className="text-sm mb-1">Yawn detection</p>
                <p className="text-xs text-muted-foreground">Identify signs of fatigue</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleEnable}>
          Enable Camera
        </Button>
        <button
          onClick={() => navigate('/enable-location')}
          className="w-full text-center text-muted-foreground text-sm py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
