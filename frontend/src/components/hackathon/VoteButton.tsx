import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VoteButtonProps {
  projectId: string;
  voteCount: number;
  hasVoted: boolean;
  disabled?: boolean;
  onVote?: (projectId: string) => void;
  onUnvote?: (projectId: string) => void;
}

export function VoteButton({
  projectId,
  voteCount,
  hasVoted,
  disabled = false,
  onVote,
  onUnvote,
}: VoteButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [localCount, setLocalCount] = useState(voteCount);
  const [localHasVoted, setLocalHasVoted] = useState(hasVoted);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalCount(voteCount);
    setLocalHasVoted(hasVoted);
  }, [voteCount, hasVoted]);

  const handleClick = async () => {
    console.log('[VoteButton] Click - user:', user?.id ?? 'NULL');
    if (disabled || isLoading) return;

    if (!user) {
      console.log('[VoteButton] No user, redirecting to login');
      navigate('/');
      return;
    }

    setIsLoading(true);

    if (localHasVoted) {
      setLocalCount((prev) => prev - 1);
      setLocalHasVoted(false);
      onUnvote?.(projectId);
    } else {
      setLocalCount((prev) => prev + 1);
      setLocalHasVoted(true);
      onVote?.(projectId);
    }

    setIsLoading(false);
  };

  const baseClasses =
    'flex items-center gap-2 px-4 py-2 font-brutal-mono text-sm transition-all';

  if (localHasVoted) {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`${baseClasses} bg-lime-400 text-black border-2 border-lime-400 hover:bg-lime-300`}
      >
        <ChevronUp className="w-4 h-4" />
        <span>{localCount}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} bg-transparent text-neutral-400 border-2 border-neutral-600 hover:border-lime-400 hover:text-lime-400 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <ChevronUp className="w-4 h-4" />
      <span>{localCount}</span>
    </button>
  );
}
