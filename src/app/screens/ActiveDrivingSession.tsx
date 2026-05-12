import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { StopCircle, MapPin, Clock, Gauge, Eye } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import AIStatusIndicator from '../components/AIStatusIndicator';

export default function ActiveDrivingSession() {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState('01:23:45');
  const [distance, setDistance] = useState('42.3');
  const [speed, setSpeed] = useState('55');

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1>Active Trip</h1>
          <StatusBadge status="active" label="In Progress" pulse />
        </div>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl mb-1">{elapsedTime}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xl mb-1">{distance}</p>
            <p className="text-xs text-muted-foreground">Miles</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Gauge className="w-4 h-4 text-success" />
            </div>
            <p className="text-xl mb-1">{speed}</p>
            <p className="text-xs text-muted-foreground">MPH</p>
          </div>
        </div>

        <div className="glass-card p-3 rounded-lg bg-primary/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Route: San Francisco → Los Angeles</span>
            <span className="text-primary">45% complete</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary w-[45%]" />
          </div>
        </div>
      </GlassCard>

      <div className="mb-6">
        <AIStatusIndicator fatigueLevel={22} eyeStatus="open" aiActive={true} />
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Live Monitoring</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl mb-1">Open</p>
              <p className="text-xs text-muted-foreground">Eye Status</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl mb-1">18/min</p>
              <p className="text-xs text-muted-foreground">Blink Rate</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Quick Actions</h3>
      </div>

      <div className="space-y-3 mb-6">
        <Button fullWidth variant="ghost" onClick={() => navigate('/live-analytics')}>
          View Live Analytics
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/fatigue-score')}>
          Check Fatigue Score
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/nearby-hospitals')}>
          Find Rest Stop
        </Button>
      </div>

      <Button fullWidth variant="danger" onClick={() => navigate('/trip-summary')}>
        <span className="flex items-center justify-center gap-2">
          <StopCircle className="w-5 h-5" />
          End Trip
        </span>
      </Button>
    </div>
  );
}
