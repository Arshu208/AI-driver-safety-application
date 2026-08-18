import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Smile, Frown, Angry, AlertTriangle, Activity, Camera } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function DriverEmotionDetection() {
  const [emotion, setEmotion] = useState('Neutral');
  const [stressLevel, setStressLevel] = useState(20);

  useEffect(() => {
    // Simulate real-time emotion detection
    const interval = setInterval(() => {
      const emotions = ['Neutral', 'Stressed', 'Fatigued', 'Angry', 'Distracted'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
      
      let newStress = stressLevel;
      if (randomEmotion === 'Stressed' || randomEmotion === 'Angry') newStress += 15;
      else if (randomEmotion === 'Neutral') newStress -= 10;
      
      setStressLevel(Math.max(0, Math.min(100, newStress)));
    }, 4000);
    return () => clearInterval(interval);
  }, [stressLevel]);

  const getEmotionColor = () => {
    switch (emotion) {
      case 'Neutral': return 'text-success';
      case 'Stressed': return 'text-warning';
      case 'Angry': return 'text-destructive';
      case 'Fatigued': return 'text-primary';
      case 'Distracted': return 'text-accent';
      default: return 'text-muted';
    }
  };

  const getEmotionIcon = () => {
    switch (emotion) {
      case 'Neutral': return <Smile className="w-12 h-12 text-success" />;
      case 'Angry': return <Angry className="w-12 h-12 text-destructive" />;
      case 'Stressed': return <AlertTriangle className="w-12 h-12 text-warning" />;
      case 'Fatigued': return <Activity className="w-12 h-12 text-primary" />;
      default: return <Frown className="w-12 h-12 text-accent" />;
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24 bg-background">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-1">Emotion Analysis</h1>
          <p className="text-muted-foreground text-sm">Real-time driver state monitoring</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <Camera className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 border border-white/10 glass-card">
        <img 
          src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop" 
          alt="Driver Feed" 
          className="w-full h-full object-cover opacity-50"
        />
        
        {/* Face tracking mesh overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border border-primary/50 rounded-[40%] bg-primary/10">
          {/* Micro-expression tracking dots */}
          <div className="absolute top-10 left-8 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute top-10 right-8 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute bottom-10 left-12 w-8 h-1 rounded-full bg-primary/80" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-white">68 LANDMARKS</span>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-white">60 FPS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="glass-card bg-black/40 border-white/10">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
            <motion.div 
              key={emotion}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-2"
            >
              {getEmotionIcon()}
            </motion.div>
            <h3 className={`text-xl font-bold ${getEmotionColor()}`}>{emotion}</h3>
            <p className="text-xs text-muted-foreground mt-1">Current State</p>
          </CardContent>
        </Card>

        <Card className="glass-card bg-black/40 border-white/10">
          <CardContent className="p-4 flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Stress Level</span>
              <span className="font-bold">{stressLevel}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
              <motion.div 
                className={`h-full ${stressLevel > 70 ? 'bg-destructive' : stressLevel > 40 ? 'bg-warning' : 'bg-success'}`}
                initial={{ width: 0 }}
                animate={{ width: `${stressLevel}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {stressLevel > 70 ? 'Take a break immediately' : stressLevel > 40 ? 'Slightly elevated' : 'Optimal driving state'}
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="font-bold text-lg mb-4">Emotion Timeline</h3>
      <div className="space-y-3">
        {[
          { time: 'Just now', state: emotion, desc: `Detected ${emotion.toLowerCase()} expressions.` },
          { time: '5 mins ago', state: 'Neutral', desc: 'Driver returned to a calm state.' },
          { time: '12 mins ago', state: 'Distracted', desc: 'Eyes off road for >3 seconds.' }
        ].map((log, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-xl glass-card border border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{log.state}</span>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{log.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
