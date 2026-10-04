import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Layers,
  FolderTree,
  Lock,
  DollarSign,
  CreditCard,
  Scale,
  ShieldAlert,
  Brain,
  BarChart3,
  FileSpreadsheet,
  Activity,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/Card';

export interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  badgeCounts: {
    disputes: number;
    riskAlerts: number;
    pendingApprovals: number;
  };
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  badgeCounts,
  onLogout
}) => {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'ai-broker', label: 'AI Broker Center', icon: Brain, badge: badgeCounts.riskAlerts }
      ]
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { id: 'users', label: 'All Users', icon: Users },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'freelancers', label: 'Freelancers', icon: UserCheck, badge: badgeCounts.pendingApprovals }
      ]
    },
    {
      title: 'MARKETPLACE & CONTRACTS',
      items: [
        { id: 'services', label: 'Services (CRUD)', icon: Layers },
        { id: 'categories', label: 'Categories', icon: FolderTree },
        { id: 'projects', label: 'Projects', icon: Briefcase }
      ]
    },
    {
      title: 'FINANCIAL & ESCROW',
      items: [
        { id: 'escrow', label: 'Escrow Vault', icon: Lock },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'refunds', label: 'Refunds', icon: CreditCard },
        { id: 'disputes', label: 'Disputes', icon: Scale, badge: badgeCounts.disputes },
        { id: 'risk-alerts', label: 'Risk Alerts', icon: ShieldAlert, badge: badgeCounts.riskAlerts }
      ]
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        { id: 'reviews', label: 'Reviews', icon: Sparkles },
        { id: 'notifications', label: 'Notifications', icon: Activity },
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldCheck },
        { id: 'reports', label: 'Reports & CSV', icon: FileSpreadsheet },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <Card as="aside" className="p-4 shadow-xl flex flex-col justify-between h-full bg-white dark:bg-[#151B2E] bold-dark-text">
      <div className="space-y-6">
        <div className="px-2 pt-1 pb-2 border-b border-slate-200 dark:border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-blue-500/20">
            TL
          </div>
          <div>
            <h2 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight leading-none bold-dark-text">
              TrustLance AI
            </h2>
            <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <nav className="space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 block bold-dark-text">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all font-bold ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-extrabold'
                          : 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 bold-dark-text'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold bg-rose-500 text-white animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </Card>
  );
};
