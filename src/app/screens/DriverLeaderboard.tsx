import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import StatusBadge from '../components/StatusBadge';

export default function DriverLeaderboard() {
  const leaderboard = [
    { rank: 1, name: 'You', score: 96, miles: 3248, badge: Trophy, color: 'primary' },
    { rank: 2, name: 'Sarah Chen', score: 95, miles: 2890, badge: Medal, color: 'accent' },
    { rank: 3, name: 'Mike Johnson', score: 94, miles: 3105, badge: Medal, color: 'warning' },
    { rank: 4, name: 'Emma Davis', score: 92, miles: 2456, badge: Award, color: 'muted' },
    { rank: 5, name: 'James Wilson', score: 91, miles: 2789, badge: Award, color: 'muted' },
    { rank: 6, name: 'Lisa Anderson', score: 90, miles: 2234, badge: Award, color: 'muted' },
    { rank: 7, name: 'David Brown', score: 89, miles: 1998, badge: Award, color: 'muted' },
    { rank: 8, name: 'Sophie Taylor', score: 88, miles: 2567, badge: Award, color: 'muted' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">Top drivers this month</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-primary mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="mb-1">#1 Safest Driver</h2>
          <p className="text-sm text-muted-foreground mb-2">Congratulations!</p>
          <StatusBadge status="active" label="Top Performer" />
        </div>
      </GlassCard>

      <div className="mb-4">
        <h3 className="mb-3">Rankings</h3>
      </div>

      <div className="space-y-3">
        {leaderboard.map((driver, index) => {
          const Badge = driver.badge;
          const isCurrentUser = driver.name === 'You';

          return (
            <GlassCard
              key={index}
              glow={isCurrentUser ? 'primary' : 'none'}
              className={isCurrentUser ? 'border-2 border-primary' : ''}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${index < 3 ? `bg-${driver.color}/20` : 'bg-muted'} flex items-center justify-center`}>
                  {index < 3 ? (
                    <Badge className={`w-6 h-6 text-${driver.color}`} />
                  ) : (
                    <span className="text-muted-foreground">#{driver.rank}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm">{driver.name}</p>
                    {isCurrentUser && (
                      <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase">
                        You
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{driver.miles.toLocaleString()} miles</p>
                </div>

                <div className="text-right">
                  <p className={`text-xl ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>{driver.score}</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-6">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Keep Improving!</p>
              <p className="text-xs text-muted-foreground">
                Maintain your #1 position by continuing safe driving practices. Next update in 7 days.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
