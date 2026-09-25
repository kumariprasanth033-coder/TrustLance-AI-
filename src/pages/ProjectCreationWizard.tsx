import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, Layers, DollarSign, Calendar, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';
import { servicesApi, projectsApi } from '../services/api';
import { ServiceCategory } from '../types';

export const ProjectCreationWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service_id');
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    service_id: preselectedService ? Number(preselectedService) : 1,
    description: '',
    requirements: '',
    budget: 1500,
    deadline: '2026-10-30',
    revision_expectations: 'Up to 2 comprehensive revision rounds included.',
    reference_websites: '',
    milestones: [
      { title: 'Milestone 1: Prototype & System Architecture', amount: 750, deadline: '2026-10-15' },
      { title: 'Milestone 2: Final Production Delivery & Testing', amount: 750, deadline: '2026-10-30' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    servicesApi.list().then(setServices);
  }, []);

  const handleNext = () => {
    if (step === 1 && !formData.title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (step === 2 && !formData.description.trim()) {
      setError('Project description is required.');
      return;
    }
    if (step === 3 && formData.budget <= 0) {
      setError('Please provide a valid positive budget.');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async (draft = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.create({
        ...formData,
        budget: Number(formData.budget)
      });
      navigate(`/customer/projects/${res.project_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Customer Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          Intelligent Project Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Post a New Project on TrustLance AI
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Define project scope, configure intelligent escrow milestones, and receive AI-matched talent proposals.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        {[
          { id: 1, label: 'Title & Service' },
          { id: 2, label: 'Scope & Specs' },
          { id: 3, label: 'Budget & Dates' },
          { id: 4, label: 'Milestones' },
          { id: 5, label: 'Review' }
        ].map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.id
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 shadow-2xs'
                  : step > s.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-semibold'
              }`}
            >
              {step > s.id ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            <span className={`text-[11px] font-semibold hidden sm:inline ${step === s.id ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
              {s.label}
            </span>
            {idx < 4 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl">
        
        {error && (
          <div className="mb-6 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Full-Stack React & PHP SaaS Platform with MySQL Escrow"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs font-medium"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
                Be specific about technology stack and deliverables.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Select Service Discipline
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs font-medium"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id} className="dark:bg-[#151B2E]">
                    {srv.name} ({srv.category}) — Avg. ${srv.avg_budget}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Project Summary & Purpose
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your vision, core features, and architectural goals..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Key Technical Requirements & Acceptance Criteria
              </label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="1. React frontend with clean Tailwind components&#10;2. PHP 8.2 backend with PDO&#10;3. MySQL normalized schema"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  Total Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={formData.budget}
                    onChange={(e) => {
                      const b = Number(e.target.value);
                      setFormData({
                        ...formData,
                        budget: b,
                        milestones: [
                          { title: formData.milestones[0]?.title || 'Phase 1: Architecture & Prototype', amount: Math.round(b * 0.5), deadline: formData.deadline },
                          { title: formData.milestones[1]?.title || 'Phase 2: Final Handover', amount: Math.round(b * 0.5), deadline: formData.deadline }
                        ]
                      });
                    }}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none tabular-nums font-mono font-bold shadow-2xs"
                  />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
                  Funds will be protected in TrustLance AI Escrow Vault upon hiring.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  Target Completion Deadline
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                Revision Expectations
              </label>
              <input
                type="text"
                value={formData.revision_expectations}
                onChange={(e) => setFormData({ ...formData, revision_expectations: e.target.value })}
                placeholder="e.g. Up to 2 comprehensive rounds included."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none shadow-2xs font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Configure Escrow Milestones
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Milestones allow funds to be released incrementally upon your inspection of each deliverable.
              </p>

              <div className="space-y-3">
                {formData.milestones.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                        Milestone {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...formData.milestones];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, milestones: updated });
                        }}
                        className="w-full mt-1 bg-white dark:bg-[#0B1020] border border-slate-300 dark:border-white/10 px-3 py-1.5 rounded-xl font-semibold text-slate-900 dark:text-white text-xs shadow-2xs"
                      />
                    </div>

                    <div className="w-full sm:w-36">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Amount ($)
                      </span>
                      <input
                        type="number"
                        value={m.amount}
                        onChange={(e) => {
                          const updated = [...formData.milestones];
                          updated[idx].amount = Number(e.target.value);
                          setFormData({ ...formData, milestones: updated });
                        }}
                        className="w-full mt-1 bg-white dark:bg-[#0B1020] border border-slate-300 dark:border-white/10 px-3 py-1.5 rounded-xl tabular-nums font-mono font-bold text-slate-900 dark:text-white text-xs shadow-2xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
              <span>Project scope ready for publication to MySQL marketplace.</span>
            </div>

            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Project Title:</span>
                <strong className="text-slate-900 dark:text-white text-right">{formData.title}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Service Category:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{services.find(s => s.id === formData.service_id)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2 font-mono tabular-nums">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Total Budget:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold">${formData.budget.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Target Deadline:</span>
                <span className="font-mono">{formData.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Configured Milestones:</span>
                <span className="font-mono">{formData.milestones.length} tranches</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSubmit(false)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Publishing Project to MySQL...' : 'Publish Project to Marketplace'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
