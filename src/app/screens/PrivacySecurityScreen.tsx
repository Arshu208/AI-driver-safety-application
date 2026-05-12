import { Shield, Lock, Eye, MapPin, Camera, Smartphone } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function PrivacySecurityScreen() {
  const permissions = [
    { icon: Camera, name: 'Camera Access', status: 'Granted', desc: 'For AI face monitoring' },
    { icon: MapPin, name: 'Location', status: 'Granted', desc: 'For trip tracking and SOS' },
    { icon: Smartphone, name: 'Notifications', status: 'Granted', desc: 'For safety alerts' },
  ];

  const privacySettings = [
    { name: 'Share usage data', enabled: true, desc: 'Help improve AI accuracy' },
    { name: 'Anonymous analytics', enabled: true, desc: 'Share anonymized driving data' },
    { name: 'Crash data sharing', enabled: true, desc: 'Share accident data to improve safety' },
  ];

  const securitySettings = [
    { name: 'Biometric login', enabled: false, desc: 'Use fingerprint or face ID' },
    { name: 'Two-factor authentication', enabled: false, desc: 'Extra account security' },
    { name: 'Auto-lock app', enabled: true, desc: 'Lock after 5 minutes' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Privacy & Security</h1>
        <p className="text-muted-foreground text-sm">Manage your data and permissions</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">Data Protected</h3>
            <p className="text-sm text-muted-foreground">End-to-end encryption enabled</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-6">
        <h3 className="mb-3">App Permissions</h3>
        <div className="space-y-2">
          {permissions.map((permission, index) => {
            const Icon = permission.icon;
            return (
              <GlassCard key={index}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">{permission.name}</p>
                    <p className="text-xs text-muted-foreground">{permission.desc}</p>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                    {permission.status}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Privacy Settings</h3>
        <div className="space-y-2">
          {privacySettings.map((setting, index) => (
            <GlassCard key={index}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm mb-0.5">{setting.name}</p>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${setting.enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Security</h3>
        <div className="space-y-2">
          {securitySettings.map((setting, index) => (
            <GlassCard key={index}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm mb-0.5">{setting.name}</p>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${setting.enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <button className="w-full flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm mb-0.5">View Privacy Policy</p>
              <p className="text-xs text-muted-foreground">Learn how we protect your data</p>
            </div>
          </button>
        </GlassCard>

        <GlassCard className="bg-destructive/5 border border-destructive/30">
          <button className="w-full flex items-center gap-3">
            <Lock className="w-5 h-5 text-destructive" />
            <div className="flex-1 text-left">
              <p className="text-sm text-destructive mb-0.5">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your data</p>
            </div>
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
