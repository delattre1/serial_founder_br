interface PositionChangeProps {
  change: number | null;
}

export function PositionChange({ change }: PositionChangeProps) {
  if (change === null) {
    return (
      <span className="font-brutal-mono text-xs text-lime-400 border border-lime-400 px-2 py-0.5">
        NEW
      </span>
    );
  }

  if (change > 0) {
    return (
      <span className="font-brutal-mono text-sm text-lime-400">
        ↑{change}
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="font-brutal-mono text-sm text-red-500">
        ↓{Math.abs(change)}
      </span>
    );
  }

  return (
    <span className="font-brutal-mono text-sm text-neutral-600">
      —
    </span>
  );
}
