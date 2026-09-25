import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  const [role, setRole] = useState<'customer' | 'freelancer'>(initialRole as 'customer' | 'freelancer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('TrustLance2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFillDemo = (fillRole: 'customer' | 'freelancer') => {
    setRole(fillRole);
    if (fillRole === 'customer') {
      setEmail('customer@demo.com');
    } else {
      setEmail('freelancer@demo.com');
    }
    setPassword('TrustLance2026!');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(email, role);
      if (res.user.role === 'customer') {
        navigate('/customer/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign In to TrustLance AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your secure projects, proposals, and escrow dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          
          {/* Role Segmented Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setRole('customer'); setEmail('customer@demo.com'); }}
              className={`py-2 rounded-lg transition-all ${
                role === 'customer'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Customer Portal
            </button>
            <button
              type="button"
              onClick={() => { setRole('freelancer'); setEmail('freelancer@demo.com'); }}
              className={`py-2 rounded-lg transition-all ${
                role === 'freelancer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Freelancer Portal
            </button>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="mb-6 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] text-blue-800 dark:text-blue-300">
                Evaluation Demo Account
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleFillDemo(role)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Auto-Fill {role === 'customer' ? 'Customer' : 'Freelancer'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'customer' ? 'customer@demo.com' : 'freelancer@demo.com'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating with PHP PDO...' : `Sign In as ${role === 'customer' ? 'Customer' : 'Freelancer'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/onboarding" className="font-semibold text-blue-600 hover:underline">
              Choose your role & register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
