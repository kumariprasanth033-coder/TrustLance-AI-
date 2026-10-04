import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Lock, 
  Scale, 
  RotateCcw, 
  Cpu, 
  Activity, 
  FileCheck, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { aiBrokerApi, automatedTestsApi } from '../services/aiBroker';
import { projectsApi, auditApi, resetLocalDatabase } from '../services/api';
import { TestResultItem, ActivityLog, Project } from '../types';

export const AIBrokerDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluatingDeadlines, setEvaluatingDeadlines] = useState(false);
  const [deadlineMessage, setDeadlineMessage] = useState<string | null>(null);

  // Automated Test Suite State
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [testSummary, setTestSummary] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState<{ current: number; total: number } | null>(null);
  const [testFilter, setTestFilter] = useState<'ALL' | 'WORKFLOW' | 'SECURITY' | 'PASSED' | 'FAILED'>('ALL');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  // Active sub-view tab: 'dashboard' | 'testing' | 'audit' | 'timeline'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'testing' | 'audit' | 'timeline'>('dashboard');

  const loadDashboardData = async () => {
    try {
      const [m, pList, logs] = await Promise.all([
        aiBrokerApi.getBrokerDashboardMetrics(),
        projectsApi.list(),
        auditApi.list()
      ]);
      setMetrics(m);
      setProjects(pList);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load broker metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRunAllTests = async () => {
    setIsRunningTests(true);
    setTestProgress({ current: 0, total: 31 });
    try {
      const { results, summary } = await automatedTestsApi.runAllTests((current, total, result) => {
        setTestProgress({ current, total });
        setTestResults(prev => [...prev.filter(r => r.id !== result.id), result]);
      });
      setTestResults(results);
      setTestSummary(summary);
      // Reload database metrics as tests execute verified transactions
      await loadDashboardData();
    } catch (e) {
      console.error('Test execution failed', e);
    } finally {
      setIsRunningTests(false);
      setTestProgress(null);
    }
  };

  const handleEvaluateDeadlines = async () => {
    setEvaluatingDeadlines(true);
    try {
      const res = await aiBrokerApi.checkAllProjectDeadlines();
      setDeadlineMessage(`Deadline scan complete: Evaluated ${res.evaluatedCount} projects. Missed deadlines triggered: ${res.missedCount}.`);
      await loadDashboardData();
      setTimeout(() => setDeadlineMessage(null), 5000);
    } catch (err: any) {
      setDeadlineMessage(`Scan error: ${err.message}`);
    } finally {
      setEvaluatingDeadlines(false);
    }
  };

  const filteredTests = testResults.filter(test => {
    if (testFilter === 'WORKFLOW') return test.category === 'CORE_WORKFLOW';
    if (testFilter === 'SECURITY') return test.category === 'SECURITY';
    if (testFilter === 'PASSED') return test.status === 'PASSED';
    if (testFilter === 'FAILED') return test.status === 'FAILED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Escrow Protocol</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="text-purple-600 dark:text-purple-400">MySQL State Machine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Broker Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Real-time escrow state machine enforcement, deadline risk telemetry, non-fungible audit logs, and automated compliance test runner.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleEvaluateDeadlines}
            disabled={evaluatingDeadlines}
            className="btn-secondary-surface px-4 py-2.5 text-xs font-bold gap-2 text-amber-600 dark:text-amber-400 hover:border-amber-400/40"
          >
            <Clock className={`w-3.5 h-3.5 ${evaluatingDeadlines ? 'animate-spin' : ''}`} />
            <span>{evaluatingDeadlines ? 'Evaluating...' : 'Scan Project Deadlines'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('testing');
              handleRunAllTests();
            }}
            disabled={isRunningTests}
            className="btn-primary-gradient px-5 py-2.5 text-xs font-extrabold gap-2 shadow-lg shadow-blue-500/20"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunningTests ? 'animate-pulse' : ''}`} />
            <span>{isRunningTests ? 'Running Test Suite...' : 'Run Automated Tests (31)'}</span>
          </button>
        </div>
      </div>

      {deadlineMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{deadlineMessage}</span>
          </div>
          <button onClick={() => setDeadlineMessage(null)} className="text-amber-600 dark:text-amber-400 font-bold">×</button>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-bold overflow-x-auto scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Broker Dashboard & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('testing')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'testing'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Automated Test Runner</span>
          {testSummary && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {testSummary.passed}/{testSummary.total} PASS
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Project Timelines & Predictions ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Audit Log Ledger ({auditLogs.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. BROKER MONITORING DASHBOARD (Requirement 12) */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Key Metrics Grid (All from Database) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card hoverLift className="p-4 sm:p-5 bold-dark-text">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Total Escrow Held
              </span>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  ${(metrics?.total_escrow_held || 0).toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Live vault balance</span>
            </Card>

            <Card hoverLift className="p-4 sm:p-5 bold-dark-text">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Active Projects
              </span>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {metrics?.active_projects || 0}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">in flight</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Monitored 24/7</span>
            </Card>

            <Card hoverLift className="p-4 sm:p-5 bold-dark-text">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Projects At Risk
              </span>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className={`text-xl sm:text-2xl font-extrabold ${
                  (metrics?.projects_at_risk || 0) > 0 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {metrics?.projects_at_risk || 0}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">flagged</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">High or Critical risk</span>
            </Card>

            <Card hoverLift className="p-4 sm:p-5 bold-dark-text">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Upcoming Deadlines
              </span>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {metrics?.upcoming_deadlines || 0}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">≤ 5 days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Velocity watch active</span>
            </Card>

            <Card hoverLift className="p-4 sm:p-5 bold-dark-text">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Deadline Missed
              </span>
              <div className="mt-2 flex items-baseline gap-1 font-mono">
                <span className={`text-xl sm:text-2xl font-extrabold ${
                  (metrics?.deadline_missed || 0) > 0 ? 'text-rose-600' : 'text-slate-400'
                }`}>
                  {metrics?.deadline_missed || 0}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">breaches</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Escrow locked / refund</span>
            </Card>
          </div>

          {/* Secondary Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 flex items-center justify-between bold-dark-text">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Pending Reviews</span>
                <strong className="text-lg font-bold text-slate-900 dark:text-white">{metrics?.pending_reviews || 0}</strong>
              </div>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 flex items-center justify-between bold-dark-text">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Refund Records</span>
                <strong className="text-lg font-bold text-slate-900 dark:text-white">
                  {metrics?.refunds_count || 0} (${(metrics?.refunds_total || 0).toFixed(0)})
                </strong>
              </div>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 flex items-center justify-between bold-dark-text">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Released Payments</span>
                <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  ${(metrics?.released_payments || 0).toFixed(2)}
                </strong>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 flex items-center justify-between bold-dark-text">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Disputes</span>
                <strong className="text-lg font-bold text-rose-500">{metrics?.active_disputes || 0}</strong>
              </div>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Risk Distribution & Escrow State Machine Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Risk Distribution Card */}
            <Card className="p-6 space-y-4 bold-dark-text">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 bold-dark-text">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                  <span>Algorithmic Risk Distribution</span>
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Active Pipeline</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400 block">LOW</span>
                  <strong className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
                    {metrics?.risk_distribution?.LOW || 0}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400 block">MEDIUM</span>
                  <strong className="text-xl font-bold font-mono text-amber-700 dark:text-amber-300">
                    {metrics?.risk_distribution?.MEDIUM || 0}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                  <span className="text-[10px] font-mono uppercase font-bold text-orange-600 dark:text-orange-400 block">HIGH</span>
                  <strong className="text-xl font-bold font-mono text-orange-700 dark:text-orange-300">
                    {metrics?.risk_distribution?.HIGH || 0}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-600 block">CRITICAL</span>
                  <strong className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400">
                    {metrics?.risk_distribution?.CRITICAL || 0}
                  </strong>
                </div>
              </div>

              {/* Visual Distribution Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden flex">
                {(() => {
                  const total = (metrics?.risk_distribution?.LOW || 0) + 
                                (metrics?.risk_distribution?.MEDIUM || 0) + 
                                (metrics?.risk_distribution?.HIGH || 0) + 
                                (metrics?.risk_distribution?.CRITICAL || 0) || 1;
                  const lowPct = ((metrics?.risk_distribution?.LOW || 0) / total) * 100;
                  const medPct = ((metrics?.risk_distribution?.MEDIUM || 0) / total) * 100;
                  const highPct = ((metrics?.risk_distribution?.HIGH || 0) / total) * 100;
                  const critPct = ((metrics?.risk_distribution?.CRITICAL || 0) / total) * 100;
                  return (
                    <>
                      <div style={{ width: `${lowPct}%` }} className="bg-emerald-500 h-full" title="Low Risk" />
                      <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" title="Medium Risk" />
                      <div style={{ width: `${highPct}%` }} className="bg-orange-500 h-full" title="High Risk" />
                      <div style={{ width: `${critPct}%` }} className="bg-rose-500 h-full" title="Critical Risk" />
                    </>
                  );
                })()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Risk calculation synthesizes remaining deadline runway, deliverable approval state, milestone progress, communication cadence, and freelancer Trust Score.
              </p>
            </Card>

            {/* Escrow State Machine Specification Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  <span>Escrow State Machine Protocol</span>
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Enforced
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Happy Path:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px] text-right">
                    CREATED → FUNDED → HELD → WORK_IN_PROGRESS → SUBMITTED → UNDER_REVIEW → RELEASED
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Revision Loop:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                    UNDER_REVIEW → REVISION_REQUESTED → RESUBMITTED → UNDER_REVIEW
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Deadline Breach:</span>
                  <span className="font-bold text-rose-500 text-[11px]">
                    HELD → DEADLINE_MISSED → REFUND_PENDING → REFUNDED
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Dispute Escalation:</span>
                  <span className="font-bold text-purple-400 text-[11px]">
                    UNDER_REVIEW → DISPUTED → ADMIN_REVIEW → RELEASED / REFUNDED
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                * All state transitions are guarded by atomic server-side validators. Invalid transitions throw rollback exceptions.
              </div>
            </Card>
          </div>

          {/* Recent Broker Actions Feed */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent AI Broker Actions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated decisions, milestone unlocks, and deadline checks recorded in MySQL.</p>
              </div>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>View Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {(metrics?.recent_actions || []).length > 0 ? (
                metrics.recent_actions.slice(0, 6).map((log: ActivityLog) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{log.action}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{log.project_title || `Project #${log.project_id}`}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{log.reason}</p>
                    </div>

                    <div className="text-right sm:shrink-0 font-mono text-[10px] text-slate-400">
                      <div className="font-bold text-slate-600 dark:text-slate-300">
                        {log.old_state} → {log.new_state}
                      </div>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">Zero actions recorded yet.</div>
              )}
            </div>
          </Card>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. AUTOMATED TEST RUNNER (Requirement 14 & 15) */}
      {/* ======================================================== */}
      {activeTab === 'testing' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Automated Workflow & Security Test Suite
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Executes 20 Core Workflow Invariants and 11 Critical Security Boundary Invariants against the database engine.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAllTests}
                disabled={isRunningTests}
                className="btn-primary-gradient px-5 py-2.5 text-xs font-extrabold gap-2 shadow-md shadow-blue-500/20"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunningTests ? 'animate-pulse' : ''}`} />
                <span>{isRunningTests ? 'Executing Tests...' : 'Run All 31 Tests'}</span>
              </button>
            </div>
          </div>

          {/* Test Summary Banner (If executed) */}
          {testSummary && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                  ✓
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {testSummary.passed === testSummary.total ? 'All Tests Verified Successfully' : 'Test Suite Completed with Failures'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Completed in <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{testSummary.duration_ms}ms</span> with <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{testSummary.success_rate}%</span> pass rate.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs font-bold">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Passed</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-lg">{testSummary.passed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Failed</span>
                  <span className={`text-lg ${testSummary.failed > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                    {testSummary.failed}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Total</span>
                  <span className="text-slate-900 dark:text-white text-lg">{testSummary.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Live Progress Bar */}
          {isRunningTests && testProgress && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2 animate-in fade-in">
              <div className="flex justify-between text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                <span>Executing Invariant Test [{testProgress.current} / {testProgress.total}]</span>
                <span>{Math.round((testProgress.current / testProgress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(testProgress.current / testProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Test Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Filter:</span>
            {[
              { id: 'ALL', label: `All Tests (${testResults.length})` },
              { id: 'WORKFLOW', label: 'Core Workflow (1-20)' },
              { id: 'SECURITY', label: 'Security Invariants (1-11)' },
              { id: 'PASSED', label: 'Passed' },
              { id: 'FAILED', label: 'Failed' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTestFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  testFilter === f.id
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Test Cards List */}
          <div className="space-y-3">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => {
                const isExpanded = expandedTestId === test.id;
                const isPassed = test.status === 'PASSED';
                return (
                  <div
                    key={test.id}
                    className={`rounded-2xl border transition-all ${
                      isPassed
                        ? 'bg-white dark:bg-[#151B2E] border-slate-200 dark:border-white/10'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                      className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                              {test.title}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              test.category === 'SECURITY'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            }`}>
                              {test.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">
                            {test.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-mono text-slate-400">{test.duration_ms}ms</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {test.status}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expandable Step Details */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/5 space-y-2 mt-2">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block pt-2">
                          Verified Assertions & Transaction Steps:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                          <div><strong className="text-slate-900 dark:text-white">Result:</strong> {test.message}</div>
                          <div><strong className="text-slate-900 dark:text-white">Execution Duration:</strong> {test.duration_ms} ms</div>
                          <div><strong className="text-slate-900 dark:text-white">Database Invariant:</strong> Verified against live relational store schemas.</div>
                          {test.steps && test.steps.map((st, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                              <span className="text-emerald-500">✔</span>
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 text-xs text-slate-500 space-y-3">
                <ShieldCheck className="w-10 h-10 text-blue-500 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Test suite ready to run</h4>
                  <p className="text-slate-400 mt-1">Click the "Run All 31 Tests" button above to execute complete customer & freelancer workflows and security verifications.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PROJECT TIMELINES & AI COMPLETION PREDICTIONS (Req 10) */}
      {/* ======================================================== */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Project Timelines & AI Completion Predictions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI completion probabilities and milestone runway calculated from active database state.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-white/10 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151B2E] overflow-hidden">
            {projects.map(proj => {
              const analysis = aiBrokerApi.evaluateProjectRisk(proj);
              return (
                <div key={proj.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-400 font-bold">#{proj.id}</span>
                      <strong className="text-slate-900 dark:text-white text-sm font-bold">{proj.title}</strong>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        proj.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        proj.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                        proj.status === 'disputed' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                        'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>Customer: <strong className="text-slate-900 dark:text-white font-sans font-semibold">{proj.customer_name}</strong></span>
                      <span>Freelancer: <strong className="text-blue-600 dark:text-blue-400 font-sans font-semibold">{proj.hired_freelancer_name || 'Unassigned'}</strong></span>
                      <span>Budget: <strong className="text-slate-900 dark:text-white font-bold">${proj.budget.toFixed(2)}</strong></span>
                      <span>Deadline: <strong className="text-slate-900 dark:text-white">{proj.deadline}</strong></span>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      {analysis.explanations.map((exp, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-blue-500 font-bold">›</span>
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Prediction Badges & Progress */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:shrink-0 w-full lg:w-auto justify-between">
                    <div className="space-y-1 text-center sm:text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Completion Probability</span>
                      <strong className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                        {analysis.completion_probability}%
                      </strong>
                      <div className="w-32 bg-slate-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden mx-auto sm:ml-auto">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${analysis.completion_probability}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Risk Level</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-extrabold uppercase inline-block border ${
                        analysis.risk_level === 'LOW' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        analysis.risk_level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                        analysis.risk_level === 'HIGH' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' :
                        'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {analysis.risk_level}
                      </span>
                    </div>

                    <Link
                      to={`/projects/${proj.id}`}
                      className="btn-secondary-surface px-3 py-2 text-xs font-bold gap-1 shrink-0"
                    >
                      <span>Open Workspace</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. AUDIT LOG (Requirement 13) */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Autonomous Escrow Audit Trail
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Immutable ledger of all AI Broker decisions, state transitions, approvals, and fund movements.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151B2E] overflow-hidden shadow-sm bold-dark-text">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bold-dark-text">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/75 dark:bg-white/5 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Transition</th>
                    <th className="py-3 px-4">Reason / Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{log.user_name || 'AI BROKER'}</div>
                        <span className="text-[10px] font-mono uppercase text-slate-400">{log.role || 'SYSTEM'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        #{log.project_id}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                        <span className="text-slate-400">{log.old_state}</span>
                        <span className="text-blue-500 font-bold mx-1">→</span>
                        <span className="text-emerald-500 font-bold">{log.new_state}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px] max-w-md">
                        {log.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
