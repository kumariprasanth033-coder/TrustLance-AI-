import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Lock, 
  FileText, 
  Eye, 
  DollarSign, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  Calendar, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface EscrowTimelineProps {
  currentStatus: 'open' | 'in_progress' | 'under_review' | 'completed' | 'disputed' | string;
  heldAmount?: number;
  releasedAmount?: number;
}

export const EscrowTimeline: React.FC<EscrowTimelineProps> = ({
  currentStatus,
  heldAmount = 0,
  releasedAmount = 0,
}) => {
  const steps = [
    { id: 1, title: 'Scope Locked', desc: 'Requirements set', icon: FileText, activeOn: ['open', 'in_progress', 'under_review', 'completed'] },
    { id: 2, title: 'Payment Secured', desc: 'Held in vault', icon: Lock, activeOn: ['in_progress', 'under_review', 'completed'] },
    { id: 3, title: 'Work Started', desc: 'Milestone progress', icon: Clock, activeOn: ['in_progress', 'under_review', 'completed'] },
    { id: 4, title: 'Deliverable Check', desc: 'Client review', icon: Eye, activeOn: ['under_review', 'completed'] },
    { id: 5, title: 'Payment Released', desc: 'Tranche paid out', icon: DollarSign, activeOn: ['completed'] },
  ];

  const getStepStatus = (stepActiveOn: string[]) => {
    return stepActiveOn.includes(currentStatus);
  };

  return (
    <div className="bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-white/5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Broker™ Intelligent Escrow Protocol
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                ACTIVE PROTECTION
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Funds are programmatically protected in MySQL ledger until milestone approval.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs tabular-nums font-mono">
          <div className="bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans font-semibold">Payment Held</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-base font-mono">${heldAmount.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans font-semibold">Released</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base font-mono">${releasedAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Steps Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 relative">
        {steps.map((step) => {
          const isActive = getStepStatus(step.activeOn);
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30 shadow-xs'
                  : 'bg-slate-50/60 dark:bg-white/5 border-slate-200/80 dark:border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-semibold'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{step.title}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AIBrokerVisualProps {
  currentStage?: number; // 1 to 7
  paymentSecured?: string;
  projectProtected?: boolean;
  milestoneProgress?: number; // 0 to 100
  deadline?: string;
  escrowStatus?: string;
  className?: string;
}

export const AIBrokerVisual: React.FC<AIBrokerVisualProps> = ({
  currentStage = 4,
  paymentSecured = '$2,500.00',
  projectProtected = true,
  milestoneProgress = 65,
  deadline = 'Oct 15, 2026',
  escrowStatus = 'Payment Secured & Held in Vault',
  className = ''
}) => {
  const stages = [
    { num: 1, label: 'Project Created', icon: FileText },
    { num: 2, label: 'Freelancer Hired', icon: UserCheck },
    { num: 3, label: 'Payment Secured', icon: Lock },
    { num: 4, label: 'Work Started', icon: Clock },
    { num: 5, label: 'Deliverable Submitted', icon: Briefcase },
    { num: 6, label: 'Customer Review', icon: Eye },
    { num: 7, label: 'Payment Released', icon: DollarSign },
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 ${className}`}>
      {/* Header with AI Broker Shield Icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI BROKER
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                Active Protection Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Autonomous supervision layer ensuring milestone verification before capital clearance.
            </p>
          </div>
        </div>

        {/* Protection Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Project 100% Protected</span>
        </div>
      </div>

      {/* 5 Core Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
            Payment Secured
          </span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 tabular-nums font-mono mt-1 block">
            {paymentSecured}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
            Project Protected
          </span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            Verified
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
            Milestone Progress
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {milestoneProgress}%
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
            Deadline
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            {deadline}
          </span>
        </div>

        <div className="col-span-2 md:col-span-1 p-3.5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
            Escrow Status
          </span>
          <span className="text-xs font-bold text-blue-900 dark:text-blue-300 mt-1 block truncate">
            {escrowStatus}
          </span>
        </div>
      </div>

      {/* 7-Stage Progression Timeline with Glowing Indicators */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Automated Escrow Lifecycle Timeline
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5">
          {stages.map((st, idx) => {
            const isCompleted = st.num < currentStage;
            const isCurrent = st.num === currentStage;
            const isUpcoming = st.num > currentStage;
            const Icon = st.icon;

            return (
              <div
                key={st.num}
                className={`relative p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-b from-blue-500/15 to-purple-500/15 border-blue-500/50 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500/20'
                    : isCompleted
                    ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20'
                    : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/60 dark:border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shadow-purple-500/30 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  Stage 0{st.num}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                  {st.label}
                </div>

                {/* Subtle arrow indicator between stages on desktop */}
                {idx < stages.length - 1 && (
                  <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

