import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Play, Clock } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function TripStartConfirmation() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('2h 30m');

  const handleStartTrip = () => {
    navigate('/active-session');
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Start Driving Session</h1>
        <p className="text-muted-foreground text-sm">Configure your trip details</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Current Location</p>
            <p className="text-sm">San Francisco, CA</p>
          </div>
        </div>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Enter destination (optional)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </GlassCard>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Safety Checklist</h3>
      </div>

      <div className="space-y-3 mb-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm">Camera calibrated</span>
            </div>
            <span className="text-xs text-success">Ready</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm">AI monitoring active</span>
            </div>
            <span className="text-xs text-success">Active</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm">Location enabled</span>
            </div>
            <span className="text-xs text-success">On</span>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm">Emergency contacts set</span>
            </div>
            <span className="text-xs text-success">Configured</span>
          </div>
        </GlassCard>
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Trip Settings</h3>
      </div>

      <div className="space-y-3 mb-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-sm">Voice alerts</span>
            <div className="w-12 h-6 bg-primary rounded-full p-1 flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <span className="text-sm">Auto break reminders</span>
            <div className="w-12 h-6 bg-primary rounded-full p-1 flex items-center justify-end">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm mb-1">Break reminder interval</p>
              <p className="text-xs text-muted-foreground">Every 2 hours</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <Button fullWidth onClick={handleStartTrip}>
        <span className="flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          Start Trip
        </span>
      </Button>
    </div>
  );
}
