import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Database, Code, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                T
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                TrustLance <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              “Hire With Confidence. Work With Trust.”
              The next-generation freelancing marketplace powered by algorithmic AI Trust Scores and intelligent escrow protection.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Escrow Milestone Guarantee</span>
            </div>
          </div>

          {/* Core Marketplace */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Talent Marketplace
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">20 Core Services</Link>
              </li>
              <li>
                <Link to="/freelancers" className="hover:text-white transition-colors">Verified Freelancers</Link>
              </li>
              <li>
                <Link to="/customer/projects/create" className="hover:text-white transition-colors">Post a Project</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">AI Trust Score Model</Link>
              </li>
            </ul>
          </div>

          {/* Architecture & College Faculty Info */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              System Architecture
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Frontend: React 19 + Bootstrap 5
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Backend: PHP 8.2+ REST API
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                Database: MySQL 8.0+ (PDO)
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                AI: Google Gemini 3.8 Flash
              </li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Escrow & Security
            </h4>
            <p className="text-[11px] leading-relaxed mb-3">
              Protected by simulated escrow ledger with ACID transaction guarantees. Ready for seamless migration to Stripe & Razorpay sandbox.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[10px] text-slate-300">
                Cryptographic audit trails generated for every milestone release.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 TrustLance AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/how-it-works" className="hover:text-white transition-colors">Architecture Whitepaper</Link>
            <span>·</span>
            <Link to="/faq" className="hover:text-white transition-colors">Platform FAQ</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Gateway</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
