import { useEffect, useState } from 'react';
import { Truck, Users, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';
import { socket, connectSocket } from '../../services/socket';

export default function FleetManagementDashboard() {
  const fleetStats = {
    totalVehicles: 24,
    activeDrivers: 18,
    totalAlerts: 7,
    avgSafetyScore: 89,
  };

  const [recentAlerts, setRecentAlerts] = useState([
    { vehicle: 'Truck-042', driver: 'John Smith', alert: 'Drowsiness', severity: 'warning', time: '2 min ago' },
    { vehicle: 'Van-015', driver: 'Emma Davis', alert: 'Speed', severity: 'info', time: '15 min ago' },
    { vehicle: 'Truck-033', driver: 'Mike Chen', alert: 'Fatigue', severity: 'warning', time: '32 min ago' },
  ]);

  useEffect(() => {
    connectSocket();
    
    const handleFleetAlert = (data: any) => {
      setRecentAlerts(prev => [{
        vehicle: `Vehicle-${data.driverId.slice(-3)}`,
        driver: `Driver ${data.driverId.substring(0, 5)}`,
        alert: data.event.eventType.replace('_', ' '),
        severity: data.event.severity === 'CRITICAL' ? 'warning' : 'info',
        time: 'Just now'
      }, ...prev].slice(0, 10));
    };

    socket.on('fleetAlert', handleFleetAlert);

    return () => {
      socket.off('fleetAlert', handleFleetAlert);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Fleet Dashboard</h1>
        <p className="text-muted-foreground text-sm">Manage your fleet safety</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Fleet Overview</h3>
          <StatusBadge status="active" label="18 Active" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3 rounded-lg bg-primary/5">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Vehicles</span>
            </div>
            <p className="text-2xl text-primary">{fleetStats.totalVehicles}</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-success/5">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Drivers</span>
            </div>
            <p className="text-2xl text-success">{fleetStats.activeDrivers}</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-warning/5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Alerts</span>
            </div>
            <p className="text-2xl text-warning">{fleetStats.totalAlerts}</p>
          </div>

          <div className="glass-card p-3 rounded-lg bg-accent/5">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Avg Score</span>
            </div>
            <p className="text-2xl text-accent">{fleetStats.avgSafetyScore}</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Recent Alerts</h3>
      </div>

      <div className="space-y-3 mb-6">
        {recentAlerts.map((alert, index) => (
          <GlassCard key={index} className={alert.severity === 'warning' ? 'border-warning/30' : 'border-primary/30'}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>{alert.vehicle}</h4>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${alert.severity === 'warning' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'}`}>
                    {alert.alert}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{alert.driver}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <AlertTriangle className={`w-5 h-5 ${alert.severity === 'warning' ? 'text-warning' : 'text-primary'}`} />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="mb-3">Fleet Performance</h3>
      </div>

      <div className="space-y-3">
        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Average Safety Score</span>
            <span className="text-sm text-success">89/100</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[89%]" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Driver Compliance</span>
            <span className="text-sm text-success">94%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-success w-[94%]" />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Total Distance Today</span>
            <span className="text-sm text-primary">2,456 miles</span>
          </div>
        </GlassCard>

        <GlassCard className="bg-success/5 border border-success/30">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1 text-success">Performance Up</p>
              <p className="text-xs text-muted-foreground">
                Fleet safety score improved by 8% this month
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
