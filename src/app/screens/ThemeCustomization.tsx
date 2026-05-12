import { Palette, Moon, Sun, Smartphone } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function ThemeCustomization() {
  const themes = [
    { name: 'Auto', desc: 'Match system settings', icon: Smartphone, active: false },
    { name: 'Dark', desc: 'Dark mode (current)', icon: Moon, active: true },
    { name: 'Light', desc: 'Light mode', icon: Sun, active: false },
  ];

  const accentColors = [
    { name: 'Neon Blue', color: '#00d4ff', active: true },
    { name: 'Electric Cyan', color: '#22d3ee', active: false },
    { name: 'Deep Purple', color: '#7c3aed', active: false },
    { name: 'Safety Orange', color: '#ff6b00', active: false },
    { name: 'Emerald Green', color: '#10b981', active: false },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Appearance</h1>
        <p className="text-muted-foreground text-sm">Customize your app theme</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">Theme Settings</h3>
            <p className="text-sm text-muted-foreground">Dark Mode Active</p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-6">
        <h3 className="mb-3">Display Mode</h3>
        <div className="space-y-2">
          {themes.map((theme, index) => {
            const Icon = theme.icon;
            return (
              <GlassCard key={index} className={theme.active ? 'border-primary/30' : ''}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.active ? 'bg-primary/20' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${theme.active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">{theme.name}</p>
                    <p className="text-xs text-muted-foreground">{theme.desc}</p>
                  </div>
                  {theme.active && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Accent Color</h3>
        <div className="grid grid-cols-2 gap-3">
          {accentColors.map((color, index) => (
            <GlassCard key={index} className={color.active ? 'border-primary/30' : ''}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${color.color} 0%, ${color.color}80 100%)`,
                    boxShadow: color.active ? `0 0 20px ${color.color}40` : 'none',
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm">{color.name}</p>
                </div>
                {color.active && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3">Display Options</h3>
        <div className="space-y-2">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm mb-0.5">Glassmorphism Effects</p>
                <p className="text-xs text-muted-foreground">Blur and transparency</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full p-1 flex items-center justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm mb-0.5">Glow Effects</p>
                <p className="text-xs text-muted-foreground">Neon glows on cards</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full p-1 flex items-center justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm mb-0.5">Animations</p>
                <p className="text-xs text-muted-foreground">Smooth transitions</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full p-1 flex items-center justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="bg-primary/5 border border-primary/30">
        <p className="text-sm text-center mb-1">Preview Changes</p>
        <p className="text-xs text-muted-foreground text-center">
          Theme changes apply instantly across the app
        </p>
      </GlassCard>
    </div>
  );
}
