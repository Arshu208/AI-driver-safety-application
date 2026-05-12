import { ReactNode } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertCardProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  icon?: ReactNode;
  pulse?: boolean;
}

export default function AlertCard({ type, title, message, icon, pulse = false }: AlertCardProps) {
  const typeStyles = {
    info: 'border-primary bg-primary/10',
    success: 'border-success bg-success/10',
    warning: 'border-warning bg-warning/10',
    danger: 'border-destructive bg-destructive/10',
  };

  const iconColors = {
    info: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const defaultIcons = {
    info: <Info className="w-6 h-6" />,
    success: <CheckCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    danger: <AlertCircle className="w-6 h-6" />,
  };

  return (
    <div className={`glass-card rounded-xl p-4 border ${typeStyles[type]} ${pulse && type === 'danger' ? 'pulse-danger' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={iconColors[type]}>
          {icon || defaultIcons[type]}
        </div>
        <div className="flex-1">
          <h4 className="text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
