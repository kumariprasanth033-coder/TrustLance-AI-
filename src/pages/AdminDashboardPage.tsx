import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Plus,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  Scale,
  Lock,
  FileSpreadsheet,
  AlertTriangle,
  LogOut,
  Brain,
  CheckCircle2
} from 'lucide-react';

import { adminApi, authApi, resetLocalDatabase } from '../services/api';
import { Card } from '../components/ui/Card';

// Modular Admin subcomponents
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminKpiCards } from '../components/admin/AdminKpiCards';
import { AdminCharts } from '../components/admin/AdminCharts';
import { AdminServiceManagement } from '../components/admin/AdminServiceManagement';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { AdminEscrowAndDisputes } from '../components/admin/AdminEscrowAndDisputes';
import { AdminProjectMonitoring } from '../components/admin/AdminProjectMonitoring';
import { AdminActivityAndReports } from '../components/admin/AdminActivityAndReports';
import { AdminQuickSearch } from '../components/admin/AdminQuickSearch';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const currentUser = authApi.getCurrentUser();

  const loadAllMetrics = async () => {
    try {
      const m = await adminApi.getDashboardMetrics();
      const a = await adminApi.getAnalyticsData();
      const n = await adminApi.getNotifications();
      setMetrics(m);
      setAnalytics(a);
      setNotifications(n);
    } catch (e: any) {
      if (e.message?.includes('403') || e.message?.includes('401')) {
        navigate('/admin/login');
      }
    }
  };

  useEffect(() => {
    loadAllMetrics();
  }, []);

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
  };

  const handleResetDb = () => {
    if (confirm('CAUTION: Reset entire MySQL database simulation to initial seed state? This restores default users, 20 services, and baseline escrow records.')) {
      resetLocalDatabase();
      loadAllMetrics();
      setSystemAlert('Database successfully reset to seed state.');
      setTimeout(() => setSystemAlert(null), 4000);
    }
  };

  const badgeCounts = {
    disputes: metrics?.active_disputes || 0,
    riskAlerts: metrics?.ai_risk_alerts || 0,
    pendingApprovals: metrics?.pending_approvals || 0
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated Command Center</span>
            <span className="text-slate-600 dark:text-slate-400 font-normal">| {currentUser?.full_name || 'Alex Sterling (Lead Auditor)'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            TrustLance AI Operations & Governance
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
            Full-platform administrative authority: Service CRUD, Escrow arbitration, Risk analytics, and Audit telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="btn-secondary-surface px-3 py-2 text-xs font-bold gap-2 text-slate-200"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Records</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">Ctrl+K</kbd>
          </button>

          <Link
            to="/ai-broker"
            className="btn-primary-gradient px-3.5 py-2 text-xs font-bold gap-1.5 flex items-center shadow-md shadow-blue-500/20"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Broker Tests</span>
          </Link>

          <button
            onClick={handleResetDb}
            className="btn-secondary-surface px-3 py-2 text-xs font-bold text-rose-400 gap-1.5 hover:bg-rose-950/30"
            title="Reset platform database to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset DB</span>
          </button>
        </div>
      </div>

      {systemAlert && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{systemAlert}</span>
        </div>
      )}

      {/* Main Grid: Responsive Sidebar + Dynamic Content Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Responsive Sidebar */}
        <div className="lg:col-span-1">
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            badgeCounts={badgeCounts}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-4 space-y-6">
          {/* TAB: DASHBOARD (Overview) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Action Buttons */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 bold-dark-text">
                <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                  QUICK ACTIONS:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab('services')}
                    className="btn-primary-gradient px-3 py-1.5 text-xs font-bold gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="btn-secondary-surface px-3 py-1.5 text-xs font-bold gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('freelancers')}
                    className="btn-secondary-surface px-3 py-1.5 text-xs font-bold gap-1.5 text-indigo-400"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Review Freelancers</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('disputes')}
                    className="btn-secondary-surface px-3 py-1.5 text-xs font-bold gap-1.5 text-rose-400"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>View Disputes ({metrics?.active_disputes || 0})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('escrow')}
                    className="btn-secondary-surface px-3 py-1.5 text-xs font-bold gap-1.5 text-emerald-400"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>View Escrow Vault</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="btn-secondary-surface px-3 py-1.5 text-xs font-bold gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* 12 Live KPI Cards */}
              <AdminKpiCards
                metrics={metrics}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />

              {/* Visual Interactive Charts */}
              <AdminCharts analytics={analytics} />

              {/* Recent Activity Teaser */}
              <Card className="p-5 bg-white dark:bg-[#151B2E] bold-dark-text">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white bold-dark-text">Live Platform Events Stream</h3>
                  <button
                    onClick={() => setActiveTab('activity-center')}
                    className="text-xs font-bold text-blue-400 hover:underline"
                  >
                    View Full Activity Center →
                  </button>
                </div>
                <div className="pt-3">
                  <AdminActivityAndReports initialView="activity" />
                </div>
              </Card>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <AdminCharts analytics={analytics} />
              <AdminKpiCards metrics={metrics} onNavigateTab={setActiveTab} />
            </div>
          )}

          {/* TAB: SERVICES (CRUD) */}
          {(activeTab === 'services' || activeTab === 'categories') && (
            <AdminServiceManagement onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <AdminUserManagement viewMode="users" onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'customers' && (
            <AdminUserManagement viewMode="customers" onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: FREELANCERS */}
          {activeTab === 'freelancers' && (
            <AdminUserManagement viewMode="freelancers" onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <AdminProjectMonitoring onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: ESCROW, PAYMENTS, REFUNDS & DISPUTES */}
          {(activeTab === 'escrow' || activeTab === 'payments' || activeTab === 'refunds') && (
            <AdminEscrowAndDisputes initialTab="escrow" onDataChanged={loadAllMetrics} />
          )}

          {activeTab === 'disputes' && (
            <AdminEscrowAndDisputes initialTab="disputes" onDataChanged={loadAllMetrics} />
          )}

          {activeTab === 'reviews' && (
            <AdminUserManagement viewMode="freelancers" onDataChanged={loadAllMetrics} />
          )}

          {activeTab === 'risk-alerts' && (
            <AdminEscrowAndDisputes initialTab="disputes" onDataChanged={loadAllMetrics} />
          )}

          {/* TAB: AI BROKER CENTER */}
          {activeTab === 'ai-broker' && (
            <div className="space-y-6">
              <Card className="p-6 bg-white dark:bg-[#151B2E] border border-blue-500/30 shadow-sm bold-dark-text">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                      Autonomous Intelligence Broker
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white bold-dark-text">AI Broker Center & Test Suite</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Continuous invariant validation, simulated deadline failures, and automated escrow safeguards.
                    </p>
                  </div>
                  <Link
                    to="/ai-broker"
                    className="btn-primary-gradient px-4 py-2.5 text-xs font-bold gap-2"
                  >
                    <span>Launch 31-Test Verification Suite</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
              <AdminProjectMonitoring onDataChanged={loadAllMetrics} />
            </div>
          )}

          {/* TAB: ACTIVITY CENTER & AUDIT LOGS & NOTIFICATIONS */}
          {(activeTab === 'activity-center' || activeTab === 'notifications') && (
            <AdminActivityAndReports initialView="activity" />
          )}

          {activeTab === 'audit-logs' && (
            <AdminActivityAndReports initialView="audit" />
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <AdminActivityAndReports initialView="reports" />
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <Card className="p-6 bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 space-y-6 shadow-sm bold-dark-text">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white bold-dark-text">Platform System Settings & Engine Health</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1 bold-dark-text">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">DATABASE ENGINE</span>
                  <p className="text-slate-900 dark:text-white font-bold bold-dark-text">MySQL 8.0 Compatible Relational Store</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">ACID Transactions: Enabled</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1 bold-dark-text">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">ESCROW PROTOCOL</span>
                  <p className="text-slate-900 dark:text-white font-bold bold-dark-text">TrustLance Multi-Signature AI Vault</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">Auto-release: Locked on dispute</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <h3 className="font-extrabold text-sm text-rose-600 dark:text-rose-400 mb-2">Emergency Recovery & Seed Reset</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-medium">
                  Resetting the database clears test mutations and restores all initial users, 20 services, and baseline escrow tranches.
                </p>
                <button
                  onClick={handleResetDb}
                  className="btn-secondary-surface text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-4 py-2 text-xs font-bold gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Execute Platform Seed Reset</span>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Global Quick Search Modal */}
      <AdminQuickSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEntity={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};
