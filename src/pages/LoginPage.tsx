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
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-72 h-72 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-blue-500/25">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to TrustLance AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Access your secure projects, proposals, and escrow dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Role Segmented Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-6 text-xs font-bold border border-slate-200/60 dark:border-white/5">
            <button
              type="button"
              onClick={() => { setRole('customer'); setEmail('customer@demo.com'); }}
              className={`py-2 rounded-xl transition-all ${
                role === 'customer'
                  ? 'bg-white dark:bg-[#0B1020] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Customer Portal
            </button>
            <button
              type="button"
              onClick={() => { setRole('freelancer'); setEmail('freelancer@demo.com'); }}
              className={`py-2 rounded-xl transition-all ${
                role === 'freelancer'
                  ? 'bg-white dark:bg-[#0B1020] text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Freelancer Portal
            </button>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="mb-6 p-3 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-[11px] text-blue-900 dark:text-blue-300 font-medium">
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
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-2xs font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password: TrustLance2026!'); }} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-white/10 text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-2xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <input type="checkbox" id="remember" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember" className="text-slate-600 dark:text-slate-400 cursor-pointer">Remember Me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating with PHP PDO...' : `Sign In as ${role === 'customer' ? 'Customer' : 'Freelancer'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/onboarding" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Choose your role & register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
