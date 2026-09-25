import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, ArrowRight, Lock, FileText, Eye, DollarSign } from 'lucide-react';

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
    { id: 1, title: 'Agreement', desc: 'Scope agreed', icon: FileText, activeOn: ['open', 'in_progress', 'under_review', 'completed'] },
    { id: 2, title: 'Escrow Funded', desc: 'Secured in vault', icon: Lock, activeOn: ['in_progress', 'under_review', 'completed'] },
    { id: 3, title: 'Work in Progress', desc: 'Milestone tasks', icon: Clock, activeOn: ['in_progress', 'under_review', 'completed'] },
    { id: 4, title: 'Review Deliverable', desc: 'Client inspection', icon: Eye, activeOn: ['under_review', 'completed'] },
    { id: 5, title: 'Payment Released', desc: 'Tranche paid out', icon: DollarSign, activeOn: ['completed'] },
  ];

  const getStepStatus = (stepActiveOn: string[]) => {
    return stepActiveOn.includes(currentStatus);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Broker™ Intelligent Escrow Protocol
              <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-mono">
                SECURED
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Funds are programmatically protected in MySQL ledger until milestone approval.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs tabular-nums font-mono">
          <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans">Held in Escrow</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">${heldAmount.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-sans">Released</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${releasedAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Steps Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => {
          const isActive = getStepStatus(step.activeOn);
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                  : 'bg-slate-50/40 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{step.title}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
