import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Star, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
          Platform Architecture Whitepaper
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How TrustLance AI Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Grounded in pure relational database design (MySQL 8.0), pure server-side controller APIs (PHP 8.2), and real cryptographic escrow ledger guarantees.
        </p>
      </div>

      {/* Section 1: The AI Trust Score */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              The AI Trust Score Model (0–100)
            </h2>
            <p className="text-xs text-slate-500">Mathematical weighting derived from normalized MySQL tables.</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Standard freelancing websites allow users to buy reviews, farm fake ratings, or bury bad contracts. TrustLance AI’s backend recalculates the Trust Score automatically upon every completed project milestone using this formula:
        </p>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1.5 border border-slate-200 dark:border-slate-700">
          <div className="font-bold text-blue-600 dark:text-blue-400">// Algorithmic Component Formula:</div>
          <div>Score = (Completion Rate × 0.25) + (Client Rating × 0.30) + (On-Time Delivery × 0.20) + (Response Speed × 0.15) + (Repeat Retention × 0.10) - (Dispute Penalty × 10)</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <strong className="block text-slate-900 dark:text-white">98–100: Elite</strong>
            <span className="text-slate-500 text-[11px]">Top 2% talent with flawless delivery records.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <strong className="block text-slate-900 dark:text-white">90–97: Highly Trusted</strong>
            <span className="text-slate-500 text-[11px]">Consistent top performers with 95%+ on-time rate.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <strong className="block text-slate-900 dark:text-white">80–89: Trusted</strong>
            <span className="text-slate-500 text-[11px]">Reliable freelancers with established reviews.</span>
          </div>
        </div>
      </div>

      {/* Section 2: Intelligent Escrow State Machine */}
      <div id="escrow" className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              The Intelligent Escrow State Engine
            </h2>
            <p className="text-xs text-slate-500">How funds move with ACID transaction safety.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-center font-mono">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-blue-600 block text-xs">1. PENDING_FUNDING</span>
            <span className="text-[11px] text-slate-500 font-sans mt-1 block">Freelancer hired; awaiting deposit.</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-amber-600 block text-xs">2. FUNDED_HELD</span>
            <span className="text-[11px] text-slate-500 font-sans mt-1 block">Funds locked in vault; work begins.</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-purple-600 block text-xs">3. UNDER_REVIEW</span>
            <span className="text-[11px] text-slate-500 font-sans mt-1 block">Deliverable uploaded for check.</span>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-emerald-600 block text-xs">4. FULLY_RELEASED</span>
            <span className="text-[11px] text-slate-500 font-sans mt-1 block">Approved & transferred to wallet.</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Frontend JavaScript code is never permitted to modify balances directly. All state transitions occur in pure PHP 8.2 backend service classes wrapped in PDO <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">beginTransaction()</code> and <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">commit()</code>.
        </p>
      </div>

    </div>
  );
};
