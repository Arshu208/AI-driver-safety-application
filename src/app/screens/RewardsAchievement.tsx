import { Award, Star, Target, Zap, Lock } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function RewardsAchievement() {
  const achievements = [
    { name: 'Safe Starter', desc: 'Complete first 10 trips', icon: '🎯', unlocked: true, date: 'May 1' },
    { name: 'Week Warrior', desc: 'Drive 7 days in a row', icon: '🔥', unlocked: true, date: 'May 8' },
    { name: 'Century Club', desc: 'Drive 100+ miles', icon: '💯', unlocked: true, date: 'May 2' },
    { name: 'Alert Driver', desc: 'Zero drowsiness alerts for 24h', icon: '⚡', unlocked: true, date: 'May 10' },
    { name: 'Perfect Score', desc: 'Achieve 100 safety score', icon: '⭐', unlocked: false, progress: 96 },
    { name: 'Marathon', desc: 'Complete 500-mile trip', icon: '🏆', unlocked: false, progress: 62 },
  ];

  const stats = {
    totalPoints: 2480,
    level: 8,
    nextLevel: 3000,
    unlockedCount: achievements.filter(a => a.unlocked).length,
    totalCount: achievements.length,
  };

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="mb-6">
        <h1 className="mb-2">Achievements</h1>
        <p className="text-muted-foreground text-sm">Your driving milestones</p>
      </div>

      <GlassCard glow="primary" className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl">Level {stats.level}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{stats.totalPoints.toLocaleString()} points</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress to Level {stats.level + 1}</span>
            <span className="text-primary">{stats.totalPoints}/{stats.nextLevel}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${(stats.totalPoints / stats.nextLevel) * 100}%` }} />
          </div>
        </div>
      </GlassCard>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3>Unlocked</h3>
          <span className="text-sm text-muted-foreground">{stats.unlockedCount}/{stats.totalCount}</span>
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <GlassCard
            key={index}
            className={achievement.unlocked ? 'bg-success/5 border border-success/30' : ''}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${achievement.unlocked ? 'bg-success/20' : 'bg-muted'}`}>
                {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
              </div>

              <div className="flex-1">
                <h4 className="mb-1">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{achievement.desc}</p>

                {achievement.unlocked ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs text-success">Unlocked {achievement.date}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-primary">{achievement.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${achievement.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-6">
        <GlassCard className="bg-primary/5 border border-primary/30">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Earn More Rewards</p>
              <p className="text-xs text-muted-foreground">
                Complete achievements to unlock exclusive badges and climb the leaderboard!
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
