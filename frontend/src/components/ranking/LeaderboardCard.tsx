import { TierBadge } from './TierBadge';
import { PositionChange } from './PositionChange';

export interface RankingMember {
  id: string;
  display_name: string;
  total_points: number;
  current_tier: string;
  rank_position: number;
  current_streak: number;
  position_change: number | null;
}

interface LeaderboardCardProps {
  member: RankingMember;
  maxPoints: number;
}

export function LeaderboardCard({ member, maxPoints }: LeaderboardCardProps) {
  const isTopThree = member.rank_position <= 3;
  const progressPercent = maxPoints > 0 ? (member.total_points / maxPoints) * 100 : 0;

  const getMedal = (position: number) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const medal = getMedal(member.rank_position);

  if (isTopThree) {
    return (
      <div className="brutal-border bg-black p-6 hover-shift cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-brutal-display text-3xl text-lime-400">
              {medal} #{String(member.rank_position).padStart(2, '0')}
            </span>
            <span className="font-brutal-display text-2xl text-white uppercase">
              {member.display_name}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <TierBadge tier={member.current_tier} size="md" />
            <span className="font-brutal-mono text-xl text-lime-400">
              {member.total_points.toLocaleString()} pts
            </span>
            <PositionChange change={member.position_change} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-neutral-800 border border-neutral-700">
          <div
            className="h-full bg-lime-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {member.current_streak > 0 && (
          <div className="mt-3 font-brutal-mono text-xs text-neutral-500">
            🔥 STREAK: {member.current_streak} DIAS
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-b border-neutral-800 py-4 px-2 hover:bg-neutral-900/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-brutal-mono text-lg text-neutral-500 w-12">
            #{String(member.rank_position).padStart(2, '0')}
          </span>
          <span className="font-brutal-mono text-lg text-white">
            {member.display_name}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <TierBadge tier={member.current_tier} size="sm" />
          <span className="font-brutal-mono text-sm text-neutral-400 w-24 text-right">
            {member.total_points.toLocaleString()} pts
          </span>
          <div className="w-12 text-right">
            <PositionChange change={member.position_change} />
          </div>
        </div>
      </div>
    </div>
  );
}
