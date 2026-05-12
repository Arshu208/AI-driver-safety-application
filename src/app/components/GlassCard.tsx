import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'primary' | 'warning' | 'danger' | 'success' | 'none';
}

export default function GlassCard({ children, className = '', glow = 'none' }: GlassCardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';

  return (
    <div className={`glass-card rounded-xl p-4 ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
