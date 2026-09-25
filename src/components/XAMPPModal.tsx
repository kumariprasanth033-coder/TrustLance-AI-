import React, { useState } from 'react';
import { X, Server, Database, CheckCircle, Terminal, Copy, RotateCcw } from 'lucide-react';
import { resetLocalDatabase } from '../services/api';

interface XAMPPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const XAMPPModal: React.FC<XAMPPModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'seed' | 'guide'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset database to initial seed data? All active projects, proposals and escrow transactions will be restored.')) {
      resetLocalDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                PHP 8.2 + MySQL Architecture & XAMPP Guide
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                  PRODUCTION READY
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grounded in normalized relational schema, PDO prepared queries, and simulated escrow state.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/40 dark:bg-slate-900/40 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Pipeline
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            XAMPP Local Run Steps
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            schema.sql
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === 'seed'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            seed.sql
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs leading-5">
                <div className="text-blue-600 dark:text-blue-400 font-bold mb-2">// Full-Stack Architecture Contract:</div>
                <div>React.js (Vite + Bootstrap 5 + Tailwind)</div>
                <div className="text-slate-400 pl-4">│  Axios HTTP Client (Bearer tokens, JSON payload)</div>
                <div className="text-slate-400 pl-4">▼</div>
                <div>PHP 8.2+ RESTful Controller Architecture (/backend/api/*)</div>
                <div className="text-slate-400 pl-4">│  PDO Prepared Statements + Session/Token Auth</div>
                <div className="text-slate-400 pl-4">▼</div>
                <div>MySQL 8.0+ Relational Database (trustlance_ai)</div>
                <div className="text-slate-400 pl-4">│  26 Normalized Tables with Foreign Keys & ACID Transactions</div>
                <div className="text-slate-400 pl-4">▼</div>
                <div>Escrow Vault Ledger (State machine: funded_held → partially_released → completed)</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                    <Database className="w-4 h-4 text-emerald-500" />
                    MySQL Database Engine
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Schema includes users, customers, freelancers, services, projects, milestones, escrow accounts, transactions, and audit logs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    ACID Escrow Ledger
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    All escrow funding, tranche release, and dispute resolutions run inside PDO transactions with rollback safety.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Running TrustLance AI locally on XAMPP (Apache + MySQL):
              </h4>
              <ol className="list-decimal pl-5 space-y-2.5">
                <li>
                  <strong>Copy project into XAMPP:</strong>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1 font-mono text-[11px]">
                    C:\xampp\htdocs\TrustLance-AI\
                  </div>
                </li>
                <li>
                  <strong>Start XAMPP Control Panel:</strong>
                  <span> Click <em>Start</em> for both <strong>Apache</strong> and <strong>MySQL</strong>.</span>
                </li>
                <li>
                  <strong>Import Database:</strong>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1 font-mono text-[11px]">
                    mysql -u root -p &lt; database/schema.sql<br />
                    mysql -u root -p &lt; database/seed.sql
                  </div>
                </li>
                <li>
                  <strong>Run Frontend Dev Server:</strong>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1 font-mono text-[11px]">
                    npm install && npm run dev
                  </div>
                </li>
              </ol>
            </div>
          )}

          {(activeTab === 'schema' || activeTab === 'seed') && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-slate-500 text-[11px]">
                  File: /database/{activeTab}.sql
                </span>
                <button
                  onClick={() => handleCopy(`USE trustlance_ai; -- ${activeTab} data`)}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy Snippet'}
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96">
                {activeTab === 'schema'
                  ? `-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role ENUM('customer', 'freelancer', 'admin') NOT NULL,
  status ENUM('active', 'suspended', 'pending_verification') DEFAULT 'active'
) ENGINE=InnoDB;

-- 2. ESCROW_ACCOUNTS (State Machine)
CREATE TABLE IF NOT EXISTS escrow_accounts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL UNIQUE,
  total_amount DECIMAL(12,2) NOT NULL,
  held_amount DECIMAL(12,2) NOT NULL,
  released_amount DECIMAL(12,2) DEFAULT 0.00,
  status ENUM('pending_funding', 'funded_held', 'partially_released', 'fully_released', 'disputed')
) ENGINE=InnoDB;`
                  : `-- 20 INITIAL SERVICES SEED
INSERT INTO services (id, name, slug, description, category, avg_budget, delivery_days) VALUES
(1, 'Web Development', 'web-development', 'Full-stack web applications, modern responsive React/Next.js platforms...', 'Engineering', 1200.00, 14),
(2, 'Mobile App Development', 'mobile-app-development', 'Native iOS, Android and cross-platform React Native / Flutter apps...', 'Engineering', 2400.00, 21),
(3, 'UI/UX Design', 'ui-ux-design', 'Figma user journey mapping, design systems, wireframing...', 'Design', 950.00, 10);`}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo DB State
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
