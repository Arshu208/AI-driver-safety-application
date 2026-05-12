import { Home, Activity, Shield, BarChart3, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Activity, label: 'Monitor', path: '/ai-monitoring-live' },
  { icon: Shield, label: 'Safety', path: '/active-session' },
  { icon: BarChart3, label: 'Analytics', path: '/daily-report' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-primary/20 backdrop-blur-xl">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary glow-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
