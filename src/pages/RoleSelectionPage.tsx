import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, UserCheck, Shield, Check, ArrowRight, Lock } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-100 dark:border-blue-900/50">
          <Shield className="w-3.5 h-3.5" />
          <span>Role-Based Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to TrustLance AI
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Choose how you want to use TrustLance AI to unlock intelligent escrow and verified talent matching.
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer Onboarding Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 rounded-2xl p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              I Want to Hire Talent (Customer)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Post projects, compare AI-matched proposals, and fund work through secure milestone escrow.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Post projects with custom milestone breakdowns</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI compatibility matching & ranking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% intelligent escrow capital protection</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Structured deliverable reviews & revisions</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register?role=customer"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Join as Customer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Freelancer Onboarding Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 rounded-2xl p-8 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              I Want to Work (Freelancer)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Find verified projects, submit AI-evaluated proposals, build your Trust Score, and get paid safely.
            </p>

            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Browse live MySQL marketplace projects</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Submit competitive proposals & milestones</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Build a mathematical AI Trust Score (0–100)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Guaranteed payout on client approval</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register?role=freelancer"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Join as Freelancer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Admin Login Notice */}
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        <span>Platform Administrator?</span>
        <Link to="/admin/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Access Admin Portal
        </Link>
      </div>
    </div>
  );
};
