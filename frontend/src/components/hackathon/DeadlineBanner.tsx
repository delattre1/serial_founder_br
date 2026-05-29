import { CURRENT } from '@/config/hackathon';

// Prominent top bar with the registration deadline. Single source = config,
// so it never contradicts the dates shown elsewhere on the site.
export function DeadlineBanner() {
  return (
    <div className="bg-lime-400 text-black border-b-2 border-black py-3 px-4 text-center">
      <span className="font-brutal-mono text-sm md:text-base font-bold tracking-wide">
        /// INSCRIÇÕES ATÉ {CURRENT.dates.registrationDeadline} ///
      </span>
    </div>
  );
}
