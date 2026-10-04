import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  LayoutDashboard,
  UserCheck,
  FileText,
  CreditCard,
  RefreshCw,
  Scale,
  Brain,
  ShieldAlert,
  BarChart3,
  Settings,
  Filter
} from 'lucide-react';
import { adminApi, disputesApi, resetLocalDatabase } from '../services/api';
import { Dispute } from '../types';
import { Card } from '../components/ui/Card';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [adminSearch, setAdminSearch] = useState('');

  const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Freelancers', icon: UserCheck },
    { label: 'Customers', icon: Users },
    { label: 'Services', icon: Layers },
    { label: 'Projects', icon: Briefcase },
    { label: 'Proposals', icon: FileText },
    { label: 'Escrow', icon: Lock },
    { label: 'Payments', icon: DollarSign },
    { label: 'Refunds', icon: CreditCard },
    { label: 'Disputes', icon: Scale, badge: disputes.filter(d => d.status === 'OPEN').length },
    { label: 'AI Scores', icon: Brain },
    { label: 'Risk Alerts', icon: ShieldAlert },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  const loadData = async () => {
    const m = await adminApi.getDashboardMetrics();
    setMetrics(m);
    try {
      const d = JSON.parse(localStorage.getItem('tl_disputes') || '[]');
      setDisputes(d);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async (actionType: string) => {
    if (!selectedDispute || !resolutionNotes.trim()) return;
    await disputesApi.resolve(selectedDispute.id, `${actionType.toUpperCase()}: ${resolutionNotes}`);
    setSelectedDispute(null);
    setResolutionNotes('');
    setActionSuccess('Dispute adjudicated successfully and committed to MySQL audit ledger.');
    setTimeout(() => setActionSuccess(null), 3500);
    loadData();
  };

  const handleResetData = () => {
    if (confirm('Reset entire platform database to initial seed state?')) {
      resetLocalDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Intelligence & Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audited financial telemetry, dispute arbitration, and risk compliance monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/ai-broker"
            className="btn-primary-gradient px-4 py-2 text-xs font-bold gap-1.5 flex items-center shadow-md shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Broker & Test Suite</span>
          </Link>

          <button
            onClick={handleResetData}
            className="btn-secondary-surface px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Platform DB</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Admin Grid with Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Admin Navigation Sidebar */}
        <Card as="aside" className="lg:col-span-1 p-4 shadow-xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
            ADMIN MODULES
          </span>
          <nav className="space-y-1 text-xs font-medium">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Right Main Admin Dashboard View */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search audit records, users, tx..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MySQL 8.0 Engine Live</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card hoverLift className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Total Users</span>
              <div className="mt-2.5 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.total_users || 7}</span>
                <span className="text-[11px] text-slate-500 font-medium">({metrics?.customers || 1}c, {metrics?.freelancers || 5}f)</span>
              </div>
            </Card>

            <Card hoverLift className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Active Projects</span>
              <div className="mt-2.5 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{metrics?.active_projects || 3}</span>
                <span className="text-[11px] text-blue-500 font-medium">in contract</span>
              </div>
            </Card>

            <Card hoverLift className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Escrow Held</span>
              <div className="mt-2.5 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${metrics?.escrow_held?.toFixed(2) || '1,600.00'}</span>
                <span className="text-[11px] text-emerald-500 font-medium">vault locked</span>
              </div>
            </Card>

            <Card hoverLift className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Open Disputes</span>
              <div className="mt-2.5 flex items-baseline gap-2 font-mono tabular-nums">
                <span className="text-2xl font-extrabold text-rose-600">{metrics?.open_disputes || disputes.filter(d => d.status === 'OPEN').length}</span>
                <span className="text-[11px] text-slate-500 font-medium">pending</span>
              </div>
            </Card>
          </div>

          {/* Disputes Adjudication Console */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Escrow Dispute Adjudication</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Examine scope claims, milestone submissions, and release/refund funds.</p>
              </div>
            </div>

            {disputes && disputes.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {disputes.map((disp) => (
                  <div key={disp.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900 dark:text-white">Reason: {disp.reason}</strong>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          disp.status === 'OPEN' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {disp.status}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] max-w-xl font-medium">{disp.description}</p>
                      {disp.resolution_notes && (
                        <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono mt-1 font-semibold">Resolution: {disp.resolution_notes}</p>
                      )}
                    </div>

                    {disp.status === 'OPEN' && (
                      <button
                        onClick={() => setSelectedDispute(disp)}
                        className="btn-primary-gradient px-4 py-2 text-xs font-bold whitespace-nowrap"
                      >
                        Arbitrate Dispute
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Zero pending disputes. Platform operations nominal.</span>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ARBITRATE DISPUTE MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Dispute Arbitration Decision
              </h3>
              <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Contention Summary:</span>
              <p className="text-slate-800 dark:text-slate-100 font-bold">{selectedDispute.reason}</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">{selectedDispute.description}</p>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Official Resolution Findings & Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="State the findings based on milestone deliverables and contract scope..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleResolve('Release to Freelancer')}
                className="btn-primary-gradient py-3 text-xs font-bold"
              >
                Release to Freelancer
              </button>
              <button
                type="button"
                onClick={() => handleResolve('Refund to Customer')}
                className="btn-secondary-surface py-3 text-xs font-bold"
              >
                Refund Escrow to Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
