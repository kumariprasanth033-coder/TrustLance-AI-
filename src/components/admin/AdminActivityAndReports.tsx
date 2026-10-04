import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileSpreadsheet,
  Download,
  Search,
  ShieldCheck,
  CheckCircle,
  FileText,
  Filter,
  Calendar,
  Layers,
  Users,
  Briefcase,
  Lock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { adminApi } from '../../services/api';
import { ActivityLog, AdminAuditLog } from '../../types';

interface AdminActivityAndReportsProps {
  initialView?: 'activity' | 'audit' | 'reports';
}

export const AdminActivityAndReports: React.FC<AdminActivityAndReportsProps> = ({
  initialView = 'activity'
}) => {
  const [view, setView] = useState<'activity' | 'audit' | 'reports'>(initialView);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      const act = await adminApi.getActivityLogs(search, roleFilter !== 'all' ? roleFilter : undefined);
      const aud = await adminApi.getAuditLogs(search, targetTypeFilter !== 'all' ? targetTypeFilter : undefined);
      setActivityLogs(act);
      setAuditLogs(aud);
    } catch (e) {}
  };

  useEffect(() => {
    loadLogs();
  }, [view, search, roleFilter, targetTypeFilter]);

  const handleExportCSV = async (reportType: string) => {
    try {
      await adminApi.exportReportCSV(reportType);
      setDownloadSuccess(`Exported ${reportType.toUpperCase()} dataset to CSV file successfully!`);
      loadLogs();
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Export failed');
    }
  };

  const reportCards = [
    { id: 'users', title: 'User & Membership Census', desc: 'Complete registry of Customers, Freelancers, Trust Scores, and verification statuses.', icon: Users },
    { id: 'projects', title: 'Projects & Contracts Audit', desc: 'All contracts, budgets, delivery milestones, deadlines, and risk classification.', icon: Briefcase },
    { id: 'services', title: 'Marketplace Services Catalog', desc: 'Dynamic service list, categories, average budgets, and active status.', icon: Layers },
    { id: 'escrow', title: 'Escrow Vault & Payout Ledger', desc: 'Tranche allocations, held balances, released payments, and refunds breakdown.', icon: Lock },
    { id: 'disputes', title: 'Disputes & Arbitrations', desc: 'Scope claims, contention points, evidence records, and adjudicated decisions.', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {view === 'reports' ? <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> : <Activity className="w-5 h-5 text-blue-600" />}
            <span>
              {view === 'reports' ? 'Administrative Reports & CSV Exporter' :
               view === 'audit' ? 'Immutable Admin Audit Log' :
               'Platform Activity Center'}
            </span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically timestamped transaction events and CSV reporting exports.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setView('activity')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              view === 'activity' ? 'bg-white dark:bg-[#151B2E] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Activity Stream
          </button>
          <button
            onClick={() => setView('audit')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              view === 'audit' ? 'bg-white dark:bg-[#151B2E] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Admin Audit Log
          </button>
          <button
            onClick={() => setView('reports')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              view === 'reports' ? 'bg-white dark:bg-[#151B2E] text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Reports & CSV
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* VIEW 1: PLATFORM ACTIVITY STREAM */}
      {view === 'activity' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search action or user..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="freelancer">Freelancer</option>
              <option value="admin">Admin</option>
              <option value="system">System / AI</option>
            </select>
          </div>

          <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold bold-dark-text">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Contract</th>
                    <th className="py-3.5 px-4">State Transition</th>
                    <th className="py-3.5 px-4">Audit Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 dark:text-white block">{log.user_name}</span>
                        <span className="text-[10px] uppercase font-mono text-blue-600 dark:text-blue-400">{log.role}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {log.project_title || `Project #${log.project_id}`}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="text-slate-400">{log.old_state}</span>
                        <span className="mx-1 text-slate-400">→</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.new_state}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                        {log.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 2: ADMIN AUDIT LOGS */}
      {view === 'audit' && (
        <div className="space-y-4">
          <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Immutable record of administrative actions (Service CRUD, User suspensions, Escrow overrides)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">
                TAMPER-PROOF LEDGER
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold bold-dark-text">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin Operator</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target Type</th>
                    <th className="py-3 px-4">Target ID</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{log.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">{log.admin_name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.action}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[10px] font-mono font-bold uppercase">
                          {log.target_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">#{log.target_id}</td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {log.new_value || log.old_value || 'Committed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 3: REPORTS & CSV EXPORT */}
      {view === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((rc) => {
            const Icon = rc.icon;
            return (
              <Card key={rc.id} hoverLift className="p-5 flex flex-col justify-between bg-white dark:bg-[#151B2E] bold-dark-text">
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white bold-dark-text">{rc.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => handleExportCSV(rc.id)}
                    className="btn-primary-gradient w-full py-2.5 px-3 text-xs font-bold gap-2 flex items-center justify-center shadow-md shadow-blue-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV Dataset</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
