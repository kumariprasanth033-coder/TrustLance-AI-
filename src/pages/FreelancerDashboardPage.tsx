import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, DollarSign, Clock, ArrowRight, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { projectsApi, authApi, freelancersApi } from '../services/api';
import { Project } from '../types';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const FreelancerDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [freelancer, setFreelancer] = useState<any>(null);
  const user = authApi.getCurrentUser();

  useEffect(() => {
    projectsApi.list().then(setProjects);
    freelancersApi.getById(1).then(setFreelancer);
  }, []);

  const assignedProjects = projects.filter(p => p.selected_freelancer_id === 1);
  const availableProjects = projects.filter(p => p.status === 'open');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Freelancer Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.full_name || 'Elena Vance'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track active milestones, inspect escrow earnings, and maintain your Elite Trust Score.
          </p>
        </div>

        <Link
          to="/services"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Browse Open Projects</span>
        </Link>
      </div>

      {/* Trust Score & Metrics Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <TrustScoreRing score={freelancer?.trust_score || 99.2} size={90} strokeWidth={7} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Elite Tier Freelancer</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                TOP 2%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-md leading-relaxed font-medium">
              Your Trust Score is evaluated across 100% on-time milestone delivery, 4.98 star rating, and zero escrow disputes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono tabular-nums w-full md:w-auto">
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block uppercase font-semibold">Wallet Balance</span>
            <strong className="text-base text-emerald-600 dark:text-emerald-400 font-bold">$800.00</strong>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block uppercase font-semibold">Pending Escrow</span>
            <strong className="text-base text-blue-600 dark:text-blue-400 font-bold">$1,600.00</strong>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans block uppercase font-semibold">Completed</span>
            <strong className="text-base text-slate-900 dark:text-white font-bold">52 Projects</strong>
          </div>
        </div>
      </div>

      {/* Active Contracts & Deliverables */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Milestone Contracts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Milestones with client-secured escrow deposits.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {assignedProjects.map((proj) => (
            <div key={proj.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</strong>
                  <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-[11px] font-mono tabular-nums">
                  <span>Client: <strong className="text-slate-900 dark:text-white font-sans">{proj.customer_name}</strong></span>
                  <span>·</span>
                  <span>Secured Escrow: <strong className="text-blue-600 dark:text-blue-400 font-bold">${proj.budget.toFixed(2)}</strong></span>
                  <span>·</span>
                  <span>Deadline: {proj.deadline}</span>
                </div>
              </div>

              <Link
                to={`/customer/projects/${proj.id}`}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap shadow-xs"
              >
                <span>Upload Deliverable / Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Available Projects to Bid On */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Open Marketplace Projects</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live projects seeking specialized talent.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {availableProjects.map((p) => (
            <div key={p.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <strong className="text-sm font-bold text-slate-900 dark:text-white block">{p.title}</strong>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-1 text-[11px] max-w-xl font-medium">{p.description}</p>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono tabular-nums pt-0.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${p.budget.toFixed(2)}</span>
                  <span>·</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{p.service_name}</span>
                  <span>·</span>
                  <span>Deadline: {p.deadline}</span>
                </div>
              </div>

              <Link
                to={`/customer/projects/${p.id}`}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 font-bold rounded-xl transition-colors whitespace-nowrap border border-slate-200 dark:border-white/10"
              >
                Submit Proposal
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
