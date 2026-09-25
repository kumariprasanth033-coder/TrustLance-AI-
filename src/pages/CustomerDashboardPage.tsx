import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Shield, Lock, Clock, ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { projectsApi, authApi } from '../services/api';
import { Project } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const user = authApi.getCurrentUser();

  useEffect(() => {
    projectsApi.list().then(setProjects);
  }, []);

  const activeProjects = projects.filter(p => ['open', 'in_progress', 'under_review'].includes(p.status));
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalEscrowHeld = projects.reduce((acc, p) => acc + (p.escrow_held_amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Customer Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.full_name || 'Sarah Jenkins'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your active milestones, review proposals, and inspect escrow deposits.
          </p>
        </div>

        <Link
          to="/customer/projects/create"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Project</span>
        </Link>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-md hover:border-blue-500/40 transition-all">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Active Projects</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums font-mono">
              {activeProjects.length}
            </span>
            <span className="text-[11px] text-blue-500 font-semibold">in progress</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-md hover:border-blue-500/40 transition-all">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Escrow Held</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums font-mono">
              ${totalEscrowHeld.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-500 font-semibold">vault locked</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-md hover:border-blue-500/40 transition-all">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Completed Work</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
              {completedProjects.length}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">contracts closed</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-md hover:border-blue-500/40 transition-all">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider font-mono">Client Trust Score</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums font-mono">
              96.5
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Prompt Payer</span>
          </div>
        </div>
      </div>

      {/* Active Projects List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Projects & Workspaces</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inspect milestones, deliverables, and escrow states.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {projects.map((proj) => (
            <div key={proj.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</strong>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    proj.status === 'in_progress' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                    proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    proj.status === 'under_review' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono tabular-nums">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Budget: ${proj.budget.toFixed(2)}</span>
                  <span>·</span>
                  <span>Deadline: {proj.deadline}</span>
                  {proj.hired_freelancer_name && (
                    <>
                      <span>·</span>
                      <span>Talent: <strong className="text-blue-600 dark:text-blue-400 font-sans font-semibold">{proj.hired_freelancer_name}</strong></span>
                    </>
                  )}
                  {proj.proposal_count !== undefined && proj.status === 'open' && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-500 font-bold">{proj.proposal_count} proposals</span>
                    </>
                  )}
                </div>
              </div>

              <Link
                to={`/customer/projects/${proj.id}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 font-bold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap border border-slate-200 dark:border-white/10"
              >
                <span>Enter Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
