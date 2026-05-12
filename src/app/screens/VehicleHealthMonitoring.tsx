import { Car, AlertTriangle, CheckCircle, Wrench, Gauge } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';

export default function VehicleHealthMonitoring() {
  const vehicles = [
    { id: 1, name: 'Truck-042', status: 'good', mileage: '45,230', lastService: '2 weeks ago', issues: 0 },
    { id: 2, name: 'Van-015', status: 'warning', mileage: '52,890', lastService: '1 month ago', issues: 2 },
    { id: 3, name: 'Truck-033', status: 'good', mileage: '38,450', lastService: '1 week ago', issues: 0 },
    { id: 4, name: 'Sedan-007', status: 'critical', mileage: '67,120', lastService: '3 months ago', issues: 4 },
    { id: 5, name: 'Truck-019', status: 'good', mileage: '41,780', lastService: '3 weeks ago', issues: 0 },
  ];

  const healthStats = {
    good: vehicles.filter(v => v.status === 'good').length,
    warning: vehicles.filter(v => v.status === 'warning').length,
    critical: vehicles.filter(v => v.status === 'critical').length,
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Vehicle Health</h1>
        <p className="text-muted-foreground text-sm">Fleet maintenance overview</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <h3 className="mb-4">Fleet Status</h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-3 rounded-lg bg-success/5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Good</span>
            </div>
            <p className="text-2xl text-success">{healthStats.good}</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-warning/5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Warning</span>
            </div>
            <p className="text-2xl text-warning">{healthStats.warning}</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-destructive/5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
            <p className="text-2xl text-destructive">{healthStats.critical}</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">All Vehicles</h3>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <GlassCard
            key={vehicle.id}
            className={
              vehicle.status === 'critical' ? 'border-destructive/30' :
              vehicle.status === 'warning' ? 'border-warning/30' : 'border-success/30'
            }
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                vehicle.status === 'critical' ? 'bg-destructive/20' :
                vehicle.status === 'warning' ? 'bg-warning/20' : 'bg-success/20'
              }`}>
                <Car className={`w-6 h-6 ${
                  vehicle.status === 'critical' ? 'text-destructive' :
                  vehicle.status === 'warning' ? 'text-warning' : 'text-success'
                }`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>{vehicle.name}</h4>
                  <StatusBadge
                    status={vehicle.status === 'critical' ? 'danger' : vehicle.status === 'warning' ? 'warning' : 'safe'}
                    label={vehicle.status}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    <span>{vehicle.mileage} mi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    <span>{vehicle.lastService}</span>
                  </div>
                </div>

                {vehicle.issues > 0 && (
                  <div className={`glass-card p-2 rounded-lg mt-2 ${
                    vehicle.status === 'critical' ? 'bg-destructive/5 border border-destructive/30' :
                    'bg-warning/5 border border-warning/30'
                  }`}>
                    <div className="flex items-center gap-2 text-xs">
                      <AlertTriangle className={`w-3 h-3 ${
                        vehicle.status === 'critical' ? 'text-destructive' : 'text-warning'
                      }`} />
                      <span className={vehicle.status === 'critical' ? 'text-destructive' : 'text-warning'}>
                        {vehicle.issues} issue{vehicle.issues > 1 ? 's' : ''} detected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
