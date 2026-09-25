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
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Min Trust Score:</span>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value={0}>All Scores</option>
            <option value={98}>Elite (98+)</option>
            <option value={90}>Highly Trusted (90+)</option>
            <option value={80}>Trusted (80+)</option>
            <option value={70}>Good (70+)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Availability:</span>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available Now</option>
            <option value="busy">Busy on Contracts</option>
          </select>
        </div>

        <div className="ml-auto text-slate-500 dark:text-slate-400 tabular-nums font-mono text-[11px]">
          Showing {filtered.length} verified specialists
        </div>
      </div>

      {/* Freelancers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((f) => (
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
                    className="w-13 h-13 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                      {f.full_name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1 mt-0.5">
                      {f.headline}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {f.rating}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums font-mono">{f.completed_projects} projects</span>
                    </div>
                  </div>
                </div>

                <TrustScoreRing score={f.trust_score} size={62} strokeWidth={5} />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                {f.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.skills?.map((sk: any, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-4 font-mono tabular-nums">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase block font-sans">On-Time Rate</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{f.on_time_delivery_rate}%</strong>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] uppercase block font-sans">Avg. Reply</span>
                  <strong className="text-slate-900 dark:text-white text-xs">{f.response_time_hours} hrs</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Rate</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">${f.hourly_rate}/hr</span>
              </div>
              <Link
                to={`/freelancers/${f.id}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-2xs"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
