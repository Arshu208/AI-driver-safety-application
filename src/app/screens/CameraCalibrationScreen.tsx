import { useState } from 'react';
import { Camera, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { motion } from 'motion/react';

export default function CameraCalibrationScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    { title: 'Position your face', desc: 'Center your face in the frame', icon: Camera },
    { title: 'Look straight ahead', desc: 'Maintain eye contact with camera', icon: CheckCircle },
    { title: 'Blink naturally', desc: 'Blink a few times normally', icon: CheckCircle },
    { title: 'Calibration complete', desc: 'Camera is ready to use', icon: CheckCircle },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Camera Calibration</h1>
        <p className="text-muted-foreground text-sm">Optimize AI detection for your setup</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />

          <motion.div
            animate={{
              scale: step === 1 ? [1, 1.05, 1] : 1,
              rotate: step === 2 ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-48 h-48 rounded-full border-4 border-dashed border-primary/50"
          >
            <div className="w-full h-full rounded-full border-4 border-primary glow-primary flex items-center justify-center">
              <Camera className="w-12 h-12 text-primary" />
            </div>
          </motion.div>

          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <CheckCircle className="w-16 h-16 text-success" />
            </motion.div>
          )}
        </div>

        <div className="text-center">
          <h3 className="mb-2">{steps[step - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[step - 1].desc}</p>
        </div>
      </GlassCard>

      <div className="space-y-3 mb-6">
        {steps.map((item, i) => {
          const Icon = item.icon;
          const isCompleted = i < step;
          const isCurrent = i === step - 1;

          return (
            <GlassCard key={i} className={isCurrent ? 'border-primary' : ''}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-success/20' : isCurrent ? 'bg-primary/20' : 'bg-muted'}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Button fullWidth onClick={handleNext}>
        <span className="flex items-center justify-center gap-2">
          {step < totalSteps ? 'Next Step' : 'Complete Calibration'}
          <ArrowRight className="w-5 h-5" />
        </span>
      </Button>
    </div>
  );
}
