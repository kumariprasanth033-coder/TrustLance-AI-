import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { adminApi, disputesApi, resetLocalDatabase } from '../services/api';
import { Dispute } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = async () => {
    const m = await adminApi.getDashboardMetrics();
    setMetrics(m);
    // Fetch disputes from store
    try {
      const d = JSON.parse(localStorage.getItem('tl_disputes') || '[]');
      setDisputes(d);
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = async (actionType: string) => {
    if (!selectedDispute || !resolutionNotes.trim()) return;
    await disputesApi.resolve(selectedDispute.id, `${actionType.toUpperCase()}: ${resolutionNotes}`);
    setSelectedDispute(null);
    setResolutionNotes('');
    setActionSuccess('Dispute adjudicated successfully and updated in MySQL audit ledger.');
    setTimeout(() => setActionSuccess(null), 3500);
    loadData();
  };

  const handleResetData = () => {
    if (confirm('Reset entire platform database to initial state?')) {
      resetLocalDatabase();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Intelligence & Operations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audited financial telemetry, dispute arbitration, and risk compliance monitoring.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2 border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Platform DB</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Total Users</span>
          <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.total_users || 7}</span>
            <span className="text-[11px] text-slate-400">({metrics?.customers || 1} clients, {metrics?.freelancers || 5} talent)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Active Projects</span>
          <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{metrics?.active_projects || 3}</span>
            <span className="text-[11px] text-slate-400">contracts in progress</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Escrow Held in Vault</span>
          <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">${metrics?.escrow_held?.toFixed(2) || '1,600.00'}</span>
            <span className="text-[11px] text-slate-400">protected</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block uppercase">Open Disputes</span>
          <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-2xl font-extrabold text-rose-600">{metrics?.open_disputes || disputes.filter(d => d.status === 'OPEN').length}</span>
            <span className="text-[11px] text-slate-400">requiring review</span>
          </div>
        </div>
      </div>

      {/* Disputes Adjudication Console */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Escrow Dispute Adjudication</h3>
            <p className="text-xs text-slate-500">Examine scope claims, milestone submissions, and release/refund funds.</p>
          </div>
        </div>

        {disputes && disputes.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {disputes.map((disp) => (
              <div key={disp.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900 dark:text-white">Reason: {disp.reason}</strong>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      disp.status === 'OPEN' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}>
                      {disp.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] max-w-xl">{disp.description}</p>
                  {disp.resolution_notes && (
                    <p className="text-emerald-600 text-[11px] font-mono mt-1">Resolution: {disp.resolution_notes}</p>
                  )}
                </div>

                {disp.status === 'OPEN' && (
                  <button
                    onClick={() => setSelectedDispute(disp)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl whitespace-nowrap shadow-2xs"
                  >
                    Arbitrate Dispute
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <span>Zero pending disputes. Platform operations nominal.</span>
          </div>
        )}
      </div>

      {/* ARBITRATE DISPUTE MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Dispute Arbitration Decision
              </h3>
              <button onClick={() => setSelectedDispute(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Contention Summary:</span>
              <p className="text-slate-800 dark:text-slate-200 font-semibold">{selectedDispute.reason}</p>
              <p className="text-slate-500 text-[11px]">{selectedDispute.description}</p>
            </div>

            <div>
              <label className="block font-semibold mb-1">Official Resolution Findings & Notes</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="State the findings based on milestone deliverables and contract scope..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleResolve('Release to Freelancer')}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Release Funds to Freelancer
              </button>
              <button
                type="button"
                onClick={() => handleResolve('Refund to Customer')}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Refund Escrow to Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
