import { useNavigate } from 'react-router-dom';
import { Volume2, Mic, MessageSquare, VolumeX } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function VoiceAssistantAlert() {
  const navigate = useNavigate();
  const [isSpeaking, setIsSpeaking] = useState(true);

  const alerts = [
    { time: '14:32', message: 'Driver, you appear drowsy. Consider taking a break.', severity: 'warning' },
    { time: '14:15', message: 'Your blink rate has increased. Stay alert.', severity: 'info' },
    { time: '13:58', message: 'Great driving! Keep it up.', severity: 'success' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Voice Assistant</h1>
        <p className="text-muted-foreground text-sm">AI safety coaching and alerts</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: isSpeaking ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary"
            >
              <Volume2 className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h3>RideSafe Assistant</h3>
              <p className="text-xs text-muted-foreground">{isSpeaking ? 'Speaking...' : 'Ready'}</p>
            </div>
          </div>
          <button onClick={() => setIsSpeaking(!isSpeaking)}>
            {isSpeaking ? (
              <Volume2 className="w-6 h-6 text-primary" />
            ) : (
              <VolumeX className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="glass-card p-4 rounded-lg bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-warning mt-1" />
            <div>
              <p className="text-sm mb-1">Current Alert</p>
              <p className="text-warning">
                "Your fatigue level is increasing. I recommend finding a rest stop in the next 10 minutes."
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Recent Alerts</h3>
      </div>

      <div className="space-y-3 mb-6">
        {alerts.map((alert, index) => (
          <GlassCard key={index}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'warning' ? 'bg-warning' : alert.severity === 'success' ? 'bg-success' : 'bg-primary'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <span className={`text-xs uppercase ${alert.severity === 'warning' ? 'text-warning' : alert.severity === 'success' ? 'text-success' : 'text-primary'}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Voice Commands</h3>
      </div>

      <div className="space-y-2 mb-6">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm">"How am I doing?"</span>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm">"Find rest stop"</span>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm">"Show my stats"</span>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary" />
            <span className="text-sm">"Emergency SOS"</span>
          </div>
        </GlassCard>
      </div>

      <Button fullWidth onClick={() => navigate('/ai-coach')}>
        Open AI Coach Chat
      </Button>
    </div>
  );
}
