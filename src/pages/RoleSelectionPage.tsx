import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, UserCheck, Shield, Check, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>Intelligent Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to TrustLance AI
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-base max-w-xl mx-auto font-medium">
          Choose how you want to use TrustLance AI.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Customer Onboarding Card */}
        <div className="bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group hover:border-blue-500/50">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                CUSTOMER
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              I Want to Hire
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Post projects, find trusted talent, and manage your work securely.
            </p>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200 mb-8 font-medium border-t border-slate-100 dark:border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                <span>Post projects with milestone escrow protection</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                <span>AI compatibility matching & mathematical ranking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                <span>100% capital safe: release funds only upon approval</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                <span>AI Broker automated milestone verification</span>
              </div>
            </div>
          </div>

          <Link
            to="/register?role=customer"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3"
          >
            <span>Join as Customer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Freelancer Onboarding Card */}
        <div className="bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group hover:border-purple-500/50">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
                FREELANCER
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              I Want to Work
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Find projects, showcase your skills, and build your trusted reputation.
            </p>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200 mb-8 font-medium border-t border-slate-100 dark:border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 font-bold" />
                <span>Browse live verified projects across 16 categories</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 font-bold" />
                <span>Submit structured milestone proposals</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 font-bold" />
                <span>Build an unforgeable AI Trust Score (0–100)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 font-bold" />
                <span>Guaranteed payments with ACID escrow vault locks</span>
              </div>
            </div>
          </div>

          <Link
            to="/register?role=freelancer"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3"
          >
            <span>Join as Freelancer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Admin Portal notice */}
      <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 relative z-10">
        <Lock className="w-3.5 h-3.5" />
        <span>Platform Administrator?</span>
        <Link to="/admin/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Access Admin Portal
        </Link>
      </div>
    </div>
  );
};
