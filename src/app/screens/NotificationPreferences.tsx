import { Bell, Volume2, Vibrate, Mail } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function NotificationPreferences() {
  const notificationSettings = [
    {
      category: 'Safety Alerts',
      items: [
        { name: 'Drowsiness Detection', enabled: true, critical: true },
        { name: 'Microsleep Warnings', enabled: true, critical: true },
        { name: 'Distraction Alerts', enabled: true, critical: false },
        { name: 'Speed Warnings', enabled: false, critical: false },
      ],
    },
    {
      category: 'Trip Updates',
      items: [
        { name: 'Trip Start/End', enabled: true, critical: false },
        { name: 'Break Reminders', enabled: true, critical: false },
        { name: 'Daily Summaries', enabled: true, critical: false },
        { name: 'Weekly Reports', enabled: false, critical: false },
      ],
    },
    {
      category: 'General',
      items: [
        { name: 'Achievement Unlocked', enabled: true, critical: false },
        { name: 'Leaderboard Updates', enabled: false, critical: false },
        { name: 'App Updates', enabled: true, critical: false },
      ],
    },
  ];

  const channels = [
    { icon: Volume2, name: 'Voice Alerts', enabled: true },
    { icon: Vibrate, name: 'Vibration', enabled: true },
    { icon: Bell, name: 'Push Notifications', enabled: true },
    { icon: Mail, name: 'Email', enabled: false },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Notifications</h1>
        <p className="text-muted-foreground text-sm">Manage alert preferences</p>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Alert Channels</h3>
        <div className="grid grid-cols-2 gap-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <GlassCard key={index} className={channel.enabled ? 'border-primary/30' : ''}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${channel.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm">{channel.name}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-all ${channel.enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {notificationSettings.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6">
          <h3 className="mb-3">{section.category}</h3>
          <div className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <GlassCard key={itemIndex}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm">{item.name}</p>
                      {item.critical && (
                        <div className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] uppercase">
                          Critical
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${item.enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}>
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      <GlassCard className="bg-primary/5 border border-primary/30">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm mb-1">Safety First</p>
            <p className="text-xs text-muted-foreground">
              Critical safety alerts cannot be disabled to ensure your protection while driving.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
