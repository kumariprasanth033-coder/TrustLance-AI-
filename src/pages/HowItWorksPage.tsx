import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Star, Cpu, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { TrustScoreRing, AITrustScoreCard } from '../components/TrustScoreRing';
import { AIBrokerVisual } from '../components/EscrowTimeline';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Autonomous Protection Protocol
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How TrustLance AI Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Grounded in pure relational database design (MySQL 8.0), pure server-side controller APIs (PHP 8.2), and autonomous cryptographic escrow ledger guarantees.
        </p>
      </div>

      {/* Signature Component 1: AI Broker Architecture */}
      <div id="escrow" className="space-y-4">
        <AIBrokerVisual
          currentStage={4}
          paymentSecured="$3,500.00"
          projectProtected={true}
          milestoneProgress={70}
          deadline="Nov 30, 2026"
          escrowStatus="Active Autonomous Escrow Vault"
        />
      </div>

      {/* Signature Component 2: The AI Trust Score */}
      <div className="space-y-6">
        <AITrustScoreCard
          score={94}
          rating={4.9}
          completionRate={99}
          onTimeDeliveryRate={98}
          responseRate={96}
          freelancerName="TrustLance AI Network Benchmark"
        />

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                The AI Trust Score Model (0–100)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mathematical weighting derived from normalized MySQL tables.</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Standard freelancing websites allow users to buy reviews, farm fake ratings, or bury bad contracts. TrustLance AI’s backend recalculates the Trust Score automatically upon every completed project milestone using this formula:
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1.5 border border-slate-200/80 dark:border-white/10">
            <div className="font-bold text-blue-600 dark:text-blue-400">// Algorithmic Component Formula:</div>
            <div>Score = (Completion Rate × 0.25) + (Client Rating × 0.30) + (On-Time Delivery × 0.20) + (Response Speed × 0.15) + (Repeat Retention × 0.10) - (Dispute Penalty × 10)</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs pt-2">
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <strong className="block text-slate-900 dark:text-white font-bold text-sm">98–100: Elite</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1 block">Top 2% talent with flawless delivery records.</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <strong className="block text-slate-900 dark:text-white font-bold text-sm">90–97: Highly Trusted</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1 block">Consistent top performers with 95%+ on-time rate.</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <strong className="block text-slate-900 dark:text-white font-bold text-sm">80–89: Trusted</strong>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1 block">Reliable freelancers with established reviews.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight">Ready to hire or get hired with confidence?</h3>
          <p className="text-xs text-blue-100 mt-1 max-w-lg">
            Experience guaranteed milestone payments, algorithmic trust ratings, and autonomous escrow protection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/onboarding"
            className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-lg transition-all whitespace-nowrap"
          >
            Get Started Now
          </Link>
        </div>
      </div>

    </div>
  );
};
