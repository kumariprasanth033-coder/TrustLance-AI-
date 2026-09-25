import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Star, 
  Cpu, 
  TrendingUp, 
  Users, 
  Globe, 
  FileCheck, 
  ChevronRight,
  HelpCircle,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { servicesApi, freelancersApi } from '../services/api';
import { ServiceCategory } from '../types';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const LandingPage: React.FC = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    servicesApi.list().then(setServices);
    freelancersApi.list().then(setFreelancers);
  }, []);

  const categories = ['All', 'Engineering', 'Design', 'AI & Data', 'Marketing', 'Media', 'Writing'];

  const filteredServices = services.filter(s => {
    const matchCategory = activeCategory === 'All' || s.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Unboxed inline kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 bg-blue-50 dark:bg-blue-950/50 px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Freelance & Intelligent Escrow Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto text-balance">
            Freelance With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">Confidence.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
            “Hire With Confidence. Work With Trust.” Discover verified talent, protect project capital with intelligent escrow, and automate workflows with an AI trust broker.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/freelancers"
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Find Freelancers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customer/projects/create"
              className="px-6 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center gap-2"
            >
              <span>Post a Project</span>
            </Link>

            <Link
              to="/services"
              className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Explore 20 Services
            </Link>
          </div>

          {/* 2. ANIMATED AI BROKER WORKFLOW DIAGRAM */}
          <div className="mt-14 max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <div className="text-left mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Core Innovation: The AI Broker Protocol
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                How TrustLance AI Protects Projects & Capital
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center text-xs">
              {[
                { title: 'Customer', desc: 'Posts Project Scope' },
                { title: 'AI Match', desc: 'Calculates Fit %' },
                { title: 'Freelancer', desc: 'Submits Proposal' },
                { title: 'AI Broker', desc: 'Locks Milestone' },
                { title: 'Escrow Vault', desc: 'Secures Capital' },
                { title: 'Work Handover', desc: 'Uploads Code/Files' },
                { title: 'Client Review', desc: 'Inspects Deliverables' },
                { title: 'Release', desc: 'Funds Paid Out' }
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 h-full flex flex-col justify-between hover:border-blue-500 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold mx-auto mb-1.5 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <strong className="text-slate-900 dark:text-white block text-[11px] font-semibold leading-tight">
                      {step.title}
                    </strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM TELEMETRY & TRUST METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">$2.4M+</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Escrow Funds Protected</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">98.6%</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">On-Time Delivery Rate</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">91.8</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Average AI Trust Score</span>
          </div>
          <div className="p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">0.02%</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">Dispute Incidence Rate</span>
          </div>
        </div>
      </section>

      {/* 4. POPULAR SERVICES EXPLORATION (20 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Comprehensive Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Explore 20 Specialized Service Categories
            </h2>
          </div>

          {/* Quick Search */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search services or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServices.slice(0, 12).map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {srv.project_count} projects
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="tabular-nums font-mono text-slate-600 dark:text-slate-300">
                  Avg. ${srv.avg_budget}
                </span>
                <Link
                  to={`/customer/projects/create?service_id=${srv.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Post Job</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length > 12 && (
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <span>View All 20 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 5. VERIFIABLE AI TRUST SCORE BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Algorithmic Truth, Not Popularity Contests
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              The AI Trust Score™ (0 to 100)
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Unlike legacy platforms with bought reviews and fake rankings, TrustLance AI calculates a mathematical Trust Score derived directly from verified MySQL transaction tables.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-white block text-sm mb-1">30% Client Ratings</strong>
                <span className="text-slate-400">Grounded in verified completed escrow deliveries.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-white block text-sm mb-1">25% Completion Rate</strong>
                <span className="text-slate-400">Strict tracking of finished vs abandoned contracts.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-white block text-sm mb-1">20% On-Time Delivery</strong>
                <span className="text-slate-400">Timestamped deliverable uploads against deadlines.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-white block text-sm mb-1">15% Response Speed</strong>
                <span className="text-slate-400">Sub-hour active inquiry reply latency tracking.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/60 rounded-2xl border border-slate-700/80">
            <TrustScoreRing score={99.2} size={150} strokeWidth={10} />
            <div className="text-center mt-4">
              <h4 className="text-base font-bold">Elite Tier Freelancer</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Scores 98–100 represent the top 2% of platform talent with verified 100% on-time records and zero escrow disputes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED VERIFIED TALENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Top Rated Talent
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Verified Freelancers
            </h2>
          </div>

          <Link
            to="/freelancers"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore All Freelancers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar_url}
                      alt={f.full_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{f.full_name}</h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1">{f.headline}</span>
                    </div>
                  </div>
                  <TrustScoreRing score={f.trust_score} size={54} strokeWidth={4} showTier={false} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {f.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.skills?.slice(0, 3).map((sk: any, i: number) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">${f.hourly_rate}/hr</span>
                </div>
                <Link
                  to={`/freelancers/${f.id}`}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900 font-semibold rounded-lg transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Questions Answered
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          {[
            {
              q: 'How does TrustLance AI guarantee that my payment is protected?',
              a: 'When you hire a freelancer, your funds are secured in the TrustLance AI Escrow Vault backed by an ACID-compliant MySQL ledger. The freelancer only receives payment after you explicitly review and approve the submitted deliverables.'
            },
            {
              q: 'How is the AI Trust Score calculated?',
              a: 'The AI Trust Score (0–100) is algorithmic, derived from on-time delivery rates, verified client review ratings, contract completion consistency, response speed, and historical dispute absence.'
            },
            {
              q: 'Can this full-stack application run on local XAMPP?',
              a: 'Yes! The entire backend is written in pure PHP 8.2+ with PDO prepared statements and connects to a normalized MySQL 8.0 schema. Both database/schema.sql and database/seed.sql are ready to run in XAMPP phpMyAdmin.'
            },
            {
              q: 'What happens if a deliverable does not match the project requirements?',
              a: 'Customers can request structured revisions directly through the project workspace. If an agreement cannot be reached, either party can open a formal dispute, triggering automated Gemini scope analysis and platform moderator adjudication.'
            }
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Hire or Work With Complete Trust?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-sm mb-8 leading-relaxed">
            Join thousands of founders, engineers, and digital specialists using TrustLance AI for secured milestones and verified talent reputation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/onboarding"
              className="px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl shadow-md hover:bg-blue-50 transition-all"
            >
              Get Started Now
            </Link>
            <Link
              to="/customer/projects/create"
              className="px-6 py-3 bg-blue-700/60 hover:bg-blue-700 border border-white/20 text-white font-bold text-sm rounded-xl transition-all"
            >
              Post a Project
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
