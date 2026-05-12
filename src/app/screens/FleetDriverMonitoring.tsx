import { User, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';

export default function FleetDriverMonitoring() {
  const drivers = [
    { id: 1, name: 'John Smith', vehicle: 'Truck-042', status: 'active', fatigueLevel: 35, safetyScore: 92, hours: '4.2h' },
    { id: 2, name: 'Emma Davis', vehicle: 'Van-015', status: 'active', fatigueLevel: 18, safetyScore: 96, hours: '2.8h' },
    { id: 3, name: 'Mike Chen', vehicle: 'Truck-033', status: 'active', fatigueLevel: 52, safetyScore: 78, hours: '6.5h' },
    { id: 4, name: 'Sarah Wilson', vehicle: 'Sedan-007', status: 'inactive', fatigueLevel: 0, safetyScore: 94, hours: '0h' },
    { id: 5, name: 'Tom Brown', vehicle: 'Truck-019', status: 'active', fatigueLevel: 22, safetyScore: 88, hours: '3.1h' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Driver Monitoring</h1>
        <p className="text-muted-foreground text-sm">Real-time driver status</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Active Drivers</h3>
            <p className="text-sm text-muted-foreground">4 of 5 drivers currently on the road</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <span className="text-xl text-primary">4</span>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">All Drivers</h3>
      </div>

      <div className="space-y-3">
        {drivers.map((driver) => {
          const isHighFatigue = driver.fatigueLevel >= 50;
          const isMediumFatigue = driver.fatigueLevel >= 30 && driver.fatigueLevel < 50;

          return (
            <GlassCard
              key={driver.id}
              className={isHighFatigue ? 'border-destructive/30' : isMediumFatigue ? 'border-warning/30' : ''}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4>{driver.name}</h4>
                    <StatusBadge
                      status={driver.status === 'active' ? 'active' : 'inactive'}
                      label={driver.status}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{driver.vehicle}</p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{driver.hours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-success" />
                      <span>Score: {driver.safetyScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {driver.status === 'active' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Fatigue Level</span>
                    <span className={isHighFatigue ? 'text-destructive' : isMediumFatigue ? 'text-warning' : 'text-success'}>
                      {driver.fatigueLevel}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isHighFatigue ? 'bg-destructive' : isMediumFatigue ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${driver.fatigueLevel}%` }}
                    />
                  </div>

                  {isHighFatigue && (
                    <div className="glass-card p-2 rounded-lg bg-destructive/5 border border-destructive/30 mt-2">
                      <div className="flex items-center gap-2 text-xs text-destructive">
                        <AlertTriangle className="w-3 h-3" />
                        <span>High fatigue - recommend break</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
