import { Activity, BarChart3, ChevronRight, Compass, Home, LifeBuoy, Settings, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { label: 'Overview', path: '/home', icon: Home },
  { label: 'Live monitoring', path: '/ai-monitoring-live', icon: Activity },
  { label: 'Navigation', path: '/smart-navigation', icon: Compass },
  { label: 'Safety reports', path: '/daily-report', icon: BarChart3 },
  { label: 'Emergency support', path: '/emergency-sos', icon: LifeBuoy },
];

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white/90 px-5 py-6 lg:flex lg:flex-col">
      <button onClick={() => navigate('/home')} className="mb-10 flex items-center gap-3 text-left">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><ShieldCheck className="h-6 w-6" /></span>
        <span><span className="block text-lg font-bold tracking-tight text-foreground">RideSafe</span><span className="block text-xs text-muted-foreground">Driver intelligence</span></span>
      </button>

      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
      <nav className="space-y-1">
        {navigation.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return <button key={path} onClick={() => navigate(path)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? 'bg-primary/10 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="h-5 w-5" /><span>{label}</span>{active && <ChevronRight className="ml-auto h-4 w-4" />}</button>;
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <p className="mb-1 text-xs font-semibold text-primary">Session status</p>
        <p className="mb-3 text-sm font-semibold text-foreground">Protection is active</p>
        <p className="text-xs leading-5 text-muted-foreground">Camera, fatigue detection, and realtime safety events are ready for your next drive.</p>
      </div>
      <button onClick={() => navigate('/settings')} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Settings className="h-5 w-5" /> Settings <span className="ml-auto truncate text-xs">{user?.name || 'Driver'}</span></button>
    </aside>
  );
}
