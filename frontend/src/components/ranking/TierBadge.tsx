interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

const TIERS: Record<string, { emoji: string; color: string; label: string }> = {
  'Board Member': { emoji: '🏛️', color: 'text-lime-400', label: 'BOARD_MEMBER' },
  'CEO': { emoji: '🎯', color: 'text-white', label: 'CEO' },
  'Co-Founder': { emoji: '💼', color: 'text-white', label: 'CO_FOUNDER' },
  'Builder': { emoji: '🛠️', color: 'text-neutral-400', label: 'BUILDER' },
  'Estagiario': { emoji: '📝', color: 'text-neutral-500', label: 'ESTAGIARIO' },
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const tierData = TIERS[tier] || TIERS['Estagiario'];

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={`font-brutal-mono ${sizeClasses[size]} ${tierData.color}`}>
      {tierData.emoji} {tierData.label}
    </span>
  );
}
