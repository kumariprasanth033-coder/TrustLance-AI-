import React from 'react';

interface TrustScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showTier?: boolean;
}

export const TrustScoreRing: React.FC<TrustScoreRingProps> = ({
  score,
  size = 80,
  strokeWidth = 6,
  showTier = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#2563eb'; // blue
  let tier = 'Trusted';
  let badgeClass = 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400';

  if (score >= 98) {
    color = '#22c55e'; // green
    tier = 'Elite';
    badgeClass = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400';
  } else if (score >= 90) {
    color = '#06b6d4'; // cyan
    tier = 'Highly Trusted';
    badgeClass = 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400';
  } else if (score >= 80) {
    color = '#2563eb';
    tier = 'Trusted';
    badgeClass = 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400';
  } else if (score >= 70) {
    color = '#7c3aed'; // purple
    tier = 'Good';
    badgeClass = 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400';
  } else if (score >= 60) {
    color = '#f97316'; // orange
    tier = 'Average';
    badgeClass = 'text-orange-700 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400';
  } else {
    color = '#ef4444'; // red
    tier = 'Needs Improvement';
    badgeClass = 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400';
  }

  return (
    <div className="flex flex-col items-center justify-center shrink-0">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Dynamic Score Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-bold text-slate-900 dark:text-white tabular-nums tracking-tight leading-none" style={{ fontSize: size * 0.28 }}>
            {score.toFixed(1)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
            Trust
          </span>
        </div>
      </div>

      {showTier && (
        <span className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${badgeClass}`}>
          {tier}
        </span>
      )}
    </div>
  );
};
