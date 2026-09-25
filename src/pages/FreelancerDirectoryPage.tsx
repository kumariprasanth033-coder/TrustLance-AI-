import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Shield, Filter, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { freelancersApi } from '../services/api';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const FreelancerDirectoryPage: React.FC = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [availability, setAvailability] = useState<string>('all');

  useEffect(() => {
    freelancersApi.list().then(setFreelancers);
  }, []);

  const filtered = freelancers.filter(f => {
    const matchSearch = !search || f.full_name.toLowerCase().includes(search.toLowerCase()) || f.headline.toLowerCase().includes(search.toLowerCase()) || f.bio?.toLowerCase().includes(search.toLowerCase());
    const matchScore = !minScore || f.trust_score >= minScore;
    const matchAvail = availability === 'all' || f.availability === availability;
    return matchSearch && matchScore && matchAvail;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Verified Talent Network
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find Top Verified Freelancers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Talent ranked by mathematical AI Trust Scores, verified delivery records, and zero-dispute histories.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Min Trust Score:</span>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value={0}>All Scores</option>
            <option value={98}>Elite (98+)</option>
            <option value={90}>Highly Trusted (90+)</option>
            <option value={80}>Trusted (80+)</option>
            <option value={70}>Good (70+)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">Availability:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available Now</option>
            <option value="busy">Busy on Contracts</option>
          </select>
        </div>

        <div className="ml-auto text-slate-500 dark:text-slate-400 tabular-nums font-mono text-[11px] font-semibold">
          Showing {filtered.length} verified specialists
        </div>
      </div>

      {/* Freelancers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((f, idx) => {
          const matchPercent = Math.min(99, Math.round(f.trust_score * 0.98 + (idx % 3)));
          return (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-md hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Avatar + Headline + Trust Score */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={f.avatar_url}
                        alt={f.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-xs"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#151B2E] ${
                        f.availability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} title={f.availability === 'available' ? 'Available' : 'Busy'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-500 transition-colors">
                          {f.full_name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1 mt-0.5 font-medium">
                        {f.headline}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {f.rating}
                        </span>
                        <span>·</span>
                        <span className="tabular-nums font-mono font-semibold">{f.completed_projects} completed</span>
                      </div>
                    </div>
                  </div>

                  <TrustScoreRing score={f.trust_score} size={64} strokeWidth={5} />
                </div>

                {/* Badges: AI Match & Availability */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
                    {matchPercent}% AI Match
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    f.availability === 'available'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {f.availability === 'available' ? '● Available' : '● In Contract'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4 font-medium">
                  {f.bio}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {f.skills?.slice(0, 4).map((sk: any, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 font-mono font-medium border border-slate-200/80 dark:border-white/5"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>

                {/* Telemetry row */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 mb-4 font-mono tabular-nums">
                  <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] uppercase block font-sans font-semibold text-slate-500 dark:text-slate-400">On-Time Rate</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">{f.on_time_delivery_rate}%</strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] uppercase block font-sans font-semibold text-slate-500 dark:text-slate-400">Avg. Reply</span>
                    <strong className="text-slate-900 dark:text-white text-xs font-bold">{f.response_time_hours} hrs</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing and Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Starting at</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums font-mono text-sm">${f.hourly_rate}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/freelancers/${f.id}`}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors border border-slate-200 dark:border-white/10"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/customer/projects/create?freelancer_id=${f.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-xs"
                  >
                    Hire
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
