import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Briefcase, MapPin, Calendar } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function CreateProfileScreen() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    driverType: '',
    age: '',
    location: '',
    experience: '',
  });

  const handleContinue = () => {
    navigate('/enable-camera');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us personalize your experience</p>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <select
                value={profile.driverType}
                onChange={(e) => setProfile({ ...profile, driverType: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground"
              >
                <option value="" disabled>Select driver type</option>
                <option value="commuter">Daily Commuter</option>
                <option value="truck">Truck Driver</option>
                <option value="taxi">Taxi/Cab Driver</option>
                <option value="fleet">Fleet Operator</option>
                <option value="traveler">Long-Distance Traveler</option>
              </select>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <input
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Years of driving experience"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <Button fullWidth onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
