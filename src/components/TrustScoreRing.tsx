import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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
  let tier = 'TRUSTED';
  let badgeClass = 'text-blue-700 bg-blue-100/80 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60';

  if (score >= 98) {
    color = '#22c55e'; // green
    tier = 'ELITE TRUSTED';
    badgeClass = 'text-emerald-700 bg-emerald-100/80 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60';
  } else if (score >= 90) {
    color = '#06b6d4'; // cyan
    tier = 'HIGHLY TRUSTED';
    badgeClass = 'text-cyan-700 bg-cyan-100/80 border border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-900/60';
  } else if (score >= 80) {
    color = '#2563eb'; // blue
    tier = 'TRUSTED';
    badgeClass = 'text-blue-700 bg-blue-100/80 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/60';
  } else if (score >= 70) {
    color = '#7c3aed'; // purple
    tier = 'VERIFIED';
    badgeClass = 'text-purple-700 bg-purple-100/80 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/60';
  } else if (score >= 60) {
    color = '#f97316'; // orange
    tier = 'AVERAGE';
    badgeClass = 'text-orange-700 bg-orange-100/80 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900/60';
  } else {
    color = '#ef4444'; // red
    tier = 'NEEDS IMPROVEMENT';
    badgeClass = 'text-rose-700 bg-rose-100/80 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60';
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
            className="text-slate-200 dark:text-white/10"
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
          <span className="font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight leading-none" style={{ fontSize: size * 0.28 }}>
            {score.toFixed(0)}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-0.5">
            Score
          </span>
        </div>
      </div>

      {showTier && (
        <span className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${badgeClass}`}>
          {tier}
        </span>
      )}
    </div>
  );
};

interface AITrustScoreCardProps {
  score: number;
  rating?: number;
  completionRate?: number;
  onTimeDeliveryRate?: number;
  responseRate?: number;
  freelancerName?: string;
  className?: string;
}

export const AITrustScoreCard: React.FC<AITrustScoreCardProps> = ({
  score = 94,
  rating = 4.9,
  completionRate = 99,
  onTimeDeliveryRate = 98,
  responseRate = 96,
  freelancerName = 'Verified Talent',
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              AI Trust Score
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Autonomous Verification Layer
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          Real-Time
        </span>
      </div>

      {/* Main Score Area */}
      <div className="flex items-center justify-between gap-6 py-6">
        <TrustScoreRing score={score} size={100} strokeWidth={8} showTier={true} />

        <div className="flex-1 grid grid-cols-2 gap-3 text-left">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Rating</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">★ {rating} / 5.0</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Completion Rate</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{completionRate}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">On-Time Delivery</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">{onTimeDeliveryRate}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Response Rate</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{responseRate}%</span>
          </div>
        </div>
      </div>

      {/* Expandable "Why this score?" section */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            Why this score?
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs space-y-2.5 animate-fadeIn">
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              TrustLance AI continuously computes scores using weighted multi-variable machine learning telemetry:
            </p>
            <div className="space-y-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex justify-between items-center">
                <span>• Client Satisfaction & Reviews (30%)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{rating}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>• Project Completion Integrity (25%)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>• On-Time Milestone Delivery (20%)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{onTimeDeliveryRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>• Communication Response Rate (15%)</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{responseRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>• Zero Escrow Disputes Penalty (10%)</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">Clean Record</span>
              </div>
            </div>
            <div className="pt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Cryptographically timestamped and audited across all smart contracts.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

