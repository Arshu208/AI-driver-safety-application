import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Car, Hash, Calendar, Palette } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function VehicleSetupScreen() {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
  });

  const handleContinue = () => {
    navigate('/add-driver-details');
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="mb-2">Vehicle Setup</h1>
          <p className="text-muted-foreground">Add your vehicle information</p>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Vehicle make (e.g., Toyota)"
                value={vehicle.make}
                onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Vehicle model (e.g., Camry)"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Year (e.g., 2022)"
                value={vehicle.year}
                onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="License plate"
                value={vehicle.licensePlate}
                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <input
                type="text"
                placeholder="Vehicle color"
                value={vehicle.color}
                onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
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
