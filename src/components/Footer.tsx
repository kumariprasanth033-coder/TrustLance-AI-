import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, Code, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1020] text-slate-400 border-t border-white/10 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="space-y-3.5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                TrustLance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              “Hire With Confidence. Work With Trust.”
              The next-generation freelancing marketplace powered by algorithmic AI Trust Scores and intelligent escrow protection.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Escrow Milestone Guarantee</span>
            </div>
          </div>

          {/* Core Marketplace */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Talent Marketplace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="hover:text-blue-400 transition-colors">Core Services</Link>
              </li>
              <li>
                <Link to="/freelancers" className="hover:text-blue-400 transition-colors">Verified Freelancers</Link>
              </li>
              <li>
                <Link to="/customer/projects/create" className="hover:text-blue-400 transition-colors">Post a Project</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">AI Trust Score Model</Link>
              </li>
              <li>
                <Link to="/how-it-works#escrow" className="hover:text-blue-400 transition-colors">AI Broker Protocol</Link>
              </li>
            </ul>
          </div>

          {/* Architecture & College Faculty Info */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              System Architecture
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Frontend: React 19 + Tailwind
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Backend: PHP 8.2+ REST API
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                Database: MySQL 8.0+ (PDO)
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                AI: Google Gemini 3.8 Flash
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Escrow & Security
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Protected by simulated escrow ledger with ACID transaction guarantees. Ready for seamless migration to Stripe & Razorpay sandbox.
            </p>
            <div className="p-3 rounded-2xl bg-[#151B2E] border border-white/10 flex items-center gap-2.5 shadow-sm">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-slate-300 leading-tight">
                Cryptographic audit trails generated for every milestone release.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-500">© 2026 TrustLance AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/how-it-works" className="hover:text-white transition-colors">Architecture Whitepaper</Link>
            <span>·</span>
            <Link to="/faq" className="hover:text-white transition-colors">Platform FAQ</Link>
            <span>·</span>
            <Link to="/onboarding" className="hover:text-white transition-colors">Role Selection</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
