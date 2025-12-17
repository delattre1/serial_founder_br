import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LeaderboardCard, TierBadge, RankingMember } from '@/components/ranking';

export default function RankingPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<RankingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState<string>('');

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);

      // Fetch all members ordered by rank position
      const { data: membersData, error } = await supabase
        .from('ranking_members')
        .select('*')
        .order('rank_position', { ascending: true });

      if (error) {
        console.error('Error fetching rankings:', error);
        setLoading(false);
        return;
      }

      if (membersData) {
        // Get latest snapshot for position changes
        const { data: snapshots } = await supabase
          .from('ranking_snapshots')
          .select('member_id, position_change, week_start')
          .order('week_start', { ascending: false })
          .limit(membersData.length);

        const snapshotMap = new Map(
          snapshots?.map(s => [s.member_id, s.position_change]) || []
        );

        if (snapshots && snapshots.length > 0) {
          const weekDate = new Date(snapshots[0].week_start);
          setCurrentWeek(getWeekNumber(weekDate));
        }

        const membersWithChanges: RankingMember[] = membersData.map(m => ({
          id: m.id,
          display_name: m.display_name,
          total_points: m.total_points || 0,
          current_tier: m.current_tier || 'Estagiario',
          rank_position: m.rank_position || 999,
          current_streak: m.current_streak || 0,
          position_change: snapshotMap.get(m.id) ?? null,
        }));

        setMembers(membersWithChanges);
      }

      setLoading(false);
    }

    fetchRankings();
  }, []);

  const getWeekNumber = (date: Date): string => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNum = Math.ceil(diff / oneWeek);
    return `SEMANA_${weekNum}`;
  };

  const maxPoints = members.length > 0 ? Math.max(...members.map(m => m.total_points)) : 0;
  const topThree = members.filter(m => m.rank_position <= 3);
  const restByTier = members.filter(m => m.rank_position > 3);

  // Group by tier
  const tierGroups = restByTier.reduce((acc, member) => {
    const tier = member.current_tier;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(member);
    return acc;
  }, {} as Record<string, RankingMember[]>);

  const tierOrder = ['CEO', 'Co-Founder', 'Builder', 'Estagiario'];

  return (
    <div className="min-h-screen bg-black text-white font-brutal-mono grid-bg relative overflow-hidden">
      {/* Overlays */}
      <div className="noise-overlay" />
      <div className="scanline" />

      {/* Marquee Header */}
      <div className="bg-lime-400 text-black py-2 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content font-brutal-mono text-sm tracking-wider">
            SERIAL_FOUNDERS // RANKING // {currentWeek || '2025'} // QUEM SHIP, APARECE // QUEM NAO SHIP, SOME //&nbsp;
            SERIAL_FOUNDERS // RANKING // {currentWeek || '2025'} // QUEM SHIP, APARECE // QUEM NAO SHIP, SOME //&nbsp;
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b-2 border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-brutal-display text-xl text-white hover:text-lime-400 transition-colors">
            SERIAL_FOUNDERS
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-brutal-mono text-xs text-neutral-500">
                  {user.email?.split('@')[0]}
                </span>
                <Link
                  to="/dashboard"
                  className="border-2 border-neutral-600 px-4 py-2 text-sm hover:border-lime-400 hover:text-lime-400 transition-colors"
                >
                  [DASHBOARD]
                </Link>
              </div>
            ) : (
              <Link
                to="/"
                className="border-2 border-lime-400 text-lime-400 px-4 py-2 text-sm hover:bg-lime-400 hover:text-black transition-colors"
              >
                [ENTRAR]
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 border-b-2 border-neutral-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-brutal-display text-6xl md:text-8xl text-white mb-6">
            RANKING
          </h1>
          <div className="brutal-border-lime bg-black/50 p-6 max-w-2xl mx-auto">
            <p className="font-brutal-mono text-lg text-lime-400">
              // QUEM SHIP, APARECE.
            </p>
            <p className="font-brutal-mono text-lg text-neutral-400">
              // QUEM NAO SHIP, SOME.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="font-brutal-mono text-lime-400 animate-blink">
                // CARREGANDO RANKING...
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-brutal-mono text-neutral-500 text-lg mb-4">
                // NENHUM MEMBRO NO RANKING AINDA
              </div>
              <p className="font-brutal-mono text-neutral-600">
                Os rankings serao atualizados semanalmente.
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 */}
              {topThree.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-brutal-display text-2xl text-lime-400 mb-6">
                    // TOP_3
                  </h2>
                  <div className="space-y-4">
                    {topThree.map(member => (
                      <LeaderboardCard
                        key={member.id}
                        member={member}
                        maxPoints={maxPoints}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Rest by Tier */}
              {tierOrder.map(tier => {
                const tierMembers = tierGroups[tier];
                if (!tierMembers || tierMembers.length === 0) return null;

                return (
                  <div key={tier} className="mb-8">
                    <div className="flex items-center gap-4 mb-4 border-b border-neutral-800 pb-2">
                      <span className="font-brutal-mono text-sm text-neutral-500">
                        // TIER:
                      </span>
                      <TierBadge tier={tier} size="md" />
                    </div>
                    <div>
                      {tierMembers.map(member => (
                        <LeaderboardCard
                          key={member.id}
                          member={member}
                          maxPoints={maxPoints}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-800 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-brutal-mono text-xs text-neutral-600">
            // SERIAL_FOUNDERS_BR © 2025
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/hackathon"
              className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              HACKATHON
            </Link>
            <a
              href="https://www.youtube.com/@danedelattre"
              target="_blank"
              rel="noopener noreferrer"
              className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              YOUTUBE
            </a>
            <a
              href="https://www.instagram.com/danedelattre/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-brutal-mono text-xs text-neutral-500 hover:text-lime-400 transition-colors"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </footer>

      {/* Large watermark decoration */}
      <div className="fixed bottom-0 right-0 text-neutral-900 text-[15rem] md:text-[20rem] font-brutal-display opacity-20 pointer-events-none select-none leading-none">
        SF
      </div>
    </div>
  );
}
