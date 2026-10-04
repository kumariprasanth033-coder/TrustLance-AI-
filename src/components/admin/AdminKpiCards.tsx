import React from 'react';
import {
  Users,
  UserCheck,
  Briefcase,
  CheckCircle2,
  Lock,
  DollarSign,
  CreditCard,
  Scale,
  ShieldAlert,
  Layers,
  Sparkles,
  Clock
} from 'lucide-react';
import { Card } from '../ui/Card';

interface AdminKpiCardsProps {
  metrics: any;
  onNavigateTab: (tabId: string) => void;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({ metrics, onNavigateTab }) => {
  const cards = [
    {
      title: 'Total Users',
      value: metrics?.total_users ?? 0,
      sub: `${metrics?.customers ?? 0} Customers • ${metrics?.freelancers ?? 0} Freelancers`,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      tab: 'users'
    },
    {
      title: 'Verified Freelancers',
      value: metrics?.verified_freelancers ?? 0,
      sub: 'AI Trust Score ≥ 80.0',
      icon: UserCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      tab: 'freelancers'
    },
    {
      title: 'Active Projects',
      value: metrics?.active_projects ?? 0,
      sub: `${metrics?.total_projects ?? 0} total registered in MySQL`,
      icon: Briefcase,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      tab: 'projects'
    },
    {
      title: 'Completed Projects',
      value: metrics?.completed_projects ?? 0,
      sub: '100% Milestone Handover',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      tab: 'projects'
    },
    {
      title: 'Active Escrow Accounts',
      value: metrics?.active_escrow ?? 0,
      sub: 'Multi-sig Vault Protected',
      icon: Lock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      tab: 'escrow'
    },
    {
      title: 'Escrow Held in Vault',
      value: `$${(Number(metrics?.escrow_held) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Locked awaiting deliverable sign-off',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      tab: 'escrow'
    },
    {
      title: 'Released Payments',
      value: `$${(Number(metrics?.released_payments) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Transferred directly to freelancer wallets',
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      tab: 'escrow'
    },
    {
      title: 'Total Refunds Processed',
      value: `$${(Number(metrics?.refunds) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      sub: 'Zero unauthorized chargebacks',
      icon: CreditCard,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      tab: 'escrow'
    },
    {
      title: 'Active Disputes',
      value: metrics?.active_disputes ?? 0,
      sub: 'Subject to AI Broker arbitration',
      icon: Scale,
      color: metrics?.active_disputes > 0 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300',
      bg: metrics?.active_disputes > 0 ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-slate-50 dark:bg-slate-800/40',
      tab: 'disputes'
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pending_approvals ?? 0,
      sub: 'Deliverables awaiting client review',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      tab: 'projects'
    },
    {
      title: 'AI Risk Alerts',
      value: metrics?.ai_risk_alerts ?? 0,
      sub: 'Real-time velocity & deadline scan',
      icon: ShieldAlert,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      tab: 'ai-broker'
    },
    {
      title: 'Active Services Catalog',
      value: metrics?.total_services ?? 0,
      sub: 'Full CRUD dynamic marketplace',
      icon: Layers,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      tab: 'services'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            hoverLift
            onClick={() => onNavigateTab(card.tab)}
            className="p-4 cursor-pointer transition-all hover:border-blue-500/50 bg-white dark:bg-[#151B2E] bold-dark-text"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bold-dark-text font-mono">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums bold-dark-text">
              {card.value}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-400 mt-1 truncate">
              {card.sub}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
