interface StatusBadgeProps {
  status: 'safe' | 'warning' | 'danger' | 'active' | 'inactive';
  label: string;
  pulse?: boolean;
}

export default function StatusBadge({ status, label, pulse = false }: StatusBadgeProps) {
  const statusStyles = {
    safe: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-destructive/20 text-destructive border-destructive/30',
    active: 'bg-primary/20 text-primary border-primary/30',
    inactive: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusStyles[status]} ${pulse && status === 'danger' ? 'pulse-danger' : ''}`}>
      <div className={`w-2 h-2 rounded-full ${status === 'safe' ? 'bg-success' : status === 'warning' ? 'bg-warning' : status === 'danger' ? 'bg-destructive' : 'bg-primary'}`} />
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}
