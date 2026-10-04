import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';
import { Card } from '../components/ui/Card';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('TrustLance2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('admin@demo.com');
    setPassword('TrustLance2026!');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(email, 'admin');
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        throw new Error('Access denied: Account lacks administrative privileges.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-blue-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trust & Safety Operations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Restricted gateway for platform administrators & dispute arbitrators
          </p>
        </div>

        {/* Card */}
        <Card className="p-6 sm:p-8 shadow-2xl bold-dark-text">
          
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs bold-dark-text">
            <span className="text-slate-900 dark:text-slate-200 font-bold">
              Demo Admin: <strong className="text-blue-600 dark:text-blue-400 font-extrabold">admin@demo.com</strong>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Fill Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 mb-1.5 bold-dark-text">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:outline-none transition-all font-mono font-bold bold-dark-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-900 dark:text-slate-200 mb-1.5 bold-dark-text">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-[#0B1020] focus:border-blue-500 focus:outline-none transition-all font-mono font-bold bold-dark-text"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-gradient w-full py-3 px-4 text-xs font-bold gap-2 mt-2"
            >
              <span>{loading ? 'Verifying RBAC Permissions...' : 'Access Admin Command Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Public admin registration is strictly prohibited by platform security policy.
          </div>
        </Card>

      </div>
    </div>
  );
};
