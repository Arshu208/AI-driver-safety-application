import { Brain, Eye, Zap } from 'lucide-react';

interface AIStatusIndicatorProps {
  fatigueLevel: number;
  eyeStatus: 'open' | 'closing' | 'closed';
  aiActive: boolean;
}

export default function AIStatusIndicator({ fatigueLevel, eyeStatus, aiActive }: AIStatusIndicatorProps) {
  const getFatigueLevelColor = () => {
    if (fatigueLevel < 30) return 'text-success';
    if (fatigueLevel < 70) return 'text-warning';
    return 'text-destructive';
  };

  const getEyeStatusColor = () => {
    if (eyeStatus === 'open') return 'text-success';
    if (eyeStatus === 'closing') return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className={`w-5 h-5 ${aiActive ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
          <span className="text-sm">AI Monitoring</span>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full ${aiActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
          {aiActive ? 'ACTIVE' : 'INACTIVE'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className={`w-5 h-5 ${getEyeStatusColor()}`} />
          <span className="text-sm">Eye Status</span>
        </div>
        <span className={`text-sm uppercase ${getEyeStatusColor()}`}>{eyeStatus}</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-5 h-5 ${getFatigueLevelColor()}`} />
            <span className="text-sm">Fatigue Level</span>
          </div>
          <span className={`text-sm ${getFatigueLevelColor()}`}>{fatigueLevel}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${fatigueLevel < 30 ? 'bg-success' : fatigueLevel < 70 ? 'bg-warning' : 'bg-destructive'}`}
            style={{ width: `${fatigueLevel}%` }}
          />
        </div>
      </div>
    </div>
  );
}
