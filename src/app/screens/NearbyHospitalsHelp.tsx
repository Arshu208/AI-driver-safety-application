import { MapPin, Navigation, Phone, Clock, Heart } from 'lucide-react';
import Button from '../components/Button';
import GlassCard from '../components/GlassCard';

export default function NearbyHospitalsHelp() {
  const locations = [
    {
      type: 'Hospital',
      name: 'UCSF Medical Center',
      distance: '2.3 miles',
      eta: '8 min',
      phone: '(415) 476-1000',
      address: '505 Parnassus Ave, San Francisco',
      icon: Heart,
      color: 'destructive'
    },
    {
      type: 'Rest Stop',
      name: 'Golden Gate Rest Area',
      distance: '0.8 miles',
      eta: '3 min',
      phone: 'N/A',
      address: 'Highway 101 North',
      icon: MapPin,
      color: 'primary'
    },
    {
      type: 'Hospital',
      name: 'California Pacific Medical Center',
      distance: '3.1 miles',
      eta: '12 min',
      phone: '(415) 600-6000',
      address: '2333 Buchanan St, San Francisco',
      icon: Heart,
      color: 'destructive'
    },
    {
      type: 'Rest Stop',
      name: 'Bay View Parking & Rest',
      distance: '1.5 miles',
      eta: '5 min',
      phone: 'N/A',
      address: 'Mission St & 5th St',
      icon: MapPin,
      color: 'primary'
    },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Nearby Help</h1>
        <p className="text-muted-foreground text-sm">Find hospitals and rest stops</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">Your Location</h3>
            <p className="text-sm text-muted-foreground">Downtown San Francisco, CA</p>
          </div>
        </div>

        <Button fullWidth variant="ghost">
          <span className="flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            Update Location
          </span>
        </Button>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Nearby Locations ({locations.length})</h3>
      </div>

      <div className="space-y-3">
        {locations.map((location, index) => {
          const Icon = location.icon;

          return (
            <GlassCard key={index} className={location.type === 'Hospital' ? 'border-destructive/30' : 'border-primary/30'}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full bg-${location.color}/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${location.color}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{location.name}</h4>
                    <div className={`px-2 py-0.5 rounded-full bg-${location.color}/20 text-${location.color} text-[10px] uppercase`}>
                      {location.type}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{location.address}</p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{location.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{location.eta}</span>
                    </div>
                    {location.phone !== 'N/A' && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px]">{location.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="ghost">
                  <span className="flex items-center justify-center gap-1">
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </span>
                </Button>
                {location.phone !== 'N/A' && (
                  <Button size="sm" variant="ghost">
                    <span className="flex items-center justify-center gap-1">
                      <Phone className="w-4 h-4" />
                      Call
                    </span>
                  </Button>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
