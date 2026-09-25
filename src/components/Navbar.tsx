import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Moon, Sun, Server, ChevronDown, User, LogOut, Check, Sparkles, Menu, X, MessageSquare, Search } from 'lucide-react';
import { authApi } from '../services/api';
import { XAMPPModal } from './XAMPPModal';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [currentUser, setCurrentUser] = useState(authApi.getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showXAMPPModal, setShowXAMPPModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser());
    setShowMobileMenu(false);
  }, [location.pathname]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Shield className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                TrustLance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-extrabold">AI</span>
              </span>
              <span className="text-[9px] tracking-wider text-slate-500 dark:text-slate-400 font-mono hidden sm:inline -mt-0.5">
                VERIFIED ESCROW & TALENT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link
              to="/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname.startsWith('/services') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Services
            </Link>
            <Link
              to="/freelancers"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname.startsWith('/freelancers') ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Find Talent
            </Link>
            <Link
              to="/how-it-works"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname === '/how-it-works' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/how-it-works#escrow"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-semibold border border-blue-500/20 transition-all"
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>AI Broker</span>
            </Link>
            <Link
              to="/faq"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname === '/faq' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right Actions & Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services, skills..."
                    autoFocus
                    className="w-36 sm:w-52 h-8 px-2.5 text-xs bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  title="Search Services & Talent"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* PHP/MySQL Architecture Button */}
            <button
              onClick={() => setShowXAMPPModal(true)}
              title="View PHP 8.2 + MySQL Architecture"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden xl:inline">PHP/MySQL</span>
            </button>

            {/* Notifications / Messages when logged in */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to={
                    currentUser.role === 'customer'
                      ? '/customer/dashboard'
                      : currentUser.role === 'freelancer'
                      ? '/freelancer/dashboard'
                      : '/admin/dashboard'
                  }
                  title="Notifications"
                  className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
                </Link>
                <Link
                  to="/projects/1"
                  title="Messages & Workspace"
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle color theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile or Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors"
                >
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                  />
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block leading-tight truncate max-w-[100px]">
                      {currentUser.full_name}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#151B2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/5">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {currentUser.full_name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                        {currentUser.email}
                      </span>
                      <div className="mt-1.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold uppercase">
                        Role: {currentUser.role}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={
                          currentUser.role === 'customer'
                            ? '/customer/dashboard'
                            : currentUser.role === 'freelancer'
                            ? '/freelancer/dashboard'
                            : '/admin/dashboard'
                        }
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Dashboard
                      </Link>

                      {currentUser.role === 'customer' && (
                        <Link
                          to="/customer/projects/create"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          + Post a Project
                        </Link>
                      )}

                      <Link
                        to="/projects/1"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        Active Workspace
                      </Link>
                    </div>

                    <div className="my-1 border-t border-slate-100 dark:border-white/5 px-4 py-1.5 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                      Switch Role (Demo)
                    </div>

                    <div className="px-2 space-y-0.5">
                      <button
                        onClick={() => handleRoleSwitch('customer')}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                          currentUser.role === 'customer' ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>Customer (Sarah J.)</span>
                        {currentUser.role === 'customer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>

                      <button
                        onClick={() => handleRoleSwitch('freelancer')}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                          currentUser.role === 'freelancer' ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>Freelancer (Elena V.)</span>
                        {currentUser.role === 'freelancer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>

                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                          currentUser.role === 'admin' ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/20' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span>Admin (Alex S.)</span>
                        {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    </div>

                    <div className="my-1.5 border-t border-slate-100 dark:border-white/5" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Services Marketplace
              </Link>
              <Link
                to="/freelancers"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Find Talent
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/how-it-works#escrow"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-blue-600 dark:text-blue-400 font-semibold"
              >
                AI Escrow Broker
              </Link>
              <Link
                to="/faq"
                onClick={() => setShowMobileMenu(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                FAQ & Knowledge Base
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowXAMPPModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300"
              >
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>PHP/MySQL Architecture</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* XAMPP Architecture Dialog */}
      <XAMPPModal isOpen={showXAMPPModal} onClose={() => setShowXAMPPModal(false)} />
    </>
  );
};
