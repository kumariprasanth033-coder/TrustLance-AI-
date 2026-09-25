import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, Moon, Sun, Server, ChevronDown, User, LogOut, Check, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';
import { XAMPPModal } from './XAMPPModal';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [currentUser, setCurrentUser] = useState(authApi.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showXAMPPModal, setShowXAMPPModal] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser());
  }, []);

  const handleRoleSwitch = async (role: 'customer' | 'freelancer' | 'admin') => {
    setShowUserMenu(false);
    const emailMap = {
      customer: 'customer@demo.com',
      freelancer: 'freelancer@demo.com',
      admin: 'admin@demo.com'
    };
    try {
      const res = await authApi.login(emailMap[role], role);
      setCurrentUser(res.user);
      if (role === 'customer') navigate('/customer/dashboard');
      else if (role === 'freelancer') navigate('/freelancer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark with brand emblem */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 fill-white/20" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              TrustLance <span className="text-blue-600 dark:text-blue-400">AI</span>
            </span>
          </Link>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Services
            </Link>
            <Link to="/freelancers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Talent Directory
            </Link>
            <Link to="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link to="/how-it-works#escrow" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI Escrow
            </Link>
            <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Zone 3: Actions & Auth */}
          <div className="flex items-center gap-3">
            {/* XAMPP Architecture Trigger */}
            <button
              onClick={() => setShowXAMPPModal(true)}
              title="View PHP 8.2 + MySQL Architecture"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden lg:inline">PHP/MySQL</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle color theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight truncate max-w-[100px]">
                      {currentUser.full_name}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {currentUser.full_name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                        {currentUser.email}
                      </span>
                    </div>

                    <Link
                      to={
                        currentUser.role === 'customer'
                          ? '/customer/dashboard'
                          : currentUser.role === 'freelancer'
                          ? '/freelancer/dashboard'
                          : '/admin/dashboard'
                      }
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Dashboard
                    </Link>

                    {currentUser.role === 'customer' && (
                      <Link
                        to="/customer/projects/create"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        + Post a Project
                      </Link>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800 px-3.5 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Switch Demo Role
                    </div>

                    <button
                      onClick={() => handleRoleSwitch('customer')}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        currentUser.role === 'customer' ? 'text-blue-600 font-semibold' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>Customer (Sarah J.)</span>
                      {currentUser.role === 'customer' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('freelancer')}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        currentUser.role === 'freelancer' ? 'text-blue-600 font-semibold' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>Freelancer (Elena V.)</span>
                      {currentUser.role === 'freelancer' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('admin')}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        currentUser.role === 'admin' ? 'text-blue-600 font-semibold' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>Admin (Alex S.)</span>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* XAMPP Architecture Dialog */}
      <XAMPPModal isOpen={showXAMPPModal} onClose={() => setShowXAMPPModal(false)} />
    </>
  );
};
