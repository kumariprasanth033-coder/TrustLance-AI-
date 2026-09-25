import React from 'react';
import { HelpCircle, Shield, CheckCircle2 } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'Why does TrustLance AI prioritize PHP and MySQL over NoSQL/Firebase?',
      a: 'Financial escrow records, milestone tranches, and talent reputation require strict relational guarantees (foreign keys, transaction atomicity, and cascading updates). PHP 8.2 + MySQL 8.0 is a proven, battle-tested full-stack standard that runs natively on XAMPP and handles ACID transactional accounting flawlessly.'
    },
    {
      q: 'How does the Simulated Escrow Payment system work in this project?',
      a: 'For academic and prototype demonstrations, TrustLance AI implements a complete database-backed simulated payment provider. When a customer clicks "Fund Escrow", the PHP backend verifies project ownership, generates a unique transaction reference (e.g. TX-ESCROW-2026-XXXX), moves the escrow state from pending_funding to funded_held, and notifies the freelancer to begin work. When the milestone is approved, the funds transfer to the freelancer’s wallet.'
    },
    {
      q: 'Is the Gemini AI Assistant connected to real database information?',
      a: 'Yes! When you converse with the TrustLance AI Assistant via the floating button, the backend automatically retrieves the authenticated user’s active projects, escrow balances, and Trust Score factor breakdowns from MySQL. This context is injected into the Gemini prompt so the assistant provides factual, grounded answers rather than generic advice.'
    },
    {
      q: 'How does the platform handle disputes between clients and freelancers?',
      a: 'If a project reaches an impasse regarding deliverables or deadlines, either party can open a formal dispute. This freezes the escrow funds in a disputed status and alerts platform administrators. Platform moderators examine the original project scope, chat logs, milestone definitions, and deliverable files to make a fair binding decision (full release, refund, or split).'
    },
    {
      q: 'How do I migrate this application to run on local XAMPP?',
      a: 'Simply copy the project folder into your XAMPP htdocs directory (e.g. C:\\xampp\\htdocs\\TrustLance-AI), start Apache and MySQL in XAMPP, import database/schema.sql and database/seed.sql via phpMyAdmin, and run npm run dev for the React frontend. Refer to the included README.md for step-by-step commands.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
          Knowledge Base & Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Everything you need to know about TrustLance AI architecture, escrow guarantees, and AI Trust Scores.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
          >
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
