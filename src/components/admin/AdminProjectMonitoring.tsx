import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/Card';
import { adminApi, projectsApi } from '../../services/api';
import { Project } from '../../types';

interface AdminProjectMonitoringProps {
  onDataChanged: () => void;
}

export const AdminProjectMonitoring: React.FC<AdminProjectMonitoringProps> = ({ onDataChanged }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const p = await adminApi.getAllProjects(
        search,
        statusFilter !== 'all' ? statusFilter : undefined,
        riskFilter !== 'all' ? riskFilter : undefined
      );
      setProjects(p);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [search, statusFilter, riskFilter]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-600" />
            <span>Platform Contract & Project Oversight</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Full lifecycle monitoring: requirements, deadlines, milestone deliverables, and escrow states.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contract title or user..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="under_review">Under Review</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold bold-dark-text">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Contract ID</th>
                <th className="py-3.5 px-4">Title & Service</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Freelancer</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Escrow Status</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">#{p.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 dark:text-white block line-clamp-1 max-w-xs">{p.title}</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{p.service_name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{p.customer_name}</td>
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {p.hired_freelancer_name || 'Pending Hire'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${p.budget}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      p.escrow_status === 'funded_held' || p.escrow_status === 'HELD' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300' :
                      p.escrow_status === 'RELEASED' || p.escrow_status === 'fully_released' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300' :
                      'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                    }`}>
                      {p.escrow_status || 'funded'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {p.deadline}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      p.risk_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300' :
                      p.risk_level === 'HIGH' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300' :
                      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300'
                    }`}>
                      {p.risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedProject(p)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-bold"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INSPECT PROJECT AUDIT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Contract #{selectedProject.id} Audit</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedProject.title}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                selectedProject.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300' :
                'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-300'
              }`}>
                {selectedProject.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Scope & Specifications:</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                {selectedProject.description}
              </p>
              {selectedProject.requirements && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/5">
                  <strong>Requirements:</strong> {selectedProject.requirements}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget</span>
                <span className="font-extrabold text-slate-900 dark:text-white">${selectedProject.budget}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Held in Escrow</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">${selectedProject.escrow_held_amount}</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Deadline</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedProject.deadline}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="btn-primary-gradient px-5 py-2 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
