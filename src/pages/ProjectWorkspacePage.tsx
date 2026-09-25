import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Upload, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  Send, 
  RotateCcw, 
  Check, 
  ChevronLeft,
  Sparkles,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  projectsApi, 
  escrowApi, 
  deliverablesApi, 
  messagesApi, 
  reviewsApi, 
  disputesApi, 
  proposalsApi,
  authApi 
} from '../services/api';
import { EscrowTimeline } from '../components/EscrowTimeline';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const currentUser = authApi.getCurrentUser();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'deliverables' | 'escrow' | 'messages' | 'dispute'>('overview');
  
  // Forms & Modals state
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState(0);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [deliverTitle, setDeliverTitle] = useState('');
  const [deliverNotes, setDeliverNotes] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState('');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<number | null>(null);

  // Proposal modal
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalPrice, setProposalPrice] = useState(0);
  const [coverLetter, setCoverLetter] = useState('');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5.0);
  const [reviewComment, setReviewComment] = useState('');

  // Dispute modal
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');

  // Chat message input
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const loadProject = async () => {
    if (!projectId) return;
    const res = await projectsApi.getById(projectId);
    setData(res);
    if (res?.project) {
      setFundAmount(res.project.budget);
      setProposalPrice(res.project.budget);
    }
    const msgs = await messagesApi.list(projectId);
    setMessages(msgs);
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  if (!data?.project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading project workspace state from MySQL...
      </div>
    );
  }

  const project = data.project;
  const isCustomer = currentUser?.role === 'customer' || currentUser?.email === 'customer@demo.com';
  const isFreelancer = currentUser?.role === 'freelancer' || currentUser?.email === 'freelancer@demo.com';

  const triggerNotify = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // 1. Fund Escrow Action
  const handleFundEscrow = async () => {
    setLoading(true);
    try {
      await escrowApi.fund(projectId, Number(fundAmount));
      setShowFundModal(false);
      triggerNotify(`Payment of $${fundAmount} successfully secured in TrustLance AI Escrow Vault.`);
      await loadProject();
    } catch (e: any) {
      alert(e.message || 'Funding failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Release Escrow Milestone Action
  const handleReleaseMilestone = async (milestone: any) => {
    if (!confirm(`Approve Milestone "${milestone.title}" and release $${milestone.amount} to freelancer?`)) return;
    setLoading(true);
    try {
      await escrowApi.release(projectId, milestone.amount, milestone.id);
      triggerNotify(`Milestone approved! $${milestone.amount.toFixed(2)} released to freelancer wallet.`);
      await loadProject();
    } catch (e: any) {
      alert(e.message || 'Release failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Deliverable Action
  const handleSubmitDeliverable = async () => {
    if (!deliverTitle.trim()) return;
    setLoading(true);
    try {
      await deliverablesApi.submit(projectId, null, deliverTitle, deliverNotes);
      setShowDeliverModal(false);
      setDeliverTitle('');
      setDeliverNotes('');
      triggerNotify('Deliverable submitted. Customer notified to inspect work.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Request Revision Action
  const handleRequestRevision = async () => {
    if (!selectedDeliverableId || !revisionDetails.trim()) return;
    setLoading(true);
    try {
      await deliverablesApi.requestRevision(selectedDeliverableId, revisionDetails);
      setShowRevisionModal(false);
      setRevisionDetails('');
      triggerNotify('Revision request sent to freelancer with your feedback.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Submit Proposal Action
  const handleSubmitProposal = async () => {
    if (!coverLetter.trim() || proposalPrice <= 0) return;
    setLoading(true);
    try {
      await proposalsApi.submit({
        project_id: projectId,
        cover_letter: coverLetter,
        proposed_price: Number(proposalPrice),
        delivery_days: 14
      });
      setShowProposalModal(false);
      triggerNotify('Proposal submitted with AI Match Score calculation.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Accept Proposal Action
  const handleAcceptProposal = async (proposalId: number) => {
    if (!confirm('Accept this proposal and assign freelancer to project?')) return;
    setLoading(true);
    try {
      await proposalsApi.accept(proposalId);
      triggerNotify('Freelancer hired! Please fund escrow to activate workspace.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. Submit Review
  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      await reviewsApi.create(projectId, rating, reviewComment);
      setShowReviewModal(false);
      triggerNotify('Review published! Freelancer AI Trust Score recalculated.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 8. Open Dispute
  const handleOpenDispute = async () => {
    if (!disputeReason.trim() || !disputeDetails.trim()) return;
    setLoading(true);
    try {
      await disputesApi.open(projectId, disputeReason, disputeDetails);
      setShowDisputeModal(false);
      triggerNotify('Dispute registered. Escrow locked pending admin arbitration.');
      await loadProject();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 9. Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = await messagesApi.send(projectId, chatMessage);
    setMessages(prev => [...prev, msg]);
    setChatMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb & Notification Banner */}
      <div className="flex items-center justify-between">
        <Link
          to={isCustomer ? '/customer/dashboard' : '/freelancer/dashboard'}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {notificationMsg && (
          <div className="p-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}
      </div>

      {/* Project Workspace Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/60 px-2.5 py-0.5 rounded uppercase border border-blue-200/60 dark:border-blue-900">
              {project.service_name || 'Service Contract'}
            </span>
            <span className="text-slate-400">·</span>
            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${
              project.status === 'in_progress' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60' :
              project.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60' :
              project.status === 'under_review' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/60' :
              project.status === 'disputed' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/60' :
              'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60'
            }`}>
              {project.status.replace('_', ' ')}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">ID #{project.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs tabular-nums font-mono text-slate-600 dark:text-slate-400 pt-1 font-medium">
            <span>Budget: <strong className="text-slate-900 dark:text-white font-bold">${project.budget.toFixed(2)}</strong></span>
            <span>Target Deadline: <strong className="text-slate-900 dark:text-white font-bold">{project.deadline}</strong></span>
            <span>Customer: <strong className="text-slate-900 dark:text-white font-sans font-bold">{project.customer_name}</strong></span>
            {project.hired_freelancer_name && (
              <span>Hired: <strong className="text-blue-600 dark:text-blue-400 font-sans font-bold">{project.hired_freelancer_name}</strong></span>
            )}
          </div>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* If project has proposals and is open, customer can review proposals tab */}
          {project.status === 'open' && isFreelancer && (
            <button
              onClick={() => setShowProposalModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Proposal</span>
            </button>
          )}

          {/* If freelancer is hired and escrow is not yet funded */}
          {project.selected_freelancer_id && (!data.escrow || data.escrow.status === 'pending_funding') && isCustomer && (
            <button
              onClick={() => setShowFundModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Fund Escrow (${project.budget.toFixed(2)})</span>
            </button>
          )}

          {/* If project in_progress and freelancer wants to upload deliverable */}
          {project.status === 'in_progress' && isFreelancer && (
            <button
              onClick={() => setShowDeliverModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Deliverable</span>
            </button>
          )}

          {/* If project is completed, customer can review */}
          {project.status === 'completed' && isCustomer && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-white/20" />
              <span>Submit Freelancer Review</span>
            </button>
          )}

          {/* Dispute trigger */}
          {['in_progress', 'under_review'].includes(project.status) && (
            <button
              onClick={() => setShowDisputeModal(true)}
              className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-semibold rounded-xl transition-colors bg-white dark:bg-slate-800 shadow-2xs"
            >
              Open Dispute
            </button>
          )}
        </div>
      </div>

      {/* Escrow Timeline Visual */}
      <EscrowTimeline
        currentStatus={project.status}
        heldAmount={data.escrow?.held_amount || 0}
        releasedAmount={data.escrow?.released_amount || 0}
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Overview & Scope
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'milestones' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Milestones ({data.milestones?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'deliverables' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Deliverables ({data.deliverables?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('escrow')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'escrow' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Escrow Ledger & Receipts
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'messages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Workspace Chat ({messages.length})
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Project Description</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {project.description}
              </p>

              {project.requirements && (
                <>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-6 mb-2">Technical Specifications</h4>
                  <pre className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-line border border-slate-200 dark:border-slate-700">
                    {project.requirements}
                  </pre>
                </>
              )}
            </div>

            {/* Proposals Received (if project is open) */}
            {data.proposals && data.proposals.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                  Proposals Received ({data.proposals.length})
                </h3>

                <div className="space-y-4">
                  {data.proposals.map((pr: any) => (
                    <div key={pr.id} className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 text-xs shadow-2xs">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <img src={pr.freelancer_avatar} alt={pr.freelancer_name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                          <div>
                            <strong className="text-slate-900 dark:text-white block font-bold">{pr.freelancer_name}</strong>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">{pr.headline}</span>
                          </div>
                          <span className="ml-auto sm:ml-2 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 font-bold text-[10px] border border-blue-200/60 dark:border-blue-800">
                            {pr.ai_match_score}% AI Match
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                          "{pr.cover_letter}"
                        </p>
                      </div>

                      <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                        <span className="font-bold text-sm text-slate-900 dark:text-white tabular-nums font-mono">
                          ${pr.proposed_price.toFixed(2)}
                        </span>
                        
                        {project.status === 'open' && isCustomer && pr.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptProposal(pr.id)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                          >
                            Accept & Hire
                          </button>
                        )}

                        {pr.status === 'accepted' && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Hired
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Contract Details */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-white">Escrow Protection State</h4>
              <div className="space-y-2 tabular-nums font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Total Scope Value:</span>
                  <strong className="text-slate-900 dark:text-white">${project.budget.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Held in Escrow:</span>
                  <strong className="text-blue-600 dark:text-blue-400">${(data.escrow?.held_amount || 0).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Released Tranches:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">${(data.escrow?.released_amount || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MILESTONES TAB */}
      {activeTab === 'milestones' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Project Milestones</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Each milestone is independently verified and approved.</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.milestones?.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                      {m.order_index}
                    </span>
                    <strong className="text-slate-900 dark:text-white text-xs">{m.title}</strong>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 pl-7 font-medium">
                    {m.description || 'Milestone scope deliverable'}
                  </p>
                </div>

                <div className="flex items-center gap-4 pl-7 sm:pl-0 w-full sm:w-auto justify-between">
                  <span className="font-bold font-mono tabular-nums text-sm text-slate-900 dark:text-white">
                    ${m.amount.toFixed(2)}
                  </span>

                  {/* Customer action to approve and release tranche */}
                  {isCustomer && m.status === 'submitted' && (
                    <button
                      onClick={() => handleReleaseMilestone(m)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs"
                    >
                      Approve & Release ${m.amount.toFixed(2)}
                    </button>
                  )}

                  {m.status === 'released' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Released
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DELIVERABLES TAB */}
      {activeTab === 'deliverables' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submitted Deliverables</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Inspect code archives, design packages, and reports.</p>
            </div>
            {isFreelancer && project.status === 'in_progress' && (
              <button
                onClick={() => setShowDeliverModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs"
              >
                + New Deliverable
              </button>
            )}
          </div>

          {data.deliverables && data.deliverables.length > 0 ? (
            <div className="space-y-3">
              {data.deliverables.map((deliv: any) => (
                <div key={deliv.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <strong className="text-slate-900 dark:text-white">{deliv.title}</strong>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                        v{deliv.version}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                        {deliv.status.replace('_', ' ')}
                      </span>
                    </div>
                    {deliv.notes && (
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 pl-6 font-medium">
                        {deliv.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pl-6 sm:pl-0">
                    {/* Customer revision request */}
                    {isCustomer && deliv.status === 'submitted' && (
                      <button
                        onClick={() => {
                          setSelectedDeliverableId(deliv.id);
                          setShowRevisionModal(true);
                        }}
                        className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg"
                      >
                        Request Revision
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No deliverables uploaded yet for this project.</p>
          )}
        </div>
      )}

      {/* 4. ESCROW LEDGER & RECEIPTS TAB */}
      {activeTab === 'escrow' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl space-y-6 text-xs">
          
          {/* Visual Security / Shield Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/5 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Escrow Protected Contract
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    100% GUARANTEED
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  Capital is locked in autonomous smart vault until milestone criteria are verified.
                </p>
              </div>
            </div>

            {isCustomer && (!data.escrow || data.escrow.held_amount === 0) && (
              <button
                onClick={() => setShowFundModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20"
              >
                + Fund Escrow
              </button>
            )}
          </div>

          {/* Key Escrow Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Amount Held
              </span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums mt-1 block">
                ${data.escrow?.held_amount ? data.escrow.held_amount.toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Project
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1 block">
                {data.project.title}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Freelancer
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1 block">
                {data.project.freelancer_name || 'Assigned Talent'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block tracking-wider">
                Escrow Status
              </span>
              <div className="mt-1">
                {(() => {
                  const status = data.escrow?.status || data.project.status;
                  if (status === 'payment_held' || status === 'open') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase">PAYMENT HELD</span>;
                  }
                  if (status === 'in_progress') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 uppercase">IN PROGRESS</span>;
                  }
                  if (status === 'under_review') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">UNDER REVIEW</span>;
                  }
                  if (status === 'completed' || status === 'released') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">RELEASED</span>;
                  }
                  if (status === 'refunded') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase">REFUNDED</span>;
                  }
                  if (status === 'disputed') {
                    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase">DISPUTED</span>;
                  }
                  return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase">PAYMENT HELD</span>;
                })()}
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table */}
          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Immutable Escrow Ledger
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {data.escrow_transactions && data.escrow_transactions.length > 0 ? (
                    data.escrow_transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">{tx.reference_id}</td>
                        <td className="py-3 px-4 uppercase font-medium">{tx.type}</td>
                        <td className="py-3 px-4 tabular-nums font-bold text-slate-900 dark:text-white">${tx.amount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === 'completed' || tx.status === 'released'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : tx.status === 'refunded'
                              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                              : tx.status === 'disputed'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-sans text-[10px]">{new Date(tx.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-center text-slate-400">
                        No transactions recorded yet in ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. WORKSPACE CHAT TAB */}
      {activeTab === 'messages' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[500px]">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Workspace Communication</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Secure project discussion recorded in MySQL.</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m: any) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img src={m.sender_avatar} alt={m.sender_name} className="w-5 h-5 rounded-full object-cover" />
                    <strong className="text-slate-900 dark:text-white font-semibold">{m.sender_name}</strong>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">({m.sender_role})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pl-7 font-medium">{m.message_text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type message to collaborator..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL 1: FUND ESCROW MODAL */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fund Escrow Vault</h3>
                <p className="text-[11px] text-slate-500">Simulated Escrow Payment System (ACID Guarantee)</p>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Deposit Amount (USD)</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold font-mono text-sm border border-slate-200 dark:border-slate-700"
              />
            </div>

            <p className="text-slate-500 text-[11px] leading-relaxed">
              Funds are held programmatically in the Trust Vault. The freelancer cannot withdraw until you inspect and approve their submitted deliverables.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFundModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFundEscrow}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {loading ? 'Securing Funds...' : `Confirm Deposit $${fundAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT DELIVERABLE MODAL */}
      {showDeliverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit Work Deliverable</h3>
            <div>
              <label className="block font-semibold mb-1">Deliverable Title</label>
              <input
                type="text"
                placeholder="e.g. Frontend Components Bundle v1.2"
                value={deliverTitle}
                onChange={(e) => setDeliverTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Handover Notes & Documentation</label>
              <textarea
                rows={3}
                placeholder="Summary of completed tasks, pull requests, or link to test build..."
                value={deliverNotes}
                onChange={(e) => setDeliverNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeliverModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitDeliverable}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Submit for Client Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST REVISION MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Request Revision</h3>
            <div>
              <label className="block font-semibold mb-1">Feedback & Adjustments Needed</label>
              <textarea
                rows={4}
                placeholder="Specify exact changes needed to align with requirements..."
                value={revisionDetails}
                onChange={(e) => setRevisionDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleRequestRevision}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Send Revision Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SUBMIT PROPOSAL MODAL */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Submit Proposal to Project</h3>
            <div>
              <label className="block font-semibold mb-1">Proposed Price ($ USD)</label>
              <input
                type="number"
                value={proposalPrice}
                onChange={(e) => setProposalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold font-mono text-sm border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Cover Letter & Approach</label>
              <textarea
                rows={4}
                placeholder="Detail your relevant experience and project plan..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProposalModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitProposal}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: SUBMIT REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Review Freelancer Performance</h3>
            <div>
              <label className="block font-semibold mb-1">Rating: {rating} Stars</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Written Review</label>
              <textarea
                rows={3}
                placeholder="Share your experience working with this freelancer..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitReview}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DISPUTE MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Open Contract Dispute</h3>
            </div>
            <div>
              <label className="block font-semibold mb-1">Dispute Reason</label>
              <input
                type="text"
                placeholder="e.g. Scope divergence or unresponsiveness"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Evidence & Context</label>
              <textarea
                rows={3}
                placeholder="Provide factual details for administrative arbitration..."
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleOpenDispute}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Lock Escrow & Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
