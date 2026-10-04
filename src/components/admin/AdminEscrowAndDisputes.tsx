import React, { useState, useEffect } from 'react';
import {
  Lock,
  Scale,
  ShieldAlert,
  Search,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Brain,
  Clock
} from 'lucide-react';
import { Card } from '../ui/Card';
import { adminApi, escrowApi } from '../../services/api';
import { EscrowAccount, Dispute } from '../../types';

interface AdminEscrowAndDisputesProps {
  initialTab?: 'escrow' | 'disputes' | 'risk-alerts' | 'ai-broker';
  onDataChanged: () => void;
}

export const AdminEscrowAndDisputes: React.FC<AdminEscrowAndDisputesProps> = ({
  initialTab = 'escrow',
  onDataChanged
}) => {
  const [activeTab, setActiveTab] = useState<'escrow' | 'disputes' | 'risk-alerts' | 'ai-broker'>(initialTab);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Intervention modal
  const [selectedEscrow, setSelectedEscrow] = useState<any | null>(null);
  const [interventionAction, setInterventionAction] = useState<'release_tranche' | 'refund'>('release_tranche');
  const [actionAmount, setActionAmount] = useState<number>(0);
  const [actionNotes, setActionNotes] = useState('');

  // Dispute adjudication modal
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [disputeNotes, setDisputeNotes] = useState('');
  const [splitPct, setSplitPct] = useState(50);

  const loadData = async () => {
    setLoading(true);
    try {
      const e = await adminApi.getEscrows(search, statusFilter !== 'all' ? statusFilter : undefined);
      const d = await adminApi.getDisputes(search, statusFilter !== 'all' ? statusFilter : undefined);
      setEscrows(e);
      setDisputes(d);
    } catch (err: any) {
      setMessage({ text: err.message || 'Error loading records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, search, statusFilter]);

  const handleOpenEscrowAction = (escrow: any, action: 'release_tranche' | 'refund') => {
    setSelectedEscrow(escrow);
    setInterventionAction(action);
    setActionAmount(escrow.held_amount || 0);
    setActionNotes('');
  };

  const handleExecuteEscrowAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscrow) return;

    try {
      await adminApi.performEscrowAction(
        selectedEscrow.id,
        interventionAction,
        actionAmount,
        actionNotes || `Admin executed ${interventionAction} from control center.`
      );
      setMessage({
        text: `Escrow #${selectedEscrow.id} action "${interventionAction}" completed and logged to audit ledger.`,
        type: 'success'
      });
      setSelectedEscrow(null);
      loadData();
      onDataChanged();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Escrow action failed', type: 'error' });
    }
  };

  const handleAdjudicateDispute = async (action: 'release_to_freelancer' | 'refund_to_customer' | 'split') => {
    if (!selectedDispute) return;
    try {
      await adminApi.resolveDispute(
        selectedDispute.id,
        action,
        disputeNotes || `Administrative resolution: ${action}`,
        splitPct
      );
      setMessage({
        text: `Dispute #${selectedDispute.id} adjudicated with action: ${action.toUpperCase()}. Escrow settled.`,
        type: 'success'
      });
      setSelectedDispute(null);
      setDisputeNotes('');
      loadData();
      onDataChanged();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Adjudication failed', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {activeTab === 'disputes' ? <Scale className="w-5 h-5 text-rose-600" /> : <Lock className="w-5 h-5 text-amber-500" />}
            <span>Financial Escrow Vault & Dispute Arbitration</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            ACID escrow ledger monitoring, tranche release authorization, and dispute adjudication.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'escrow' ? 'bg-white dark:bg-[#151B2E] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Escrow Accounts ({escrows.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'disputes' ? 'bg-white dark:bg-[#151B2E] text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Disputes ({disputes.length})
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {activeTab === 'escrow' ? (
            <>
              <option value="funded_held">Funded / Held</option>
              <option value="partially_released">Partially Released</option>
              <option value="fully_released">Fully Released</option>
              <option value="pending_funding">Pending Funding</option>
            </>
          ) : (
            <>
              <option value="OPEN">Open</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
            </>
          )}
        </select>
      </div>

      {/* Escrow Accounts Table */}
      {activeTab === 'escrow' && (
        <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bold-dark-text">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Escrow ID</th>
                  <th className="py-3.5 px-4">Project Contract</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Freelancer</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Held in Vault</th>
                  <th className="py-3.5 px-4">Released</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Interventions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {escrows.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{e.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white block line-clamp-1 max-w-xs">{e.project_title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Deadline: {e.deadline}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{e.customer_name}</td>
                    <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">{e.freelancer_name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">${e.total_amount}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">${e.held_amount}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">${e.released_amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        e.status === 'funded_held' || e.status === 'HELD' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300' :
                        e.status === 'fully_released' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-300'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {e.held_amount > 0 ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEscrowAction(e, 'release_tranche')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100"
                          >
                            Release
                          </button>
                          <button
                            onClick={() => handleOpenEscrowAction(e, 'refund')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-100"
                          >
                            Refund
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">Vault Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Disputes Adjudication Console */}
      {activeTab === 'disputes' && (
        <Card className="p-6 bg-white dark:bg-[#151B2E] space-y-4 bold-dark-text">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active & Historical Escrow Disputes</h3>
              <p className="text-[11px] font-semibold text-slate-500">Every adjudication executes double-entry escrow release/refund and logs to AdminAuditLogs.</p>
            </div>
          </div>

          {disputes.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {disputes.map((disp) => (
                <div key={disp.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-extrabold text-slate-900 dark:text-white">Reason: {disp.reason}</strong>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        disp.status === 'OPEN' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-300' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300'
                      }`}>
                        {disp.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] max-w-xl font-medium">{disp.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
                      <span>Contract: {disp.project_title}</span>
                      <span>Escrow in Vault: ${disp.escrow_held}</span>
                    </div>
                    {disp.resolution_notes && (
                      <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono mt-1 font-bold">
                        Resolution: {disp.resolution_notes}
                      </p>
                    )}
                  </div>

                  {disp.status === 'OPEN' && (
                    <button
                      onClick={() => setSelectedDispute(disp)}
                      className="btn-primary-gradient px-4 py-2 text-xs font-bold whitespace-nowrap shadow-md"
                    >
                      Arbitrate Dispute
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Zero open disputes across active contracts.</span>
            </div>
          )}
        </Card>
      )}

      {/* ESCROW INTERVENTION MODAL */}
      {selectedEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
              Admin Escrow Action: {interventionAction === 'release_tranche' ? 'Release Funds to Freelancer' : 'Refund Funds to Customer'}
            </h3>

            <form onSubmit={handleExecuteEscrowAction} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Contract Info:</span>
                <p className="font-extrabold text-slate-900 dark:text-white">{selectedEscrow.project_title}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Currently Held: ${selectedEscrow.held_amount}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Transaction Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedEscrow.held_amount}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Audit Log Justification / Notes</label>
                <textarea
                  rows={2}
                  required
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Official record of why manual administrative release or refund was executed..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEscrow(null)}
                  className="btn-secondary-surface py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient py-2.5 text-xs font-bold"
                >
                  Execute Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPUTE ARBITRATION MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
              Dispute Arbitration Console
            </h3>

            <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Contention Summary:</span>
              <p className="font-extrabold text-slate-900 dark:text-white">{selectedDispute.reason}</p>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{selectedDispute.description}</p>
              <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                Vault Escrow at Stake: ${selectedDispute.escrow_held}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Official Findings & Resolution Record</label>
              <textarea
                rows={3}
                required
                value={disputeNotes}
                onChange={(e) => setDisputeNotes(e.target.value)}
                placeholder="State the findings based on milestone deliverables, chats, and contract requirements..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Select Adjudication Payout:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjudicateDispute('release_to_freelancer')}
                  className="btn-primary-gradient py-2.5 text-[11px] font-bold"
                >
                  100% Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjudicateDispute('refund_to_customer')}
                  className="btn-secondary-surface py-2.5 text-[11px] font-bold"
                >
                  100% Client Refund
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjudicateDispute('split')}
                  className="btn-secondary-surface text-indigo-600 dark:text-indigo-400 py-2.5 text-[11px] font-bold"
                >
                  50 / 50 Split
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-[11px]"
              >
                Close without saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
