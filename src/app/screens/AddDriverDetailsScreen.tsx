import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Hash, Phone, Users } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function AddDriverDetailsScreen() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState({
    licenseNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
  });

  const handleFinish = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="mb-2">Driver Details</h1>
          <p className="text-muted-foreground">Add important driver information for safety</p>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Driver's license number"
                value={driver.licenseNumber}
                onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Emergency contact name"
                value={driver.emergencyContact}
                onChange={(e) => setDriver({ ...driver, emergencyContact: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <input
                type="tel"
                placeholder="Emergency contact phone"
                value={driver.emergencyPhone}
                onChange={(e) => setDriver({ ...driver, emergencyPhone: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <select
                value={driver.bloodType}
                onChange={(e) => setDriver({ ...driver, bloodType: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground"
              >
                <option value="" disabled>Blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </GlassCard>

          <Button fullWidth onClick={handleFinish}>
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
