import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, CreditCard, Palette, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function SettingsScreen() {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', path: '/create-profile', desc: 'Manage your personal information' },
        { icon: Bell, label: 'Notifications', path: '/notification-settings', desc: 'Alert preferences' },
        { icon: Shield, label: 'Privacy & Security', path: '/privacy-security', desc: 'Data and permissions' },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: CreditCard, label: 'Subscription', path: '/subscription', desc: 'Manage your plan' },
        { icon: Palette, label: 'Appearance', path: '/theme-customization', desc: 'Theme and display' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', path: '/home', desc: 'FAQs and guides' },
        { icon: LogOut, label: 'Sign Out', path: '/logout', desc: 'Log out of your account', danger: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">John Doe</h3>
            <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs uppercase">
              Pro Member
            </div>
          </div>
        </div>
      </GlassCard>

      {settingsGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <h3 className="mb-3">{group.title}</h3>
          <div className="space-y-2">
            {group.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <GlassCard
                  key={itemIndex}
                  className={item.danger ? 'border-destructive/30 hover:bg-destructive/5' : 'hover:bg-primary/5'}
                >
                  <button
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.danger ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                      <Icon className={`w-5 h-5 ${item.danger ? 'text-destructive' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm mb-0.5 ${item.danger ? 'text-destructive' : ''}`}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      ))}

      <div className="text-center text-xs text-muted-foreground mt-8">
        <p>RideSafe AI v1.0.0</p>
        <p className="mt-1">© 2026 RideSafe AI. All rights reserved.</p>
      </div>
    </div>
  );
}
